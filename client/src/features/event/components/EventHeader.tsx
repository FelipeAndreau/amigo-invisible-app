import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../../shared/theme';

interface Props {
  title: string;
  subtitle?: string;
  isCentered?: boolean;
}

export const EventHeader = ({ title, subtitle, isCentered = true }: Props) => (
  <View style={[styles.container, isCentered && styles.centered]}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  centered: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    color: Theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Theme.colors.gray,
    textAlign: 'center',
    marginTop: 4,
  },
});