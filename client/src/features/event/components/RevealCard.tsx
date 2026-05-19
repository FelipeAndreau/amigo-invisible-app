import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Gift, Eye, RefreshCcw, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Theme } from '../../../shared/theme';

interface Props {
  giverName: string;
  receiverName: string;
  isRevealing: boolean;
  onRevealIn: () => void;
  onRevealOut: () => void;
  onNext: () => void;
  onReset: () => void;
  isLast: boolean;
}

export const RevealCard = ({ 
  giverName, 
  receiverName, 
  isRevealing, 
  onRevealIn, 
  onRevealOut, 
  onNext, 
  onReset,
  isLast 
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Gift color={Theme.colors.primary} size={32} />
        </View>
        <Text style={styles.label}>Turno de:</Text>
        <Text style={styles.name}>{giverName}</Text>
        
        <View style={[styles.box, isRevealing && styles.boxActive]}>
          {isRevealing ? (
            <View style={styles.centered}>
              <Text style={styles.labelSmall}>Tu amigo invisible es:</Text>
              <Text style={styles.receiver}>{receiverName}</Text>
            </View>
          ) : (
            <View style={styles.centered}>
              <Eye color={Theme.colors.gray} size={28} />
              <Text style={styles.placeholder}>Manten presionado para revelar</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.revealButton}
          onPressIn={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onRevealIn();
          }}
          onPressOut={onRevealOut}
          activeOpacity={0.95}
        >
          <Text style={styles.revealButtonText}>REVELAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        {!isLast ? (
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              onNext();
            }}
          >
            <Text style={styles.nextButtonText}>Siguiente participante</Text>
            <ChevronRight color={Theme.colors.text} size={20} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onReset();
            }}
          >
            <RefreshCcw color={Theme.white} size={20} style={{ marginRight: 8 }} />
            <Text style={styles.resetButtonText}>Finalizar Sorteo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  card: {
    backgroundColor: Theme.white,
    padding: 32,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Theme.colors.gray,
    marginBottom: 4,
  },
  labelSmall: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: Theme.colors.gray,
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 36,
    color: Theme.colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  box: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginBottom: 24,
  },
  boxActive: {
    backgroundColor: '#FFF1F2',
    borderColor: Theme.colors.secondary,
    borderStyle: 'solid',
  },
  placeholder: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Theme.colors.gray,
    marginTop: 8,
  },
  receiver: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 38,
    color: Theme.colors.primary,
    textAlign: 'center',
  },
  revealButton: {
    backgroundColor: Theme.colors.cta,
    paddingVertical: 18,
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
  },
  revealButtonText: {
    fontFamily: 'Fredoka-Bold',
    color: Theme.white,
    fontSize: 18,
    letterSpacing: 1,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  nextButtonText: {
    fontFamily: 'Nunito-Bold',
    color: Theme.colors.text,
    fontSize: 16,
    marginRight: 4,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: 'Fredoka-Bold',
    color: Theme.white,
    fontSize: 16,
  },
  centered: {
    alignItems: 'center',
  }
});
