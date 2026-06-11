import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { Button } from '../../shared/components/Button';
import { ChevronLeft, Users, Plus, Trash2, UserPlus } from 'lucide-react-native';

const FriendsScreen = ({ navigation }: any) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchFriends = async () => {
    try {
      const data = await apiClient.get('/friends');
      setFriends(data);
    } catch (e) {
      console.error('Fetch friends error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFriends();
    });
    return unsubscribe;
  }, [navigation]);

  const handleAddFriend = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Ingresa un nombre');
      return;
    }
    setAdding(true);
    try {
      await apiClient.post('/friends', { name: newName.trim(), email: newEmail.trim() || undefined });
      setNewName('');
      setNewEmail('');
      setShowAdd(false);
      fetchFriends();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo agregar el contacto');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteFriend = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Contacto',
      `¿Eliminar a ${name} de tus contactos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/friends/${id}`);
              fetchFriends();
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.friendName}>{item.name}</Text>
          {item.email && <Text style={styles.friendEmail}>{item.email}</Text>}
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDeleteFriend(item.id, item.name)} style={styles.deleteBtn}>
        <Trash2 size={18} color={Theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Contactos</Text>
        <TouchableOpacity onPress={() => setShowAdd(!showAdd)} style={styles.addBtn}>
          {showAdd ? <ChevronLeft size={24} color={Theme.colors.primary} /> : <Plus size={24} color={Theme.colors.primary} />}
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email (opcional)"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            title="Agregar Contacto"
            onPress={handleAddFriend}
            loading={adding}
            icon={<UserPlus size={18} color="white" />}
          />
        </View>
      )}

      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={friends}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={48} color={Theme.colors.gray} />
              <Text style={styles.emptyText}>No tienes contactos guardados.</Text>
              <Text style={styles.emptySubtext}>Agrega contactos para invitarlos más fácilmente.</Text>
            </View>
          }
        />
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
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  backBtn: {
    padding: Theme.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  addBtn: {
    padding: Theme.spacing.sm,
  },
  addForm: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  input: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.text,
  },
  list: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 100,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.heading,
    fontSize: 16,
  },
  friendName: {
    fontFamily: Theme.fonts.heading,
    fontSize: 16,
    color: Theme.colors.text,
  },
  friendEmail: {
    fontFamily: Theme.fonts.body,
    fontSize: 12,
    color: Theme.colors.gray,
  },
  deleteBtn: {
    padding: 4,
  },
  loadingText: {
    textAlign: 'center',
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
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

export default FriendsScreen;