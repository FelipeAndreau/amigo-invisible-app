import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Amigo Invisible - Infraestructura</Text>
      <Text style={styles.subtitle}>Rama de Felipe Andreau</Text>
      
      <Text style={styles.section}>Docker & DevOps</Text>
      <Text style={styles.text}>docker-compose.yml con PostgreSQL 16, Go backend (hot reload), Expo frontend</Text>
      
      <Text style={styles.section}>Configuración</Text>
      <Text style={styles.text}>package.json, tsconfig.json, metro.config.js, app.json, .air.toml</Text>
      
      <Text style={styles.section}>Tests</Text>
      <Text style={styles.text}>Tests unitarios Go (logic_test.go) + TypeScript (validation.test.ts)</Text>
      
      <Text style={styles.section}>Documentación</Text>
      <Text style={styles.text}>README.md, CHANGELOG.md, docs/alcance, docs/doc_tecnica, docs/guia</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E11D48',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 24,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#6B7280',
  },
});
