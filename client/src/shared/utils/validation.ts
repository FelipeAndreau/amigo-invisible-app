/**
 * Utilidades de validación para el frontend
 * Asegura que las entradas del usuario cumplan con reglas de negocio
 * antes de enviarlas al backend.
 */

export const ValidationRules = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  },

  eventName: (name: string): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 50;
  },

  participantName: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 30;
  },

  inviteCode: (code: string): boolean => {
    return code.trim().length >= 6 && code.trim().length <= 16;
  },
};

export const ValidationMessages = {
  email: 'Ingresa un email válido (ej: usuario@email.com)',
  password: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  eventName: 'El nombre del evento debe tener entre 3 y 50 caracteres',
  participantName: 'El nombre debe tener entre 2 y 30 caracteres',
  inviteCode: 'El código de invitación debe tener entre 6 y 16 caracteres',
  required: 'Este campo es obligatorio',
};
