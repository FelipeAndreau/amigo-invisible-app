package event

import (
	"amigo-invisible-server/internal/platform/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ListEventParticipantsHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	// Verify ownership
	var exists bool
	err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM events WHERE id = $1 AND user_id = $2)", eventID, userID).Scan(&exists)
	if err != nil || !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found or unauthorized"})
		return
	}

	rows, err := db.DB.Query("SELECT id, name, email, access_token FROM participants WHERE event_id = $1", eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query participants"})
		return
	}
	defer rows.Close()

	participants := []Participant{}
	for rows.Next() {
		var p Participant
		var email, token *string
		rows.Scan(&p.ID, &p.Name, &email, &token)
		if email != nil { p.Email = *email }
		if token != nil { p.AccessToken = *token }
		participants = append(participants, p)
	}

	c.JSON(http.StatusOK, participants)
}
