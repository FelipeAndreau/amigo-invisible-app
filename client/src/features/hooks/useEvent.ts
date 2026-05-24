import { useState } from 'react';
import { Participant, performShuffle } from '../logic/shuffle';

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
    setState(prev => {
      if (
        prev.participants.some(
          participant => participant.name.toLowerCase() === name.toLowerCase(),
        )
      ) {
        throw new Error('El participante ya existe');
      }

      const newParticipant: Participant = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
      };

      return {
        ...prev,
        participants: [...prev.participants, newParticipant],
      };
    });
  };

  const startShuffle = () => {
    setState(prev => {
      const assignments = performShuffle(prev.participants);

      return {
        ...prev,
        assignments,
        isSorted: true,
      };
    });
  };

  const resetEvent = () => {
    setState({
      name: '',
      participants: [],
      assignments: {},
      isSorted: false,
    });
  };

  return {
    ...state,
    addParticipant,
    startShuffle,
    resetEvent,
  };
};