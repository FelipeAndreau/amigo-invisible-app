import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Theme } from '../theme';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onRemove: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    color: '#10B981',
    bgColor: '#F0FDF4',
  },
  error: {
    icon: XCircle,
    color: '#EF4444',
    bgColor: '#FEF2F2',
  },
  warning: {
    icon: AlertCircle,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  info: {
    icon: Info,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
  },
};

export const Toast: React.FC<ToastProps> = ({ id, message, type, onRemove }) => {
  const translateY = new Animated.Value(-100);
  const opacity = new Animated.Value(0);

  const config = toastConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate out after 2.7s
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onRemove(id);
      });
    }, 2700);

    return () => clearTimeout(timer);
  }, [id, onRemove, translateY, opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: config.bgColor,
          borderColor: config.color,
        },
      ]}
    >
      <IconComponent size={20} color={config.color} />
      <Text style={[styles.message, { color: config.color }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  message: {
    fontFamily: Theme.fonts.heading,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});