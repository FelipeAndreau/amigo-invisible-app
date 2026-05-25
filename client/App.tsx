import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

import { useEvent } from './src/features/event/hooks/useEvent';
import { Theme } from './src/shared/theme';

// Componentes shared
import { Button } from './src/shared/components/Button';
import { Input } from './src/shared/components/Input';

// Componentes de dominio
import { EventHeader } from './src/features/event/components/EventHeader';
import { ParticipantInput } from './src/features/event/components/ParticipantInput';
import { ParticipantList } from './src/features/event/components/ParticipantList';
import { RevealCard } from './src/features/event/components/RevealCard';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Fredoka-Bold': Fredoka_700Bold,
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
  });

  const { 
    name, 
    participants, 
    isSorted, 
    assignments, 
    loading, 
    createEvent, 
    addParticipant, 
    startShuffle, 
    resetEvent 
  } = useEvent();

  const [revealIndex, setRevealIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [eventNameInput, setEventNameInput] = useState('');

  // Reset local state when event ends or resets
  useEffect(() => {
    if (!name) {
      setRevealIndex(0);
      setIsRevealing(false);
      setEventNameInput('');
    }
  }, [name]);

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  // Vista 1: Setup del Evento
  if (!name) {
    return (
      <View style={styles.container}>
        <View style={styles.hero}>
          <EventHeader 
            title="🎉 Amigo Invisible" 
            subtitle="Organiza tu sorteo de forma fácil, segura y secreta." 
          />
        </View>
        
        <Input 
          label="Nombre del evento"
          placeholder="Ej: Navidad en Familia 🎄"
          value={eventNameInput}
          onChangeText={setEventNameInput}
        />

        <Button 
          title="Comenzar"
          onPress={() => {
            if (!eventNameInput.trim()) return Alert.alert('Error', 'Ingresa un nombre para el evento');
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            createEvent(eventNameInput);
          }}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Vista 3: Modo Revelación (Sorteo realizado)
  if (isSorted) {
    const currentGiver = participants[revealIndex];
    const currentReceiver = participants.find(p => p.id === assignments[currentGiver.id]);

    return (
      <View style={styles.container}>
        <EventHeader title={name} />
        <RevealCard 
          giverName={currentGiver.name}
          receiverName={currentReceiver?.name || '???'}
          isRevealing={isRevealing}
          onRevealIn={() => setIsRevealing(true)}
          onRevealOut={() => setIsRevealing(false)}
          onNext={() => setRevealIndex(revealIndex + 1)}
          onReset={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            resetEvent();
          }}
          isLast={revealIndex === participants.length - 1}
        />
      </View>
    );
  }

  // Vista 2: Gestión de Participantes
  return (
    <View style={styles.container}>
      <EventHeader title={name} isCentered={false} />
      
      <ParticipantInput onAdd={(name) => {
        try {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          addParticipant(name);
        } catch (e: any) {
          Alert.alert('¡Ups!', e.message);
        }
      }} />

      <ParticipantList participants={participants} />

      {/* Botón de Sorteo footer */}
      <View style={styles.absoluteFooter}>
        <Button 
          title="REALIZAR SORTEO"
          type="primary"
          disabled={participants.length < 3}
          onPress={() => {
            try {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              startShuffle();
            } catch (e: any) {
              Alert.alert('Error', e.message);
            }
          }}
          style={styles.shuffleButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingTop: 60,
    paddingHorizontal: Theme.spacing.lg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    marginTop: 60,
    marginBottom: 40,
  },
  absoluteFooter: {
    paddingVertical: 24,
    backgroundColor: Theme.colors.background,
  },
  shuffleButton: {
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  }
});