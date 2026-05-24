import { useState } from 'react';
import { Participant } from '../logic/shuffle';

export interface EventState {
  name: string;
  participants: Participant[];
  assignments: Record<string, string>;
  isSorted: boolean;
}

export const useEvent = () => {
  const [state, setState] = useState<EventState>({
    name: '',
    participants: [],
    assignments: {},
    isSorted: false,
  });

  const addParticipant = (name: string) => {
    if (
      state.participants.some(
        participant => participant.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      throw new Error('El participante ya existe');
    }

    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
    };

    setState({
      ...state,
      participants: [...state.participants, newParticipant],
    });
  };

  return {
    ...state,
    addParticipant,
  };
};