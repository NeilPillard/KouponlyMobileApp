import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock3, MapPin, Share2, TicketPercent } from 'lucide-react-native';
import { Share, StyleSheet, Text, View } from 'react-native';

import { IconButton, PrimaryButton, RemoteImage, Screen, commonStyles } from '@/components/kouponly-ui';
import { offers, partners } from '@/data/fixtures';
import { useAppStore } from '@/store/use-app-store';
import { colors, radius, shadow } from '@/theme';

export default function OfferScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = offers.find((candidate) => candidate.id === id);
  const partner = offer ? partners.find((candidate) => candidate.id === offer.partnerId) : undefined;
  const used = useAppStore((state) => state.redemptions[id ?? '']?.used ?? 0);
  if (!offer || !partner) return <Screen><Text>Offer not found.</Text></Screen>;
  const remaining = Math.max(0, 3 - used);
  return <Screen>
    <View style={styles.nav}><IconButton label="Back" onPress={() => router.back()}><ArrowLeft size={20} color={colors.ink} /></IconButton><IconButton label="Share offer" onPress={() => Share.share({ message: `${offer.title} at ${partner.name} on Kouponly — ${offer.saving}` })}><Share2 size={19} color={colors.ink} /></IconButton></View>
    <View style={styles.hero}><RemoteImage uri={partner.image} style={StyleSheet.absoluteFill} /><View style={styles.heroOverlay} /><View style={styles.heroCopy}><Text style={styles.kicker}>KOUPONLY MEMBER OFFER</Text><Text style={styles.heroTitle}>{partner.name}</Text><Text style={styles.heroMeta}><MapPin size={12} color={colors.white} /> {partner.place} · {partner.branch.distanceKm} km</Text></View></View>
    <View style={styles.offerCard}><View style={styles.ticketIcon}><TicketPercent size={24} color={colors.ink} /></View><Text style={styles.offerTitle}>{offer.title}</Text><Text style={styles.saving}>{offer.saving}</Text><Text style={styles.description}>Show this offer only after confirming that the partner can honour it. Your redemption limit and renewal date stay visible before use.</Text><View style={styles.details}><View><Text style={styles.detailLabel}>REDEMPTION</Text><Text style={styles.detailValue}>{offer.mode === 'online' ? 'Online code' : 'In-store PIN'}</Text></View><View><Text style={styles.detailLabel}>USES LEFT</Text><Text style={styles.detailValue}>{remaining}/3</Text></View><View><Text style={styles.detailLabel}>RENEWS</Text><Text style={styles.detailValue}>{offer.renewalDate}</Text></View></View><View style={styles.warning}><Clock3 size={16} color={colors.ink} /><Text style={styles.warningText}>{offer.mode === 'online' ? 'Online codes remain active for 10 minutes after confirmation.' : 'A partner staff member enters the private four-digit PIN.'}</Text></View><PrimaryButton label={remaining ? 'Continue to redemption' : 'Offer expired'} disabled={!remaining} onPress={() => router.push(`/redemption/${offer.id}`)} /></View>
    <View style={styles.about}><Text style={commonStyles.h3}>About {partner.name}</Text><Text style={[commonStyles.body, { marginTop: 8 }]}>{partner.description}</Text></View>
  </Screen>;
}

const styles = StyleSheet.create({
  nav: { marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  hero: { height: 235, overflow: 'hidden', borderRadius: radius.hero, justifyContent: 'flex-end', backgroundColor: colors.ink },
  heroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,.43)' },
  heroCopy: { zIndex: 1, padding: 20 },
  kicker: { color: colors.lime, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  heroTitle: { marginTop: 8, color: colors.white, fontFamily: 'Sora_800ExtraBold', fontSize: 26 },
  heroMeta: { marginTop: 6, color: '#DDD', fontSize: 10 },
  offerCard: { marginTop: 16, padding: 18, borderRadius: radius.xl, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadow.card },
  ticketIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lime },
  offerTitle: { marginTop: 14, color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 17, lineHeight: 23 },
  saving: { marginTop: 7, color: colors.success, fontSize: 12, fontWeight: '900' },
  description: { marginTop: 11, color: colors.muted, fontSize: 10, lineHeight: 16 },
  details: { marginTop: 17, paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: colors.line },
  detailLabel: { color: colors.muted, fontSize: 7, fontWeight: '900', letterSpacing: .8 },
  detailValue: { marginTop: 5, color: colors.ink, fontSize: 10, fontWeight: '800' },
  warning: { marginVertical: 16, padding: 11, flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 12, backgroundColor: colors.peach },
  warningText: { flex: 1, color: colors.ink, fontSize: 9, lineHeight: 14 },
  about: { marginTop: 16, padding: 18, borderRadius: radius.xl, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
});
