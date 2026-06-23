package event

import (
	"testing"
)

func TestShuffleParticipants(t *testing.T) {
	t.Run("valid derangement", func(t *testing.T) {
		participants := []string{"a", "b", "c", "d", "e"}
		result, err := ShuffleParticipants(participants)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		// Check no one is assigned to themselves
		for giver, receiver := range result {
			if giver == receiver {
				t.Errorf("participant %s assigned to themselves", giver)
			}
		}

		// Check all participants are assigned
		if len(result) != len(participants) {
			t.Errorf("expected %d assignments, got %d", len(participants), len(result))
		}

		// Check all receivers are valid participants
		for _, receiver := range result {
			found := false
			for _, p := range participants {
				if p == receiver {
					found = true
					break
				}
			}
			if !found {
				t.Errorf("receiver %s not in participants list", receiver)
			}
		}
	})

	t.Run("minimum 3 participants", func(t *testing.T) {
		_, err := ShuffleParticipants([]string{"a", "b"})
		if err == nil {
			t.Error("expected error for less than 3 participants")
		}
	})

	t.Run("exactly 3 participants", func(t *testing.T) {
		participants := []string{"a", "b", "c"}
		result, err := ShuffleParticipants(participants)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result) != 3 {
			t.Errorf("expected 3 assignments, got %d", len(result))
		}
	})

	t.Run("large group", func(t *testing.T) {
		participants := []string{"a", "b", "c", "d", "e", "f", "g", "h", "i", "j"}
		result, err := ShuffleParticipants(participants)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(result) != 10 {
			t.Errorf("expected 10 assignments, got %d", len(result))
		}
	})
}

func TestGenerateMagicToken(t *testing.T) {
	t.Run("generates unique tokens", func(t *testing.T) {
		token1 := GenerateMagicToken()
		token2 := GenerateMagicToken()
		if token1 == token2 {
			t.Error("expected unique tokens")
		}
	})

	t.Run("generates 32 char hex string", func(t *testing.T) {
		token := GenerateMagicToken()
		if len(token) != 32 {
			t.Errorf("expected 32 chars, got %d", len(token))
		}
	})

	t.Run("generates valid hex", func(t *testing.T) {
		token := GenerateMagicToken()
		for _, c := range token {
			if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
				t.Errorf("invalid hex character: %c", c)
			}
		}
	})
}