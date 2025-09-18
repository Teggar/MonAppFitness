// app/(tabs)/explore.tsx - Historique des séances

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../context/DataContext';

export default function ExploreScreen() {
  const router = useRouter();
  const { seances, supprimerSeance, isLoading } = useData();
  const [expandedSeance, setExpandedSeance] = useState<number | null>(null);

  // Naviguer vers nouvelle séance
  const creerNouvelleSeance = () => {
    router.push('/(tabs)/nouvelle-seance');
  };

  // Basculer l'affichage des détails d'une séance
  const toggleSeanceDetails = (seanceId: number) => {
    setExpandedSeance(expandedSeance === seanceId ? null : seanceId);
  };

  // Confirmer la suppression d'une séance
  const confirmerSuppression = (seance: any) => {
    Alert.alert(
      'Supprimer la séance',
      `Êtes-vous sûr de vouloir supprimer "${seance.nom}" du ${seance.date} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => supprimerSeance(seance.id)
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Historique des Séances</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={creerNouvelleSeance}
        >
          <Text style={styles.addButtonText}>➕ Nouvelle Séance</Text>
        </TouchableOpacity>
      </View>

      {/* Résumé rapide */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 Résumé</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{seances.length}</Text>
            <Text style={styles.summaryLabel}>Séances</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {seances.reduce((total, s) => total + (s.exercices?.length || 0), 0)}
            </Text>
            <Text style={styles.summaryLabel}>Exercices</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {seances.length > 0 
                ? Math.round(seances.reduce((total, s) => total + (s.duree_minutes || 0), 0) / seances.length)
                : 0
              }
            </Text>
            <Text style={styles.summaryLabel}>Min/séance</Text>
          </View>
        </View>
      </View>

      {/* Liste des séances */}
      <View style={styles.seancesList}>
        <Text style={styles.sectionTitle}>
          🏋️ Vos séances ({seances.length})
        </Text>
        
        {seances.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>🎯 Aucune séance enregistrée</Text>
            <Text style={styles.emptySubtext}>Créez votre première séance d'entraînement !</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={creerNouvelleSeance}>
              <Text style={styles.emptyButtonText}>🚀 Commencer maintenant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          seances.map((seance) => (
            <View key={seance.id} style={styles.seanceCard}>
              {/* En-tête de la séance */}
              <TouchableOpacity 
                style={styles.seanceHeader}
                onPress={() => toggleSeanceDetails(seance.id)}
              >
                <View style={styles.seanceMainInfo}>
                  <Text style={styles.seanceNom}>{seance.nom}</Text>
                  <Text style={styles.seanceDate}>{seance.date}</Text>
                  
                  <View style={styles.seanceQuickStats}>
                    <Text style={styles.quickStat}>
                      {seance.exercices?.length || 0} exercice{(seance.exercices?.length || 0) > 1 ? 's' : ''}
                    </Text>
                    {seance.duree_minutes && (
                      <Text style={styles.quickStat}>• {seance.duree_minutes} min</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.seanceActions}>
                  <Text style={styles.expandIcon}>
                    {expandedSeance === seance.id ? '▼' : '▶'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Détails expandés */}
              {expandedSeance === seance.id && (
                <View style={styles.seanceDetails}>
                  {/* Notes */}
                  {seance.notes && (
                    <View style={styles.notesSection}>
                      <Text style={styles.notesTitle}>📝 Notes:</Text>
                      <Text style={styles.notesText}>{seance.notes}</Text>
                    </View>
                  )}
                  
                  {/* Liste des exercices */}
                  <View style={styles.exercicesSection}>
                    <Text style={styles.exercicesTitle}>
                      💪 Exercices ({seance.exercices?.length || 0}):
                    </Text>
                    
                    {seance.exercices && seance.exercices.length > 0 ? (
                      seance.exercices.map((exercice, index) => (
                        <View key={exercice.id} style={styles.exerciceItem}>
                          <Text style={styles.exerciceNom}>
                            {index + 1}. {exercice.exercice}
                          </Text>
                          <Text style={styles.exerciceStats}>
                            {exercice.series} × {exercice.repetitions} reps à {exercice.poids}kg
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noExercices}>Aucun exercice enregistré</Text>
                    )}
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsSection}>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => confirmerSuppression(seance)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️ Supprimer</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.duplicateButton}
                      onPress={() => {
                        // TODO: Implémenter la duplication
                        Alert.alert('Info', 'Fonctionnalité de duplication à venir !');
                      }}
                    >
                      <Text style={styles.duplicateButtonText}>📋 Dupliquer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* Bouton fixe en bas */}
      {seances.length > 0 && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity style={styles.fixedButton} onPress={creerNouvelleSeance}>
            <Text style={styles.fixedButtonText}>+ Nouvelle Séance</Text>
          </TouchableOpacity>
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
  header: {
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  seancesList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  seanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  seanceMainInfo: {
    flex: 1,
  },
  seanceNom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  seanceDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  seanceQuickStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStat: {
    fontSize: 12,
    color: '#4CAF50',
    marginRight: 8,
    fontWeight: '500',
  },
  seanceActions: {
    paddingLeft: 10,
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
  },
  seanceDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 15,
  },
  notesSection: {
    marginBottom: 15,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  exercicesSection: {
    marginBottom: 15,
  },
  exercicesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  exerciceItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  exerciceNom: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  exerciceStats: {
    fontSize: 12,
    color: '#666',
  },
  noExercices: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.45,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  duplicateButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 0.45,
    alignItems: 'center',
  },
  duplicateButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fixedButtonContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  fixedButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  fixedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});