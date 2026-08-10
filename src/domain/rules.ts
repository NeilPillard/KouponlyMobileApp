import type { DirectoryItem, SortMode } from '@/types';

export function filterAndSortDirectory(items: DirectoryItem[], query: string, filter: string, sort: SortMode) {
  const normalized = query.trim().toLowerCase();
  const matchesFilter = (type: DirectoryItem['type']) => filter === 'All' ||
    (filter === 'Partners' && type === 'Vendor') ||
    (filter === 'Offers' && type === 'Offer') ||
    (filter === 'Go out' && type === 'Experience') ||
    (filter === 'Grow' && ['Course', 'Internship', 'Freelance', 'Job'].includes(type)) ||
    (filter === 'Rewards' && type === 'Reward') ||
    type === filter;
  const filtered = items.filter((item) =>
    matchesFilter(item.type) &&
    (!normalized || `${item.title} ${item.subtitle} ${item.tag} ${item.keywords}`.toLowerCase().includes(normalized)),
  );
  return [...filtered].sort((a, b) =>
    sort === 'A-Z' ? a.title.localeCompare(b.title) :
    sort === 'Highest offer' ? b.offerValue - a.offerValue :
    sort === 'Newest' ? b.newest - a.newest :
    sort === 'Nearest' ? a.distanceKm - b.distanceKm : b.trend - a.trend,
  );
}

export const remainingUses = (used = 0) => Math.max(0, 3 - used);
export const isCodeActive = (expiresAt: number | undefined, now = Date.now()) => Boolean(expiresAt && expiresAt > now);
export const redemptionCode = (title: string) => `KPL-${title.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase()}-${String(title.length * 137).slice(-4).padStart(4, '0')}`;
export const canSpendPoints = (balance: number, cost: number) => cost > 0 && balance >= cost;
