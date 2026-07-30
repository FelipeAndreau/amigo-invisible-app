package db

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"os"
	"path/filepath"
	"runtime"
)

var DB *sql.DB

func InitDB() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	name := os.Getenv("DB_NAME")

	log.Printf("Connecting to DB: host=%s port=%s user=%s dbname=%s", host, port, user, name)

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, os.Getenv("DB_PASSWORD"), name,
	)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}

	log.Println("Successfully connected to the database")

	// Auto-migration: ejecutar schema.sql si existe
	if err := runMigrations(); err != nil {
		log.Printf("Warning: failed to run migrations: %v", err)
	}
}

func runMigrations() error {
	_, b, _, _ := runtime.Caller(0)
	basePath := filepath.Dir(b)
	schemaPath := filepath.Join(basePath, "schema.sql")

	schemaSQL, err := os.ReadFile(schemaPath)
	if err != nil {
		return fmt.Errorf("could not read schema.sql: %w", err)
	}

	_, err = DB.Exec(string(schemaSQL))
	if err != nil {
		return fmt.Errorf("could not execute schema.sql: %w", err)
	}

	// Ejecutar migraciones adicionales
	migrationsDir := filepath.Join(basePath, "migrations")
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		log.Printf("No migrations directory found, skipping: %v", err)
	} else {
		for _, entry := range entries {
			if !entry.IsDir() && filepath.Ext(entry.Name()) == ".sql" {
				migrationPath := filepath.Join(migrationsDir, entry.Name())
				migrationSQL, err := os.ReadFile(migrationPath)
				if err != nil {
					log.Printf("Warning: could not read migration %s: %v", entry.Name(), err)
					continue
				}
				_, err = DB.Exec(string(migrationSQL))
				if err != nil {
					log.Printf("Warning: failed to execute migration %s: %v", entry.Name(), err)
					continue
				}
				log.Printf("Migration executed: %s", entry.Name())
			}
		}
	}

	log.Println("Database schema initialized successfully")
	return nil
}
