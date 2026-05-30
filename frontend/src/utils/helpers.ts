import { type Role } from '../types';

export function roleLabel(role: Role) {
  return { admin: 'Profesor Admin', teacher: 'Profesor', student: 'Alumno', family: 'Padre de familia' }[role];
}

export function currentLabel(nav: Array<{ id: string; label: string }>, view: string) {
  return nav.find((item) => item.id === view)?.label ?? 'Vista principal';
}

export function initials(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}
