import { directoryItems } from '@/data/fixtures';
import { canSpendPoints, filterAndSortDirectory, isCodeActive, redemptionCode, remainingUses } from '@/domain/rules';

describe('directory rules', () => {
  it('searches across content types and keeps the selected filter', () => {
    const results = filterAndSortDirectory(directoryItems, 'creator', 'Freelance', 'Trending');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.type === 'Freelance')).toBe(true);
  });

  it('supports website-aligned grouped filters', () => {
    expect(filterAndSortDirectory(directoryItems, '', 'Partners', 'Trending').every((item) => item.type === 'Vendor')).toBe(true);
    expect(filterAndSortDirectory(directoryItems, '', 'Grow', 'Trending').every((item) => ['Course', 'Internship', 'Freelance', 'Job'].includes(item.type))).toBe(true);
    expect(filterAndSortDirectory(directoryItems, '', 'Rewards', 'Trending').every((item) => item.type === 'Reward')).toBe(true);
  });

  it('returns an empty result for a scoped query with no matches', () => {
    expect(filterAndSortDirectory(directoryItems, 'not-a-real-kouponly-result', 'All', 'Trending')).toEqual([]);
  });

  it.each([
    ['A-Z', (items: typeof directoryItems) => items[0].title.localeCompare(items.at(-1)!.title) <= 0],
    ['Highest offer', (items: typeof directoryItems) => items[0].offerValue >= items.at(-1)!.offerValue],
    ['Newest', (items: typeof directoryItems) => items[0].newest >= items.at(-1)!.newest],
    ['Nearest', (items: typeof directoryItems) => items[0].distanceKm <= items.at(-1)!.distanceKm],
    ['Trending', (items: typeof directoryItems) => items[0].trend >= items.at(-1)!.trend],
  ] as const)('sorts by %s', (sort, assertion) => {
    expect(assertion(filterAndSortDirectory(directoryItems, '', 'All', sort))).toBe(true);
  });
});

describe('redemption and reward rules', () => {
  it('limits recurring offers to three uses', () => {
    expect(remainingUses(0)).toBe(3);
    expect(remainingUses(2)).toBe(1);
    expect(remainingUses(3)).toBe(0);
    expect(remainingUses(99)).toBe(0);
  });

  it('rehydrates active codes from an absolute expiry', () => {
    expect(isCodeActive(11_000, 10_000)).toBe(true);
    expect(isCodeActive(9_999, 10_000)).toBe(false);
  });

  it('creates stable redemption codes', () => {
    expect(redemptionCode('Second drink free')).toMatch(/^KPL-SEC-\d{4}$/);
    expect(redemptionCode('Second drink free')).toBe(redemptionCode('Second drink free'));
  });

  it('requires a sufficient points balance', () => {
    expect(canSpendPoints(680, 650)).toBe(true);
    expect(canSpendPoints(199, 200)).toBe(false);
  });
});
