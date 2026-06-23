import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Theme } from '../../shared/theme';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { useAuth } from '../../shared/hooks/useAuth';
import { apiClient } from '../../shared/utils/api';
import { ValidationRules, ValidationMessages } from '../../shared/utils/validation';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError(ValidationMessages.required);
      isValid = false;
    } else if (!ValidationRules.email(email)) {
      setEmailError(ValidationMessages.email);
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError(ValidationMessages.required);
      isValid = false;
    } else if (isRegister) {
      const passwordValidation = ValidationRules.password(password);
      if (!passwordValidation.valid) {
        setPasswordError(passwordValidation.errors.join('\n'));
        isValid = false;
      }
    }

    return isValid;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const data = await apiClient.post(endpoint, { email, password });
      await login(data.token);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Amigo Invisible</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'Crea tu cuenta de organizador' : 'Bienvenido de nuevo'}
        </Text>

        <Input 
          placeholder="Email" 
          value={email} 
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          error={emailError}
        />
        <View style={{ height: Theme.spacing.md }} />
        <Input 
          placeholder="Contraseña" 
          value={password} 
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError('');
          }}
          secureTextEntry={true}
          error={passwordError}
        />
        {isRegister && password.length > 0 && password.length < 8 && (
          <Text style={styles.hint}>Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número</Text>
        )}

        <View style={{ height: Theme.spacing.lg }} />
        
        <Button 
          title={isRegister ? 'Registrarse' : 'Iniciar Sesión'} 
          onPress={handleAuth} 
          loading={!!loading}
          type="primary"
        />

        <Button 
          title={isRegister ? '¿Ya tienes cuenta? Ingresa' : '¿No tienes cuenta? Regístrate'} 
          onPress={() => setIsRegister(!isRegister)} 
          type="secondary"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.primary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  hint: {
    fontSize: 12,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
});

export default LoginScreen;