import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Theme } from '../../shared/theme';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { ParticipantInput } from './components/ParticipantInput';
import { ParticipantList } from './components/ParticipantList';
import { apiClient } from '../../shared/utils/api';
import { ChevronLeft } from 'lucide-react-native';

const CreateEventScreen = ({ navigation }: any) => {
  const [eventName, setEventName] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addParticipant = (name: string) => {
    if (participants.includes(name)) {
      Alert.alert('Error', 'Este participante ya está en la lista');
      return;
    }
    setParticipants([...participants, name]);
  };

  const handleCreate = async () => {
    if (!eventName.trim() || participants.length < 3) {
      Alert.alert('Error', 'El evento necesita un nombre y al menos 3 participantes');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/events', { name: eventName, participants });
      Alert.alert('Éxito', 'Evento creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el evento');
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

      <ParticipantList 
        participants={participants.map((p, i) => ({ id: i.toString(), name: p }))}
        ListHeaderComponent={
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre del Evento</Text>
            <Input 
              placeholder="Ej: Navidad 2026" 
              value={eventName} 
              onChangeText={setEventName} 
            />

            <View style={{ height: Theme.spacing.lg }} />

            <Text style={styles.label}>Participantes ({participants.length})</Text>
            <ParticipantInput onAdd={addParticipant} />
            
            <View style={{ height: Theme.spacing.md }} />
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <View style={{ height: Theme.spacing.xl }} />
            <Button 
              title="Crear y Guardar" 
              onPress={handleCreate} 
              loading={!!loading}
            />
          </View>
        }
      />
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
  formContainer: {
    paddingHorizontal: Theme.spacing.lg,
  },
  footerContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 40,
  },
  label: {
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
    fontSize: 16,
  }
});

export default CreateEventScreen;
