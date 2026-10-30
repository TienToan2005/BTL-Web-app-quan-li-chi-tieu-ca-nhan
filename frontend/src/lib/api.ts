import type {
  AdminStats, AdminUser, AdminUserDetail, Budget, Category, CategoryType, MonthlyReport,
  Session, Transaction, TransactionInput, Wallet,
} from '../types';

export const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const NETWORK_MSG = 'Không thể kết nối máy chủ. Hãy kiểm tra backend rồi thử lại.';

// Cùng khóa localStorage với bản giao diện cũ nên phiên đăng nhập dùng chung được.
export const session = {
  read(): Session | null {
    const id = localStorage.getItem('user_id');
    if (!id || !localStorage.getItem('access_token')) return null;
    return { id: Number(id), username: localStorage.getItem('username') ?? '', role: localStorage.getItem('role') ?? 'USER' };
  },
  clear: () => localStorage.clear(),
};

function messageOf(data: any, fallback: string): string {
  const m = data?.message ?? data?.detail;
  return typeof m === 'string' ? m : fallback;
}

async function refreshToken(): Promise<boolean> {
  const rt = localStorage.getItem('refresh_token');
  if (!rt) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh?refresh_token=${encodeURIComponent(rt)}`, { method: 'POST' });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const build = (): RequestInit => {
    const headers = new Headers(options.headers);
    if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    const token = localStorage.getItem('access_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return { ...options, headers };
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, build());
  } catch {
    throw new ApiError(NETWORK_MSG, 0);
  }

  if (res.status === 401 && localStorage.getItem('refresh_token')) {
    if (await refreshToken()) res = await fetch(`${BASE_URL}${endpoint}`, build());
    else window.dispatchEvent(new Event('auth:expired'));
  }

  let data: any = null;
  try { data = await res.json(); } catch { /* không có thân JSON */ }
  if (!res.ok) throw new ApiError(messageOf(data, 'Đã có lỗi xảy ra'), res.status);
  return data as T;
}

const num = (v: unknown) => Number(v) || 0;

export const api = {
  async login(username: string, password: string): Promise<Session> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).catch(() => { throw new ApiError(NETWORK_MSG, 0); });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(messageOf(data, 'Tên đăng nhập hoặc mật khẩu chưa đúng.'), res.status);
    const id = data.user_id ?? data.id;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', data.role);
    localStorage.setItem('user_id', String(id));
    return { id: Number(id), username, role: data.role };
  },

  async register(username: string, email: string, password: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    }).catch(() => { throw new ApiError(NETWORK_MSG, 0); });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(messageOf(data, 'Đăng ký chưa thành công. Kiểm tra lại thông tin rồi thử lại.'), res.status);
  },

  async wallets(userId: number): Promise<Wallet[]> {
    const list = await request<Wallet[]>(`/wallets/user/${userId}`);
    return list.map(w => ({ ...w, balance: num(w.balance) }));
  },
  createWallet: (data: { user_id: number; name: string; balance: number; icon: string; color: string }) =>
    request<Wallet>('/wallets/', { method: 'POST', body: JSON.stringify(data) }),

  categories: (userId: number) => request<Category[]>(`/categories/user/${userId}`),
  createCategory: (data: { user_id: number; name: string; type: CategoryType; icon: string; color: string }) =>
    request<Category>('/categories/', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategory: (id: number, userId: number) =>
    request<{ message: string }>(`/categories/${id}?user_id=${userId}`, { method: 'DELETE' }),

  async transactions(params: Record<string, string | number>): Promise<Transaction[]> {
    const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
    const data = await request<Transaction[] | { items: Transaction[] }>(`/transactions/search?${query}`);
    const list = Array.isArray(data) ? data : data.items ?? [];
    return list.map(t => ({ ...t, amount: num(t.amount) }));
  },
  createTransaction: (data: TransactionInput) =>
    request<{ id?: number; data?: { id: number } }>('/transactions/', { method: 'POST', body: JSON.stringify(data) }),
  deleteTransaction: (id: number, userId: number) =>
    request<unknown>(`/transactions/${id}?current_user_id=${userId}`, { method: 'DELETE' }),
  transfer: (data: { from_wallet_id: number; to_wallet_id: number; amount: number; user_id: number }) =>
    request<unknown>('/transactions/transfer', { method: 'POST', body: JSON.stringify(data) }),
  uploadReceipt(txId: number, file: File) {
    const form = new FormData();
    form.append('file', file);
    return request<unknown>(`/upload-receipt/${txId}`, { method: 'POST', body: form });
  },

  async budgets(userId: number, month: number, year: number): Promise<Budget[]> {
    const list = await request<Budget[]>(`/budgets/user/${userId}?month=${month}&year=${year}`);
    return list.map(b => ({ ...b, amount_limit: num(b.amount_limit), actual_spent: num(b.actual_spent) }));
  },
  saveBudget: (data: { user_id: number; category_id: number; amount: number; month: number; year: number }) =>
    request<{ status: string; message: string }>('/budgets/', { method: 'POST', body: JSON.stringify(data) }),

  report: (userId: number, month: number, year: number) =>
    request<MonthlyReport>(`/reports/${userId}?month=${month}&year=${year}`),
  advice: (userId: number, month: number, year: number) =>
    request<{ advice?: string }>(`/reports/ai-advice/${userId}?month=${month}&year=${year}`),
  chat: (userId: number, message: string) =>
    request<{ answer?: string }>('/ai/chat', { method: 'POST', body: JSON.stringify({ user_id: userId, message }) }),
  exportUrl: (format: 'excel' | 'pdf', userId: number) => `${BASE_URL}/reports/export?format=${format}&user_id=${userId}`,

  adminStats: async () => (await request<{ data: AdminStats }>('/api/admin/stats')).data,
  adminUsers: async () => (await request<{ data: AdminUser[] }>('/api/admin/users')).data,
  adminUser: async (id: number) => (await request<{ data: AdminUserDetail }>(`/api/admin/users/${id}/details`)).data,
  toggleBan: (id: number) => request<{ message: string }>(`/api/admin/users/${id}/toggle-ban`, { method: 'PUT' }),
};
