import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { Theme } from '../theme';

interface Props {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
}

export const Input = ({ label, placeholder, value, onChangeText, error, secureTextEntry }: Props) => (
  <View style={styles.container}>
    {!!label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={[styles.input, !!error && styles.inputError]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!!secureTextEntry}
      placeholderTextColor={Theme.colors.gray}
    />
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: Theme.colors.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: Theme.colors.text,
  },
  inputError: {
    borderColor: Theme.colors.error,
  },
  errorText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: Theme.colors.error,
    marginTop: 4,
  },
});
