import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { ChevronLeft, LogIn } from 'lucide-react-native';

const JoinEventScreen = ({ navigation }: any) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Ingresa el código de invitación');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Ingresa tu nombre');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/events/join', { code: code.trim(), name: name.trim() });
      Alert.alert('¡Éxito!', 'Te uniste al sorteo correctamente', [
        { text: 'Ver sorteo', onPress: () => navigation.navigate('EventDetail', {
          eventId: response.event_id,
          eventName: '',
          status: 'open',
          role: 'participant'
        })},
        { text: 'Dashboard', onPress: () => navigation.navigate('Dashboard') }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo unir al sorteo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Unirse a Sorteo</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Código de invitación"
          value={code}
          onChangeText={setCode}
          placeholder="Ej: ABC123"
          autoCapitalize="characters"
        />
        <Input
          label="Tu nombre"
          value={name}
          onChangeText={setName}
          placeholder="Cómo te verán los demás"
        />
        <Button
          title="Unirse"
          onPress={handleJoin}
          loading={loading}
          icon={<LogIn size={20} color="white" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  backBtn: {
    marginRight: Theme.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  form: {
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
});

export default JoinEventScreen;