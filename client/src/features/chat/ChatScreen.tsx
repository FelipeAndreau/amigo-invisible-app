import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Theme } from '../../shared/theme';
import { apiClient } from '../../shared/utils/api';
import { useToast } from '../../shared/context/ToastContext';
import { ChevronLeft, Send } from 'lucide-react-native';

const ChatScreen = ({ route, navigation }: any) => {
  const { eventId, eventName } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      const data = await apiClient.get(`/events/${eventId}/messages`);
      // Reverse to show newest at bottom
      setMessages(data.reverse());
    } catch (e: any) {
      showError(e.message || 'Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchMessages();
    // Polling every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const text = newMessage.trim();
    setNewMessage('');
    try {
      await apiClient.post(`/events/${eventId}/messages`, { content: text });
      fetchMessages();
    } catch (e: any) {
      showError(e.message || 'Error al enviar mensaje');
    }
  };

  const renderMessage = ({ item }: any) => (
    <View style={[styles.messageBubble, item.is_mine ? styles.myBubble : styles.otherBubble]}>
      <Text style={[styles.senderLabel, item.is_mine ? styles.mySenderLabel : styles.otherSenderLabel]}>
        {item.is_mine ? 'Tú' : 'Anónimo'}
      </Text>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timeText}>
        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{eventName}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={Theme.colors.gray}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Send size={20} color={Theme.colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  senderLabel: {
    fontFamily: Theme.fonts.body,
    fontSize: 10,
    marginBottom: 4,
    opacity: 0.8,
  },
  mySenderLabel: {
    color: Theme.colors.white,
  },
  otherSenderLabel: {
    color: Theme.colors.gray,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Theme.colors.cta,
    borderRadius: Theme.radius.full,
    padding: Theme.spacing.sm,
    marginLeft: Theme.spacing.sm,
  },
});

export default ChatScreen;
