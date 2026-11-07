import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  switchUser: (userId: number) => void;
  isLowBandwidth: boolean;
  toggleLowBandwidth: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  users: [],
  switchUser: () => {},
  isLowBandwidth: false,
  toggleLowBandwidth: () => {},
  isLoading: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const demoUsers = await api.getDemoUsers();
        setUsers(demoUsers);
        if (demoUsers.length > 0) {
          setCurrentUser(demoUsers[0]);
        }
      } catch (err) {
        console.error('Failed to load users, using fallback', err);
        const fallbackUser: User = {
          id: 1,
          email: 'rahul.korra@example.com',
          full_name: 'Rahul Korra',
          role: 'student',
          is_active: true,
          created_at: new Date().toISOString()
        };
        setUsers([fallbackUser]);
        setCurrentUser(fallbackUser);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const switchUser = (userId: number) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const toggleLowBandwidth = () => {
    setIsLowBandwidth(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('low-bandwidth');
      } else {
        document.body.classList.remove('low-bandwidth');
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, switchUser, isLowBandwidth, toggleLowBandwidth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
