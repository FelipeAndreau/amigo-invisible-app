package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "up",
			"version": "1.0.0",
		})
	})

	// Placeholder para futuras rutas de la E2
	api := r.Group("/api/v1")
	{
		api.GET("/events", func(c *gin.Context) {
			c.JSON(http.StatusOK, []string{})
		})
	}

	r.Run(":8080")
}
