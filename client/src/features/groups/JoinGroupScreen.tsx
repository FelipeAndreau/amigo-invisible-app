import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Theme } from '../../shared/theme';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { apiClient } from '../../shared/utils/api';
import { useToast } from '../../shared/context/ToastContext';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

const JoinGroupScreen = ({ navigation }: any) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const { showError, showSuccess } = useToast();

  const validate = () => {
    setCodeError('');
    if (!inviteCode.trim()) {
      setCodeError('El código es obligatorio');
      return false;
    }
    return true;
  };

  const handleJoin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await apiClient.post('/groups/join', { invite_code: inviteCode.trim() });
      showSuccess('Te uniste al grupo');
      navigation.goBack();
    } catch (e: any) {
      showError(e.message || 'Error al unirse al grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Unirse a Grupo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Código de invitación</Text>
        <Input
          placeholder="Ej: a1b2c3d4"
          value={inviteCode}
          onChangeText={(text) => {
            setInviteCode(text);
            setCodeError('');
          }}
          autoCapitalize="none"
          error={codeError}
        />

        <View style={{ height: Theme.spacing.lg }} />

        <Button
          title="Unirse"
          onPress={handleJoin}
          loading={loading}
          type="primary"
        />
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
    fontSize: 24,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
});

export default JoinGroupScreen;