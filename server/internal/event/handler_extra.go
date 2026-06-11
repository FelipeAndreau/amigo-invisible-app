package event

import (
	"amigo-invisible-server/internal/platform/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ParticipantWithMe struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email,omitempty"`
	AssignedTo string `json:"assigned_to,omitempty"`
	IsMe       bool   `json:"is_me"`
}

func ListEventParticipantsHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	// Verify user is organizer or participant
	var isAuthorized bool
	err := db.DB.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM events WHERE id = $1 AND user_id = $2
			UNION
			SELECT 1 FROM participants WHERE event_id = $1 AND user_id = $2
		)
	`, eventID, userID).Scan(&isAuthorized)
	if err != nil || !isAuthorized {
		c.JSON(http.StatusForbidden, gin.H{"error": "Event not found or unauthorized"})
		return
	}

	rows, err := db.DB.Query("SELECT id, name, email, assigned_to, user_id FROM participants WHERE event_id = $1", eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query participants"})
		return
	}
	defer rows.Close()

	participants := []ParticipantWithMe{}
	uidStr := userID.(string)
	for rows.Next() {
		var p ParticipantWithMe
		var email, assignedTo, puid *string
		rows.Scan(&p.ID, &p.Name, &email, &assignedTo, &puid)
		if email != nil { p.Email = *email }
		if assignedTo != nil { p.AssignedTo = *assignedTo }
		if puid != nil && *puid == uidStr {
			p.IsMe = true
		}
		participants = append(participants, p)
	}

	c.JSON(http.StatusOK, participants)
}
