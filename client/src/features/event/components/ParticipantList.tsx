import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Participant } from '../logic/shuffle';
import { Theme } from '../../../shared/theme';

interface Props {
participants: Participant[];
}

export const ParticipantList = ({ participants }: Props) => {

return (
    <FlatList
    data={participants}
    keyExtractor={(item) => item.id}
    contentContainerStyle={participants.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
    ListEmptyComponent={renderEmpty}
    renderItem={({ item }) => (
        <View style={styles.item}>
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
itemText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Theme.colors.text,
},
});