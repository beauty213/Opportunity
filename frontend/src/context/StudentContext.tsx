import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentIdentity, Scholarship } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface StudentContextType {
  identity: StudentIdentity | null;
  savedScholarships: number[];
  compareList: number[];
  toggleSaveScholarship: (id: number) => void;
  toggleCompareScholarship: (id: number) => void;
  refreshIdentity: () => Promise<void>;
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType>({
  identity: null,
  savedScholarships: [],
  compareList: [],
  toggleSaveScholarship: () => {},
  toggleCompareScholarship: () => {},
  refreshIdentity: async () => {},
  isLoading: true
});

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [identity, setIdentity] = useState<StudentIdentity | null>(null);
  const [savedScholarships, setSavedScholarships] = useState<number[]>([1]);
  const [compareList, setCompareList] = useState<number[]>([1, 4]); // Pre-compare ePASS & Reliance
  const [isLoading, setIsLoading] = useState(true);

  const fetchIdentity = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const data = await api.getStudentIdentity(currentUser.id);
      setIdentity(data);
    } catch (err) {
      console.error('Error fetching identity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentity();
  }, [currentUser]);

  const toggleSaveScholarship = (id: number) => {
    setSavedScholarships(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleCompareScholarship = (id: number) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 scholarships simultaneously.");
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <StudentContext.Provider value={{
      identity,
      savedScholarships,
      compareList,
      toggleSaveScholarship,
      toggleCompareScholarship,
      refreshIdentity: fetchIdentity,
      isLoading
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
