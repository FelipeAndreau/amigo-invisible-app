package event

import "time"

type Event struct {
	ID         string    `json:"id"`
	UserID     string    `json:"user_id"`
	Name       string    `json:"name"`
	Status     string    `json:"status"` // draft, shuffled
	InviteCode string    `json:"invite_code,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}

type Participant struct {
	ID          string  `json:"id"`
	EventID     string  `json:"event_id"`
	Name        string  `json:"name"`
	Email       string  `json:"email,omitempty"`
	UserID      *string `json:"user_id,omitempty"`
	AssignedTo  string  `json:"assigned_to,omitempty"`
	AccessToken string  `json:"access_token,omitempty"`
}

type CreateEventRequest struct {
	Name              string `json:"name" binding:"required"`
	OrganizerDisplayName string `json:"organizer_display_name" binding:"required"`
}
