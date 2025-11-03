import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
const API_URL= import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for different roles
const demoUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Soumodip Dey',
    role: 'global_admin',
    department: 'IT',
    position: 'CEO (Chief Executive Officer) ',
    employeeId: 'EMP001',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c8d6?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    email: 'hr@company.com',
    name: 'Indrajit Das',
    role: 'hr_manager',
    department: 'Human Resources',
    position: 'HR Manager',
    employeeId: 'EMP002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    email: 'manager@company.com',
    name: 'Emily Rodriguez',
    role: 'manager',
    department: 'Operations',
    position: 'Operations Manager',
    employeeId: 'EMP003',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    email: 'abir@company.com',
    name: 'Abir Lal Banerjee',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Engineer',
    employeeId: 'EMP004',
    avatar: '/images/Abir3.png'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('hrms_token');
      const storedUser = localStorage.getItem('hrms_user');
      
      if (token && storedUser) {
        try {
          // Verify token with server
          const response = await fetch(`${API_URL}/auth/verify`, {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const { user } = await response.json();
            setUser(user);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('hrms_token');
            localStorage.removeItem('hrms_user');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Don't clear storage immediately on error - might be network issue
          // localStorage.removeItem('hrms_token');
          // localStorage.removeItem('hrms_user');
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const { token, user } = await response.json();
      
      // Store token and user data
      localStorage.setItem('hrms_token', token);
      localStorage.setItem('hrms_user', JSON.stringify(user));
      
      setUser(user);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
    localStorage.removeItem('hrms_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};