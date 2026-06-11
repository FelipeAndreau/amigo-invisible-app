package event

import (
	"amigo-invisible-server/internal/platform/db"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateEventHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req CreateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	var eventID string
	err = tx.QueryRow("INSERT INTO events (user_id, name) VALUES ($1, $2) RETURNING id", userID, req.Name).Scan(&eventID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event"})
		return
	}

	for _, name := range req.Participants {
		_, err = tx.Exec("INSERT INTO participants (event_id, name) VALUES ($1, $2)", eventID, name)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add participant"})
			return
		}
	}

	tx.Commit()
	c.JSON(http.StatusCreated, gin.H{"event_id": eventID})
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
	var exists bool
	err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM events WHERE id = $1 AND user_id = $2)", eventID, userID).Scan(&exists)
	if err != nil || !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or unauthorized"})
		return
	}

	// Get participants
	rows, err := db.DB.Query("SELECT id FROM participants WHERE event_id = $1", eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get participants"})
		return
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		rows.Scan(&id)
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
		token := GenerateMagicToken()
		_, err = tx.Exec("UPDATE participants SET assigned_to = $1, access_token = $2 WHERE id = $3", receiverID, token, giverID)
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

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"message": "Shuffle completed successfully"})
}

func RevealHandler(c *gin.Context) {
	token := c.Param("token")
	var name, assignedName string
	var revealedAt *time.Time

	err := db.DB.QueryRow(`
		SELECT p.name, a.name, p.revealed_at
		FROM participants p 
		JOIN participants a ON p.assigned_to = a.id 
		WHERE p.access_token = $1`, token).Scan(&name, &assignedName, &revealedAt)

	if err == sql.ErrNoRows {
		c.HTML(http.StatusNotFound, "error.html", gin.H{"error": "Link inválido"})
		return
	} else if err != nil {
		c.HTML(http.StatusInternalServerError, "error.html", gin.H{"error": "Error del servidor"})
		return
	}

	if revealedAt != nil {
		c.HTML(http.StatusForbidden, "error.html", gin.H{"error": "Este resultado ya fue revelado anteriormente. Por seguridad, solo se puede ver una vez."})
		return
	}

	// Marcar como revelado
	_, _ = db.DB.Exec("UPDATE participants SET revealed_at = CURRENT_TIMESTAMP WHERE access_token = $1", token)

	c.HTML(http.StatusOK, "reveal.html", gin.H{
		"Name":         name,
		"AssignedName": assignedName,
	})
}

func GenerateInviteHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	var exists bool
	err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM events WHERE id = $1 AND user_id = $2)", eventID, userID).Scan(&exists)
	if err != nil || !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or unauthorized"})
		return
	}

	code := GenerateMagicToken()[:8]
	_, err = db.DB.Exec("UPDATE events SET invite_code = $1 WHERE id = $2", code, eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate invite code"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invite_code": code})
}

type JoinEventRequest struct {
	Code string `json:"code" binding:"required"`
	Name string `json:"name" binding:"required"`
}

func JoinEventHandler(c *gin.Context) {
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

	var exists bool
	err = db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM participants WHERE event_id = $1 AND name = $2)", eventID, req.Name).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "Participant name already exists in this event"})
		return
	}

	_, err = db.DB.Exec("INSERT INTO participants (event_id, name) VALUES ($1, $2)", eventID, req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Joined event successfully", "event_id": eventID})
}
