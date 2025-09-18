// app/(tabs)/index.tsx - Version mise à jour

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../context/DataContext';

export default function HomeScreen() {
  const router = useRouter();
  const { seances, isLoading, user, signOut } = useData();
  
  console.log('HomeScreen - Nombre de séances:', seances.length);
  
  // Navigation vers nouvelle séance
  const creerNouvelleSeance = () => {
    router.push('/(tabs)/nouvelle-seance');
  };

  // Navigation vers l'historique
  const voirHistorique = () => {
    router.push('/(tabs)/explore');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Chargement de vos données...</Text>
      </View>
    );
  }

  // ========== STATISTIQUES BASÉES SUR LES SÉANCES ==========
  const totalSeances = seances.length;
  const derniereSeance = seances[0]; // La plus récente
  
  // Calculer le nombre total d'exercices dans toutes les séances
  const totalExercices = seances.reduce((total, seance) => {
    return total + (seance.exercices?.length || 0);
  }, 0);

  // Trouver le type de séance le plus fréquent
  const typeSeancesCount = seances.reduce((acc, seance) => {
    acc[seance.nom] = (acc[seance.nom] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const typeSeanceFavori = Object.keys(typeSeancesCount).length > 0 
    ? Object.entries(typeSeancesCount).sort(([,a], [,b]) => b - a)[0][0]
    : "Aucune pour l'instant";

  // Calculer la moyenne d'exercices par séance
  const moyenneExercicesParSeance = totalSeances > 0 
    ? Math.round(totalExercices / totalSeances * 10) / 10 
    : 0;

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>💪 Mon App Fitness</Text>
        <Text style={styles.subtitle}>Suivez votre progression</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={signOut}
        >
          <Text style={styles.logoutText}>🚪 Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton principal - Nouvelle séance */}
      <TouchableOpacity style={styles.mainButton} onPress={creerNouvelleSeance}>
        <Text style={styles.mainButtonText}>🏋️ Nouvelle Séance</Text>
      </TouchableOpacity>

      {/* Dernière séance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Dernière Séance</Text>
        {!derniereSeance ? (
          <Text style={styles.noDataText}>Aucune séance enregistrée</Text>
        ) : (
          <View>
            <Text style={styles.cardText}>
              <Text style={styles.bold}>{derniereSeance.nom}</Text>
            </Text>
            <Text style={styles.cardText}>Date: {derniereSeance.date}</Text>
            <Text style={styles.cardText}>
              {derniereSeance.exercices?.length || 0} exercice{(derniereSeance.exercices?.length || 0) > 1 ? 's' : ''}
            </Text>
            {derniereSeance.duree_minutes && (
              <Text style={styles.cardText}>Durée: {derniereSeance.duree_minutes} min</Text>
            )}
          </View>
        )}
      </View>

      {/* Statistiques rapides */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Vos Stats</Text>
        <Text style={styles.cardText}>Total séances: {totalSeances}</Text>
        <Text style={styles.cardText}>Total exercices: {totalExercices}</Text>
        <Text style={styles.cardText}>Type de séance favori: {typeSeanceFavori}</Text>
        <Text style={styles.cardText}>
          Moyenne: {moyenneExercicesParSeance} exercice{moyenneExercicesParSeance > 1 ? 's' : ''} / séance
        </Text>
        <Text style={styles.motivationText}>
          {totalSeances === 0 
            ? "🎯 Prochain objectif: Première séance !" 
            : `🔥 Continuez comme ça ! ${totalSeances} séance${totalSeances > 1 ? 's' : ''} complétée${totalSeances > 1 ? 's' : ''}`
          }
        </Text>
      </View>

      {/* Boutons secondaires */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={voirHistorique}>
          <Text style={styles.secondaryButtonText}>📝 Historique</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={creerNouvelleSeance}
        >
          <Text style={styles.secondaryButtonText}>⚡ Séance Express</Text>
        </TouchableOpacity>
      </View>

      {/* Aperçu des dernières séances */}
      {seances.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 Dernières séances</Text>
          {seances.slice(0, 3).map((seance) => (
            <View key={seance.id} style={styles.miniSeance}>
              <View style={styles.miniSeanceHeader}>
                <Text style={styles.miniSeanceNom}>{seance.nom}</Text>
                <Text style={styles.miniSeanceDate}>{seance.date}</Text>
              </View>
              <Text style={styles.miniSeanceDetails}>
                {seance.exercices?.length || 0} exercice{(seance.exercices?.length || 0) > 1 ? 's' : ''}
                {seance.duree_minutes && ` • ${seance.duree_minutes} min`}
              </Text>
            </View>
          ))}
          {seances.length > 3 && (
            <TouchableOpacity onPress={voirHistorique}>
              <Text style={styles.voirPlus}>Voir toutes les séances...</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Message de motivation */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationTitle}>
          {totalSeances === 0 
            ? "🚀 Prêt à commencer ?" 
            : totalSeances < 5 
              ? "💪 Bien parti !" 
              : "🏆 Champion en route !"
          }
        </Text>
        <Text style={styles.motivationSubtext}>
          {totalSeances === 0 
            ? "Créez votre première séance et commencez votre parcours fitness !" 
            : `${totalSeances} séance${totalSeances > 1 ? 's' : ''} dans votre historique. Continuez sur cette lancée !`
          }
        </Text>
      </View>
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
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 20,
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
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  motivationText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
    flex: 0.48,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  miniSeance: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  miniSeanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  miniSeanceNom: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  miniSeanceDate: {
    fontSize: 12,
    color: '#666',
  },
  miniSeanceDetails: {
    fontSize: 14,
    color: '#666',
  },
  voirPlus: {
    textAlign: 'center',
    color: '#2196F3',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  motivationCard: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  motivationSubtext: {
    fontSize: 14,
    color: '#4caf50',
    textAlign: 'center',
    lineHeight: 20,
  },
});