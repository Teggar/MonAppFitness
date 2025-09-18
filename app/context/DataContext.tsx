import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

// Type pour nos exercices (aligné avec la base de données)
export type Exercice = {
  id: number;
  exercice: string;
  poids: number;
  repetitions: number;
  series: number;
  date: string; // Format français pour l'affichage
  date_exercice?: string; // Format ISO pour la base
  created_at?: string;
  updated_at?: string;
};

// Type pour le contexte
type DataContextType = {
  seances: Exercice[];
  ajouterExercice: (exercice: Omit<Exercice, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  chargerDonnees: () => Promise<void>;
  supprimerExercice: (id: number) => Promise<void>;
  isLoading: boolean;
  user: any;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
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

// Fonction utilitaire pour convertir les dates
const formatDateFrench = (dateISO: string) => {
  return new Date(dateISO).toLocaleDateString('fr-FR');
};

const formatDateISO = (dateFrench: string) => {
  const [day, month, year] = dateFrench.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Provider pour partager les données
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seances, setSeances] = useState<Exercice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        chargerDonnees();
      } else {
        setIsLoading(false);
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        chargerDonnees();
      } else {
        setSeances([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Connexion
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
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
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription
  const signUp = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Erreur d\'inscription', error.message);
        return false;
      }

      Alert.alert('Succès', 'Vérifiez votre email pour confirmer votre inscription');
      return true;
    } catch (error) {
      console.error('Erreur signUp:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion
  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Erreur', error.message);
      }
    } catch (error) {
      console.error('Erreur signOut:', error);
    }
  };

  // Charger les données depuis Supabase
  const chargerDonnees = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('exercices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement:', error);
        Alert.alert('Erreur', 'Impossible de charger les données');
        return;
      }

      // Convertir les dates pour l'affichage
      const seancesFormatees = data?.map(seance => ({
        ...seance,
        date: formatDateFrench(seance.date_exercice)
      })) || [];

      setSeances(seancesFormatees);
      console.log('Données chargées:', seancesFormatees.length, 'exercices');
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un exercice
  const ajouterExercice = async (nouvelExercice: Omit<Exercice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);

      // Préparer les données pour Supabase
      const exerciceData = {
        exercice: nouvelExercice.exercice,
        poids: nouvelExercice.poids,
        repetitions: nouvelExercice.repetitions,
        series: nouvelExercice.series,
        date_exercice: nouvelExercice.date_exercice || formatDateISO(nouvelExercice.date)
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

      // Mettre à jour l'état local
      const exerciceFormate = {
        ...data,
        date: formatDateFrench(data.date_exercice)
      };

      setSeances(prevSeances => [exerciceFormate, ...prevSeances]);
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

      // Mettre à jour l'état local
      setSeances(prevSeances => prevSeances.filter(seance => seance.id !== id));
      console.log('Exercice supprimé, ID:', id);

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ 
      seances, 
      ajouterExercice, 
      chargerDonnees, 
      supprimerExercice,
      isLoading,
      user,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </DataContext.Provider>
  );
};