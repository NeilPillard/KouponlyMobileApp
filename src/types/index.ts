export type SortMode = 'Trending' | 'A-Z' | 'Highest offer' | 'Newest' | 'Nearest';
export type DirectoryType = 'Vendor' | 'Offer' | 'Experience' | 'Course' | 'Internship' | 'Freelance' | 'Job' | 'Reward';
export type RedemptionMode = 'online' | 'inStore';
export type CampaignStatus = 'available' | 'applied' | 'selected' | 'in-progress' | 'submitted' | 'approved' | 'paid';
export type HomeMode = 'save' | 'play' | 'grow';
export type CampaignStage = CampaignStatus;

export interface Branch { id: string; name: string; latitude: number; longitude: number; distanceKm: number }
export interface Offer { id: string; partnerId: string; title: string; saving: string; value: number; mode: RedemptionMode; renewalDate: string; externalUrl?: string }
export interface Partner { id: string; name: string; place: string; category: string; rating: number; image: string; logo?: string; description: string; branch: Branch; offerIds: string[]; trend: number; newest: number }
export interface Category { slug: string; name: string; description: string; image: string; keywords: string[]; subcategories: string[] }
export interface HeroSlide { id: string; brand: string; kicker: string; title: string; copy: string; cta: string; image: string; partnerId?: string; search?: string }
export interface DirectoryItem { id: string; type: DirectoryType; title: string; subtitle: string; tag: string; image: string; description: string; action: string; offerValue: number; newest: number; trend: number; distanceKm: number; keywords: string; partnerId?: string; destination?: 'grow' | 'rewards'; externalUrl?: string }
export interface Opportunity { id: string; track: 'creator' | 'bd' | 'marketing' | 'campus'; title: string; subtitle: string; description: string; benefits: string[] }
export interface Campaign { id: string; title: string; partner: string; pay: number; due: string; image: string; status: CampaignStatus }
export interface Earning { id: string; campaign: string; amount: number; status: 'processing' | 'paid'; date: string }
export interface Challenge { id: string; title: string; detail: string; progress: number; target: number; points: number }
export interface Reward { id: string; name: string; detail: string; points: number; image: string }
export interface RedemptionRecord { offerId: string; used: number; lastUsedAt?: number; activeCodeExpiresAt?: number }
export interface SavedItem { partnerId: string; savedAt: number }
export interface AppNotification { id: string; title: string; body: string; read: boolean }
export interface UserProfile { id: string; name: string; email: string; phone: string; city: string; membership: 'Member' | 'Gold'; creatorAccepted: boolean }
export interface AccountSettings { offerAlerts: boolean; creatorUpdates: boolean; locationEnabled: boolean; reducedMotion: boolean }
export interface CityStory { id: string; title: string; note: string; image: string; search: string }
export interface DrawerDestination { id: string; label: string; detail: string; route: string }
export interface QuickSearch { id: string; label: string; query?: string; filter?: string; sort?: SortMode }
export interface OfferDetail extends Offer { partnerName: string; instructions: string[] }
export interface FaqItem { id: string; question: string; answer: string }
export interface LegalItem { id: string; title: string; note: string; body: string }
export interface Gift { id: string; offerId: string; recipient?: string; status: 'received' | 'sent' | 'accepted'; createdAt: number }
export interface Notification { id: string; title: string; body: string; read: boolean; createdAt: number }
