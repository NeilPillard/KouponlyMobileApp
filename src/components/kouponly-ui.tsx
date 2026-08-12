import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronRight, Heart, ImageOff, MapPin, Star } from 'lucide-react-native';
import { useState } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle, type ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Partner } from '@/types';
import { colors, radius, shadow, spacing } from '@/theme';
import { useAppStore } from '@/store/use-app-store';

export function Screen({ children, scroll = true, style }: PropsWithChildren<{ scroll?: boolean; style?: StyleProp<ViewStyle> }>) {
  const content = <View style={[styles.screenContent, style]}>{children}</View>;
  return <SafeAreaView edges={['top']} style={styles.safe}>{scroll ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}</SafeAreaView>;
}

export function Eyebrow({ children, lime = false }: PropsWithChildren<{ lime?: boolean }>) {
  return <Text style={[styles.eyebrow, lime && { color: colors.lime }]}>{children}</Text>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <View style={styles.sectionTitle}><View>{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<Text style={styles.h2}>{title}</Text></View>{action}</View>;
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></Pressable>;
}

export function PrimaryButton({ label, onPress, disabled, light = false }: { label: string; onPress?: () => void; disabled?: boolean; light?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primary, light && styles.primaryLight, disabled && styles.disabled, pressed && styles.pressed]}><Text style={[styles.primaryText, light && { color: colors.ink }]}>{label}</Text><ChevronRight size={17} color={light ? colors.ink : colors.lime} /></Pressable>;
}

export function IconButton({ children, onPress, label, dark = false }: PropsWithChildren<{ onPress?: () => void; label: string; dark?: boolean }>) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, dark && styles.iconButtonDark, pressed && styles.pressed]}>{children}</Pressable>;
}

export function RemoteImage({ uri, style, contentFit = 'cover', accessibilityLabel }: { uri: string; style?: StyleProp<ImageStyle>; contentFit?: 'cover' | 'contain'; accessibilityLabel?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <View accessible accessibilityLabel={accessibilityLabel ?? 'Image unavailable'} style={[styles.imageFallback, style]}><ImageOff size={22} color={colors.muted} /></View>;
  return <Image accessibilityLabel={accessibilityLabel} source={{ uri }} style={style} contentFit={contentFit} transition={180} onError={() => setFailed(true)} />;
}

export function PartnerCard({ partner, compact = false }: { partner: Partner; compact?: boolean }) {
  const saved = useAppStore((state) => state.savedPartnerIds.includes(partner.id));
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  return <Pressable testID={`partner-card-${partner.id}`} accessibilityLabel={`Open ${partner.name}`} onPress={() => router.push(`/partner/${partner.id}`)} style={({ pressed }) => [compact ? styles.compactCard : styles.partnerCard, pressed && styles.pressed]}>
    <RemoteImage uri={partner.image} style={compact ? styles.compactImage : styles.partnerImage} />
    <View style={styles.partnerCopy}>
      <Text numberOfLines={1} style={styles.partnerName}>{partner.name}</Text>
      <View style={styles.metaRow}><MapPin size={12} color={colors.muted} /><Text style={styles.meta}>{partner.place} · {partner.branch.distanceKm} km</Text></View>
      <View style={styles.metaRow}><Star size={12} color={colors.ink} fill={colors.lime} /><Text style={styles.metaStrong}>{partner.rating}</Text><Text style={styles.offerTag}>MEMBER OFFER</Text></View>
    </View>
    <Pressable accessibilityLabel={saved ? 'Remove from saved' : 'Save partner'} hitSlop={8} onPress={(event) => { event.stopPropagation(); toggleSaved(partner.id); }} style={styles.heart}><Heart size={18} color={colors.ink} fill={saved ? colors.lime : 'transparent'} /></Pressable>
  </Pressable>;
}

export function EmptyState({ title, body, action, onAction }: { title: string; body: string; action?: string; onAction?: () => void }) {
  return <View style={styles.empty}><View style={styles.emptyMark}><Heart size={26} color={colors.ink} /></View><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyBody}>{body}</Text>{action ? <PrimaryButton label={action} onPress={onAction} /> : null}</View>;
}

export const commonStyles = StyleSheet.create({
  h1: { color: colors.ink, fontFamily: 'Sora_800ExtraBold', fontSize: 29, lineHeight: 32, letterSpacing: -1.2 },
  h2: { color: colors.ink, fontFamily: 'Sora_800ExtraBold', fontSize: 22, lineHeight: 26, letterSpacing: -0.7 },
  h3: { color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 16, lineHeight: 21 },
  body: { color: colors.text, fontSize: 14, lineHeight: 21 },
  muted: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.line, ...shadow.card },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingBottom: 120 },
  screenContent: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  eyebrow: { marginBottom: 5, color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  h2: commonStyles.h2,
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 14 },
  chip: { minHeight: 35, justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 13, backgroundColor: colors.white },
  chipActive: { borderColor: colors.ink, backgroundColor: colors.ink },
  chipText: { fontSize: 11, fontWeight: '800', color: colors.text },
  chipTextActive: { color: colors.white },
  primary: { minHeight: 48, borderRadius: radius.md, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.ink, ...shadow.lime },
  primaryLight: { backgroundColor: colors.white, shadowOpacity: 0 },
  primaryText: { color: colors.white, fontSize: 12, fontWeight: '900' },
  iconButton: { width: 42, height: 42, borderRadius: 15, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  iconButtonDark: { backgroundColor: colors.ink, borderColor: colors.ink, ...shadow.lime },
  partnerCard: { width: 270, overflow: 'hidden', backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.line, ...shadow.card },
  partnerImage: { width: '100%', height: 145, backgroundColor: colors.cream },
  compactCard: { width: '100%', minHeight: 116, padding: 10, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line },
  compactImage: { width: 96, height: 96, borderRadius: radius.md, backgroundColor: colors.cream },
  partnerCopy: { flex: 1, padding: 13, gap: 6 },
  partnerName: { color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { flexShrink: 1, color: colors.muted, fontSize: 10 },
  metaStrong: { color: colors.ink, fontSize: 10, fontWeight: '800' },
  offerTag: { marginLeft: 5, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 3, overflow: 'hidden', backgroundColor: colors.lime, color: colors.ink, fontSize: 8, fontWeight: '900' },
  heart: { position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  empty: { alignItems: 'center', paddingVertical: 58, paddingHorizontal: 24, gap: 10 },
  emptyMark: { width: 58, height: 58, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lime },
  emptyTitle: { ...commonStyles.h3, marginTop: 6 },
  emptyBody: { ...commonStyles.muted, textAlign: 'center', marginBottom: 8 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.35, shadowOpacity: 0 },
  imageFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
});
