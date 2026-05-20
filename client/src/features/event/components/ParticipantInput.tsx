import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Theme } from '../../../shared/theme';

interface Props {
  onAdd: (name: string) => void;
}

export const ParticipantInput = ({ onAdd }: Props) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAdd(input.trim());
    setInput('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del amigo..."
        value={input}
        onChangeText={setInput}
        placeholderTextColor={Theme.colors.gray}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAdd}
        accessibilityLabel="Agregar participante"
        accessibilityRole="button"
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 12,
    color: Theme.colors.text,
  },
  button: {
    backgroundColor: Theme.colors.cta,
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Theme.colors.cta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
