import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../context/DataContext';

export default function HomeScreen() {
  const router = useRouter();
  const { seances, isLoading, user, signOut } = useData();
  
  // DEBUG: Affichons ce qu'on reçoit
  console.log('HomeScreen - Nombre de séances:', seances.length);
  console.log('HomeScreen - Chargement:', isLoading);
  
  const allerAuxSeances = () => {
    router.push('/(tabs)/explore');
  };

  // Affichage de chargement
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Chargement de vos données...</Text>
      </View>
    );
  }

  // Calculer les statistiques depuis les vraies données
  const totalSeances = seances.length;
  const derniereSeance = seances[0]; // La plus récente (en premier)
  
  // Trouver l'exercice le plus fréquent
  const exercicesCount = seances.reduce((acc, seance) => {
    acc[seance.exercice] = (acc[seance.exercice] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const exerciceFavori = Object.keys(exercicesCount).length > 0 
    ? Object.entries(exercicesCount).sort(([,a], [,b]) => b - a)[0][0]
    : "Aucun pour l'instant";

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>💪 Mon App Fitness</Text>
        <Text style={styles.subtitle}>Suivez votre progression</Text>
        
        {/* Bouton de déconnexion */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={signOut}
        >
          <Text style={styles.logoutText}>🚪 Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/* DEBUG: Affichage temporaire */}
      <View style={[styles.card, {backgroundColor: '#ffebcc'}]}>
        <Text style={styles.cardTitle}>🐛 DEBUG (temporaire)</Text>
        <Text style={styles.cardText}>Séances trouvées: {seances.length}</Text>
        <Text style={styles.cardText}>
          Données: {seances.length > 0 ? JSON.stringify(seances[0]) : 'Aucune'}
        </Text>
        <Text style={styles.cardText}>Statut: {isLoading ? 'Chargement...' : 'Chargé'}</Text>
      </View>

      {/* Bouton principal - Nouvelle séance */}
      <TouchableOpacity style={styles.mainButton} onPress={allerAuxSeances}>
        <Text style={styles.mainButtonText}>🏋️ Nouvelle Séance</Text>
      </TouchableOpacity>

      {/* Dernière séance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Dernière Séance</Text>
        {!derniereSeance ? (
          <Text style={styles.noDataText}>Aucune séance enregistrée</Text>
        ) : (
          <View>
            <Text style={styles.cardText}>Exercice: {derniereSeance.exercice}</Text>
            <Text style={styles.cardText}>Date: {derniereSeance.date}</Text>
            <Text style={styles.cardText}>
              {derniereSeance.series} séries × {derniereSeance.repetitions} reps à {derniereSeance.poids}kg
            </Text>
          </View>
        )}
      </View>

      {/* Statistiques rapides */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Vos Stats</Text>
        <Text style={styles.cardText}>Total exercices: {totalSeances}</Text>
        <Text style={styles.cardText}>Exercice favori: {exerciceFavori}</Text>
        <Text style={styles.cardText}>
          {totalSeances === 0 
            ? "Prochain objectif: Première séance !" 
            : `Continuez comme ça ! ${totalSeances} exercice${totalSeances > 1 ? 's' : ''} fait${totalSeances > 1 ? 's' : ''}`
          }
        </Text>
      </View>

      {/* Boutons secondaires */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={allerAuxSeances}>
          <Text style={styles.secondaryButtonText}>📝 Historique</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>📊 Progression</Text>
        </TouchableOpacity>
      </View>

      {/* Aperçu des derniers exercices */}
      {seances.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 Derniers exercices</Text>
          {seances.slice(0, 3).map((seance) => (
            <View key={seance.id} style={styles.miniSeance}>
              <Text style={styles.miniSeanceText}>
                {seance.exercice} - {seance.poids}kg × {seance.repetitions}
              </Text>
              <Text style={styles.miniSeanceDate}>{seance.date}</Text>
            </View>
          ))}
          {seances.length > 3 && (
            <TouchableOpacity onPress={allerAuxSeances}>
              <Text style={styles.voirPlus}>Voir plus...</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  mainButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  miniSeance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  miniSeanceText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  miniSeanceDate: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  voirPlus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
});