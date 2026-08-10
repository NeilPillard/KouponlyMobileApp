import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, ChevronRight, Clock3 } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton, PrimaryButton, Screen, SectionTitle, commonStyles } from '@/components/kouponly-ui';
import { campaigns } from '@/data/fixtures';
import { useAppStore } from '@/store/use-app-store';
import type { CampaignStatus } from '@/types';
import { colors, radius } from '@/theme';

const stages: CampaignStatus[] = ['available', 'applied', 'selected', 'in-progress', 'submitted', 'approved', 'paid'];

export default function CampaignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaign = campaigns.find((item) => item.id === id);
  const storedStage = useAppStore((state) => id ? state.campaignStages[id] : undefined);
  const setStage = useAppStore((state) => state.setCampaignStage);
  if (!campaign) return <Screen><Text>Campaign not found.</Text></Screen>;
  const stage = storedStage ?? campaign.status;
  const next = stages[Math.min(stages.indexOf(stage) + 1, stages.length - 1)];
  return <Screen>
    <View style={styles.nav}><IconButton label="Back" onPress={() => router.back()}><ArrowLeft size={20} color={colors.ink} /></IconButton><Text style={styles.navTitle}>Campaign brief</Text><View style={{ width: 42 }} /></View>
    <Image source={{ uri: campaign.image }} style={styles.hero} contentFit="cover" />
    <Text style={styles.kicker}>{campaign.partner.toUpperCase()} · ₹{campaign.pay.toLocaleString('en-IN')}</Text><Text style={styles.title}>{campaign.title}</Text><Text style={commonStyles.muted}>Due {campaign.due}</Text>
    <View style={styles.statusCard}><View style={styles.statusDot}><Check size={17} color={colors.ink} /></View><View style={{ flex: 1 }}><Text style={styles.statusLabel}>CAMPAIGN STATUS</Text><Text style={styles.statusTitle}>{stage.replace('-', ' ').toUpperCase()}</Text></View><Clock3 size={19} color={colors.muted} /></View>
    <SectionTitle eyebrow="WHAT TO DO" title="Move this brief forward" /><View style={styles.steps}>{['Receive the product or visit', 'Create and submit', 'Get approval and post', 'Transfer files and get paid'].map((step, index) => <View key={step} style={styles.step}><Text style={styles.stepNumber}>{index + 1}</Text><Text style={styles.stepText}>{step}</Text><ChevronRight size={15} color={colors.muted} /></View>)}</View>
    <PrimaryButton label={stage === 'paid' ? 'Paid and complete' : stage === 'available' ? 'Apply for this campaign' : `Mark as ${next.replace('-', ' ')}`} disabled={stage === 'paid'} onPress={() => setStage(campaign.id, next)} />
    <Pressable onPress={() => router.push('/account/earnings')} style={styles.earnings}><Text style={styles.earningsText}>View Creator earnings</Text><ChevronRight size={16} color={colors.ink} /></Pressable>
  </Screen>;
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  navTitle: { fontFamily: 'Sora_700Bold', fontSize: 13 },
  hero: { width: '100%', height: 220, borderRadius: radius.hero, backgroundColor: colors.cream },
  kicker: { marginTop: 20, color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  title: { marginTop: 7, color: colors.ink, fontFamily: 'Sora_800ExtraBold', fontSize: 25, lineHeight: 29 },
  statusCard: { marginTop: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: radius.xl, backgroundColor: colors.ink },
  statusDot: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lime },
  statusLabel: { color: colors.lime, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  statusTitle: { marginTop: 4, color: colors.white, fontFamily: 'Sora_700Bold', fontSize: 12 },
  steps: { marginBottom: 18, padding: 14, borderRadius: radius.xl, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  step: { minHeight: 43, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, borderColor: colors.line },
  stepNumber: { width: 25, height: 25, paddingTop: 5, borderRadius: 13, textAlign: 'center', backgroundColor: colors.ink, color: colors.lime, fontSize: 9, fontWeight: '900' },
  stepText: { flex: 1, fontSize: 10, fontWeight: '800' },
  earnings: { minHeight: 49, marginTop: 12, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: radius.md, backgroundColor: colors.lime },
  earningsText: { fontSize: 10, fontWeight: '900' },
});
