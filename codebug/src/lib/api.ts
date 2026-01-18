// API Configuration for Frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

// Generic fetch wrapper with error handling
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// ============ AUTH API ============
export const authAPI = {
    // Unified login - tries admin first, then client, returns redirect path
    unifiedLogin: (email: string, password: string) =>
        apiFetch<{ message: string; user: { id: string; name: string; email: string; company?: string; role: string }; redirectTo: string }>(
            '/api/admin/unified-login',
            { method: 'POST', body: JSON.stringify({ email, password }) }
        ),

    // Admin login (legacy)
    login: (email: string, password: string) =>
        apiFetch<{ message: string; user: { id: string; name: string; email: string; role: string } }>(
            '/api/admin/login',
            { method: 'POST', body: JSON.stringify({ email, password }) }
        ),

    // Client login (legacy)
    clientLogin: (email: string, password: string) =>
        apiFetch<{ message: string; user: { id: string; name: string; email: string; company?: string; role: string } }>(
            '/api/admin/client-login',
            { method: 'POST', body: JSON.stringify({ email, password }) }
        ),

    // Register admin (admin only)
    registerAdmin: (name: string, email: string, password: string, role?: string) =>
        apiFetch<{ message: string; admin: any }>(
            '/api/admin/register-admin',
            { method: 'POST', body: JSON.stringify({ name, email, password, role }) }
        ),

    // Register client (admin only)
    registerClient: (data: { name: string; email: string; password: string; company?: string; phone?: string }) =>
        apiFetch<{ message: string; client: any }>(
            '/api/admin/register-client',
            { method: 'POST', body: JSON.stringify(data) }
        ),

    logout: () => apiFetch<{ message: string }>('/logout', { method: 'POST' }),

    checkAuth: () => apiFetch<{ id: string; email: string; role: string; name?: string }>('/check-cookie'),

    getProfile: () => apiFetch<any>('/api/admin/profile'),

    updateProfile: (data: any) =>
        apiFetch<any>('/api/admin/profile', { method: 'PUT', body: JSON.stringify(data) }),

    changePassword: (currentPassword: string, newPassword: string) =>
        apiFetch<{ message: string }>('/api/admin/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        }),

    getDashboardStats: () =>
        apiFetch<{
            projects: { total: number; published: number; draft: number; archived: number };
            messages: { total: number; unread: number; replied: number };
            caseStudies: { total: number; published: number; featured: number };
            reviews: { total: number; pending: number; approved: number; featured: number; averageRating: number };
            clients: { total: number; active: number; inactive: number };
            orders: { total: number; pending: number; inProgress: number; review: number; completed: number };
            tickets: { total: number; open: number; inProgress: number; resolved: number; closed: number };
        }>('/api/admin/dashboard'),

    // Admin management
    getAllAdmins: (filters?: { search?: string; role?: string }) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.role) params.append('role', filters.role);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/admin/admins${query}`);
    },
    getAdminStats: () => apiFetch<{ total: number; admins: number; editors: number; viewers: number }>('/api/admin/admins/stats'),
    deleteAdmin: (id: string) => apiFetch<{ message: string }>(`/api/admin/admins/${id}`, { method: 'DELETE' }),
};

// ============ PROJECTS API ============
export const projectsAPI = {
    getAll: (filters?: { category?: string; status?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/projects${query}`);
    },
    getPublic: () => apiFetch<any[]>('/api/projects/public'),
    getById: (id: string) => apiFetch<any>(`/api/projects/${id}`),
    create: (data: any) => apiFetch<any>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => apiFetch<any>(`/api/projects/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id: string) => apiFetch<{ message: string }>(`/api/projects/${id}`, { method: 'DELETE' }),
    getStats: () => apiFetch<any>('/api/projects/stats'),
};

// ============ MESSAGES API ============
export const messagesAPI = {
    getAll: (filters?: { status?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/messages${query}`);
    },
    getById: (id: string) => apiFetch<any>(`/api/messages/${id}`),
    create: (data: any) => apiFetch<any>('/api/messages', { method: 'POST', body: JSON.stringify(data) }),
    // Public contact form - no auth required
    sendContact: (data: { name: string; email: string; subject?: string; message: string; company?: string; phone?: string }) =>
        apiFetch<{ message: string }>('/api/messages/contact', { method: 'POST', body: JSON.stringify(data) }),
    markAsRead: (id: string) => apiFetch<any>(`/api/messages/${id}/read`, { method: 'PATCH' }),
    reply: (id: string, replyMessage: string) => apiFetch<any>(`/api/messages/${id}/reply`, { method: 'POST', body: JSON.stringify({ replyMessage }) }),
    archive: (id: string) => apiFetch<any>(`/api/messages/${id}/archive`, { method: 'PATCH' }),
    delete: (id: string) => apiFetch<{ message: string }>(`/api/messages/${id}`, { method: 'DELETE' }),
    getStats: () => apiFetch<any>('/api/messages/stats'),
};

