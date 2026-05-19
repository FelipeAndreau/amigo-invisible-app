import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { Participant } from '../logic/shuffle';
import { Theme } from '../../../shared/theme';

interface Props {
  participants: Participant[];
}

export const ParticipantList = ({ participants }: Props) => {
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <UserPlus color={Theme.colors.secondary} size={48} strokeWidth={1.5} />
      <Text style={styles.emptyText}>Aún no hay amigos en la lista</Text>
      <Text style={styles.emptySubtext}>¡Empieza agregando algunos!</Text>
    </View>
  );

  return (
    <FlatList
      data={participants}
      keyExtractor={(item) => item.id}
      contentContainerStyle={participants.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
      ListEmptyComponent={renderEmpty}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={styles.dot} />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.secondary,
    marginRight: 12,
  },
  itemText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Theme.colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  emptyText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    color: Theme.colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Theme.colors.gray,
    marginTop: 4,
  },
});
