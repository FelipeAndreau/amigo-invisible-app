package event

import (
	"amigo-invisible-server/internal/platform/db"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type EventDateRequest struct {
	EventDate *time.Time `json:"event_date"`
}

func SetEventDateHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	var exists bool
	err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM events WHERE id = $1 AND user_id = $2)", eventID, userID).Scan(&exists)
	if err != nil || !exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only organizer can set event date"})
		return
	}

	var req EventDateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err = db.DB.Exec("UPDATE events SET event_date = $1 WHERE id = $2", req.EventDate, eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set event date"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event date updated"})
}

func GetEventDateHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

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

	var eventDate *time.Time
	err = db.DB.QueryRow("SELECT event_date FROM events WHERE id = $1", eventID).Scan(&eventDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get event date"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"event_date": eventDate})
}

type GalleryPhotoRequest struct {
	PhotoData string `json:"photo_data" binding:"required"`
	Caption   string `json:"caption"`
}

type GalleryPhoto struct {
	ID        string    `json:"id"`
	PhotoData string    `json:"photo_data"`
	Caption   string    `json:"caption"`
	CreatedAt time.Time `json:"created_at"`
}

func UploadGalleryPhotoHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	var isAuthorized bool
	err := db.DB.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM events WHERE id = $1 AND user_id = $2
			UNION
			SELECT 1 FROM participants WHERE event_id = $1 AND user_id = $2
		)
	`, eventID, userID).Scan(&isAuthorized)
	if err != nil || !isAuthorized {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
		return
	}

	// Check if event date has passed
	var eventDate *time.Time
	err = db.DB.QueryRow("SELECT event_date FROM events WHERE id = $1", eventID).Scan(&eventDate)
	if err != nil || eventDate == nil || time.Now().Before(*eventDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gallery is only available after the event date"})
		return
	}

	var req GalleryPhotoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var photoID string
	err = db.DB.QueryRow("INSERT INTO gallery_photos (event_id, user_id, photo_data, caption) VALUES ($1, $2, $3, $4) RETURNING id", eventID, userID, req.PhotoData, req.Caption).Scan(&photoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload photo"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": photoID, "message": "Photo uploaded"})
}

func ListGalleryPhotosHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	var isAuthorized bool
	err := db.DB.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM events WHERE id = $1 AND user_id = $2
			UNION
			SELECT 1 FROM participants WHERE event_id = $1 AND user_id = $2
		)
	`, eventID, userID).Scan(&isAuthorized)
	if err != nil || !isAuthorized {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
		return
	}

	// Check if event date has passed
	var eventDate *time.Time
	err = db.DB.QueryRow("SELECT event_date FROM events WHERE id = $1", eventID).Scan(&eventDate)
	if err != nil || eventDate == nil || time.Now().Before(*eventDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gallery is only available after the event date"})
		return
	}

	rows, err := db.DB.Query("SELECT id, photo_data, caption, created_at FROM gallery_photos WHERE event_id = $1 ORDER BY created_at DESC", eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get photos"})
		return
	}
	defer rows.Close()

	photos := []GalleryPhoto{}
	for rows.Next() {
		var p GalleryPhoto
		rows.Scan(&p.ID, &p.PhotoData, &p.Caption, &p.CreatedAt)
		photos = append(photos, p)
	}

	c.JSON(http.StatusOK, photos)
}
