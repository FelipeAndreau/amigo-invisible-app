import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Share } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { Button } from '../../shared/components/Button';
import { ParticipantList } from './components/ParticipantList';
import { ParticipantInput } from './components/ParticipantInput';
import { ChevronLeft, Play } from 'lucide-react-native';

const EventDetailScreen = ({ route, navigation }: any) => {
  const { eventId, eventName, status: initialStatus } = route.params;
  const [participants, setParticipants] = useState<any[]>([]);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);

  const fetchData = async () => {
    try {
      const data = await apiClient.get(`/events/${eventId}/participants`);
      setParticipants(data);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar los participantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleShuffle = async () => {
    if (participants.length < 3) {
        Alert.alert('Error', 'Necesitas al menos 3 participantes para el sorteo.');
        return;
    }

    Alert.alert(
      '¿Realizar sorteo?',
      'Una vez realizado, no podrás agregar o eliminar participantes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sortear',
          onPress: async () => {
            setShuffling(true);
            try {
              await apiClient.post(`/events/${eventId}/shuffle`, {});
              setStatus('shuffled');
              await fetchData();
              Alert.alert('¡Éxito!', 'Sorteo realizado. Ahora puedes compartir los links.');
            } catch (e: any) {
              Alert.alert('Error', e.message);
            } finally {
              setShuffling(false);
            }
          }
        }
      ]
    );
  };

  const handleShare = async (p: any) => {
    if (!p.access_token) return;
    const url = `http://192.168.100.94:8080/r/${p.access_token}`;
    try {
      await Share.share({
        message: `🎁 *¡Llegó el Amigo Invisible!* 🎁\n\nHola *${p.name}*, ya puedes descubrir a quién te toca hacerle un regalo.\n\n🤫 Haz clic aquí para ver tu resultado:\n${url}\n\n_Recuerda no decírselo a nadie..._`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteParticipant = (p: any) => {
    Alert.alert(
      'Eliminar Participante',
      `¿Deseas quitar a ${p.name} de este sorteo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/events/${eventId}/participants/${p.id}`);
              fetchData();
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          }
        }
      ]
    );
  };

  const handleAddParticipant = async (name: string) => {
    try {
      await apiClient.post(`/events/${eventId}/participants`, { name });
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{eventName}</Text>
          <Text style={styles.subtitle}>
            {status === 'shuffled' ? 'Sorteo Finalizado' : 'Borrador'}
          </Text>
        </View>
      </View>

      <ParticipantList 
        participants={participants}
        onPress={(p) => status === 'shuffled' && handleShare(p)}
        onDelete={handleDeleteParticipant}
        showShareIcon={status === 'shuffled'}
        showDeleteIcon={status === 'draft'}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.label}>Participantes ({participants.length})</Text>
            {status === 'draft' && (
              <View style={styles.inputWrapper}>
                <ParticipantInput onAdd={handleAddParticipant} />
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {status === 'shuffled' ? (
              <Text style={styles.infoText}>Pulsa en cada participante para compartir su link de revelación.</Text>
            ) : (
              <Button 
                title="Realizar Sorteo" 
                onPress={handleShuffle} 
                loading={shuffling}
                icon={<Play size={20} color="white" />}
              />
            )}
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
  },
  listHeader: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
    fontSize: 16,
    marginBottom: Theme.spacing.sm,
  },
  inputWrapper: {
    marginTop: Theme.spacing.sm,
  },
  footer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: 20,
  },
  infoText: {
    textAlign: 'center',
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    fontSize: 14,
  }
});

export default EventDetailScreen;
