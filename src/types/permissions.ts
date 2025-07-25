// 詳細権限管理システム
export type Permission = 
  // ユーザー管理
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  
  // 会議室予約管理
  | 'bookings.view.own'
  | 'bookings.view.all'
  | 'bookings.create'
  | 'bookings.approve'
  | 'bookings.cancel'
  | 'bookings.edit'
  
  // 申請管理
  | 'requests.view.own'
  | 'requests.view.all'
  | 'requests.create'
  | 'requests.approve'
  | 'requests.reject'
  | 'requests.edit'
  
  // ビル管理
  | 'building.view'
  | 'building.edit'
  | 'building.rooms.manage'
  | 'building.tenants.manage'
  
  // 請求書・レポート
  | 'billing.view'
  | 'billing.create'
  | 'billing.edit'
  | 'reports.view'
  | 'reports.create'
  
  // 空室管理
  | 'vacancy.view'
  | 'vacancy.edit'
  
  // カレンダー・イベント
  | 'calendar.view'
  | 'calendar.create'
  | 'calendar.edit'
  
  // 緊急連絡
  | 'emergency.view'
  | 'emergency.create'
  | 'emergency.respond';

export interface UserPermissions {
  userId: string;
  permissions: Permission[];
  buildingId?: string; // 特定のビルに限定する場合
  expiresAt?: Date; // 権限の有効期限
}

// ロールのデフォルト権限
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  OWNER: [
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'bookings.view.all', 'bookings.approve', 'bookings.cancel', 'bookings.edit',
    'requests.view.all', 'requests.approve', 'requests.reject', 'requests.edit',
    'building.view', 'building.edit', 'building.rooms.manage', 'building.tenants.manage',
    'billing.view', 'billing.create', 'billing.edit',
    'reports.view', 'reports.create',
    'vacancy.view', 'vacancy.edit',
    'calendar.view', 'calendar.create', 'calendar.edit',
    'emergency.view', 'emergency.create', 'emergency.respond'
  ],
  MGMT: [
    'users.view',
    'bookings.view.all', 'bookings.approve', 'bookings.cancel',
    'requests.view.all', 'requests.approve', 'requests.reject',
    'building.view', 'building.rooms.manage', 'building.tenants.manage',
    'billing.view', 'billing.create',
    'reports.view', 'reports.create',
    'calendar.view', 'calendar.create', 'calendar.edit',
    'emergency.view', 'emergency.respond'
  ],
  TENANT: [
    'bookings.view.own', 'bookings.create',
    'requests.view.own', 'requests.create',
    'building.view',
    'calendar.view',
    'emergency.create'
  ],
  BROKER: [
    'building.view',
    'vacancy.view',
    'calendar.view'
  ]
};

export interface PermissionCheck {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;
}