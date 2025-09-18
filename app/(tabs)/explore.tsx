import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useData } from '../context/DataContext';

export default function SeancesScreen() {
  // Utiliser le contexte au lieu du state local
  const { seances, ajouterExercice } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // États pour le formulaire d'ajout
  const [exercice, setExercice] = useState('');
  const [poids, setPoids] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [series, setSeries] = useState('');

  const ajouterNouvelExercice = () => {
    if (!exercice || !poids || !repetitions || !series) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const nouvelExercice = {
      exercice: exercice,
      poids: parseFloat(poids),
      repetitions: parseInt(repetitions),
      series: parseInt(series),
      date: new Date().toLocaleDateString('fr-FR')
    };

    // Utiliser la fonction du contexte
    ajouterExercice(nouvelExercice);
    
    // Reset du formulaire
    setExercice('');
    setPoids('');
    setRepetitions('');
    setSeries('');
    setShowAddForm(false);
    
    Alert.alert('Succès', 'Exercice ajouté !');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏋️ Mes Séances</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addButtonText}>
            {showAddForm ? '❌ Annuler' : '➕ Ajouter Exercice'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nouvel Exercice</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nom de l'exercice (ex: Développé couché)"
            value={exercice}
            onChangeText={setExercice}
          />
          
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Poids (kg)"
              value={poids}
              onChangeText={setPoids}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Répétitions"
              value={repetitions}
              onChangeText={setRepetitions}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Séries"
              value={series}
              onChangeText={setSeries}
              keyboardType="numeric"
            />
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={ajouterNouvelExercice}>
            <Text style={styles.submitButtonText}>✅ Ajouter</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Liste des séances */}
      <View style={styles.seancesList}>
        <Text style={styles.sectionTitle}>
          📋 Historique ({seances.length} exercices)
        </Text>
        
        {seances.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>🏃‍♂️ Aucun exercice enregistré</Text>
            <Text style={styles.emptySubtext}>Ajoutez votre premier exercice !</Text>
          </View>
        ) : (
          seances.map((seance) => (
            <View key={seance.id} style={styles.seanceCard}>
              <View style={styles.seanceHeader}>
                <Text style={styles.exerciceNom}>{seance.exercice}</Text>
                <Text style={styles.seanceDate}>{seance.date}</Text>
              </View>
              
              <View style={styles.seanceStats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Poids</Text>
                  <Text style={styles.statValue}>{seance.poids} kg</Text>
                </View>
                
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Répétitions</Text>
                  <Text style={styles.statValue}>{seance.repetitions}</Text>
                </View>
                
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Séries</Text>
                  <Text style={styles.statValue}>{seance.series}</Text>
                </View>
              </View>
            </View>
          ))
        )}
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
    fontSize: 28,
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
  formCard: {
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
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 0.3,
    marginRight: 5,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  seanceCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  seanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciceNom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  seanceDate: {
    fontSize: 14,
    color: '#666',
  },
  seanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});