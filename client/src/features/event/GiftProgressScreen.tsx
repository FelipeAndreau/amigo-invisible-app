import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Theme } from '../../shared/theme';
import { Button } from '../../shared/components/Button';
import { apiClient } from '../../shared/utils/api';
import { ChevronLeft, ShoppingBag, Gift, Truck, CheckCircle } from 'lucide-react-native';

const GiftProgressScreen = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [wrapped, setWrapped] = useState(false);
  const [delivered, setDelivered] = useState(false);

  const fetchProgress = async () => {
    try {
      const data = await apiClient.get(`/events/${eventId}/gift-progress`);
      setPurchased(data.purchased);
      setWrapped(data.wrapped);
      setDelivered(data.delivered);
    } catch (e) {
      console.error('Error fetching progress:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [eventId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.post(`/events/${eventId}/gift-progress`, {
        purchased,
        wrapped,
        delivered
      });
      Alert.alert('¡Guardado!', 'Progreso actualizado');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProgress();
    });
    return unsubscribe;
  }, [navigation, eventId]);

  const ProgressItem = ({ 
    title, 
    description, 
    icon: Icon, 
    checked, 
    onToggle 
  }: any) => (
    <TouchableOpacity 
      style={[styles.item, checked && styles.itemChecked]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, checked && styles.iconChecked]}>
        <Icon size={28} color={checked ? Theme.colors.white : Theme.colors.primary} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, checked && styles.itemTitleChecked]}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      {checked && (
        <CheckCircle size={24} color={Theme.colors.cta} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Regalo</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Marcá el progreso de tu regalo</Text>

        <ProgressItem
          title="Ya lo compré"
          description="Marcá cuando hayas comprado el regalo"
          icon={ShoppingBag}
          checked={purchased}
          onToggle={() => setPurchased(!purchased)}
        />

        <ProgressItem
          title="Ya lo envolví"
          description="Marcá cuando lo hayas envuelto"
          icon={Gift}
          checked={wrapped}
          onToggle={() => setWrapped(!wrapped)}
        />

        <ProgressItem
          title="Ya lo entregué"
          description="Marcá cuando lo hayas entregado"
          icon={Truck}
          checked={delivered}
          onToggle={() => setDelivered(!delivered)}
        />

        <View style={{ height: 30 }} />
        
        <Button
          title="Guardar Progreso"
          onPress={handleSave}
          loading={saving}
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
    fontSize: 24,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  content: {
    paddingHorizontal: Theme.spacing.lg,
  },
  subtitle: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.gray,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  itemChecked: {
    borderColor: Theme.colors.cta,
    backgroundColor: '#F0FDF4',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  iconChecked: {
    backgroundColor: Theme.colors.cta,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: Theme.fonts.heading,
    fontSize: 16,
    color: Theme.colors.text,
  },
  itemTitleChecked: {
    color: Theme.colors.cta,
  },
  itemDescription: {
    fontFamily: Theme.fonts.body,
    fontSize: 12,
    color: Theme.colors.gray,
    marginTop: 2,
  },
});

export default GiftProgressScreen;
