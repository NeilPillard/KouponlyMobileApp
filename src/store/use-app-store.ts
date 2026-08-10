import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { profile as initialProfile } from '@/data/fixtures';
import type { AccountSettings, CampaignStatus, Gift, Notification, RedemptionRecord, UserProfile } from '@/types';

type Store = {
  hydrated: boolean;
  savedPartnerIds: string[];
  redemptions: Record<string, RedemptionRecord>;
  points: number;
  appliedCampaignIds: string[];
  profile: UserProfile;
  settings: AccountSettings;
  gifts: Gift[];
  notifications: Notification[];
  feedback: string[];
  campaignStages: Record<string, CampaignStatus>;
  setHydrated: (value: boolean) => void;
  toggleSaved: (partnerId: string) => void;
  consumeOffer: (offerId: string, activeCodeExpiresAt?: number) => boolean;
  spendPoints: (amount: number) => boolean;
  toggleCampaign: (campaignId: string) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateSetting: (key: keyof AccountSettings, value: boolean) => void;
  addGift: (gift: Gift) => void;
  acceptGift: (giftId: string) => void;
  submitFeedback: (message: string) => void;
  markNotificationRead: (notificationId: string) => void;
  setCampaignStage: (campaignId: string, stage: CampaignStatus) => void;
};

export const useAppStore = create<Store>()(persist((set, get) => ({
  hydrated: false,
  savedPartnerIds: ['starbucks'],
  redemptions: {},
  points: 680,
  appliedCampaignIds: [],
  profile: initialProfile,
  settings: { offerAlerts: true, creatorUpdates: true, locationEnabled: false, reducedMotion: false },
  gifts: [],
  notifications: [],
  feedback: [],
  campaignStages: {},
  setHydrated: (hydrated) => set({ hydrated }),
  toggleSaved: (partnerId) => set((state) => ({ savedPartnerIds: state.savedPartnerIds.includes(partnerId) ? state.savedPartnerIds.filter((id) => id !== partnerId) : [...state.savedPartnerIds, partnerId] })),
  consumeOffer: (offerId, activeCodeExpiresAt) => {
    const current = get().redemptions[offerId];
    if ((current?.used ?? 0) >= 3) return false;
    set((state) => ({ redemptions: { ...state.redemptions, [offerId]: { offerId, used: (current?.used ?? 0) + 1, lastUsedAt: Date.now(), activeCodeExpiresAt } } }));
    return true;
  },
  spendPoints: (amount) => { if (get().points < amount) return false; set((state) => ({ points: state.points - amount })); return true; },
  toggleCampaign: (campaignId) => set((state) => ({ appliedCampaignIds: state.appliedCampaignIds.includes(campaignId) ? state.appliedCampaignIds.filter((id) => id !== campaignId) : [...state.appliedCampaignIds, campaignId] })),
  updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
  updateSetting: (key, value) => set((state) => ({ settings: { ...state.settings, [key]: value } })),
  addGift: (gift) => set((state) => ({ gifts: [...state.gifts, gift] })),
  acceptGift: (giftId) => set((state) => ({ gifts: state.gifts.map((gift) => gift.id === giftId ? { ...gift, status: 'accepted' } : gift) })),
  submitFeedback: (message) => set((state) => ({ feedback: [...state.feedback, message] })),
  markNotificationRead: (notificationId) => set((state) => ({ notifications: state.notifications.map((item) => item.id === notificationId ? { ...item, read: true } : item) })),
  setCampaignStage: (campaignId, stage) => set((state) => ({ campaignStages: { ...state.campaignStages, [campaignId]: stage } })),
}), {
  name: 'kouponly:v1',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: ({ savedPartnerIds, redemptions, points, appliedCampaignIds, profile, settings, gifts, notifications, feedback, campaignStages }) => ({ savedPartnerIds, redemptions, points, appliedCampaignIds, profile, settings, gifts, notifications, feedback, campaignStages }),
  onRehydrateStorage: () => (state) => state?.setHydrated(true),
}));
