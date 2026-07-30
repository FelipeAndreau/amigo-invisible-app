package auth

import (
	"amigo-invisible-server/internal/platform/auth"
	"amigo-invisible-server/internal/platform/db"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AuthRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

// validatePasswordStrength verifica que la contraseña cumpla con políticas de seguridad
func validatePasswordStrength(password string) error {
	if len(password) < 8 {
		return errors.New("La contraseña debe tener al menos 8 caracteres")
	}

	hasUpper := false
	hasLower := false
	hasNumber := false

	for _, char := range password {
		switch {
		case char >= 'A' && char <= 'Z':
			hasUpper = true
		case char >= 'a' && char <= 'z':
			hasLower = true
		case char >= '0' && char <= '9':
			hasNumber = true
		}
	}

	if !hasUpper {
		return errors.New("La contraseña debe contener al menos una mayúscula")
	}
	if !hasLower {
		return errors.New("La contraseña debe contener al menos una minúscula")
	}
	if !hasNumber {
		return errors.New("La contraseña debe contener al menos un número")
	}

	return nil
}

func RegisterHandler(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := validatePasswordStrength(req.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	var userID string
	err = db.DB.QueryRow("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id", req.Email, string(hashedPassword)).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists or database error"})
		return
	}

	token, err := auth.GenerateToken(userID, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user_id": userID,
		"token":   token,
	})
}

func LoginHandler(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userID, passwordHash string
	err := db.DB.QueryRow("SELECT id, password_hash FROM users WHERE email = $1", req.Email).Scan(&userID, &passwordHash)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token, err := auth.GenerateToken(userID, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"token":   token,
	})
}
