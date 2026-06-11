import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { Button } from '../../shared/components/Button';
import { Gift, Lock, AlertCircle, Sparkles } from 'lucide-react-native';

const RevealPublicScreen = ({ route }: any) => {
  const { token } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ name: string; assignedName: string } | null>(null);
  const [revealed, setRevealed] = useState(false);
  
  // Animations
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    if (!token) {
      setError('No se proporcionó un token de revelación válido');
      setLoading(false);
      return;
    }

    fetchReveal();
  }, [token]);

  const fetchReveal = async () => {
    try {
      // Use JSON API instead of HTML parsing
      const data = await apiClient.get(`/reveal/${token}`);
      setResult({
        name: data.name,
        assignedName: data.assigned_name
      });
    } catch (e: any) {
      if (e.message && e.message.includes('403')) {
        setError('Este resultado ya fue revelado anteriormente. Por seguridad, solo se puede ver una vez.');
      } else if (e.message && e.message.includes('404')) {
        setError('Link inválido o expirado');
      } else {
        setError('Error de conexión. Verifica tu internet e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Verificando tu link...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <AlertCircle size={48} color={Theme.colors.error} />
          <Text style={styles.errorTitle}>No se puede mostrar</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se encontró información del sorteo.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Gift size={48} color={Theme.colors.primary} />
        
        <Text style={styles.greeting}>¡Hola, {result.name}!</Text>
        <Text style={styles.subtitle}>Tu Amigo Invisible te espera...</Text>

        {!revealed ? (
          <View style={styles.revealSection}>
            <Lock size={32} color={Theme.colors.gray} />
            <Text style={styles.hint}>Mantén presionado para revelar</Text>
            <Button 
              title="Revelar mi Amigo Invisible"
              onPress={handleReveal}
              type="primary"
            />
          </View>
        ) : (
          <Animated.View style={[
            styles.resultSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}>
            <Sparkles size={32} color={Theme.colors.cta} />
            <Text style={styles.resultLabel}>¡Tu amigo invisible es:</Text>
            <Text style={styles.resultName}>{result.assignedName}</Text>
            <Text style={styles.warning}>¡No se lo digas a nadie! 🤫</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
  },
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingText: {
    marginTop: Theme.spacing.md,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    fontSize: 16,
  },
  errorCard: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  errorTitle: {
    fontFamily: Theme.fonts.heading,
    fontSize: 20,
    color: Theme.colors.error,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  errorText: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.gray,
    textAlign: 'center',
  },
  greeting: {
    fontFamily: Theme.fonts.heading,
    fontSize: 24,
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
  },
  subtitle: {
    fontFamily: Theme.fonts.body,
    fontSize: 16,
    color: Theme.colors.gray,
    marginBottom: Theme.spacing.lg,
  },
  revealSection: {
    alignItems: 'center',
    width: '100%',
  },
  hint: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.gray,
    marginVertical: Theme.spacing.md,
  },
  resultSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: Theme.spacing.md,
  },
  resultLabel: {
    fontFamily: Theme.fonts.heading,
    fontSize: 18,
    color: Theme.colors.text,
    marginTop: Theme.spacing.sm,
  },
  resultName: {
    fontFamily: Theme.fonts.heading,
    fontSize: 32,
    color: Theme.colors.primary,
    marginVertical: Theme.spacing.md,
  },
  warning: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.gray,
    fontStyle: 'italic',
  },
});

export default RevealPublicScreen;
