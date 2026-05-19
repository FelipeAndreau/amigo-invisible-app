import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Participant, performShuffle } from '../logic/shuffle';

const STORAGE_KEY = '@amigo_invisible_event';

export interface EventState {
  name: string;
  participants: Participant[];
  assignments: Record<string, string>; // { giverId: receiverId }
  isSorted: boolean;
}

export const useEvent = () => {
  const [state, setState] = useState<EventState>({
    name: '',
    participants: [],
    assignments: {},
    isSorted: false,
  });
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);

  // Cargar datos al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
          setState(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Error loading event data', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Guardar datos (Debounced/Guarded)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!loading && state.name !== '') {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
          console.error('Error saving event data', e);
        }
      };
      saveData();
    }
  }, [state, loading]);

  const createEvent = useCallback((name: string) => {
    setState({ name, participants: [], assignments: {}, isSorted: false });
  }, []);

  const addParticipant = useCallback((name: string) => {
    setState(prev => {
      if (prev.participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('El participante ya existe');
      }
      const newParticipant: Participant = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim()
      };
      return {
        ...prev,
        participants: [...prev.participants, newParticipant],
      };
    });
  }, []);

  const startShuffle = useCallback(() => {
    setState(prev => {
      const assignments = performShuffle(prev.participants);
      return {
        ...prev,
        assignments,
        isSorted: true,
      };
    });
  }, []);

  const resetEvent = useCallback(async () => {
    // Primero limpiamos almacenamiento para evitar race conditions
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState({ name: '', participants: [], assignments: {}, isSorted: false });
  }, []);

  return {
    ...state,
    loading,
    createEvent,
    addParticipant,
    startShuffle,
    resetEvent,
  };
};
