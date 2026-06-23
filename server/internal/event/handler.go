package event

import (
	"amigo-invisible-server/internal/platform/db"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateEventHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req CreateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	inviteCode := GenerateMagicToken()[:8]

	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	var eventID string
	err = tx.QueryRow("INSERT INTO events (user_id, name, status, invite_code) VALUES ($1, $2, 'open', $3) RETURNING id", userID, req.Name, inviteCode).Scan(&eventID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event"})
		return
	}

	// Auto-register organizer as participant
	_, err = tx.Exec("INSERT INTO participants (event_id, name, user_id) VALUES ($1, $2, $3)", eventID, req.OrganizerDisplayName, userID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register organizer as participant"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"event_id": eventID, "invite_code": inviteCode})
}

func ListEventsHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	rows, err := db.DB.Query("SELECT id, name, status, created_at FROM events WHERE user_id = $1 ORDER BY created_at DESC", userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query events"})
		return
	}
	defer rows.Close()

	events := []Event{}
	for rows.Next() {
		var e Event
		rows.Scan(&e.ID, &e.Name, &e.Status, &e.CreatedAt)
		events = append(events, e)
	}

	c.JSON(http.StatusOK, events)
}

func ShuffleEventHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	// Verify ownership
	var status string
	err := db.DB.QueryRow("SELECT status FROM events WHERE id = $1 AND user_id = $2", eventID, userID).Scan(&status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or unauthorized"})
		return
	}

	if status != "draft" && status != "open" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event already shuffled"})
		return
	}

	// Get participants with user_id
	rows, err := db.DB.Query("SELECT id, user_id FROM participants WHERE event_id = $1", eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get participants"})
		return
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id, uid string
		rows.Scan(&id, &uid)
		if uid == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "All participants must have a user account. Cannot shuffle with ghost participants."})
			return
		}
		ids = append(ids, id)
	}

	if len(ids) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "At least 3 participants required"})
		return
	}

	assignments, err := ShuffleParticipants(ids)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed"})
		return
	}

	for giverID, receiverID := range assignments {
		_, err = tx.Exec("UPDATE participants SET assigned_to = $1 WHERE id = $2", receiverID, giverID)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
			return
		}
	}

	_, err = tx.Exec("UPDATE events SET status = 'shuffled' WHERE id = $1", eventID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Status update failed"})
		return
	}

	// Get event name for system message
	var eventName string
	err = tx.QueryRow("SELECT name FROM events WHERE id = $1", eventID).Scan(&eventName)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get event name"})
		return
	}

	// Create system message for shuffle
	shuffleMessage := fmt.Sprintf("🎉 ¡El sorteo de '%s' se realizó! Que empiece la diversión 🎁", eventName)
	_, err = tx.Exec(
		"INSERT INTO messages (event_id, user_id, content, message_type) VALUES ($1, $2, $3, 'system')",
		eventID, userID, shuffleMessage,
	)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create system message"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Shuffle completed successfully"})
}

func ListParticipantEventsHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	rows, err := db.DB.Query(`
		SELECT DISTINCT e.id, e.name, e.status, e.created_at
		FROM events e
		INNER JOIN participants p ON p.event_id = e.id
		WHERE p.user_id = $1
		ORDER BY e.created_at DESC
	`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query participant events"})
		return
	}
	defer rows.Close()

	events := []Event{}
	for rows.Next() {
		var e Event
		rows.Scan(&e.ID, &e.Name, &e.Status, &e.CreatedAt)
		events = append(events, e)
	}

	c.JSON(http.StatusOK, events)
}

func GetMyAssignmentHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	var pID, name string
	var assignedTo sql.NullString
	err := db.DB.QueryRow(`
		SELECT p.id, p.name, p.assigned_to
		FROM participants p
		WHERE p.event_id = $1 AND p.user_id = $2
	`, eventID, userID).Scan(&pID, &name, &assignedTo)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "You are not a participant in this event"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	var assignedName string
	if assignedTo.Valid {
		db.DB.QueryRow("SELECT name FROM participants WHERE id = $1", assignedTo.String).Scan(&assignedName)
	}

	c.JSON(http.StatusOK, gin.H{
		"participant_id": pID,
		"name":           name,
		"assigned_to":    assignedTo,
		"assigned_name":  assignedName,
	})
}

type JoinEventRequest struct {
	Code string `json:"code" binding:"required"`
	Name string `json:"name" binding:"required"`
}

// JoinEventHandler allows authenticated users to join an event by invite code.
func JoinEventHandler(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var req JoinEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var eventID string
	var status string
	err := db.DB.QueryRow("SELECT id, status FROM events WHERE invite_code = $1", req.Code).Scan(&eventID, &status)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invalid invite code"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if status == "shuffled" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event already shuffled, cannot join"})
		return
	}

	_, err = db.DB.Exec("INSERT INTO participants (event_id, name, user_id) VALUES ($1, $2, $3)", eventID, req.Name, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join event. You may already be a participant."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Joined event successfully", "event_id": eventID})
}