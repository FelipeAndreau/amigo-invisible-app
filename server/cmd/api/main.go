package main

import (
	"amigo-invisible-server/internal/auth"
	"amigo-invisible-server/internal/event"
	"amigo-invisible-server/internal/platform/db"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	db.InitDB()

	r := gin.Default()

	// Cargar plantillas HTML
	r.LoadHTMLGlob("web/templates/*.html")

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

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

		api.GET("/reveal/:token", event.RevealHandler)
		r.GET("/r/:token", event.RevealHandler) // Ruta corta: /r/TOKEN

		// Rutas protegidas
		protected := api.Group("/")
		protected.Use(auth.AuthMiddleware())
		{
			protected.GET("/events", event.ListEventsHandler)
			protected.POST("/events", event.CreateEventHandler)
			protected.DELETE("/events/:id", event.DeleteEventHandler)
			protected.GET("/events/:id/participants", event.ListEventParticipantsHandler)
			protected.POST("/events/:id/participants", event.AddParticipantHandler)
			protected.POST("/events/:id/shuffle", event.ShuffleEventHandler)
			protected.DELETE("/events/:id/participants/:participant_id", event.DeleteParticipantHandler)
		}
	}

	r.Run("0.0.0.0:8080")
}
