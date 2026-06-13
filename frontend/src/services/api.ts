const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Get stored auth token
function getToken(): string | null {
    try {
        const userData = localStorage.getItem('employee_user');
        if (userData) {
            const parsed = JSON.parse(userData);
            return parsed.token || null;
        }
    } catch { /* ignore */ }
    return null;
}

// Generic fetch helper with auth token
async function apiFetch(endpoint: string, options?: RequestInit) {
    const token = getToken();
    const headers: Record<string, string> = {};
    
    // Auto-set Content-Type to JSON unless body is FormData
    if (!(options?.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options?.headers },
    });

    // Handle token expiry - try refresh
    if (res.status === 401) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            const newToken = getToken();
            if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
            const retryRes = await fetch(`${API_BASE}${endpoint}`, { headers, ...options });
            if (!retryRes.ok) {
                const err = await retryRes.json().catch(() => ({ message: retryRes.statusText }));
                throw new Error(err.message || 'API Error');
            }
            return retryRes.json();
        }
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'API Error');
    }
    return res.json();
}

// Token refresh
async function tryRefreshToken(): Promise<boolean> {
    try {
        const userData = localStorage.getItem('employee_user');
        if (!userData) return false;
        const parsed = JSON.parse(userData);
        if (!parsed.refreshToken) return false;
        const res = await fetch(`${API_BASE}/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: parsed.refreshToken }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        parsed.token = data.token;
        parsed.refreshToken = data.refreshToken;
        localStorage.setItem('employee_user', JSON.stringify(parsed));
        return true;
    } catch { return false; }
}

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════
export const login = (email: string, password: string) =>
    apiFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (data: { name: string; email: string; password: string; empId: string; dept: string; role?: string; designation?: string; phone?: string }) =>
    apiFetch('/register', { method: 'POST', body: JSON.stringify(data) });

export const logout = () => apiFetch('/logout', { method: 'POST' });

// ═══════════════════════════════════════
// USERS (EMPLOYEE CRUD)
// ═══════════════════════════════════════
export const getUsers = () => apiFetch('/users');
export const getUser = (id: string) => apiFetch(`/user/${id}`);
export const createUser = (data: any) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = (id: string, data: any) =>
    apiFetch(`/user/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (id: string) => apiFetch(`/user/${id}`, { method: 'DELETE' });

// ═══════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════
export const getDashboardData = (userId: string) => apiFetch(`/dashboard/${userId}`);
export const getAdminDashboard = () => apiFetch('/admin/dashboard');
export const getAdminRequests = () => apiFetch('/admin/requests');

// ═══════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════
export const getAttendance = (userId: string) => apiFetch(`/attendance/${userId}`);
export const createAttendance = (data: any) => apiFetch('/attendance', { method: 'POST', body: JSON.stringify(data) });
export const getAllAttendance = () => apiFetch('/attendance-all');

// ═══════════════════════════════════════
// LEAVES
// ═══════════════════════════════════════
export const getLeaves = (userId: string) => apiFetch(`/leaves/${userId}`);
export const applyLeave = (data: any) =>
    apiFetch('/leaves', { method: 'POST', body: JSON.stringify(data) });
export const updateLeave = (id: string, data: any) =>
    apiFetch(`/leaves/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const getLeaveBalance = (userId: string) => apiFetch(`/leave-balance/${userId}`);
export const getAllLeaves = () => apiFetch('/leaves-all');

// ═══════════════════════════════════════
// GATE PASS
// ═══════════════════════════════════════
export const getGatePasses = (userId: string) => apiFetch(`/gatepasses/${userId}`);
export const createGatePass = (data: any) =>
    apiFetch('/gatepasses', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// PAYROLL
// ═══════════════════════════════════════
export const getPayroll = (userId: string) => apiFetch(`/payroll/${userId}`);
export const getAllPayroll = () => apiFetch('/payroll-all');
export const createPayroll = (data: any) =>
    apiFetch('/payroll', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// TRAINING
// ═══════════════════════════════════════
export const getTrainings = () => apiFetch('/trainings');
export const createTraining = (data: any) => apiFetch('/trainings', { method: 'POST', body: JSON.stringify(data) });
export const enrollTraining = (id: string, userId: string) =>
    apiFetch(`/trainings/${id}/enroll`, { method: 'PUT', body: JSON.stringify({ userId }) });

// ═══════════════════════════════════════
// DOCUMENTS
// ═══════════════════════════════════════
export const getDocuments = (userId: string) => apiFetch(`/documents/${userId}`);
export const createDocument = (data: any) =>
    apiFetch('/documents', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════
export const getProjects = () => apiFetch('/projects');
export const createProject = (data: any) =>
    apiFetch('/projects', { method: 'POST', body: JSON.stringify(data) });
export const updateProject = (id: string, data: any) =>
    apiFetch(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════
export const getAnnouncements = () => apiFetch('/announcements');
export const createAnnouncement = (data: any) =>
    apiFetch('/announcements', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════
export const getNotifications = (userId: string) => apiFetch(`/notifications/${userId}`);
export const markNotificationRead = (id: string) =>
    apiFetch(`/notifications/${id}/read`, { method: 'PUT' });

// ═══════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════
export const getDepartments = () => apiFetch('/departments');
export const createDepartment = (data: any) =>
    apiFetch('/departments', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// CANTEEN
// ═══════════════════════════════════════
export const getCanteenMenu = () => apiFetch('/canteen/menu');
export const getCanteenOrders = (userId: string) => apiFetch(`/canteen/orders/${userId}`);
export const placeCanteenOrder = (data: any) =>
    apiFetch('/canteen/orders', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// GUEST HOUSE
// ═══════════════════════════════════════
export const getGuestHouseBookings = (userId: string) => apiFetch(`/guesthouse/${userId}`);
export const bookGuestHouse = (data: any) =>
    apiFetch('/guesthouse', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// TRANSPORT
// ═══════════════════════════════════════
export const getTransportRequests = (userId: string) => apiFetch(`/transport/${userId}`);
export const requestTransport = (data: any) =>
    apiFetch('/transport', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// UNIFORM
// ═══════════════════════════════════════
export const getUniformRequests = (userId: string) => apiFetch(`/uniforms/${userId}`);
export const requestUniform = (data: any) =>
    apiFetch('/uniforms', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// SIM
// ═══════════════════════════════════════
export const getSIMRequests = (userId: string) => apiFetch(`/sim/${userId}`);
export const requestSIM = (data: any) =>
    apiFetch('/sim', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// ASSETS
// ═══════════════════════════════════════
export const getAssets = (userId: string) => apiFetch(`/assets/${userId}`);
export const getAssetRequests = (userId: string) => apiFetch(`/asset-requests/${userId}`);
export const requestAsset = (data: any) =>
    apiFetch('/asset-requests', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// GENERAL REQUESTS
// ═══════════════════════════════════════
export const getGeneralRequests = (userId: string) => apiFetch(`/general-requests/${userId}`);
export const submitGeneralRequest = (data: any) =>
    apiFetch('/general-requests', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// MEETINGS
// ═══════════════════════════════════════
export const getMeetings = (userId: string) => apiFetch(`/meetings/${userId}`);

// ═══════════════════════════════════════
// POLICIES
// ═══════════════════════════════════════
export const getPolicies = () => apiFetch('/policies');

// ═══════════════════════════════════════
// IDEAS
// ═══════════════════════════════════════
export const getIdeas = () => apiFetch('/ideas');
export const submitIdea = (data: any) =>
    apiFetch('/ideas', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// ATTENDANCE MISS SLIP
// ═══════════════════════════════════════
export const getMissSlips = (userId: string) => apiFetch(`/miss-slips/${userId}`);
export const createMissSlip = (data: any) =>
    apiFetch('/miss-slips', { method: 'POST', body: JSON.stringify(data) });
export const getAllMissSlips = () => apiFetch('/miss-slips-all');

// ═══════════════════════════════════════
// TRAVEL
// ═══════════════════════════════════════
export const getTravelRequests = (userId: string) => apiFetch(`/travel/${userId}`);
export const createTravelRequest = (data: any) =>
    apiFetch('/travel', { method: 'POST', body: JSON.stringify(data) });
export const updateTravelRequest = (id: string, data: any) =>
    apiFetch(`/travel/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// MRF
// ═══════════════════════════════════════
export const getMRFs = () => apiFetch('/mrf');
export const createMRF = (data: any) =>
    apiFetch('/mrf', { method: 'POST', body: JSON.stringify(data) });
export const updateMRF = (id: string, data: any) =>
    apiFetch(`/mrf/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// INTERVIEWS
// ═══════════════════════════════════════
export const getInterviews = () => apiFetch('/interviews');
export const createInterview = (data: any) =>
    apiFetch('/interviews', { method: 'POST', body: JSON.stringify(data) });
export const updateInterview = (id: string, data: any) =>
    apiFetch(`/interviews/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// JOB DESCRIPTIONS
// ═══════════════════════════════════════
export const getJobDescriptions = () => apiFetch('/job-descriptions');
export const createJobDescription = (data: any) =>
    apiFetch('/job-descriptions', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// KEY REPRESENTATIVES
// ═══════════════════════════════════════
export const getKeyReps = () => apiFetch('/key-reps');
export const createKeyRep = (data: any) =>
    apiFetch('/key-reps', { method: 'POST', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// WELFARE
// ═══════════════════════════════════════
export const getWelfarePrograms = () => apiFetch('/welfare');
export const createWelfareProgram = (data: any) =>
    apiFetch('/welfare', { method: 'POST', body: JSON.stringify(data) });
export const enrollWelfare = (id: string, userId: string) =>
    apiFetch(`/welfare/${id}/enroll`, { method: 'PUT', body: JSON.stringify({ userId }) });

// ═══════════════════════════════════════
// RESIGNATIONS
// ═══════════════════════════════════════
export const getResignations = (userId: string) => apiFetch(`/resignations/${userId}`);
export const submitResignation = (data: any) =>
    apiFetch('/resignations', { method: 'POST', body: JSON.stringify(data) });
export const updateResignation = (id: string, data: any) =>
    apiFetch(`/resignations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const getAllResignations = () => apiFetch('/resignations-all');

// ═══════════════════════════════════════
// REQUESTS (LEGACY/DASHBOARD)
// ═══════════════════════════════════════
export const getRequests = (userId: string) => apiFetch(`/requests/${userId}`);
export const getAllRequests = () => apiFetch('/requests-all');
export const updateRequest = (id: string, data: any) =>
    apiFetch(`/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// ═══════════════════════════════════════
// PDF DOWNLOADS
// ═══════════════════════════════════════
export const downloadPDF = (type: string, id: string) => {
    window.open(`${API_BASE}/pdf/${type}/${id}`, '_blank');
};
export const downloadLetter = (userId: string, letterType: 'experience' | 'offer') => {
    window.open(`${API_BASE}/pdf/letter/${userId}/${letterType}`, '_blank');
};

// ═══════════════════════════════════════
// DEPARTMENT DATA STORE (replaces localStorage)
// ═══════════════════════════════════════
export const getDeptStore = (key: string) =>
  apiFetch(`/dept-store/${encodeURIComponent(key)}`);

export const setDeptStore = (
  key: string,
  items: any[],
  department?: string
) =>
  apiFetch(`/dept-store/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify({ items, department }),
  });

// Alias for compatibility
export const saveDeptStore = setDeptStore;

export const clearDeptStore = (key: string) =>
  apiFetch(`/dept-store/${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
// ═══════════════════════════════════════
// CROSS-PORTAL STATS
// ═══════════════════════════════════════
export const getCrossPortalStats = () => apiFetch('/cross-portal/stats');

// ═══════════════════════════════════════
// LEAVE / GATEPASS APPROVAL ACTIONS
// ═══════════════════════════════════════
export const applyLeaveWithNotification = (data: any) =>
    apiFetch('/leaves/apply', { method: 'POST', body: JSON.stringify(data) });
export const approveLeave = (id: string) =>
    apiFetch(`/leaves/${id}/approve`, { method: 'PUT' });
export const rejectLeave = (id: string, reason: string) =>
    apiFetch(`/leaves/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) });
export const applyGatePassWithNotification = (data: any) =>
    apiFetch('/gatepasses/apply', { method: 'POST', body: JSON.stringify(data) });
export const approveGatePass = (id: string) =>
    apiFetch(`/gatepasses/${id}/approve`, { method: 'PUT' });
export const rejectGatePass = (id: string, reason: string) =>
    apiFetch(`/gatepasses/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) });
export const cancelGatePass = (id: string) =>
    apiFetch(`/gatepasses/${id}/cancel`, { method: 'PUT' });
export const getGatePassStats = (userId: string) =>
    apiFetch(`/gatepasses/${userId}/stats`);
export const approveRequest = (id: string) =>
    apiFetch(`/requests/${id}/approve`, { method: 'PUT' });
export const rejectRequest = (id: string, reason: string) =>
    apiFetch(`/requests/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) });

// ═══════════════════════════════════════
// SYSTEM HEALTH
// ═══════════════════════════════════════
export const getSystemHealth = () => apiFetch('/system/health');

// ═══════════════════════════════════════
// EMPLOYEE ONBOARDING & PASSWORD
// ═══════════════════════════════════════
export const createEmployee = (data: any) =>
    apiFetch('/users/create-employee', { method: 'POST', body: JSON.stringify(data) });
export const changePassword = (userId: string, data: { currentPassword?: string; newPassword: string }) =>
    apiFetch(`/users/${userId}/change-password`, { method: 'PUT', body: JSON.stringify(data) });
export const parseResume = (formData: FormData) =>
    apiFetch('/resume/parse', { method: 'POST', body: formData });

// ═══════════════════════════════════════
// GLOBAL NOTIFICATIONS
// ═══════════════════════════════════════
export const triggerGlobalNotification = (module: string, message: string, type: string = 'info') =>
    apiFetch('/notifications/global', { method: 'POST', body: JSON.stringify({ module, message, type }) });
