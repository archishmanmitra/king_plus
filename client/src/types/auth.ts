export type UserRole = 
  | 'global_admin'
  | 'hr_manager'
  | 'manager'
  | 'employee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  avatar?: string;
  employeeId?: string;
  // Legacy fields (will be removed once UI migrates to Employee models)
  name?: string;
  department?: string;
  position?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}