import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Theme } from '../../shared/theme';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { apiClient } from '../../shared/utils/api';
import { useToast } from '../../shared/context/ToastContext';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

const CreateGroupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const { showError, showSuccess } = useToast();

  const validate = () => {
    setNameError('');
    if (!name.trim()) {
      setNameError('El nombre del grupo es obligatorio');
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await apiClient.post('/groups', { name: name.trim() });
      showSuccess(`Grupo creado. Código: ${data.invite_code}`);
      navigation.goBack();
    } catch (e: any) {
      showError(e.message || 'Error al crear grupo');
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
        <Text style={styles.title}>Nuevo Grupo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre del grupo</Text>
        <Input
          placeholder="Ej: Familia, Trabajo, Amigos"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError('');
          }}
          error={nameError}
        />

        <View style={{ height: Theme.spacing.lg }} />

        <Button
          title="Crear Grupo"
          onPress={handleCreate}
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

export default CreateGroupScreen;