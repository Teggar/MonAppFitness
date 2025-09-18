// Créez ce fichier : app/types/index.ts

// Types pour les séances
export type Seance = {
  id: number;
  nom: string;
  date_seance: string; // Format ISO
  date: string; // Format français pour affichage
  duree_minutes?: number;
  notes?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  exercices?: Exercice[]; // Liste des exercices de cette séance
};

// Type pour les exercices (modifié)
export type Exercice = {
  id: number;
  exercice: string;
  poids: number;
  repetitions: number;
  series: number;
  seance_id: number; // Lien vers la séance
  date: string; // Format français pour l'affichage
  date_exercice?: string; // Format ISO pour la base
  created_at?: string;
  updated_at?: string;
};

// Type pour créer une nouvelle séance
export type NouvelleSeance = {
  nom: string;
  date_seance: string;
  duree_minutes?: number;
  notes?: string;
  exercices: Omit<Exercice, 'id' | 'seance_id' | 'date' | 'date_exercice' | 'created_at' | 'updated_at'>[];
};

// Type pour un modèle d'exercice (pour réutiliser)
export type ModeleExercice = {
  id: number;
  nom: string;
  poids_habituel?: number;
  repetitions_habituelles?: number;
  series_habituelles?: number;
  user_id?: string;
  created_at?: string;
};