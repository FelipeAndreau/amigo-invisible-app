import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Theme } from '../../shared/theme';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

const MOCK_MESSAGES = [
  { id: '1', sender: 'María', text: '¿Ya saben qué regalar?', time: '10:30', isMe: false },
  { id: '2', sender: 'Carlos', text: 'Yo ya tengo una idea 🎁', time: '10:32', isMe: false },
  { id: '3', sender: 'Tú', text: '¡No hagan trampa!', time: '10:35', isMe: true },
  { id: '4', sender: 'Pilar', text: 'Alguien quiere intercambiar?', time: '10:40', isMe: false },
];

const ChatScreen = ({ route, navigation }: any) => {
  const { eventName } = route.params;

  const renderMessage = ({ item }: any) => (
    <View style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
      {!item.isMe && <Text style={styles.senderName}>{item.sender}</Text>}
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{eventName}</Text>
      </View>

      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Chat disponible próximamente..."
          placeholderTextColor={Theme.colors.gray}
          editable={false}
        />
      </View>
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
    fontSize: 20,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  messagesList: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    marginBottom: Theme.spacing.sm,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Theme.colors.cta,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.white,
  },
  senderName: {
    fontFamily: Theme.fonts.body,
    fontSize: 12,
    color: Theme.colors.gray,
    marginBottom: 4,
  },
  messageText: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.text,
  },
  timeText: {
    fontFamily: Theme.fonts.body,
    fontSize: 10,
    color: Theme.colors.gray,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.gray,
  },
});

export default ChatScreen;