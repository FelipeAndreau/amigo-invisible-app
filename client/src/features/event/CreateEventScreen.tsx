import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Theme } from '../../shared/theme';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { apiClient } from '../../shared/utils/api';
import { ChevronLeft } from 'lucide-react-native';

const CreateEventScreen = ({ navigation }: any) => {
  const [eventName, setEventName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Ingresa un nombre para el sorteo');
      return;
    }
    if (!displayName.trim()) {
      Alert.alert('Error', 'Ingresa tu nombre para el sorteo');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/events', { 
        name: eventName.trim(), 
        organizer_display_name: displayName.trim() 
      });
      Alert.alert(
        '¡Sorteo creado!',
        `Tu código de invitación es: ${response.invite_code}\n\nComparte este código con tus amigos para que se unan.`,
        [
          { 
            text: 'Ver sorteo', 
            onPress: () => navigation.navigate('EventDetail', {
              eventId: response.event_id,
              eventName: eventName.trim(),
              status: 'open',
              role: 'organizer',
              inviteCode: response.invite_code
            })
          }
        ]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el sorteo');
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
        <Text style={styles.title}>Nuevo Sorteo</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Nombre del Sorteo"
          placeholder="Ej: Navidad 2026"
          value={eventName}
          onChangeText={setEventName}
        />
        <Input
          label="Tu nombre en el sorteo"
          placeholder="Cómo te verán los demás"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <Button
          title="Crear Sorteo"
          onPress={handleCreate}
          loading={loading}
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
    fontSize: 24,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  form: {
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
});

export default CreateEventScreen;