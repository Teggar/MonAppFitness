// Créez ce fichier : app/(tabs)/nouvelle-seance.tsx

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../context/DataContext';

type ExerciceTemp = {
  exercice: string;
  poids: number;
  repetitions: number;
  series: number;
};

export default function NouvelleSeanceScreen() {
  const router = useRouter();
  const { creerSeance, modelesExercices, isLoading } = useData();
  
  // État pour la séance
  const [nomSeance, setNomSeance] = useState('');
  const [notes, setNotes] = useState('');
  const [exercices, setExercices] = useState<ExerciceTemp[]>([]);
  
  // État pour ajouter un exercice
  const [showAddExercice, setShowAddExercice] = useState(false);
  const [nouvelExercice, setNouvelExercice] = useState<ExerciceTemp>({
    exercice: '',
    poids: 0,
    repetitions: 0,
    series: 0
  });

  // Ajouter un exercice à la séance
  const ajouterExercice = () => {
    if (!nouvelExercice.exercice.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le nom de l\'exercice');
      return;
    }

    setExercices(prev => [...prev, { ...nouvelExercice }]);
    
    // Reset du formulaire
    setNouvelExercice({
      exercice: '',
      poids: 0,
      repetitions: 0,
      series: 0
    });
    
    setShowAddExercice(false);
  };

  // Utiliser un modèle d'exercice
  const utiliserModele = (modele: any) => {
    setNouvelExercice({
      exercice: modele.nom,
      poids: modele.poids_habituel || 0,
      repetitions: modele.repetitions_habituelles || 0,
      series: modele.series_habituelles || 0
    });
  };

  // Supprimer un exercice
  const supprimerExercice = (index: number) => {
    setExercices(prev => prev.filter((_, i) => i !== index));
  };

  // Sauvegarder la séance
  const sauvegarderSeance = async () => {
    if (!nomSeance.trim()) {
      Alert.alert('Erreur', 'Veuillez donner un nom à votre séance');
      return;
    }

    if (exercices.length === 0) {
      Alert.alert('Erreur', 'Ajoutez au moins un exercice à votre séance');
      return;
    }

    try {
      await creerSeance({
        nom: nomSeance,
        date_seance: new Date().toISOString().split('T')[0], // Date du jour
        notes,
        exercices: exercices
      });

      // Retour à l'écran principal
      router.back();
      
    } catch (error) {
      console.error('Erreur sauvegarde séance:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>🏋️ Nouvelle Séance</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>❌ Annuler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={sauvegarderSeance}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? '⏳ Sauvegarde...' : '✅ Sauvegarder'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Informations de base */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Informations de base</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nom de la séance (ex: Push Day, Jambes...)"
          value={nomSeance}
          onChangeText={setNomSeance}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Notes (optionnel)"
          value={notes}
          onChangeText={setNotes}
          multiline={true}
          numberOfLines={3}
        />
      </View>

      {/* Liste des exercices */}
      <View style={styles.card}>
        <View style={styles.exercicesHeader}>
          <Text style={styles.cardTitle}>
            💪 Exercices ({exercices.length})
          </Text>
          
          <TouchableOpacity 
            style={styles.addExerciceButton}
            onPress={() => setShowAddExercice(!showAddExercice)}
          >
            <Text style={styles.addExerciceText}>
              {showAddExercice ? '❌ Annuler' : '➕ Ajouter'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire d'ajout d'exercice */}
        {showAddExercice && (
          <View style={styles.addExerciceForm}>
            <Text style={styles.formTitle}>Nouvel exercice</Text>
            
            {/* Modèles disponibles */}
            {modelesExercices.length > 0 && (
              <View style={styles.modelesSection}>
                <Text style={styles.modelesTitle}>🎯 Mes modèles :</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {modelesExercices.map(modele => (
                    <TouchableOpacity 
                      key={modele.id} 
                      style={styles.modeleButton}
                      onPress={() => utiliserModele(modele)}
                    >
                      <Text style={styles.modeleText}>{modele.nom}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Nom de l'exercice"
              value={nouvelExercice.exercice}
              onChangeText={(text) => setNouvelExercice(prev => ({...prev, exercice: text}))}
            />
            
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Poids (kg)"
                value={nouvelExercice.poids.toString()}
                onChangeText={(text) => setNouvelExercice(prev => ({...prev, poids: parseInt(text) || 0}))}
                keyboardType="numeric"
              />
              
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Reps"
                value={nouvelExercice.repetitions.toString()}
                onChangeText={(text) => setNouvelExercice(prev => ({...prev, repetitions: parseInt(text) || 0}))}
                keyboardType="numeric"
              />
              
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Séries"
                value={nouvelExercice.series.toString()}
                onChangeText={(text) => setNouvelExercice(prev => ({...prev, series: parseInt(text) || 0}))}
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity style={styles.addButton} onPress={ajouterExercice}>
              <Text style={styles.addButtonText}>✅ Ajouter à la séance</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Liste des exercices ajoutés */}
        {exercices.length === 0 ? (
          <Text style={styles.emptyText}>Aucun exercice ajouté</Text>
        ) : (
          exercices.map((ex, index) => (
            <View key={index} style={styles.exerciceItem}>
              <View style={styles.exerciceInfo}>
                <Text style={styles.exerciceNom}>{ex.exercice}</Text>
                <Text style={styles.exerciceDetails}>
                  {ex.series} × {ex.repetitions} reps à {ex.poids}kg
                </Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => supprimerExercice(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Résumé */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Résumé</Text>
        <Text style={styles.summaryText}>
          Nom : {nomSeance || 'Non défini'}
        </Text>
        <Text style={styles.summaryText}>
          Exercices : {exercices.length}
        </Text>
        <Text style={styles.summaryText}>
          Date : {new Date().toLocaleDateString('fr-FR')}
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
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  exercicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addExerciceButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addExerciceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addExerciceForm: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modelesSection: {
    marginBottom: 15,
  },
  modelesTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  modeleButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  modeleText: {
    color: '#1976d2',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 0.3,
    marginRight: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  exerciceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciceInfo: {
    flex: 1,
  },
  exerciceNom: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciceDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});