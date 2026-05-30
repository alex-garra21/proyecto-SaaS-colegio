import { type ReactNode } from 'react';

export type Role = 'admin' | 'teacher' | 'student' | 'family';

export interface User {
  email: string;
  name: string;
  role: Role;
  idRol?: number;
  token?: string;
  idUsuario?: number;
}

export type View = string;

export interface FamilyChild {
  id: string;
  name: string;
  grade: string;
  average: number;
  balance: string;
  risk: string;
  subjects: number;
  avatar: string;
}

export interface NavItem {
  id: View;
  label: string;
  icon: ReactNode;
}
