import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axios';
import { normalizeSeason } from '../utils/helpers';
import seasonsService from '../api/services/seasonsService';
import logger from '../lib/logger';

const useAppStore = create(
    persist(
        (set, get) => ({
            // --- Auth State ---
            user: null,
            profile: null,
            token: null,
            school_annee: null,
            activeSeason: null,
            lastLoginTime: null,
            isAdminMode: false,
            loading: true,
            reverbTrigger: false,
            hasCheckedReverb: false,
            hasCheckedActiveSeason: false,

            setLoading: (loading) => set({ loading }),
            setAdminMode: (value) => set({ isAdminMode: !!value }),
            setActiveSeason: (season) => set({ activeSeason: normalizeSeason(season) }),

            login: (userData) => {
                const activeSeason = normalizeSeason(
                    userData.activeSeason ||
                    userData.season ||
                    userData.season_id ||
                    userData.annee ||
                    userData
                );
                set({
                    user: userData.user,
                    profile: userData.profile,
                    token: userData.token,
                    school_annee: userData.annee || activeSeason?.label || null,
                    activeSeason,
                    isAdminMode: userData.role === 'admin',
                    lastLoginTime: Date.now(),
                    reverbTrigger: userData.reverb_trigger !== undefined ? !!userData.reverb_trigger : false,
                    hasCheckedActiveSeason: !!activeSeason,
                    loading: false
                });
            },

            // --- NEW: loadActiveSeason ---
            loadActiveSeason: async () => {
                if (get().hasCheckedActiveSeason) return null;
                try {
                    // const response = await api.get('/seasons/active');
                    const response = await seasonsService.isActive();
                    logger({ "Active Season Response": response }, "info")();
                    // Handle both wrapped { data: {...} } and direct object responses
                    const season = response?.data || response;
                    const normalized = normalizeSeason(season);
                    if (normalized) {
                        set({ activeSeason: normalized });
                        return normalized;
                    }
                } catch (error) {
                    // 404 or other error — skip silently, pages show empty-state
                } finally {
                    set({ hasCheckedActiveSeason: true });
                }
                return null;
            },

            logout: async () => {
                // Clear session storage and store state synchronously first to prevent race conditions during page unloads/redirects
                sessionStorage.removeItem('app-storage');
                set({
                    user: null,
                    profile: null,
                    token: null,
                    school_annee: null, // 👈 Clear it out on logout
                    activeSeason: null,
                    lastLoginTime: null,
                    isAdminMode: false,
                    loading: false,
                    hasCheckedReverb: false,
                    hasCheckedActiveSeason: false
                });

                try {
                    await api.post('/logout');
                } catch (error) {
                    // Fail silently or handle without console prints
                }
            },

            refreshProfile: () => {
                // In a real app, this might fetch from an API
                // For now, we keep the existing logic of keeping it in sync with state/storage
                const currentProfile = get().profile;
                set({ profile: currentProfile });
            },

            updateProfile: (newData) => {
                set((state) => ({
                    profile: { ...state.profile, ...newData }
                }));
            },

            checkReverbStatus: async () => {
                if (get().hasCheckedReverb) return;
                try {
                    const response = await api.get('/reverb-status');
                    // Handle unwrapped or wrapped response format
                    const data = response?.data || response;
                    const isTriggered = !!data?.reverb_trigger;
                    set({ reverbTrigger: isTriggered });
                } catch (error) {
                    logger("Error checking reverb status:", error);
                } finally {
                    set({ hasCheckedReverb: true });
                }
            },

            // --- API Loading State ---
            apiCallCount: 0,
            isApiLoading: false,
            startApiCall: () => set((state) => {
                const next = state.apiCallCount + 1;
                return { apiCallCount: next, isApiLoading: true };
            }),
            endApiCall: () => set((state) => {
                const next = Math.max(state.apiCallCount - 1, 0);
                return { apiCallCount: next, isApiLoading: next > 0 };
            }),

            // --- Service State (Placeholder for global 'Service' state) ---
            services: [],
            selectedService: null,
            setServices: (services) => set({ services }),
            setSelectedService: (service) => set({ selectedService: service }),
            addService: (service) => set((state) => ({ services: [...state.services, service] })),
            removeService: (serviceId) => set((state) => ({
                services: state.services.filter(s => s.id !== serviceId)
            })),
        }),
        {
            name: 'app-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({
                user: state.user,
                profile: state.profile,
                token: state.token,
                school_annee: state.school_annee,
                activeSeason: state.activeSeason,
                isAdminMode: state.isAdminMode,
                services: state.services,
                lastLoginTime: state.lastLoginTime,
                reverbTrigger: state.reverbTrigger,
            }), // only persist these fields
            onRehydrateStorage: () => (state) => {
                if (state) state.setLoading(false);
                if (state && state.lastLoginTime) {
                    const twentyFourHours = 24 * 60 * 60 * 1000;
                    const isExpired = Date.now() - state.lastLoginTime > twentyFourHours;

                    if (isExpired) {
                        state.logout();
                        // Force a page reload to clear any other stale memory
                        window.location.href = '/login';
                    }
                }
            },
        }
    )
);

export default useAppStore;
