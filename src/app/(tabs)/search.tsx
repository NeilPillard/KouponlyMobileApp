import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, EmptyState, Screen, commonStyles } from '@/components/kouponly-ui';
import { directoryItems } from '@/data/fixtures';
import { filterAndSortDirectory } from '@/domain/rules';
import { colors, radius } from '@/theme';
import type { DirectoryItem, SortMode } from '@/types';

const filters = ['All', 'Partners', 'Offers', 'Go out', 'Grow', 'Rewards'];
const sorts: SortMode[] = ['Trending', 'A-Z', 'Highest offer', 'Newest', 'Nearest'];
const quickSearches = ['Near me', 'Food', 'Partners', 'Free', 'Internships', 'Creator work'];

export default function SearchScreen() {
  const params = useLocalSearchParams<{ term?: string }>();
  const [query, setQuery] = useState(() => params.term ?? '');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState<SortMode>('Trending');
  const [locationMessage, setLocationMessage] = useState('');
  const chooseSort = async (next: SortMode) => {
    if (next === 'Nearest') {
      const permission = await Location.requestForegroundPermissionsAsync();
      setLocationMessage(permission.status === 'granted' ? 'Sorted from your current area' : 'Location denied — using fixture distances');
    }
    setSort(next);
  };

  const items = useMemo(() => filterAndSortDirectory(directoryItems, query, filter, sort), [filter, query, sort]);
  const applyQuickSearch = (item: string) => {
    if (item === 'Near me') { void chooseSort('Nearest'); return; }
    setQuery(item === 'Partners' ? '' : item === 'Creator work' ? 'creator' : item.toLowerCase());
    setFilter(item === 'Partners' ? 'Partners' : item === 'Internships' || item === 'Creator work' ? 'Grow' : 'All');
    setSort('Trending');
  };

  const open = (item: DirectoryItem) => {
    if (item.partnerId) router.push(`/partner/${item.partnerId}`);
    else if (item.destination === 'grow') router.push('/grow');
    else if (item.destination === 'rewards') router.push('/rewards');
    else router.push(`/listing/${item.id}`);
  };

  return <Screen>
    <View style={styles.hero}><Text style={styles.kicker}>KOCHI DIRECTORY</Text><Text style={styles.title}>Find your next good plan.</Text><Text style={styles.heroBody}>Offers, places, experiences and opportunities in one search.</Text></View>
    <View style={styles.searchBox}><Search size={19} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Try coffee, internship or weekend" placeholderTextColor="#929292" style={styles.input} returnKeyType="search" />{query ? <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}><X size={18} color={colors.muted} /></Pressable> : null}</View>
    {!query ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{quickSearches.map((item) => <Chip key={item} label={item} onPress={() => applyQuickSearch(item)} />)}</ScrollView> : null}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{filters.map((item) => <Chip key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />)}</ScrollView>
    <View style={styles.sortLabel}><SlidersHorizontal size={15} color={colors.ink} /><Text>Sort results</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{sorts.map((item) => <Chip key={item} label={item} active={sort === item} onPress={() => chooseSort(item)} />)}</ScrollView>
    {locationMessage ? <Text style={styles.locationMessage}>{locationMessage}</Text> : null}
    <View style={styles.resultHeader}><View><Text style={styles.resultCount}>{items.length}</Text><Text style={styles.resultLabel}>MATCHES</Text></View><Text style={commonStyles.h3}>{query ? `Results for “${query}”` : 'Trending around you'}</Text></View>
    <View style={styles.list}>{items.map((item) => <Pressable key={item.id} onPress={() => open(item)} style={({ pressed }) => [styles.item, pressed && styles.pressed]}><Image source={{ uri: item.image }} style={styles.image} contentFit="cover" /><View style={styles.copy}><View style={styles.itemTop}><Text style={styles.type}>{item.type}</Text><Text style={styles.tag}>{item.tag}</Text></View><Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text><Text numberOfLines={1} style={styles.subtitle}>{item.subtitle}</Text></View><ChevronRight size={18} color={colors.muted} /></Pressable>)}</View>
    {!items.length ? <EmptyState title="No matches yet" body="Try a broader word or clear the selected type." action="Show everything" onAction={() => { setQuery(''); setFilter('All'); }} /> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { minHeight: 156, borderRadius: radius.hero, padding: 20, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.ink }, kicker: { color: colors.lime, fontSize: 9, fontWeight: '900', letterSpacing: 1.4 }, title: { marginTop: 8, color: colors.white, fontFamily: 'Sora_800ExtraBold', fontSize: 25, lineHeight: 28 }, heroBody: { marginTop: 7, maxWidth: 285, color: '#BDBDBD', fontSize: 10, lineHeight: 15 },
  searchBox: { height: 54, marginTop: 16, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white }, input: { flex: 1, height: '100%', color: colors.ink, fontSize: 12 }, row: { gap: 7, paddingVertical: 12, paddingRight: 20 }, sortLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }, sortLabelText: { fontSize: 11, fontWeight: '800' }, locationMessage: { color: colors.muted, fontSize: 9 },
  resultHeader: { marginTop: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 11 }, resultCount: { width: 42, height: 42, paddingTop: 11, borderRadius: 21, overflow: 'hidden', textAlign: 'center', backgroundColor: colors.ink, color: colors.lime, fontSize: 12, fontWeight: '900' }, resultLabel: { display: 'none' }, list: { gap: 9 },
  item: { minHeight: 108, padding: 9, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white }, image: { width: 90, height: 90, borderRadius: radius.md, backgroundColor: colors.cream }, copy: { flex: 1 }, itemTop: { flexDirection: 'row', alignItems: 'center', gap: 5 }, type: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1 }, tag: { flexShrink: 1, paddingHorizontal: 7, paddingVertical: 3, borderRadius: radius.pill, overflow: 'hidden', backgroundColor: colors.lime, color: colors.ink, fontSize: 8, fontWeight: '900' }, itemTitle: { marginTop: 7, color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 13, lineHeight: 17 }, subtitle: { marginTop: 5, color: colors.muted, fontSize: 9 }, pressed: { opacity: .7 },
});
