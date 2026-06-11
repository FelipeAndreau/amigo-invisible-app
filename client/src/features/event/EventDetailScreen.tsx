import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Share } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { Button } from '../../shared/components/Button';
import { ParticipantList } from './components/ParticipantList';
import { ParticipantInput } from './components/ParticipantInput';
import { ChevronLeft, Play, MessageCircle } from 'lucide-react-native';

const EventDetailScreen = ({ route, navigation }: any) => {
  const { eventId, eventName, status: initialStatus, role = 'organizer' } = route.params;
  const [participants, setParticipants] = useState<any[]>([]);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);
  const [myAssignment, setMyAssignment] = useState<any>(null);
  const isOrganizer = role === 'organizer';

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

  const fetchMyAssignment = async () => {
    if (!isOrganizer && status === 'shuffled') {
      try {
        const data = await apiClient.get(`/events/${eventId}/my-assignment`);
        setMyAssignment(data);
      } catch (e) {
        console.error('Assignment error:', e);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchMyAssignment();
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
    let inviteCode = '';
    try {
      const inviteData = await apiClient.post(`/events/${eventId}/invite`, {});
      inviteCode = inviteData.invite_code || '';
    } catch (e) {
      console.error('Failed to get invite code:', e);
    }
    const url = `http://192.168.100.94:8080/r/${p.access_token}`;
    const inviteText = inviteCode ? `📱 Si tenés la app, unite con este código: *${inviteCode}*\n` : '';
    try {
      await Share.share({
        message: `🎁 *¡Llegó el Amigo Invisible!* 🎁\n\nHola *${p.name}*, te invitaron al sorteo "*${eventName}*".\n\n${inviteText}🌐 O abrí este link para ver tu resultado:\n${url}\n\n¡No se lo digas a nadie! 🤫`,
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
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { eventId, eventName })} style={styles.chatBtn}>
          <MessageCircle size={24} color={Theme.colors.cta} />
        </TouchableOpacity>
      </View>

      {!isOrganizer && status === 'shuffled' && myAssignment && (
        <View style={styles.assignmentCard}>
          <Text style={styles.assignmentLabel}>¡Tu amigo invisible es:</Text>
          <Text style={styles.assignmentName}>{myAssignment.assigned_name || '...'}</Text>
        </View>
      )}

      {!isOrganizer && status === 'draft' && (
        <View style={styles.waitingCard}>
          <Text style={styles.waitingText}>Esperando a que el organizador realice el sorteo...</Text>
        </View>
      )}

      <ParticipantList
        participants={participants}
        onPress={(p) => isOrganizer && status === 'shuffled' && handleShare(p)}
        onDelete={isOrganizer ? handleDeleteParticipant : undefined}
        showShareIcon={isOrganizer && status === 'shuffled'}
        showDeleteIcon={isOrganizer && status === 'draft'}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.label}>Participantes ({participants.length})</Text>
            {isOrganizer && status === 'draft' && (
              <View style={styles.inputWrapper}>
                <ParticipantInput onAdd={handleAddParticipant} />
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {isOrganizer && (
              status === 'shuffled' ? (
                <Text style={styles.infoText}>Pulsa en cada participante para compartir su link de revelación.</Text>
              ) : (
                <Button
                  title="Realizar Sorteo"
                  onPress={handleShuffle}
                  loading={shuffling}
                  icon={<Play size={20} color="white" />}
                />
              )
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
  },
  chatBtn: {
    padding: Theme.spacing.sm,
    marginLeft: Theme.spacing.sm,
  },
  assignmentCard: {
    backgroundColor: '#DEF7EC',
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
  },
  assignmentLabel: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: '#03543F',
    marginBottom: Theme.spacing.sm,
  },
  assignmentName: {
    fontFamily: Theme.fonts.heading,
    fontSize: 24,
    color: '#03543F',
  },
  waitingCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
  },
  waitingText: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: '#92400E',
  },
});

export default EventDetailScreen;
