package groups

import (
	"crypto/rand"
	"encoding/hex"
)

// GenerateInviteCode creates a unique 8-character hex code for joining a group.
func GenerateInviteCode() string {
	b := make([]byte, 4)
	if _, err := rand.Read(b); err != nil {
		panic(err) // Should never fail with crypto/rand
	}
	return hex.EncodeToString(b)
}
