// Legacy E1 shuffle logic - no longer used (backend handles shuffle now)
// Kept for reference only

export interface Participant {
  id: string;
  name: string;
}

/**
 * Genera una permutación (derangement) de los participantes tal que
 * nadie se asigne a sí mismo.
 */
export const performShuffle = (participants: Participant[]): Record<string, string> => {
  if (participants.length < 3) {
    throw new Error('Se necesitan al menos 3 participantes para el sorteo.');
  }

  // Verificar duplicados de nombres (opcional, pero buena práctica)
  const names = participants.map(p => p.name.toLowerCase().trim());
  const uniqueNames = new Set(names);
  // Nota: Permitimos mismos nombres si tienen IDs distintos, 
  // pero el algoritmo de derangement sobre IDs siempre es posible si N >= 2 y no hay IDs repetidos.

  const ids = participants.map(p => p.id);
  let shuffledIds = [...ids];
  let isValid = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 500;

  while (!isValid && attempts < MAX_ATTEMPTS) {
    attempts++;
    // Fisher-Yates Shuffle
    for (let i = shuffledIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
    }

    // Validar que no haya auto-asignaciones
    isValid = true;
    for (let i = 0; i < ids.length; i++) {
      if (shuffledIds[i] === ids[i]) {
        isValid = false;
        break;
      }
    }
  }

  if (!isValid) {
    throw new Error('No se pudo generar un sorteo válido tras varios intentos. Intenta cambiar los participantes.');
  }

  const assignments: Record<string, string> = {};
  ids.forEach((id, index) => {
    assignments[id] = shuffledIds[index];
  });

  return assignments;
};
