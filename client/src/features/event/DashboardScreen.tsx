import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { useAuth } from '../../shared/hooks/useAuth';
import { LogOut, Plus, Users, Calendar, Trash2, Link2, History } from 'lucide-react-native';

const DashboardScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const fetchEvents = async () => {
    try {
      const [organized, participating] = await Promise.all([
        apiClient.get('/events'),
        apiClient.get('/events/participating').catch(() => []),
      ]);
      setEvents(organized || []);
      setParticipatingEvents(participating || []);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDeleteEvent = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Sorteo',
      `¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/events/${id}`);
              fetchEvents();
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          }
        }
      ]
    );
  };

  const renderEventCard = ({ item, isOrganizer }: { item: any; isOrganizer: boolean }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetail', {
        eventId: item.id,
        eventName: item.name,
        status: item.status,
        role: isOrganizer ? 'organizer' : 'participant'
      })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.eventName}>{item.name}</Text>
        {isOrganizer && (
          <TouchableOpacity
            onPress={() => handleDeleteEvent(item.id, item.name)}
            style={styles.deleteBtn}
          >
            <Trash2 size={18} color={Theme.colors.error} />
          </TouchableOpacity>
        )}
        {!isOrganizer && (
          <View style={[styles.roleBadge, { backgroundColor: '#DBEAFE' }]}>
            <Text style={[styles.roleBadgeText, { color: '#1E40AF' }]}>Participante</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={[styles.badge, { backgroundColor: item.status === 'shuffled' ? '#DEF7EC' : '#DBEAFE' }]}>
          <Text style={[styles.badgeText, { color: item.status === 'shuffled' ? '#03543F' : '#1E40AF' }]}>
            {item.status === 'shuffled' ? 'Sorteado' : item.status === 'open' ? 'Abierto' : 'Borrador'}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Calendar size={14} color={Theme.colors.gray} />
          <Text style={styles.footerText}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Sorteos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.headerBtn}>
            <History size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('JoinEvent')} style={styles.headerBtn}>
            <Link2 size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')} style={styles.headerBtn}>
            <Users size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.headerBtn}>
            <LogOut size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={[]}
          renderItem={() => null}
          keyExtractor={() => 'root'}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View>
              {events.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Organizador</Text>
                  {events.map((item) => (
                    <View key={item.id} style={styles.cardWrapper}>
                      {renderEventCard({ item, isOrganizer: true })}
                    </View>
                  ))}
                </View>
              )}

              {participatingEvents.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Participando</Text>
                  {participatingEvents.map((item) => (
                    <View key={item.id} style={styles.cardWrapper}>
                      {renderEventCard({ item, isOrganizer: false })}
                    </View>
                  ))}
                </View>
              )}

              {events.length === 0 && participatingEvents.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Aún no tienes sorteos activos.</Text>
                  <Text style={styles.emptySubtext}>Crea uno nuevo o únete con un código de invitación.</Text>
                </View>
              )}
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Plus size={32} color={Theme.colors.white} />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  headerBtn: {
    padding: Theme.spacing.sm,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  cardWrapper: {
    marginBottom: Theme.spacing.md,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  roleBadgeText: {
    fontSize: 10,
    fontFamily: Theme.fonts.body,
    fontWeight: '700',
  },
  emptySubtext: {
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    fontSize: 14,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 100,
  },
  eventCard: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  eventName: {
    fontSize: 18,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: Theme.fonts.body,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: Theme.colors.cta,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    fontSize: 16,
  }
});

export default DashboardScreen;
