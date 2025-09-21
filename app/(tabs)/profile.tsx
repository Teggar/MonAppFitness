// app/(tabs)/profile.tsx

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useData } from '../context/DataContext';

export default function ProfileScreen() {
  const { user, signOut, seances } = useData();

  // Statistiques utilisateur
  const totalSeances = seances.length;
  const totalExercices = seances.reduce((total, seance) => {
    return total + (seance.exercices?.length || 0);
  }, 0);

  const confirmerDeconnexion = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Se déconnecter', 
          style: 'destructive',
          onPress: signOut
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export des données', 
      'Fonctionnalité à venir...',
      [{ text: 'OK' }]
    );
  };

  const handleSettings = () => {
    Alert.alert(
      'Paramètres', 
      'Fonctionnalité à venir...',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête profil */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email ? user.email.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email || 'Email non disponible'}</Text>
        <Text style={styles.joinDate}>
          Membre depuis {new Date(user?.created_at || '').toLocaleDateString('fr-FR') || 'Date inconnue'}
        </Text>
      </View>

      {/* Statistiques */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Vos statistiques</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalSeances}</Text>
            <Text style={styles.statLabel}>Séances</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalExercices}</Text>
            <Text style={styles.statLabel}>Exercices</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {totalSeances > 0 ? Math.round(totalExercices / totalSeances * 10) / 10 : 0}
            </Text>
            <Text style={styles.statLabel}>Moy/séance</Text>
          </View>
        </View>
      </View>

      {/* Actions du compte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Gestion du compte</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleExportData}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📤</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Exporter mes données</Text>
              <Text style={styles.menuSubtitle}>Télécharger vos séances et exercices</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Paramètres</Text>
              <Text style={styles.menuSubtitle}>Préférences et configuration</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Section à propos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ À propos</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutTitle}>Version de l'application</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>📋</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Conditions d'utilisation</Text>
              <Text style={styles.menuSubtitle}>Termes et conditions</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Déconnexion */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={confirmerDeconnexion}>
          <Text style={styles.logoutText}>🚪 Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/* Espace en bas */}
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#4CAF50',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
    padding: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  aboutTitle: {
    fontSize: 16,
    color: '#333',
  },
  aboutValue: {
    fontSize: 16,
    color: '#666',
  },
  logoutSection: {
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 30,
  },
});