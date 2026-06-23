package event

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"math/big"
)

// GenerateMagicToken creates a unique secure string for participant access
func GenerateMagicToken() string {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		panic(err) // Should never fail with crypto/rand
	}
	return hex.EncodeToString(b)
}

// ShuffleParticipants implements Fisher-Yates and ensures a derangement
func ShuffleParticipants(participantIDs []string) (map[string]string, error) {
	n := len(participantIDs)
	if n < 3 {
		return nil, errors.New("minimum 3 participants required for a fair shuffle")
	}

	// Simple approach for derangement:
	// Shuffle and check until no one is at their original position
	// For N >= 3, the probability of a derangement is approx 1/e (~36.7%)

	targets := make([]string, n)
	copy(targets, participantIDs)

	for attempt := 0; attempt < 100; attempt++ {
		// Shuffle targets
		for i := n - 1; i > 0; i-- {
			jBig, _ := rand.Int(rand.Reader, big.NewInt(int64(i+1)))
			j := int(jBig.Int64())
			targets[i], targets[j] = targets[j], targets[i]
		}

		// Check if it's a derangement
		valid := true
		for i := 0; i < n; i++ {
			if targets[i] == participantIDs[i] {
				valid = false
				break
			}
		}

		if valid {
			result := make(map[string]string)
			for i := 0; i < n; i++ {
				result[participantIDs[i]] = targets[i]
			}
			return result, nil
		}
	}

	return nil, errors.New("failed to generate a valid derangement after 100 attempts")
}