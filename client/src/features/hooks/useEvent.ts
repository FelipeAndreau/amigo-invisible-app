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

    return {
        ...state,
    };
}