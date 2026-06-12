package event

import (
	"amigo-invisible-server/internal/platform/db"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type GiftProgressRequest struct {
	Purchased bool `json:"purchased"`
	Wrapped   bool `json:"wrapped"`
	Delivered bool `json:"delivered"`
}

func SaveGiftProgressHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	var participantID string
	err := db.DB.QueryRow("SELECT id FROM participants WHERE event_id = $1 AND user_id = $2", eventID, userID).Scan(&participantID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not a participant in this event"})
		return
	}

	var req GiftProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err = db.DB.Exec(`
		INSERT INTO gift_progress (participant_id, purchased, wrapped, delivered)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (participant_id) DO UPDATE SET
			purchased = EXCLUDED.purchased,
			wrapped = EXCLUDED.wrapped,
			delivered = EXCLUDED.delivered,
			updated_at = CURRENT_TIMESTAMP
	`, participantID, req.Purchased, req.Wrapped, req.Delivered)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save gift progress"})
		return
	}

	// Get user name for system message
	var userName string
	err = db.DB.QueryRow("SELECT name FROM users WHERE id = $1", userID).Scan(&userName)
	if err != nil {
		userName = "Alguien"
	}

	// Create system message based on progress
	var messageContent string
	if req.Delivered {
		messageContent = fmt.Sprintf("🎉 %s entregó su regalo!", userName)
	} else if req.Wrapped && req.Purchased {
		messageContent = fmt.Sprintf("✨ %s tiene su regalo listo para entregar", userName)
	} else if req.Purchased {
		messageContent = fmt.Sprintf("🛍️ %s está preparando su regalo", userName)
	}

	if messageContent != "" {
		db.DB.Exec(
			"INSERT INTO messages (event_id, user_id, content, message_type) VALUES ($1, $2, $3, 'system')",
			eventID, userID, messageContent,
		)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Gift progress saved"})
}

func GetGiftProgressHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	var participantID string
	err := db.DB.QueryRow("SELECT id FROM participants WHERE event_id = $1 AND user_id = $2", eventID, userID).Scan(&participantID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not a participant in this event"})
		return
	}

	var progress GiftProgressRequest
	err = db.DB.QueryRow("SELECT purchased, wrapped, delivered FROM gift_progress WHERE participant_id = $1", participantID).Scan(&progress.Purchased, &progress.Wrapped, &progress.Delivered)
	if err != nil {
		// Return empty progress if not found
		progress = GiftProgressRequest{Purchased: false, Wrapped: false, Delivered: false}
	}

	c.JSON(http.StatusOK, progress)
}
