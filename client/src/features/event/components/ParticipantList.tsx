import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { UserPlus, Share2, Trash2 } from 'lucide-react-native';
import { Theme } from '../../../shared/theme';

interface Participant {
  id: string;
  name: string;
  access_token?: string;
}

interface Props {
  participants: Participant[];
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  onPress?: (p: Participant) => void;
  onDelete?: (p: Participant) => void;
  showShareIcon?: boolean;
  showDeleteIcon?: boolean;
}

export const ParticipantList = ({ 
  participants, 
  ListHeaderComponent, 
  ListFooterComponent, 
  onPress,
  onDelete,
  showShareIcon,
  showDeleteIcon 
}: Props) => {
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
      contentContainerStyle={[
        styles.listContent,
        participants.length === 0 && { flexGrow: 1 }
      ]}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => onPress && onPress(item)}
            disabled={!onPress}
            activeOpacity={0.7}
          >
            <View style={styles.dot} />
            <Text style={styles.itemText}>{item.name}</Text>
            
            {showShareIcon && item.access_token && (
              <Share2 size={18} color={Theme.colors.cta} />
            )}

            {showDeleteIcon && (
              <TouchableOpacity 
                onPress={() => onDelete && onDelete(item)}
                style={styles.deleteAction}
              >
                <Trash2 size={18} color={Theme.colors.error} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 40,
  },
  itemContainer: {
    paddingHorizontal: Theme.spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
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
    flex: 1,
  },
  deleteAction: {
    padding: 4,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
    paddingVertical: 40,
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
