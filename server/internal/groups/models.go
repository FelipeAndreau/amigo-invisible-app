package groups

import "time"

// Group represents a circle of users that can host multiple events over time.
type Group struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	CreatedBy  string    `json:"created_by"`
	InviteCode string    `json:"invite_code"`
	CreatedAt  time.Time `json:"created_at"`
}

// GroupMember represents a user's membership in a group.
type GroupMember struct {
	ID       string    `json:"id"`
	GroupID  string    `json:"group_id"`
	UserID   string    `json:"user_id"`
	JoinedAt time.Time `json:"joined_at"`
}

// CreateGroupRequest is the payload for creating a new group.
type CreateGroupRequest struct {
	Name string `json:"name" binding:"required"`
}

// JoinGroupRequest is the payload for joining a group by invite code.
type JoinGroupRequest struct {
	InviteCode string `json:"invite_code" binding:"required"`
}

// MemberDetail augments a group member with the user's email for display.
type MemberDetail struct {
	ID       string    `json:"id"`
	UserID   string    `json:"user_id"`
	Email    string    `json:"email"`
	JoinedAt time.Time `json:"joined_at"`
}

// GroupEvent is a lightweight event representation returned inside a group.
type GroupEvent struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}