// ============ CASE STUDIES API ============
export const caseStudiesAPI = {
    getAll: (filters?: { status?: string; featured?: boolean }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/case-studies${query}`);
    },
    getPublic: () => apiFetch<any[]>('/api/case-studies/public'),
    getById: (id: string) => apiFetch<any>(`/api/case-studies/${id}`),
    create: (data: any) => apiFetch<any>('/api/case-studies', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/case-studies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleFeatured: (id: string) => apiFetch<any>(`/api/case-studies/${id}/featured`, { method: 'PATCH' }),
    updateStatus: (id: string, status: string) => apiFetch<any>(`/api/case-studies/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id: string) => apiFetch<{ message: string }>(`/api/case-studies/${id}`, { method: 'DELETE' }),
    getStats: () => apiFetch<any>('/api/case-studies/stats'),
};

// ============ REVIEWS API ============
export const reviewsAPI = {
    getAll: (filters?: { status?: string; featured?: boolean }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/reviews${query}`);
    },
    getPublic: () => apiFetch<any[]>('/api/reviews/public'),
    getById: (id: string) => apiFetch<any>(`/api/reviews/${id}`),
    create: (data: any) => apiFetch<any>('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    approve: (id: string) => apiFetch<any>(`/api/reviews/${id}/approve`, { method: 'PATCH' }),
    reject: (id: string) => apiFetch<any>(`/api/reviews/${id}/reject`, { method: 'PATCH' }),
    toggleFeatured: (id: string) => apiFetch<any>(`/api/reviews/${id}/featured`, { method: 'PATCH' }),
    approveAll: () => apiFetch<{ message: string }>('/api/reviews/approve-all', { method: 'PATCH' }),
    delete: (id: string) => apiFetch<{ message: string }>(`/api/reviews/${id}`, { method: 'DELETE' }),
    getStats: () => apiFetch<any>('/api/reviews/stats'),
};

// ============ CLIENTS API ============
export const clientsAPI = {
    getAll: (filters?: { status?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/clients${query}`);
    },
    getById: (id: string) => apiFetch<any>(`/api/clients/${id}`),
    create: (data: any) => apiFetch<any>('/api/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deactivate: (id: string) => apiFetch<any>(`/api/clients/${id}/deactivate`, { method: 'PATCH' }),
    activate: (id: string) => apiFetch<any>(`/api/clients/${id}/activate`, { method: 'PATCH' }),
    getStats: () => apiFetch<any>('/api/clients/stats'),
    // Client self-service endpoints
    getProfile: () => apiFetch<any>('/api/clients/profile'),
    updateProfile: (data: { name?: string; company?: string; phone?: string }) =>
        apiFetch<any>('/api/clients/profile', { method: 'PUT', body: JSON.stringify(data) }),
    changePassword: (currentPassword: string, newPassword: string) =>
        apiFetch<{ message: string }>('/api/clients/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        }),
};

// ============ ORDERS API ============
export const ordersAPI = {
    getAll: (filters?: { status?: string; category?: string; priority?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/orders${query}`);
    },
    getById: (id: string) => apiFetch<any>(`/api/orders/${id}`),
    create: (data: any) => apiFetch<any>('/api/orders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => apiFetch<any>(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    updateProgress: (id: string, progress: number) => apiFetch<any>(`/api/orders/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ progress }) }),
    addMilestone: (id: string, milestone: any) => apiFetch<any>(`/api/orders/${id}/milestones`, { method: 'POST', body: JSON.stringify(milestone) }),
    updateMilestone: (orderId: string, milestoneId: string, data: any) => apiFetch<any>(`/api/orders/${orderId}/milestones/${milestoneId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<{ message: string }>(`/api/orders/${id}`, { method: 'DELETE' }),
    getStats: () => apiFetch<any>('/api/orders/stats'),
};

// ============ TICKETS API ============
export const ticketsAPI = {
    getAll: (filters?: { status?: string; priority?: string; category?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/tickets${query}`);
    },
    getById: (id: string) => apiFetch<any>(`/api/tickets/${id}`),
    create: (data: any) => apiFetch<any>('/api/tickets', { method: 'POST', body: JSON.stringify(data) }),
    addMessage: (id: string, message: string, attachments?: any[]) =>
        apiFetch<any>(`/api/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify({ message, attachments }) }),
    updateStatus: (id: string, status: string) => apiFetch<any>(`/api/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    assign: (id: string, adminId?: string) => apiFetch<any>(`/api/tickets/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ adminId }) }),
    delete: (id: string) => apiFetch<{ message: string }>(`/api/tickets/${id}`, { method: 'DELETE' }),
    getStats: () => apiFetch<any>('/api/tickets/stats'),
};

// ============ DASHBOARD API ============
export const dashboardAPI = {
    getStats: () => apiFetch<{
        totalProjects: number;
        publishedProjects: number;
        totalMessages: number;
        unreadMessages: number;
        totalCaseStudies: number;
        publishedCaseStudies: number;
        totalReviews: number;
        pendingReviews: number;
        averageRating: number;
        recentActivity: any[];
    }>('/api/admin/dashboard'),
};

// ============ ARTICLES API ============
export const articlesAPI = {
    getAll: (filters?: { status?: string; category?: string; featured?: boolean; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/articles${query}`);
    },
    getPublic: () => apiFetch<any[]>('/api/articles/public'),
    getFeatured: (limit?: number) => apiFetch<any[]>(`/api/articles/featured${limit ? `?limit=${limit}` : ''}`),
    getBySlug: (slug: string) => apiFetch<any>(`/api/articles/slug/${slug}`),
    getByCategory: (category: string) => apiFetch<any[]>(`/api/articles/category/${category}`),
    getById: (id: string) => apiFetch<any>(`/api/articles/${id}`),
    create: (data: any) => apiFetch<any>('/api/articles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => apiFetch<any>(`/api/articles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    toggleFeatured: (id: string) => apiFetch<any>(`/api/articles/${id}/featured`, { method: 'PATCH' }),
    delete: (id: string) => apiFetch<{ message: string }>(`/api/articles/${id}`, { method: 'DELETE' }),
    getStats: () => apiFetch<any>('/api/articles/stats'),
};

