package friends

import (
	"amigo-invisible-server/internal/platform/db"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Friend struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Name      string    `json:"name"`
	Email     string    `json:"email,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type AddFriendRequest struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
}

func ListFriendsHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	rows, err := db.DB.Query("SELECT id, user_id, name, email, created_at FROM friends WHERE user_id = $1 ORDER BY created_at DESC", userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query friends"})
		return
	}
	defer rows.Close()

	friends := []Friend{}
	for rows.Next() {
		var f Friend
		rows.Scan(&f.ID, &f.UserID, &f.Name, &f.Email, &f.CreatedAt)
		friends = append(friends, f)
	}

	c.JSON(http.StatusOK, friends)
}

func AddFriendHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req AddFriendRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var friendID string
	err := db.DB.QueryRow(
		"INSERT INTO friends (user_id, name, email) VALUES ($1, $2, $3) RETURNING id",
		userID, req.Name, req.Email,
	).Scan(&friendID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add friend"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": friendID, "message": "Friend added successfully"})
}

func DeleteFriendHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	friendID := c.Param("id")

	result, err := db.DB.Exec("DELETE FROM friends WHERE id = $1 AND user_id = $2", friendID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete friend"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Friend not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Friend deleted successfully"})
}

func AutoAddFriendFromParticipant(userID string, name string, email string) {
	if email == "" {
		return
	}
	// Check if already exists
	var exists bool
	err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM friends WHERE user_id = $1 AND email = $2)", userID, email).Scan(&exists)
	if err != nil || exists {
		return
	}
	db.DB.Exec("INSERT INTO friends (user_id, name, email) VALUES ($1, $2, $3)", userID, name, email)
}