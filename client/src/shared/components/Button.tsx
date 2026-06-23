import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'cta' | 'danger' | 'dark';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  icon, 
  disabled, 
  loading,
  style 
}: Props) => {
  const getBgColor = () => {
    if (disabled) return '#CBD5E1';
    switch (type) {
      case 'secondary': return Theme.colors.secondary;
      case 'cta': return Theme.colors.cta;
      case 'danger': return Theme.colors.error;
      case 'dark': return Theme.colors.text;
      default: return Theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: getBgColor() }, style]}
      onPress={onPress}
      disabled={!!(disabled || loading)}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          {!!icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Fredoka-Bold',
    color: Theme.colors.white,
    fontSize: 18,
  },
});
