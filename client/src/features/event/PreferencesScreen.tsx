import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Theme } from '../../shared/theme';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { apiClient } from '../../shared/utils/api';
import { ChevronLeft, Heart } from 'lucide-react-native';

const PreferencesScreen = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [favoriteColor, setFavoriteColor] = useState('');
  const [clothingSize, setClothingSize] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [allergies, setAllergies] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  const handleSave = async () => {
    if (!favoriteColor.trim()) {
      Alert.alert('Error', 'Ingresa tu color favorito');
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
      Alert.alert('¡Guardado!', 'Tus preferencias fueron guardadas correctamente');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudieron guardar las preferencias');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Preferencias</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.form}>
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
});

export default PreferencesScreen;
