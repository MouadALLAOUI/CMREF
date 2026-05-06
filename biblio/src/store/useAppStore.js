import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axios';
const useAppStore = create(
    persist(
        (set, get) => ({
            // --- Auth State ---
            user: null,
            profile: null,
            token: null,
            lastLoginTime: null,
            isAdminMode: false,
            loading: true,

            setLoading: (loading) => set({ loading }),
            setAdminMode: (value) => set({ isAdminMode: !!value }),

            login: (userData) => {
                set({
                    user: userData.user,
                    profile: userData.profile,
                    token: userData.token,
                    isAdminMode: userData.role === 'admin',
                    lastLoginTime: Date.now(),
                    loading: false
                });
            },

            logout: async () => {
                try {
                    const response = await api.post('/logout');

                    // 🔥 Look at your browser console for this!
                    console.log("--- BACKEND DEBUG INFO ---");
                    console.log(response.data.debug || response.data);
                    console.table(response.data.debug || response.data);
                    console.log("--------------------------");
                } catch (error) {
                    console.error("Logout Error:", error.response?.data);
                    if (error.response?.data?.debug) {
                        console.table(error.response.data.debug);
                    }
                } finally {
                    sessionStorage.removeItem('app-storage');
                    set({
                        user: null,
                        profile: null,
                        token: null,
                        lastLoginTime: null,
                        isAdminMode: false,
                        loading: false
                    });
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
                isAdminMode: state.isAdminMode,
                services: state.services,
                lastLoginTime: state.lastLoginTime,
            }), // only persist these fields
            onRehydrateStorage: () => (state) => {
                if (state) state.setLoading(false);
                if (state && state.lastLoginTime) {
                    const twentyFourHours = 24 * 60 * 60 * 1000;
                    // const oneHour = 60 * 60 * 1000;
                    // const onemin = 60 * 1000;
                    // const onesec = 1000;
                    const isExpired = Date.now() - state.lastLoginTime > twentyFourHours;

                    if (isExpired) {
                        console.warn("Session expired. Logging out...");
                        state.logout();
                        // Optional: force a page reload to clear any other stale memory
                        window.location.href = '/login';
                    }
                }
            },
        }
    )
);

export default useAppStore;
