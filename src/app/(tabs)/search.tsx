import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, EmptyState, Screen } from '@/components/kouponly-ui';
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
    <View style={styles.hero}><View style={styles.heroOrb}/><Text style={styles.title}>Everything, one search.</Text><Text style={styles.heroBody}>Kerala partners, offers, experiences and opportunities.</Text><Text style={styles.heroCount}>150 THINGS TO EXPLORE</Text></View>
    <View testID="directory-search" style={styles.searchBox}><Search size={19} color={colors.ink} /><TextInput value={query} onChangeText={setQuery} placeholder="Search food, jobs, partners, experiences…" placeholderTextColor="#777" style={styles.input} returnKeyType="search" />{query ? <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}><X size={18} color={colors.muted} /></Pressable> : null}</View>
    {!query ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{quickSearches.map((item) => <Chip key={item} label={item} onPress={() => applyQuickSearch(item)} />)}</ScrollView> : null}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{filters.map((item) => <Chip key={item} label={item} active={filter === item} onPress={() => setFilter(item)} />)}</ScrollView>
    <View style={styles.sortLabel}><SlidersHorizontal size={15} color={colors.ink} /><Text>Sort results</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>{sorts.map((item) => <Chip key={item} label={item} active={sort === item} onPress={() => chooseSort(item)} />)}</ScrollView>
    {locationMessage ? <Text style={styles.locationMessage}>{locationMessage}</Text> : null}
    <View style={styles.resultHeader}><Text style={styles.resultCount}>{items.length} results</Text><Text style={styles.resultLabel}>across {filter.toLowerCase()}</Text><Text style={styles.resultBadge}>{sort}</Text></View>
    <View style={styles.list}>{items.map((item) => <Pressable key={item.id} onPress={() => open(item)} style={({ pressed }) => [styles.item, pressed && styles.pressed]}><Image source={{ uri: item.image }} style={styles.image} contentFit="cover" /><View style={styles.copy}><View style={styles.itemTop}><Text style={styles.type}>{item.type}</Text><Text style={styles.tag}>{item.tag}</Text></View><Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text><Text numberOfLines={1} style={styles.subtitle}>{item.subtitle}</Text></View><ChevronRight size={18} color={colors.muted} /></Pressable>)}</View>
    {!items.length ? <EmptyState title="No matches yet" body="Try a broader word or clear the selected type." action="Show everything" onAction={() => { setQuery(''); setFilter('All'); }} /> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { minHeight: 124, borderRadius: 24, padding: 18, overflow: 'hidden', justifyContent: 'center', backgroundColor: colors.ink }, heroOrb:{position:'absolute',width:112,height:112,right:-27,top:-31,borderRadius:56,backgroundColor:colors.lime}, title: { maxWidth:255,color: colors.white, fontFamily: 'Sora_800ExtraBold', fontSize: 25, lineHeight: 26 }, heroBody: { marginTop: 6, maxWidth: 265, color: '#AAA', fontSize: 8, lineHeight: 12 },heroCount:{alignSelf:'flex-start',marginTop:12,paddingHorizontal:9,paddingVertical:6,borderRadius:999,overflow:'hidden',backgroundColor:'rgba(197,255,61,.13)',color:colors.lime,fontSize:6,fontWeight:'900',letterSpacing:.7},
  searchBox: { height: 52, marginTop: -9,marginHorizontal:10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: 17, borderWidth: 1.5, borderColor: colors.ink, backgroundColor: colors.white,shadowColor:colors.lime,shadowOpacity:1,shadowRadius:0,shadowOffset:{width:0,height:6},elevation:3 }, input: { flex: 1, height: '100%', color: colors.ink, fontFamily:'Sora_600SemiBold',fontSize: 10 }, row: { gap: 6, paddingVertical: 10, paddingRight: 20 }, sortLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }, sortLabelText: { fontSize: 10, fontWeight: '800' }, locationMessage: { color: colors.muted, fontSize: 8 },
  resultHeader: { marginTop: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'baseline', gap: 4 }, resultCount: { color:colors.ink,fontFamily:'Sora_800ExtraBold',fontSize: 16 }, resultLabel: { flex:1,color:colors.muted,fontSize:7 },resultBadge:{paddingHorizontal:8,paddingVertical:6,borderRadius:999,overflow:'hidden',backgroundColor:'#EDEDED',color:colors.muted,fontSize:7,fontWeight:'800'}, list: { gap: 9 },
  item: { minHeight: 99, padding: 9, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white }, image: { width: 76, height: 76, borderRadius: 16, backgroundColor: colors.cream }, copy: { flex: 1 }, itemTop: { flexDirection: 'row', alignItems: 'center', gap: 5 }, type: { color: colors.muted, fontSize: 7, fontWeight: '900', letterSpacing: 1 }, tag: { flexShrink: 1, paddingHorizontal: 7, paddingVertical: 3, borderRadius: radius.pill, overflow: 'hidden', backgroundColor: '#F0F0F0', color: colors.ink, fontSize: 7, fontWeight: '900' }, itemTitle: { marginTop: 6, color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 11, lineHeight: 15 }, subtitle: { marginTop: 4, color: colors.muted, fontSize: 8 }, pressed: { opacity: .7 },
});
