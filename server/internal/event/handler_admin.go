package event

import (
	"amigo-invisible-server/internal/platform/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DeleteParticipantHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")
	participantID := c.Param("participant_id")

	// Verify ownership and if event is still in draft
	var status string
	err := db.DB.QueryRow("SELECT status FROM events WHERE id = $1 AND user_id = $2", eventID, userID).Scan(&status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or unauthorized"})
		return
	}

	if status != "draft" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete participants from a shuffled event"})
		return
	}

	_, err = db.DB.Exec("DELETE FROM participants WHERE id = $1 AND event_id = $2", participantID, eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete participant"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Participant deleted"})
}

type AddParticipantRequest struct {
	Name string `json:"name" binding:"required"`
}

func AddParticipantHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	var req AddParticipantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify ownership and if event is still in draft
	var status string
	err := db.DB.QueryRow("SELECT status FROM events WHERE id = $1 AND user_id = $2", eventID, userID).Scan(&status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or unauthorized"})
		return
	}

	if status != "draft" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot add participants to a shuffled event"})
		return
	}

	var participantID string
	err = db.DB.QueryRow("INSERT INTO participants (event_id, name) VALUES ($1, $2) RETURNING id", eventID, req.Name).Scan(&participantID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add participant"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": participantID, "name": req.Name})
}

func DeleteEventHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	result, err := db.DB.Exec("DELETE FROM events WHERE id = $1 AND user_id = $2", eventID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete event"})
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or unauthorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event deleted"})
}
