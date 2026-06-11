import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Modal, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Theme } from '../../shared/theme';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { ParticipantInput } from './components/ParticipantInput';
import { ParticipantList } from './components/ParticipantList';
import { apiClient } from '../../shared/utils/api';
import { ChevronLeft, Plus, Users, X } from 'lucide-react-native';

const CreateEventScreen = ({ navigation }: any) => {
  const [eventName, setEventName] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [showContactsModal, setShowContactsModal] = useState(false);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await apiClient.get('/friends');
        setFriends(data);
      } catch (e) {
        console.error('Load friends error:', e);
      }
    };
    loadFriends();
  }, []);

  const addParticipant = (name: string) => {
    if (participants.includes(name)) {
      Alert.alert('Error', 'Este participante ya está en la lista');
      return;
    }
    setParticipants([...participants, name]);
  };

  const addFromContact = (friend: any) => {
    const name = friend.name;
    if (participants.includes(name)) {
      Alert.alert('Error', `${name} ya está en la lista`);
      return;
    }
    setParticipants(prev => [...prev, name]);
    setShowContactsModal(false);
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

  const renderContactItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => addFromContact(item)} style={styles.contactItem}>
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
      </View>
      <Plus size={20} color={Theme.colors.cta} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo Sorteo</Text>
      </View>

      <Modal
        visible={showContactsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar desde Contactos</Text>
              <TouchableOpacity onPress={() => setShowContactsModal(false)}>
                <X size={24} color={Theme.colors.text} />
              </TouchableOpacity>
            </View>
            {friends.length === 0 ? (
              <View style={styles.emptyContacts}>
                <Users size={48} color={Theme.colors.gray} />
                <Text style={styles.emptyText}>No tienes contactos guardados.</Text>
                <Text style={styles.emptySubtext}>Agrega contactos primero desde la pantalla de Amigos.</Text>
              </View>
            ) : (
              <FlatList
                data={friends}
                renderItem={renderContactItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.contactsList}
              />
            )}
          </View>
        </View>
      </Modal>

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
            
            <TouchableOpacity 
              style={styles.contactsButton} 
              onPress={() => setShowContactsModal(true)}
            >
              <Users size={18} color={Theme.colors.cta} />
              <Text style={styles.contactsButtonText}>Agregar desde contactos</Text>
            </TouchableOpacity>

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
  },
  contactsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.cta,
    borderStyle: 'dashed',
  },
  contactsButtonText: {
    fontFamily: Theme.fonts.heading,
    fontSize: 14,
    color: Theme.colors.cta,
    marginLeft: Theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.lg,
    maxHeight: '70%',
    paddingBottom: Theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  contactsList: {
    padding: Theme.spacing.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAvatarText: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.heading,
    fontSize: 16,
  },
  contactInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  contactName: {
    fontFamily: Theme.fonts.heading,
    fontSize: 16,
    color: Theme.colors.text,
  },
  contactEmail: {
    fontFamily: Theme.fonts.body,
    fontSize: 12,
    color: Theme.colors.gray,
  },
  emptyContacts: {
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  emptyText: {
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    fontSize: 16,
    marginTop: Theme.spacing.md,
  },
  emptySubtext: {
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    fontSize: 14,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
});

export default CreateEventScreen;
