import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { useAuth } from '../../shared/hooks/useAuth';
import { useToast } from '../../shared/context/ToastContext';
import { ChevronLeft, Plus, Calendar, Trash2, User } from 'lucide-react-native';

const GroupDetailScreen = ({ route, navigation }: any) => {
  const { groupId, groupName } = route.params;
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const { showError, showSuccess } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupData, membersData, eventsData] = await Promise.all([
        apiClient.get(`/groups/${groupId}`),
        apiClient.get(`/groups/${groupId}/members`),
        apiClient.get(`/groups/${groupId}/events`).catch(() => []),
      ]);
      setGroup(groupData);
      setMembers(membersData || []);
      setEvents(eventsData || []);
    } catch (e: any) {
      showError(e.message || 'Error al cargar grupo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const handleRemoveMember = (memberUserId: string, email: string) => {
    Alert.alert(
      'Eliminar miembro',
      `¿Querés eliminar a ${email} del grupo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/groups/${groupId}/members/${memberUserId}`);
              showSuccess('Miembro eliminado');
              fetchData();
            } catch (e: any) {
              showError(e.message || 'Error al eliminar miembro');
            }
          },
        },
      ]
    );
  };

  const renderMember = ({ item }: { item: any }) => (
    <View style={styles.memberRow}>
      <View style={styles.memberInfo}>
        <User size={18} color={Theme.colors.gray} />
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      {group?.created_by === userId && item.user_id !== userId && (
        <TouchableOpacity onPress={() => handleRemoveMember(item.user_id, item.email)}>
          <Trash2 size={18} color={Theme.colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEvent = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetail', {
        eventId: item.id,
        eventName: item.name,
        status: item.status,
        role: 'participant'
      })}
    >
      <Calendar size={18} color={Theme.colors.primary} />
      <Text style={styles.eventName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
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
        <Text style={styles.title}>{groupName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Código de invitación</Text>
        <Text style={styles.inviteCode}>{group?.invite_code}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Miembros</Text>
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sorteos del grupo</Text>
        {events.length === 0 ? (
          <Text style={styles.emptyText}>Aún no hay sorteos en este grupo.</Text>
        ) : (
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>

      {group?.created_by === userId && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateEvent', { groupId })}
        >
          <Plus size={28} color={Theme.colors.white} />
        </TouchableOpacity>
      )}
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
  section: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  inviteCode: {
    fontSize: 18,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.primary,
    letterSpacing: 1,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  memberEmail: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.text,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventName: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
  },
  fab: {
    position: 'absolute',
    right: Theme.spacing.lg,
    bottom: Theme.spacing.lg,
    backgroundColor: Theme.colors.cta,
    borderRadius: Theme.radius.full,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default GroupDetailScreen;