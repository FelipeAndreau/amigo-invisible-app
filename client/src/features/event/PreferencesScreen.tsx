import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Theme } from '../../shared/theme';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { apiClient } from '../../shared/utils/api';
import { useToast } from '../../shared/context/ToastContext';
import { ChevronLeft, Heart, Eye } from 'lucide-react-native';

const PreferencesScreen = ({ route, navigation }: any) => {
  const { eventId, mode = 'edit' } = route.params;
  const isViewMode = mode === 'view';
  const [loading, setLoading] = useState(isViewMode);
  const [saving, setSaving] = useState(false);
  const [assignedName, setAssignedName] = useState('');
  const { showError, showSuccess } = useToast();
  
  const [favoriteColor, setFavoriteColor] = useState('');
  const [clothingSize, setClothingSize] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [allergies, setAllergies] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  const fetchAssignmentPreferences = async () => {
    try {
      const data = await apiClient.get(`/events/${eventId}/my-assignment/preferences`);
      setAssignedName(data.name || 'Tu amigo invisible');
      setFavoriteColor(data.favorite_color || '');
      setClothingSize(data.clothing_size || '');
      setFavoriteFood(data.favorite_food || '');
      setHobbies(data.hobbies || '');
      setAllergies(data.allergies || '');
      setPriceRange(data.price_range || '');
      setAboutMe(data.about_me || '');
    } catch (e: any) {
      console.error('Error fetching assignment preferences:', e);
      showError(e.message || 'No se pudieron cargar las preferencias de tu asignado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isViewMode) {
      fetchAssignmentPreferences();
    }
  }, [eventId, isViewMode]);

  const handleSave = async () => {
    if (!favoriteColor.trim()) {
      showError('Ingresa tu color favorito');
      return;
    }

    setSaving(true);
    try {
      await apiClient.post(`/events/${eventId}/preferences`, {
        favorite_color: favoriteColor.trim(),
        clothing_size: clothingSize.trim(),
        favorite_food: favoriteFood.trim(),
        hobbies: hobbies.trim(),
        allergies: allergies.trim(),
        price_range: priceRange.trim(),
        about_me: aboutMe.trim()
      });
      showSuccess('Tus preferencias fueron guardadas correctamente');
    } catch (e: any) {
      showError(e.message || 'No se pudieron guardar las preferencias');
    } finally {
      setSaving(false);
    }
  };

  const renderViewItem = (label: string, value: string) => (
    <View style={styles.viewItem}>
      <Text style={styles.viewLabel}>{label}</Text>
      <Text style={styles.viewValue}>{value || 'No especificado'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isViewMode ? `Preferencias de ${assignedName}` : 'Mis Preferencias'}
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.form}>
        {isViewMode ? (
          <>
            <Text style={styles.subtitle}>¡Estas son las preferencias de tu amigo invisible!</Text>
            {renderViewItem('Color favorito', favoriteColor)}
            {renderViewItem('Talle de ropa', clothingSize)}
            {renderViewItem('Comida/dulce favorito', favoriteFood)}
            {renderViewItem('Hobbies/Intereses', hobbies)}
            {renderViewItem('Alergias o restricciones', allergies)}
            {renderViewItem('Rango de precio sugerido', priceRange)}
            {renderViewItem('Contame más sobre vos', aboutMe)}
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>¡Ayuda a tu amigo invisible a elegir el regalo perfecto!</Text>
            
            <Input
              label="Color favorito *"
              placeholder="Ej: Rojo, Azul, Verde"
              value={favoriteColor}
              onChangeText={setFavoriteColor}
            />
            
            <Input
              label="Talle de ropa"
              placeholder="Ej: S, M, L, XL"
              value={clothingSize}
              onChangeText={setClothingSize}
            />
            
            <Input
              label="Comida/dulce favorito"
              placeholder="Ej: Chocolate, Helado, Pizza"
              value={favoriteFood}
              onChangeText={setFavoriteFood}
            />
            
            <Input
              label="Hobbies/Intereses"
              placeholder="Ej: Leer, deportes, música, cocinar"
              value={hobbies}
              onChangeText={setHobbies}
            />
            
            <Input
              label="Alergias o restricciones"
              placeholder="Ej: Ninguna, celiaquía, alergia a frutos secos"
              value={allergies}
              onChangeText={setAllergies}
            />
            
            <Input
              label="Rango de precio sugerido"
              placeholder="Ej: $500-1000, $1000-2000, $2000+"
              value={priceRange}
              onChangeText={setPriceRange}
            />
            
            <Input
              label="Contame más sobre vos"
              placeholder="¿Qué te gustaría recibir? ¿Algo que no te gustaría?"
              value={aboutMe}
              onChangeText={setAboutMe}
              multiline
            />

            <View style={{ height: 20 }} />
            
            <Button
              title="Guardar Preferencias"
              onPress={handleSave}
              loading={saving}
              icon={<Heart size={20} color="white" />}
            />
          </>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  form: {
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  subtitle: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.gray,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  viewItem: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  viewLabel: {
    fontFamily: Theme.fonts.heading,
    fontSize: 14,
    color: Theme.colors.gray,
    marginBottom: 4,
  },
  viewValue: {
    fontFamily: Theme.fonts.body,
    fontSize: 16,
    color: Theme.colors.text,
  },
});

export default PreferencesScreen;
