import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { Theme } from '../../shared/theme';
import { Button } from '../../shared/components/Button';
import { apiClient } from '../../shared/utils/api';
import { ChevronLeft, Camera, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const GalleryScreen = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPhotos = useCallback(async () => {
    try {
      const data = await apiClient.get(`/events/${eventId}/gallery`);
      setPhotos(data);
    } catch (e: any) {
      console.error('Error fetching photos:', e);
      if (e.message && !e.message.includes('Gallery is only available')) {
        Alert.alert('Error', e.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para subir fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      try {
        await apiClient.post(`/events/${eventId}/gallery`, {
          photo_data: `data:image/jpeg;base64,${result.assets[0].base64}`,
          caption: ''
        });
        fetchPhotos();
        Alert.alert('¡Éxito!', 'Foto subida correctamente');
      } catch (e: any) {
        Alert.alert('Error', e.message || 'No se pudo subir la foto');
      }
    }
  };

  const renderPhoto = ({ item }: any) => (
    <View style={styles.photoContainer}>
      <Image 
        source={{ uri: item.photo_data }} 
        style={styles.photo}
        resizeMode="cover"
      />
      {item.caption ? (
        <Text style={styles.caption}>{item.caption}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Galería</Text>
      </View>

      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchPhotos} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Camera size={48} color={Theme.colors.gray} />
            <Text style={styles.emptyText}>Aún no hay fotos</Text>
            <Text style={styles.emptySubtext}>¡Sé el primero en subir una foto!</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleUpload}>
        <Upload size={24} color={Theme.colors.white} />
      </TouchableOpacity>
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
  grid: {
    padding: Theme.spacing.lg,
  },
  photoContainer: {
    flex: 1,
    margin: 4,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.md,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 150,
  },
  caption: {
    fontFamily: Theme.fonts.body,
    fontSize: 12,
    color: Theme.colors.gray,
    padding: Theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: Theme.fonts.body,
    fontSize: 16,
    color: Theme.colors.gray,
    marginTop: Theme.spacing.md,
  },
  emptySubtext: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.gray,
    marginTop: Theme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: Theme.colors.cta,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default GalleryScreen;
