export type Permission = 
  | 'product.read' | 'product.manage' 
  | 'order.read' | 'order.manage' 
  | 'design.read' | 'design.review' 
  | 'customer.read' | 'customer.manage'
  | 'campaign.read' | 'campaign.manage' | 'campaign.publish'
  | 'content.manage' | 'system.manage' | 'audit.read';

export type AdminRole = 'SUPER_ADMIN' | 'STORE_MANAGER' | 'PRODUCTION_MANAGER' | 'MARKETING_MANAGER' | 'SUPPORT_AGENT';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
}

export interface AuditLog {
  id: string;
  timestamp: number;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

// ---------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------
const DEMO_ADMINS: Record<AdminRole, AdminUser> = {
  SUPER_ADMIN: { id: 'adm_1', name: 'Owner', email: 'owner@mwtrends.com', role: 'SUPER_ADMIN', permissions: ['product.read', 'product.manage', 'order.read', 'order.manage', 'design.read', 'design.review', 'customer.read', 'customer.manage', 'campaign.read', 'campaign.manage', 'campaign.publish', 'content.manage', 'system.manage', 'audit.read'] },
  STORE_MANAGER: { id: 'adm_2', name: 'Store Mgr', email: 'manager@mwtrends.com', role: 'STORE_MANAGER', permissions: ['product.read', 'product.manage', 'order.read', 'order.manage', 'customer.read', 'customer.manage', 'campaign.read'] },
  PRODUCTION_MANAGER: { id: 'adm_3', name: 'Prod Lead', email: 'production@mwtrends.com', role: 'PRODUCTION_MANAGER', permissions: ['product.read', 'order.read', 'order.manage', 'design.read', 'design.review'] },
  MARKETING_MANAGER: { id: 'adm_5', name: 'Marketing Lead', email: 'marketing@mwtrends.com', role: 'MARKETING_MANAGER', permissions: ['product.read', 'campaign.read', 'campaign.manage', 'campaign.publish', 'content.manage'] },
  SUPPORT_AGENT: { id: 'adm_4', name: 'Support', email: 'support@mwtrends.com', role: 'SUPPORT_AGENT', permissions: ['order.read', 'customer.read'] }
};

const AUDIT_KEY = 'mw_admin_audit';
const CURRENT_ADMIN_KEY = 'mw_current_admin';

// Initialize default admin to SUPER_ADMIN for prototype ease
if (typeof window !== 'undefined' && !localStorage.getItem(CURRENT_ADMIN_KEY)) {
  localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(DEMO_ADMINS.SUPER_ADMIN));
}

// ---------------------------------------------------------
// SERVICE METHODS
// ---------------------------------------------------------
export const adminService = {
  getCurrentAdmin: (): AdminUser | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CURRENT_ADMIN_KEY);
    return data ? JSON.parse(data) : null;
  },

  switchAdminRole: (role: AdminRole): AdminUser => {
    const newAdmin = DEMO_ADMINS[role];
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(newAdmin));
    }
    return newAdmin;
  },

  hasPermission: (permission: Permission): boolean => {
    const admin = adminService.getCurrentAdmin();
    if (!admin) return false;
    return admin.permissions.includes(permission);
  },

  getAuditLogs: (): AuditLog[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(AUDIT_KEY);
    return data ? JSON.parse(data) : [];
  },

  logAction: (action: string, entityType: string, entityId: string, details: string) => {
    const admin = adminService.getCurrentAdmin();
    if (!admin) return; // Should not happen in secure environment

    const newLog: AuditLog = {
      id: `adt_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      actorId: admin.id,
      actorName: admin.name,
      action,
      entityType,
      entityId,
      details
    };

    const logs = adminService.getAuditLogs();
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUDIT_KEY, JSON.stringify([newLog, ...logs].slice(0, 500))); // Keep last 500
    }
  }
};
