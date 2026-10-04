const STORAGE_KEY = 'mw_auth_session';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const authService = {
  login: async (emailOrPhone: string): Promise<UserSession> => {
    await new Promise(resolve => setTimeout(resolve, 600)); // Mock delay
    const session: UserSession = {
      id: 'usr_demo123',
      name: 'Ahmed Khan',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'demo@mwtrends.com',
      phone: emailOrPhone.includes('@') ? '03001234567' : emailOrPhone,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  getSession: (): UserSession | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
};
