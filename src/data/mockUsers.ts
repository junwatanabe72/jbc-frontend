import type { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'owner-1',
    email: 'owner@example.com',
    name: '田中太郎',
    role: 'OWNER',
    buildingId: 'building-1'
  },
  {
    id: 'mgmt-1',
    email: 'mgmt@example.com',
    name: '佐藤花子',
    role: 'MGMT',
    buildingId: 'building-1'
  },
  {
    id: 'tenant-1',
    email: 'tenant@example.com',
    name: '山田次郎',
    role: 'TENANT',
    buildingId: 'building-1',
    tenantId: 'tenant-1'
  },
  {
    id: 'broker-1',
    email: 'broker@example.com',
    name: '鈴木三郎',
    role: 'BROKER'
  }
];

export const mockCredentials = {
  'owner@example.com': 'password',
  'mgmt@example.com': 'password',
  'tenant@example.com': 'password',
  'broker@example.com': 'password'
};