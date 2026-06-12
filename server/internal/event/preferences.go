package event

import (
	"amigo-invisible-server/internal/platform/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PreferencesRequest struct {
	FavoriteColor  string `json:"favorite_color"`
	ClothingSize   string `json:"clothing_size"`
	FavoriteFood   string `json:"favorite_food"`
	Hobbies        string `json:"hobbies"`
	Allergies      string `json:"allergies"`
	PriceRange     string `json:"price_range"`
	AboutMe        string `json:"about_me"`
}

func SavePreferencesHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	// Verify user is participant
	var participantID string
	err := db.DB.QueryRow("SELECT id FROM participants WHERE event_id = $1 AND user_id = $2", eventID, userID).Scan(&participantID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not a participant in this event"})
		return
	}

	var req PreferencesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Upsert preferences
	_, err = db.DB.Exec(`
		INSERT INTO preferences (participant_id, favorite_color, clothing_size, favorite_food, hobbies, allergies, price_range, about_me)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (participant_id) DO UPDATE SET
			favorite_color = EXCLUDED.favorite_color,
			clothing_size = EXCLUDED.clothing_size,
			favorite_food = EXCLUDED.favorite_food,
			hobbies = EXCLUDED.hobbies,
			allergies = EXCLUDED.allergies,
			price_range = EXCLUDED.price_range,
			about_me = EXCLUDED.about_me,
			updated_at = CURRENT_TIMESTAMP
	`, participantID, req.FavoriteColor, req.ClothingSize, req.FavoriteFood, req.Hobbies, req.Allergies, req.PriceRange, req.AboutMe)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save preferences"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Preferences saved"})
}

func GetAssignmentPreferencesHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	eventID := c.Param("id")

	// Get participant's assigned_to
	var assignedToID *string
	err := db.DB.QueryRow("SELECT assigned_to FROM participants WHERE event_id = $1 AND user_id = $2", eventID, userID).Scan(&assignedToID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not a participant in this event or no assignment yet"})
		return
	}
	if assignedToID == nil || *assignedToID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No assignment yet for this event"})
		return
	}

	// Get preferences of the assigned participant
	var prefs PreferencesRequest
	var participantName string
	err = db.DB.QueryRow(`
		SELECT p.name, 
			COALESCE(pr.favorite_color, ''), 
			COALESCE(pr.clothing_size, ''), 
			COALESCE(pr.favorite_food, ''), 
			COALESCE(pr.hobbies, ''), 
			COALESCE(pr.allergies, ''), 
			COALESCE(pr.price_range, ''), 
			COALESCE(pr.about_me, '')
		FROM participants p
		LEFT JOIN preferences pr ON pr.participant_id = p.id
		WHERE p.id = $1
	`, *assignedToID).Scan(&participantName, &prefs.FavoriteColor, &prefs.ClothingSize, &prefs.FavoriteFood, &prefs.Hobbies, &prefs.Allergies, &prefs.PriceRange, &prefs.AboutMe)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get preferences: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"name":           participantName,
		"favorite_color": prefs.FavoriteColor,
		"clothing_size":  prefs.ClothingSize,
		"favorite_food":  prefs.FavoriteFood,
		"hobbies":        prefs.Hobbies,
		"allergies":      prefs.Allergies,
		"price_range":    prefs.PriceRange,
		"about_me":       prefs.AboutMe,
	})
}
