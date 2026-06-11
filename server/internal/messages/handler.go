package messages

import (
	"amigo-invisible-server/internal/platform/db"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Message struct {
	ID        string    `json:"id"`
	EventID   string    `json:"event_id"`
	UserID    string    `json:"user_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateMessageRequest struct {
	Content string `json:"content" binding:"required"`
}

func ListMessagesHandler(c *gin.Context) {
	eventID := c.Param("id")
	userID, _ := c.Get("userID")

	// Verify user is participant or organizer
	var isAuthorized bool
	err := db.DB.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM participants WHERE event_id = $1 AND user_id = $2
			UNION
			SELECT 1 FROM events WHERE id = $1 AND user_id = $2
		)
	`, eventID, userID).Scan(&isAuthorized)
	if err != nil || !isAuthorized {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to view messages"})
		return
	}

	rows, err := db.DB.Query("SELECT id, event_id, user_id, content, created_at FROM messages WHERE event_id = $1 ORDER BY created_at DESC LIMIT 50", eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query messages"})
		return
	}
	defer rows.Close()

	messages := []Message{}
	for rows.Next() {
		var m Message
		rows.Scan(&m.ID, &m.EventID, &m.UserID, &m.Content, &m.CreatedAt)
		messages = append(messages, m)
	}

	c.JSON(http.StatusOK, messages)
}

func CreateMessageHandler(c *gin.Context) {
	eventID := c.Param("id")
	userID, _ := c.Get("userID")

	var req CreateMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify user is participant or organizer
	var isAuthorized bool
	err := db.DB.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM participants WHERE event_id = $1 AND user_id = $2
			UNION
			SELECT 1 FROM events WHERE id = $1 AND user_id = $2
		)
	`, eventID, userID).Scan(&isAuthorized)
	if err != nil || !isAuthorized {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to send messages"})
		return
	}

	var messageID string
	err = db.DB.QueryRow(
		"INSERT INTO messages (event_id, user_id, content) VALUES ($1, $2, $3) RETURNING id",
		eventID, userID, req.Content,
	).Scan(&messageID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create message"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": messageID, "message": "Message created"})
}