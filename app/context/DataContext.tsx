import React, { createContext, useContext, useState } from 'react';

// Type pour nos exercices
export type Exercice = {
  id: number;
  exercice: string;
  poids: number;
  repetitions: number;
  series: number;
  date: string;
};

// Type pour le contexte
type DataContextType = {
  seances: Exercice[];
  ajouterExercice: (exercice: Omit<Exercice, 'id'>) => void;
  chargerDonnees: () => void;
};

// Créer le contexte
const DataContext = createContext<DataContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return context;
};

// Provider pour partager les données
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seances, setSeances] = useState<Exercice[]>([]);

  // Charger les données (pour l'instant vide)
  const chargerDonnees = () => {
    console.log('Chargement des données...');
  };

  // Ajouter un exercice
  const ajouterExercice = (nouvelExercice: Omit<Exercice, 'id'>) => {
    const exerciceAvecId = {
      ...nouvelExercice,
      id: Date.now()
    };
    
    const nouvellesSeances = [exerciceAvecId, ...seances];
    setSeances(nouvellesSeances);
    console.log('Exercice ajouté:', exerciceAvecId);
  };

  return (
    <DataContext.Provider value={{ seances, ajouterExercice, chargerDonnees }}>
      {children}
    </DataContext.Provider>
  );
};