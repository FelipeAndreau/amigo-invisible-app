package main

import (
	"amigo-invisible-server/internal/auth"
	"amigo-invisible-server/internal/platform/db"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	db.InitDB()

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "up",
			"version": "1.0.0",
		})
	})

	api := r.Group("/api/v1")
	{
		// Rutas públicas
		authGroup := api.Group("/auth")
		{
			authGroup.POST("/register", auth.RegisterHandler)
			authGroup.POST("/login", auth.LoginHandler)
		}

		// Rutas protegidas
		protected := api.Group("/")
		protected.Use(auth.AuthMiddleware())
		{
			protected.GET("/events", func(c *gin.Context) {
				userID, _ := c.Get("userID")
				c.JSON(http.StatusOK, gin.H{
					"events": []string{},
					"owner":  userID,
				})
			})
		}
	}

	r.Run(":8080")
}
