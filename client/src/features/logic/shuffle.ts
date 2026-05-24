export interface Participant {
  id: string;
  name: string;
}

export const performShuffle = (participants: Participant[]): Record<string, string> => {
  if (participants.length < 3) {
    throw new Error('Se necesitan al menos 3 participantes para el sorteo.');
  }

  const names = participants.map(participant => participant.name);
  let shuffledNames = [...names];
  let isValid = false;

  while (!isValid) {
    shuffledNames = [...names];

    for (let i = shuffledNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }

    isValid = true;

    for (let i = 0; i < names.length; i++) {
      if (names[i] === shuffledNames[i]) {
        isValid = false;
        break;
      }
    }
  }

  const assignments: Record<string, string> = {};

  names.forEach((name, index) => {
    assignments[name] = shuffledNames[index];
  });

  return assignments;
};