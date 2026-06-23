package event

import (
	"amigo-invisible-server/internal/platform/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

type HistoryEvent struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Status       string `json:"status"`
	Role         string `json:"role"`
	AssignedName string `json:"assigned_name,omitempty"`
	CreatedAt    string `json:"created_at"`
}

func GetHistoryHandler(c *gin.Context) {
	userID, _ := c.Get("userID")

	rows, err := db.DB.Query(`
		SELECT DISTINCT e.id, e.name, e.status, e.created_at,
			CASE WHEN e.user_id = $1 THEN 'organizer' ELSE 'participant' END as role
		FROM events e
		LEFT JOIN participants p ON p.event_id = e.id
		WHERE e.user_id = $1 OR p.user_id = $1
		ORDER BY e.created_at DESC
	`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query history"})
		return
	}
	defer rows.Close()

	history := []HistoryEvent{}
	for rows.Next() {
		var h HistoryEvent
		rows.Scan(&h.ID, &h.Name, &h.Status, &h.CreatedAt, &h.Role)
		history = append(history, h)
	}

	c.JSON(http.StatusOK, history)
}