// ============ CAREERS API ============
export const careersAPI = {
    getAll: (filters?: { status?: string; department?: string; type?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.department) params.append('department', filters.department);
        if (filters?.type) params.append('type', filters.type);
        if (filters?.search) params.append('search', filters.search);
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiFetch<any[]>(`/api/careers${query}`);
    },
    getOpen: () => apiFetch<any[]>('/api/careers/open'),
    getByDepartment: (department: string) => apiFetch<any[]>(`/api/careers/department/${department}`),
    getById: (id: string) => apiFetch<any>(`/api/careers/${id}`),
    create: (data: any) => apiFetch<any>('/api/careers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/careers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => apiFetch<any>(`/api/careers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    toggleUrgent: (id: string) => apiFetch<any>(`/api/careers/${id}/urgent`, { method: 'PATCH' }),
    apply: (id: string) => apiFetch<{ message: string }>(`/api/careers/${id}/apply`, { method: 'POST' }),
    delete: (id: string) => apiFetch<{ message: string }>(`/api/careers/${id}`, { method: 'DELETE' }),
    getStats: () => apiFetch<any>('/api/careers/stats'),
};

export default {
    auth: authAPI,
    projects: projectsAPI,
    messages: messagesAPI,
    caseStudies: caseStudiesAPI,
    reviews: reviewsAPI,
    clients: clientsAPI,
    orders: ordersAPI,
    tickets: ticketsAPI,
    dashboard: dashboardAPI,
    articles: articlesAPI,
    careers: careersAPI,
};
