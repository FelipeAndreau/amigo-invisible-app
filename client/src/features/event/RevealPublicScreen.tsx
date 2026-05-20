import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RevealPublicScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Revelación Simplificada</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RevealPublicScreen;
