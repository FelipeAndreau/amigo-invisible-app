package groups

import (
	"amigo-invisible-server/internal/platform/db"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateGroupHandler creates a new group and registers the creator as a member.
func CreateGroupHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req CreateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	inviteCode := GenerateInviteCode()

	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	var groupID string
	err = tx.QueryRow(
		"INSERT INTO groups (name, created_by, invite_code) VALUES ($1, $2, $3) RETURNING id",
		req.Name, userID, inviteCode,
	).Scan(&groupID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create group"})
		return
	}

	_, err = tx.Exec(
		"INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
		groupID, userID,
	)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add creator as member"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"group_id": groupID, "invite_code": inviteCode})
}

// ListGroupsHandler returns all groups where the current user is a member.
func ListGroupsHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	rows, err := db.DB.Query(`
		SELECT g.id, g.name, g.created_by, g.invite_code, g.created_at
		FROM groups g
		JOIN group_members gm ON g.id = gm.group_id
		WHERE gm.user_id = $1
		ORDER BY g.created_at DESC
	`, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query groups"})
		return
	}
	defer rows.Close()

	groups := []Group{}
	for rows.Next() {
		var g Group
		rows.Scan(&g.ID, &g.Name, &g.CreatedBy, &g.InviteCode, &g.CreatedAt)
		groups = append(groups, g)
	}

	c.JSON(http.StatusOK, groups)
}

// GetGroupHandler returns a single group if the user is a member.
func GetGroupHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	groupID := c.Param("id")

	var g Group
	err := db.DB.QueryRow(`
		SELECT g.id, g.name, g.created_by, g.invite_code, g.created_at
		FROM groups g
		JOIN group_members gm ON g.id = gm.group_id
		WHERE g.id = $1 AND gm.user_id = $2
	`, groupID, userID).Scan(&g.ID, &g.Name, &g.CreatedBy, &g.InviteCode, &g.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Group not found or unauthorized"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query group"})
		return
	}

	c.JSON(http.StatusOK, g)
}

// JoinGroupHandler allows a user to join a group by invite code.
func JoinGroupHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req JoinGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var groupID string
	err := db.DB.QueryRow("SELECT id FROM groups WHERE invite_code = $1", req.InviteCode).Scan(&groupID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Invalid invite code"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find group"})
		return
	}

	_, err = db.DB.Exec(
		"INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
		groupID, userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join group"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"group_id": groupID, "message": "Joined group successfully"})
}

// ListGroupMembersHandler returns all members of a group.
func ListGroupMembersHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	groupID := c.Param("id")

	// Verify membership first
	var memberCount int
	err := db.DB.QueryRow(
		"SELECT COUNT(*) FROM group_members WHERE group_id = $1 AND user_id = $2",
		groupID, userID,
	).Scan(&memberCount)
	if err != nil || memberCount == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to view this group"})
		return
	}

	rows, err := db.DB.Query(`
		SELECT gm.id, gm.user_id, u.email, gm.joined_at
		FROM group_members gm
		JOIN users u ON gm.user_id = u.id
		WHERE gm.group_id = $1
		ORDER BY gm.joined_at ASC
	`, groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query members"})
		return
	}
	defer rows.Close()

	members := []MemberDetail{}
	for rows.Next() {
		var m MemberDetail
		rows.Scan(&m.ID, &m.UserID, &m.Email, &m.JoinedAt)
		members = append(members, m)
	}

	c.JSON(http.StatusOK, members)
}

// DeleteGroupMemberHandler removes a member from a group. Only the creator can do it.
func DeleteGroupMemberHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	groupID := c.Param("id")
	memberUserID := c.Param("user_id")

	var createdBy string
	err := db.DB.QueryRow("SELECT created_by FROM groups WHERE id = $1", groupID).Scan(&createdBy)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query group"})
		return
	}

	if createdBy != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the group creator can remove members"})
		return
	}

	if memberUserID == createdBy {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot remove the group creator"})
		return
	}

	_, err = db.DB.Exec(
		"DELETE FROM group_members WHERE group_id = $1 AND user_id = $2",
		groupID, memberUserID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove member"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Member removed successfully"})
}

// ListGroupEventsHandler returns all events that belong to a group.
func ListGroupEventsHandler(c *gin.Context) {
	userID, _ := c.Get("userID")
	groupID := c.Param("id")

	var memberCount int
	err := db.DB.QueryRow(
		"SELECT COUNT(*) FROM group_members WHERE group_id = $1 AND user_id = $2",
		groupID, userID,
	).Scan(&memberCount)
	if err != nil || memberCount == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to view this group"})
		return
	}

	rows, err := db.DB.Query(`
		SELECT id, name, status, created_at
		FROM events
		WHERE group_id = $1
		ORDER BY created_at DESC
	`, groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query group events"})
		return
	}
	defer rows.Close()

	events := []GroupEvent{}
	for rows.Next() {
		var e GroupEvent
		rows.Scan(&e.ID, &e.Name, &e.Status, &e.CreatedAt)
		events = append(events, e)
	}

	c.JSON(http.StatusOK, events)
}
