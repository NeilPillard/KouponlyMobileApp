import { Image } from 'expo-image';
import { router } from 'expo-router';
import { LocateFixed, MapPin, Navigation, Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, PartnerCard, commonStyles } from '@/components/kouponly-ui';
import { partners } from '@/data/fixtures';
import { colors, shadow } from '@/theme';

const groups = ['All', 'Food', 'Coffee', 'Beauty', 'Fun', 'Shop', 'Stays', 'Travel'];
const mapImage = 'https://raw.githubusercontent.com/NeilPillard/Kouponlyapp/main/public/kochi-map-bg.png';
const pinPositions = [
  { left: '20%', top: '33%' }, { left: '48%', top: '43%' }, { left: '70%', top: '24%' },
  { left: '82%', top: '56%' }, { left: '34%', top: '61%' }, { left: '61%', top: '68%' },
  { left: '13%', top: '73%' }, { left: '87%', top: '30%' }, { left: '52%', top: '21%' },
  { left: '75%', top: '76%' }, { left: '29%', top: '19%' }, { left: '43%', top: '79%' },
] as const;

export default function MapScreen() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');
  const [selected, setSelected] = useState(partners[0].id);
  const [centred, setCentred] = useState(false);
  const visible = useMemo(() => partners.filter((partner) => (
    group === 'All' ||
    (group === 'Food' && ['Mains', 'Snacks', 'Cuisines', 'Breakfast', 'Buffet'].includes(partner.category)) ||
    (group === 'Coffee' && partner.category === 'Drinks') ||
    (group === 'Beauty' && partner.category === 'Beauty') ||
    (group === 'Fun' && ['Entertainment', 'Things to do'].includes(partner.category)) ||
    (group === 'Shop' && partner.category === 'Shopping') ||
    (group === 'Stays' && partner.category === 'Staycations') ||
    (group === 'Travel' && partner.category === 'Travel')
  ) && (!query || `${partner.name} ${partner.place} ${partner.category}`.toLowerCase().includes(query.toLowerCase()))), [group, query]);
  const focused = visible.find((item) => item.id === selected) ?? visible[0];

  return <View style={styles.container}>
    <View style={styles.toolbar}>
      <View style={styles.search} testID="map-search"><Search size={18} color={colors.ink}/><TextInput value={query} onChangeText={(value) => { setQuery(value); if (value) setGroup('All'); }} placeholder="Find a partner or offer in Kochi" placeholderTextColor="#777" style={styles.input}/>{query ? <Pressable accessibilityLabel="Clear map search" onPress={() => setQuery('')}><X size={17} color={colors.muted}/></Pressable> : null}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{groups.map((item) => <Chip key={item} label={item} active={group === item} onPress={() => { setGroup(item); setQuery(''); }}/>)}</ScrollView>
    </View>
    <View style={styles.mapWrap}>
      <Image source={{ uri: mapImage }} style={StyleSheet.absoluteFill} contentFit="cover" transition={0}/>
      <View style={styles.mapWash}/>
      <Text style={[styles.placeLabel, { left: '23%', top: '27%' }]}>PANAMPILLY NAGAR</Text>
      <Text style={[styles.placeLabel, { left: '60%', top: '47%' }]}>VYTTILA</Text>
      <Text style={[styles.placeLabel, { left: '61%', top: '16%' }]}>KALOOR</Text>
      {visible.map((partner, index) => {
        const position = pinPositions[partners.indexOf(partner) % pinPositions.length];
        const active = partner.id === selected;
        return <Pressable key={partner.id} testID={`map-pin-${partner.id}`} accessibilityLabel={`${partner.name} map pin`} onPress={() => setSelected(partner.id)} style={[styles.pin, position, active && styles.pinActive]}><MapPin size={active ? 29 : 25} color={active ? colors.ink : '#64011A'} fill={active ? colors.lime : '#64011A'}/></Pressable>;
      })}
      <View style={[styles.userDot, centred && { left: '50%', top: '48%' }]}><View style={styles.userDotInner}/></View>
      <View style={styles.area}><MapPin size={13} color={colors.ink}/><Text style={styles.areaText}>KOCHI · LIVE AREA</Text></View>
      <Pressable testID="map-recenter" accessibilityLabel="Recenter map" onPress={() => setCentred(true)} style={styles.locate}><Navigation size={20} color={colors.lime} fill={colors.lime}/></Pressable>
    </View>
    <View style={styles.results}>
      <View style={styles.resultTitle}><View><Text style={styles.count}>{visible.length} PARTNERS NEARBY</Text><Text style={commonStyles.h3}>{group === 'All' ? 'Best around you' : group}</Text></View><Pressable onPress={() => router.push('/(tabs)/search')}><Text style={styles.directory}>Directory</Text></Pressable></View>
      {focused ? <PartnerCard partner={focused} compact/> : <View style={styles.empty}><LocateFixed size={24} color={colors.ink}/><Text style={commonStyles.h3}>No matching partners</Text><Text style={commonStyles.muted}>Try another category or search.</Text></View>}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 44, backgroundColor: colors.paper },
  toolbar: { paddingHorizontal: 14, paddingBottom: 3, backgroundColor: colors.paper },
  search: { height: 48, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadow.card },
  input: { flex: 1, height: '100%', fontFamily: 'Sora_600SemiBold', fontSize: 11 },
  chips: { gap: 6, paddingVertical: 9, paddingRight: 18 },
  mapWrap: { height: '52%', minHeight: 390, overflow: 'hidden', backgroundColor: '#E6E8DF' },
  mapWash: { position:'absolute',inset:0, backgroundColor: 'rgba(250,250,245,.12)' },
  placeLabel: { position: 'absolute', paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,.7)', color: '#666', fontSize: 6, fontWeight: '900', letterSpacing: .5 },
  pin: { position: 'absolute', width: 34, height: 34, marginLeft: -17, marginTop: -17, alignItems: 'center', justifyContent: 'center' },
  pinActive: { transform: [{ scale: 1.12 }] },
  userDot: { position: 'absolute', left: '53%', top: '57%', width: 17, height: 17, padding: 4, borderRadius: 9, backgroundColor: colors.white, shadowColor: '#2563EB', shadowOpacity: .45, shadowRadius: 8, elevation: 6 },
  userDotInner: { flex: 1, borderRadius: 5, backgroundColor: '#2563EB' },
  area: { position: 'absolute', left: 13, bottom: 13, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, height: 29, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.92)', ...shadow.card },
  areaText: { color: colors.ink, fontSize: 7, fontWeight: '900', letterSpacing: .7 },
  locate: { position: 'absolute', right: 14, bottom: 14, width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink, ...shadow.card },
  results: { flex: 1, marginTop: -18, padding: 15, paddingBottom: 94, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.paper },
  resultTitle: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 },
  count: { marginBottom: 3, color: colors.muted, fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  directory: { fontSize: 9, fontWeight: '900', textDecorationLine: 'underline' },
  empty: { alignItems: 'center', gap: 8, padding: 24 },
});
