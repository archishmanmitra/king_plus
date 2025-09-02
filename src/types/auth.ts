export type UserRole = 
  | 'global_admin'
  | 'hr_manager'
  | 'manager'
  | 'hr_executive'
  | 'project_admin'
  | 'asset_manager'
  | 'help_desk_manager'
  | 'requisition_manager'
  | 'performance_admin'
  | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  position: string;
  avatar?: string;
  employeeId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}