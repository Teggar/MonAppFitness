// app/context/DataContext.tsx - Version complète avec séances

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

// Types
export type Seance = {
  id: number;
  nom: string;
  date_seance: string;
  date: string; // Format français
  duree_minutes?: number;
  notes?: string;
  exercices?: Exercice[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Exercice = {
  id: number;
  exercice: string;
  poids: number;
  repetitions: number;
  series: number;
  seance_id?: number; // Optionnel pour rétrocompatibilité
  date: string;
  date_exercice?: string;
  created_at?: string;
  updated_at?: string;
};

export type ModeleExercice = {
  id: number;
  nom: string;
  poids_habituel?: number;
  repetitions_habituelles?: number;
  series_habituelles?: number;
  user_id?: string;
  created_at?: string;
};

type DataContextType = {
  seances: Seance[];
  exercicesIndividuels: Exercice[]; // Anciens exercices sans séance
  modelesExercices: ModeleExercice[];
  isLoading: boolean;
  user: any;
  
  // Actions pour les séances
  creerSeance: (seance: {
    nom: string;
    date_seance: string;
    duree_minutes?: number;
    notes?: string;
    exercices: Omit<Exercice, 'id' | 'seance_id' | 'date' | 'date_exercice' | 'created_at' | 'updated_at'>[];
  }) => Promise<void>;
  
  chargerSeances: () => Promise<void>;
  supprimerSeance: (id: number) => Promise<void>;
  
  // Actions pour les exercices individuels (rétrocompatibilité)
  ajouterExercice: (exercice: Omit<Exercice, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  chargerDonnees: () => Promise<void>;
  supprimerExercice: (id: number) => Promise<void>;
  
  // Actions pour les modèles d'exercices
  creerModeleExercice: (modele: Omit<ModeleExercice, 'id'>) => Promise<void>;
  chargerModelesExercices: () => Promise<void>;
  
  // Auth
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider');
  }
  return context;
};

// Fonctions utilitaires
const formatDateFrench = (dateISO: string) => {
  return new Date(dateISO).toLocaleDateString('fr-FR');
};

const formatDateISO = (dateFrench: string) => {
  const [day, month, year] = dateFrench.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [exercicesIndividuels, setExercicesIndividuels] = useState<Exercice[]>([]);
  const [modelesExercices, setModelesExercices] = useState<ModeleExercice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Auth useEffect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        chargerSeances();
        chargerDonnees();
        chargerModelesExercices();
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        chargerSeances();
        chargerDonnees();
        chargerModelesExercices();
      } else {
        setSeances([]);
        setExercicesIndividuels([]);
        setModelesExercices([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ NOUVEAU useEffect pour charger les données quand user change
  useEffect(() => {
    if (user?.id) {
      console.log('🔄 Utilisateur connecté, chargement des données...');
      chargerSeances();
      chargerDonnees();
      chargerModelesExercices();
    }
  }, [user]); // Se déclenche uniquement quand user change

  // ========== NOUVELLES MÉTHODES POUR LES SÉANCES ==========

  // Charger les séances avec leurs exercices
  const chargerSeances = async () => {
    try {
      setIsLoading(true);
      
      // ✅ AJOUTEZ CETTE VÉRIFICATION
      if (!user?.id) {
        console.log('Pas d\'utilisateur connecté, arrêt du chargement des séances');
        setIsLoading(false);
        return;
      }
      // AJOUTEZ CE LOG POUR VÉRIFIER
      console.log('Chargement des séances pour user:', user.id);
      
      const { data: seancesData, error: seancesError } = await supabase
        .from('seances')
        .select(`
          *,
          exercices(*)
        `)
        .eq('user_id', user.id) // AJOUTEZ CETTE LIGNE
        .order('date_seance', { ascending: false });

      if (seancesError) {
        console.error('Erreur lors du chargement des séances:', seancesError);
        // Ne pas afficher d'erreur si la table n'existe pas encore
        if (!seancesError.message.includes('relation "seances" does not exist')) {
          Alert.alert('Erreur', 'Impossible de charger les séances');
        }
        return;
      }

      // AJOUTEZ CE LOG POUR VÉRIFIER LES DONNÉES RÉCUPÉRÉES
      console.log('Données brutes récupérées:', seancesData);

      // Formater les données
      const seancesFormatees = seancesData?.map(seance => ({
        ...seance,
        date: formatDateFrench(seance.date_seance),
        exercices: seance.exercices?.map((ex: any) => ({
          ...ex,
          date: formatDateFrench(ex.date_exercice)
        })) || []
      })) || [];

      setSeances(seancesFormatees);
      console.log('Séances formatées chargées:', seancesFormatees.length);
      
    } catch (error) {
      console.error('Erreur lors du chargement des séances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une nouvelle séance
  const creerSeance = async (nouvelleSeance: {
    nom: string;
    date_seance: string;
    duree_minutes?: number;
    notes?: string;
    exercices: Omit<Exercice, 'id' | 'seance_id' | 'date' | 'date_exercice' | 'created_at' | 'updated_at'>[];
  }) => {
    try {
      setIsLoading(true);

      // 1. Créer la séance AVEC user_id
      const { data: seanceData, error: seanceError } = await supabase
        .from('seances')
        .insert([{
          nom: nouvelleSeance.nom,
          date_seance: nouvelleSeance.date_seance,
          duree_minutes: nouvelleSeance.duree_minutes,
          notes: nouvelleSeance.notes,
          user_id: user?.id // AJOUTEZ CETTE LIGNE
        }])
        .select()
        .single();

      if (seanceError) {
        console.error('Erreur création séance:', seanceError);
        Alert.alert('Erreur', 'Impossible de créer la séance');
        return;
      }

      // 2. Ajouter les exercices AVEC user_id
      if (nouvelleSeance.exercices.length > 0) {
        const exercicesData = nouvelleSeance.exercices.map(ex => ({
          exercice: ex.exercice,
          poids: ex.poids,
          repetitions: ex.repetitions,
          series: ex.series,
          seance_id: seanceData.id,
          date_exercice: nouvelleSeance.date_seance,
          user_id: user?.id // AJOUTEZ CETTE LIGNE AUSSI
        }));

        const { error: exercicesError } = await supabase
          .from('exercices')
          .insert(exercicesData);

        if (exercicesError) {
          console.error('Erreur ajout exercices:', exercicesError);
          Alert.alert('Erreur', 'Impossible d\'ajouter les exercices');
          return;
        }
      }

      // Recharger les données
      await chargerSeances();
      Alert.alert('Succès', 'Séance créée avec succès !');

    } catch (error) {
      console.error('Erreur création séance:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une séance
  const supprimerSeance = async (id: number) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('seances')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur suppression séance:', error);
        Alert.alert('Erreur', 'Impossible de supprimer la séance');
        return;
      }

      // Mettre à jour l'état local
      setSeances(prev => prev.filter(s => s.id !== id));
      console.log('Séance supprimée, ID:', id);

    } catch (error) {
      console.error('Erreur suppression:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== MÉTHODES POUR LES MODÈLES ==========

  // Charger les modèles d'exercices
  const chargerModelesExercices = async () => {
    try {
      const { data, error } = await supabase
        .from('modeles_exercices')
        .select('*')
        .order('nom');

      if (error) {
        console.error('Erreur modèles:', error);
        // Pas d'alerte si la table n'existe pas encore
        return;
      }

      setModelesExercices(data || []);
    } catch (error) {
      console.error('Erreur chargement modèles:', error);
    }
  };

  // Créer un modèle d'exercice
  const creerModeleExercice = async (modele: Omit<ModeleExercice, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('modeles_exercices')
        .insert([modele])
        .select()
        .single();

      if (error) {
        console.error('Erreur création modèle:', error);
        Alert.alert('Erreur', 'Impossible de créer le modèle');
        return;
      }

      setModelesExercices(prev => [...prev, data]);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // ========== MÉTHODES RÉTROCOMPATIBLES (exercices individuels) ==========

  // Charger les exercices individuels (sans séance)
  const chargerDonnees = async () => {
    try {
      if (!user?.id) {
        console.log('Pas d\'utilisateur connecté, arrêt du chargement des exercices');
        return;
      }
      const { data, error } = await supabase
        .from('exercices')
        .select('*')
        .eq('user_id', user.id) // AJOUTEZ CETTE LIGNE
        .is('seance_id', null) // Seulement les exercices sans séance
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement:', error);
        return;
      }

      // Convertir les dates pour l'affichage
      const exercicesFormats = data?.map(exercice => ({
        ...exercice,
        date: formatDateFrench(exercice.date_exercice)
      })) || [];

      setExercicesIndividuels(exercicesFormats);
      console.log('Exercices individuels chargés:', exercicesFormats.length);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  // Ajouter un exercice individuel
  const ajouterExercice = async (nouvelExercice: Omit<Exercice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);

      const exerciceData = {
        exercice: nouvelExercice.exercice,
        poids: nouvelExercice.poids,
        repetitions: nouvelExercice.repetitions,
        series: nouvelExercice.series,
        date_exercice: nouvelExercice.date_exercice || formatDateISO(nouvelExercice.date),
        seance_id: null // Exercice individuel
      };

      const { data, error } = await supabase
        .from('exercices')
        .insert([exerciceData])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout:', error);
        Alert.alert('Erreur', 'Impossible d\'ajouter l\'exercice');
        return;
      }

      const exerciceFormate = {
        ...data,
        date: formatDateFrench(data.date_exercice)
      };

      setExercicesIndividuels(prev => [exerciceFormate, ...prev]);
      console.log('Exercice ajouté:', exerciceFormate);

    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un exercice
  const supprimerExercice = async (id: number) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('exercices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        Alert.alert('Erreur', 'Impossible de supprimer l\'exercice');
        return;
      }

      // Mettre à jour l'état local pour les deux listes
      setExercicesIndividuels(prev => prev.filter(ex => ex.id !== id));
      setSeances(prev => prev.map(seance => ({
        ...seance,
        exercices: seance.exercices?.filter(ex => ex.id !== id) || []
      })));

      console.log('Exercice supprimé, ID:', id);

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== AUTH METHODS ==========

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Erreur de connexion', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur signIn:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
      return false;
    }
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Erreur d\'inscription', error.message);
        return false;
      }

      Alert.alert('Succès', 'Compte créé ! Vérifiez votre email.');
      return true;
    } catch (error) {
      console.error('Erreur signUp:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSeances([]);
      setExercicesIndividuels([]);
      setModelesExercices([]);
    } catch (error) {
      console.error('Erreur signOut:', error);
    }
  };

  return (
    <DataContext.Provider value={{ 
      // Séances
      seances,
      creerSeance,
      chargerSeances,
      supprimerSeance,
      
      // Exercices individuels (rétrocompatibilité)
      //seances: exercicesIndividuels, // Alias pour compatibilité avec l'ancien code
      ajouterExercice,
      chargerDonnees,
      supprimerExercice,
      exercicesIndividuels,
      
      // Modèles
      modelesExercices,
      creerModeleExercice,
      chargerModelesExercices,
      
      // État
      isLoading,
      user,
      
      // Auth
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </DataContext.Provider>
  );
};