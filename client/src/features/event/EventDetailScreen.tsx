import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Share } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { Button } from '../../shared/components/Button';
import { ParticipantList } from './components/ParticipantList';
import { ChevronLeft, Play, MessageCircle, Copy, Share2 } from 'lucide-react-native';

const EventDetailScreen = ({ route, navigation }: any) => {
  const { eventId, eventName, status: initialStatus, role = 'organizer', inviteCode: initialCode } = route.params;
  const [participants, setParticipants] = useState<any[]>([]);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);
  const [myAssignment, setMyAssignment] = useState<any>(null);
  const [inviteCode, setInviteCode] = useState(initialCode || '');
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
    if (status === 'shuffled') {
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
              await fetchMyAssignment();
              Alert.alert('¡Éxito!', 'Sorteo realizado. Cada participante puede ver su asignación en la app.');
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

  const handleShareCode = async () => {
    if (!inviteCode) return;
    try {
      await Share.share({
        message: `🎁 *¡Te invito a un Amigo Invisible!* 🎁\n\nSorteo: *${eventName}*\n\n📱 Código de invitación: *${inviteCode}*\n\nUnite descargando la app Amigo Invisible e ingresando este código.`,
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
            {status === 'shuffled' ? 'Sorteo Finalizado' : 'Abierto - Recibiendo participantes'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { eventId, eventName })} style={styles.chatBtn}>
          <MessageCircle size={24} color={Theme.colors.cta} />
        </TouchableOpacity>
      </View>

      {/* Asignación para participantes */}
      {status === 'shuffled' && myAssignment && (
        <View style={styles.assignmentCard}>
          <Text style={styles.assignmentLabel}>¡Tu amigo invisible es:</Text>
          <Text style={styles.assignmentName}>{myAssignment.assigned_name || '...'}</Text>
        </View>
      )}

      {status === 'shuffled' && !myAssignment && !isOrganizer && (
        <View style={styles.waitingCard}>
          <Text style={styles.waitingText}>No se encontró tu asignación. ¿Ya te uniste a este sorteo?</Text>
        </View>
      )}

      {/* Código de invitación para organizador */}
      {isOrganizer && status !== 'shuffled' && inviteCode && (
        <View style={styles.inviteCard}>
          <Text style={styles.inviteLabel}>Código de invitación</Text>
          <Text style={styles.inviteCode}>{inviteCode}</Text>
          <TouchableOpacity onPress={handleShareCode} style={styles.shareBtn}>
            <Share2 size={18} color={Theme.colors.white} />
            <Text style={styles.shareBtnText}>Compartir código</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Esperando para participantes */}
      {!isOrganizer && status !== 'shuffled' && (
        <View style={styles.waitingCard}>
          <Text style={styles.waitingText}>Esperando a que el organizador realice el sorteo...</Text>
        </View>
      )}

      <ParticipantList
        participants={participants}
        onDelete={isOrganizer && status !== 'shuffled' ? handleDeleteParticipant : undefined}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.label}>Participantes ({participants.length})</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {isOrganizer && (
              status === 'shuffled' ? (
                <Text style={styles.infoText}>Sorteo finalizado. Cada participante ve su asignación en la app.</Text>
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
  inviteCard: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    alignItems: 'center',
  },
  inviteLabel: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.sm,
    opacity: 0.9,
  },
  inviteCode: {
    fontFamily: Theme.fonts.heading,
    fontSize: 32,
    color: Theme.colors.white,
    letterSpacing: 4,
    marginBottom: Theme.spacing.md,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  shareBtnText: {
    fontFamily: Theme.fonts.heading,
    fontSize: 14,
    color: Theme.colors.white,
    marginLeft: Theme.spacing.sm,
  },
});

export default EventDetailScreen;
