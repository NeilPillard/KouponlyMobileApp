import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Navigation, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, EmptyState, IconButton, PartnerCard, Screen, commonStyles } from '@/components/kouponly-ui';
import { categories, partners } from '@/data/fixtures';
import { colors, radius } from '@/theme';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = categories.find((item) => item.slug === slug) ?? categories[0];
  const [subcategory, setSubcategory] = useState('All');
  const [query, setQuery] = useState('');
  const [nearest, setNearest] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const matches = useMemo(() => partners.filter((partner) => {
    const haystack = `${partner.name} ${partner.category} ${partner.description}`.toLowerCase();
    const categoryMatch = category.keywords.some((term) => haystack.includes(term)) || partner.category.toLowerCase().includes(category.name.toLowerCase()) || category.slug === 'mains';
    const subMatch = subcategory === 'All' || haystack.includes(subcategory.toLowerCase().replace('burgers','burger').replace('juices','juice'));
    return categoryMatch && subMatch && (!query || haystack.includes(query.toLowerCase()));
  }), [category, query, subcategory]);
  const toggleNearest = async () => {
    if (!nearest) {
      const permission = await Location.requestForegroundPermissionsAsync();
      setLocationMessage(permission.status === 'granted' ? 'Showing closest first' : 'Location denied — using fixture distances');
    }
    setNearest((value) => !value);
  };

  return <Screen>
    <View style={styles.nav}><IconButton label="Back" onPress={() => router.back()}><ArrowLeft size={20} color={colors.ink} /></IconButton><Text style={styles.navTitle}>Category</Text><View style={{ width: 42 }} /></View>
    <View style={styles.hero}><Image source={{ uri: category.image }} style={StyleSheet.absoluteFill} contentFit="cover" /><View style={styles.overlay} /><View style={styles.heroCopy}><Text style={styles.kicker}>KOCHI PICKS</Text><Text style={styles.title}>{category.name}</Text><Text style={styles.description}>{category.description}</Text></View></View>
    <View style={styles.search}><Search size={18} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder={`Search ${category.name.toLowerCase()}`} placeholderTextColor="#888" style={styles.input} /></View>
    <Pressable onPress={toggleNearest} style={[styles.nearest, nearest && styles.nearestActive]}><Navigation size={17} color={nearest ? colors.lime : colors.ink} /><View style={{ flex: 1 }}><Text style={styles.nearestTitle}>Nearest to me</Text><Text style={styles.nearestBody}>{locationMessage || (nearest ? 'Showing closest first' : 'Use your Kochi location')}</Text></View><View style={[styles.switch, nearest && styles.switchActive]}><View style={[styles.switchThumb, nearest && styles.switchThumbActive]} /></View></Pressable>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{category.subcategories.map((item) => <Chip key={item} label={item} active={subcategory === item} onPress={() => setSubcategory(item)} />)}</ScrollView>
    <View style={styles.heading}><Text style={commonStyles.h3}>{subcategory === 'All' ? `Best ${category.name.toLowerCase()}` : subcategory}</Text><Text style={styles.count}>{nearest ? 'Closest first · ' : ''}{matches.length} partners</Text></View>
    <View style={styles.list}>{matches.map((partner) => <PartnerCard key={partner.id} partner={partner} compact />)}</View>
    {!matches.length ? <EmptyState title="Nothing here yet" body="Try another subcategory or clear the search." action="Show all" onAction={() => { setSubcategory('All'); setQuery(''); }} /> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, navTitle: { fontFamily: 'Sora_700Bold', fontSize: 13 }, hero: { height: 225, borderRadius: radius.hero, overflow: 'hidden', justifyContent: 'flex-end' }, overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,.45)' }, heroCopy: { padding: 20 }, kicker: { color: colors.lime, fontSize: 9, fontWeight: '900', letterSpacing: 1.3 }, title: { marginTop: 6, color: colors.white, fontFamily: 'Sora_800ExtraBold', fontSize: 30 }, description: { marginTop: 7, maxWidth: 300, color: '#E0E0E0', fontSize: 11, lineHeight: 16 },
  search: { height: 50, marginTop: 15, borderRadius: radius.lg, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line }, input: { flex: 1, height: '100%', fontSize: 12 }, nearest: { minHeight: 58, marginTop: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: radius.lg, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line }, nearestActive: { borderColor: colors.ink, backgroundColor: colors.ink }, nearestTitle: { color: colors.ink, fontSize: 11, fontWeight: '900' }, nearestBody: { marginTop: 3, color: colors.muted, fontSize: 9 }, switch: { width: 38, height: 22, padding: 3, borderRadius: 12, backgroundColor: colors.cream }, switchActive: { backgroundColor: '#333' }, switchThumb: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.white }, switchThumbActive: { alignSelf: 'flex-end', backgroundColor: colors.lime }, chips: { gap: 7, paddingVertical: 12, paddingRight: 20 }, heading: { marginVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, count: { color: colors.muted, fontSize: 10, fontWeight: '700' }, list: { gap: 9 },
});
