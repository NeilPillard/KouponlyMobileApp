import { Image } from 'expo-image';
import { router } from 'expo-router';
import { BadgePercent, Bell, BriefcaseBusiness, ChevronRight, Gift, Heart, History, MapPin, Menu, MessageCircle, Search, Settings, Sparkles, TicketPercent, Trophy, UserRound, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { IconButton, PartnerCard, Screen, SectionTitle, commonStyles } from '@/components/kouponly-ui';
import { categories, heroSlides, partners } from '@/data/fixtures';
import { useAppStore } from '@/store/use-app-store';
import { colors, radius, shadow } from '@/theme';

const modes = [
  { id: 'save', title: 'Save', detail: 'Deals & offers', color: colors.peach, icon: BadgePercent },
  { id: 'play', title: 'Go out', detail: 'Book & explore', color: colors.blue, icon: MapPin },
  { id: 'grow', title: 'Grow', detail: 'Learn & earn', color: '#E8EFD9', icon: BriefcaseBusiness },
] as const;

const cityStories = [
  { title: 'Bolgatty pool day', note: 'Pool and lunch from ₹1,499', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=88', search: 'pool' },
  { title: 'Kumbalangi sunset', note: 'A slow backwater evening', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=88', search: 'Kumbalangi' },
  { title: 'Pottery in Mattancherry', note: 'Make something worth keeping', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=88', search: 'pottery' },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const heroWidth = width - 40;
  const heroRef = useRef<ScrollView>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [homeMode, setHomeMode] = useState<(typeof modes)[number]['id']>('save');
  const [pathsOpen, setPathsOpen] = useState(false);
  const savedCount = useAppStore((state) => state.savedPartnerIds.length);
  const points = useAppStore((state) => state.points);
  const profile = useAppStore((state) => state.profile);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((current) => {
      const next = (current + 1) % heroSlides.length;
      heroRef.current?.scrollTo({ x: heroWidth * next, animated: true });
      return next;
    }), 5000);
    return () => clearInterval(timer);
  }, [heroWidth]);

  const openHero = (index: number) => {
    const slide = heroSlides[index];
    if (slide.partnerId) router.push(`/partner/${slide.partnerId}`);
    else router.push(`/(tabs)/search?term=${encodeURIComponent(slide.search ?? '')}`);
  };

  return <>
    <Screen>
      <View style={styles.header}>
        <IconButton label="Open menu" dark onPress={() => setDrawerOpen(true)}><Menu size={20} color={colors.lime} /></IconButton>
        <View style={styles.headerCopy}><Text style={styles.location}><MapPin size={12} color={colors.muted} /> KOCHI</Text><Text style={commonStyles.h2}>Good morning, Neil</Text></View>
        <IconButton label="Notifications" onPress={() => router.push('/account/notifications')}><Bell size={20} color={colors.ink} /><View style={styles.dot} /></IconButton>
      </View>

      <Pressable onPress={() => router.push('/(tabs)/search')} style={styles.searchEntry}><Search size={19} color={colors.muted} /><Text style={styles.searchText}>Search offers, places and opportunities</Text><View style={styles.filterBadge}><Sparkles size={14} color={colors.ink} /></View></Pressable>

      <View style={styles.modePicker}><Text style={styles.modePickerLabel}>TODAY I WANT TO…</Text><View style={styles.modeGrid}>{modes.map(({ id, title, detail, color, icon: Icon }) => { const active = homeMode === id; return <Pressable key={id} onPress={() => { setHomeMode(id); setPathsOpen(false); }} style={({ pressed }) => [styles.modeCard, { backgroundColor: active ? colors.ink : color }, pressed && styles.pressed]}><Icon size={20} color={active ? colors.lime : colors.ink} /><Text style={[styles.modeTitle, active && { color: colors.white }]}>{title}</Text><Text style={[styles.modeDetail, active && { color: '#BDBDBD' }]}>{detail}</Text></Pressable>; })}</View></View>

      {homeMode === 'save' ? <>
        <ScrollView ref={heroRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(event) => setHeroIndex(Math.round(event.nativeEvent.contentOffset.x / heroWidth))}>{heroSlides.map((item) => <Pressable key={item.id} onPress={() => openHero(heroSlides.indexOf(item))} style={[styles.hero, { width: heroWidth }]}><View style={styles.heroCopy}><Text style={styles.heroKicker}>{item.kicker}</Text><Text style={styles.heroTitle}>{item.title}</Text><Text style={styles.heroBody}>{item.copy}</Text><View style={styles.heroCta}><Text style={styles.heroCtaText}>{item.cta}</Text><ChevronRight size={15} color={colors.ink} /></View></View><Image source={{ uri: item.image }} style={styles.heroImage} contentFit="cover" /><View style={styles.heroOrb} /></Pressable>)}</ScrollView>
        <View style={styles.pagination}>{heroSlides.map((slide, index) => <Pressable key={slide.id} accessibilityLabel={`Show hero ${index + 1}`} onPress={() => { setHeroIndex(index); heroRef.current?.scrollTo({ x: heroWidth * index, animated: true }); }} style={[styles.pageDot, index === heroIndex && styles.pageDotActive]} />)}</View>
      </> : homeMode === 'play' ? <Pressable onPress={() => router.push('/(tabs)/search?term=experience')} style={styles.modeHero}><View style={{ flex: 1 }}><Text style={styles.heroKicker}>WEEKEND MODE</Text><Text style={styles.modeHeroTitle}>Your next story starts outside.</Text><Text style={styles.modeHeroBody}>Book something fun in under a minute.</Text><View style={styles.heroCta}><Text style={styles.heroCtaText}>Find an experience</Text><ChevronRight size={15} color={colors.ink} /></View></View><Image source={{ uri: cityStories[0].image }} style={styles.modeHeroImage} contentFit="cover" /></Pressable> : <View style={styles.growModeHero}><Text style={styles.heroKicker}>WORK WITH KOUPONLY</Text><Text style={styles.modeHeroTitle}>Build your career. Get paid doing it.</Text><Text style={styles.modeHeroBody}>Creator campaigns, paid internships and campus roles made for students.</Text><Pressable onPress={() => setPathsOpen((value) => !value)} style={styles.growModeButton}><Text style={styles.growModeButtonText}>{pathsOpen ? 'Close opportunities' : 'View opportunities'}</Text><ChevronRight size={15} color={colors.ink} /></Pressable>{pathsOpen ? <View style={styles.pathList}>{['UGC Creator','BD & Sales','Marketing','Campus Ambassador'].map((path) => <Pressable key={path} onPress={() => router.push(`/grow?track=${path === 'UGC Creator' ? 'creator' : path === 'BD & Sales' ? 'bd' : path === 'Marketing' ? 'marketing' : 'campus'}`)} style={styles.pathItem}><Text style={styles.pathText}>{path}</Text><ChevronRight size={15} color={colors.lime} /></Pressable>)}</View> : null}</View>}
      <View style={styles.section}><SectionTitle eyebrow={homeMode === 'save' ? 'SAVE YOUR WAY' : homeMode === 'play' ? 'MAKE A PLAN' : 'KEEP GROWING'} title={homeMode === 'save' ? 'Browse categories' : homeMode === 'play' ? 'Find something to do' : 'Paths worth exploring'} /></View>
      <View style={styles.categoryGrid}>{categories.map((category) => <Pressable key={category.slug} onPress={() => router.push(`/category/${category.slug}`)} style={({ pressed }) => [styles.category, pressed && styles.pressed]}><Image source={{ uri: category.image }} style={styles.categoryImage} contentFit="cover" /><Text style={styles.categoryLabel}>{category.name}</Text></Pressable>)}</View>

      <View style={styles.section}><SectionTitle eyebrow="STUDENT EXCLUSIVE" title="Popular this week" action={<Pressable onPress={() => router.push('/(tabs)/search')}><Text style={styles.seeAll}>See all</Text></Pressable>} /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>{partners.slice(0, 5).map((partner) => <PartnerCard key={partner.id} partner={partner} />)}</ScrollView>

      <View style={styles.section}><SectionTitle eyebrow="KOCHI STORIES" title="Make a day of it" /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>{cityStories.map((story) => <Pressable key={story.title} onPress={() => router.push(`/(tabs)/search?term=${encodeURIComponent(story.search)}`)} style={styles.storyCard}><Image source={{ uri: story.image }} style={styles.storyImage} contentFit="cover" /><Text style={styles.storyTitle}>{story.title}</Text><Text style={styles.storyNote}>{story.note}</Text></Pressable>)}</ScrollView>

      <View style={styles.section}><SectionTitle eyebrow="QUICK VALUE" title="Meals under ₹100" /></View>
      <View style={styles.underCard}><View><Text style={styles.underKicker}>NEAR YOUR CAMPUS</Text><Text style={styles.underTitle}>Good food. Tiny bill.</Text><Text style={styles.underBody}>Discover quick Kerala meals and snack stops from ₹69.</Text><Pressable onPress={() => router.push('/(tabs)/search?term=food')} style={styles.underButton}><Text style={styles.underButtonText}>Find a meal</Text><ChevronRight size={15} color={colors.lime} /></Pressable></View><TicketPercent size={70} color={colors.lime} strokeWidth={1.5} /></View>

      <Pressable onPress={() => router.push('/grow')} style={styles.growCard}><View style={styles.growIcon}><BriefcaseBusiness size={23} color={colors.lime} /></View><View style={{ flex: 1 }}><Text style={styles.growKicker}>WORK WITH KOUPONLY</Text><Text style={styles.growTitle}>Build something useful with us</Text><Text style={styles.growBody}>Creator campaigns, internships and campus roles.</Text></View><ChevronRight size={20} color={colors.ink} /></Pressable>
    </Screen>

    <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
      <Pressable style={styles.backdrop} onPress={() => setDrawerOpen(false)}><Pressable style={styles.drawer} onPress={() => undefined}>
        <View style={styles.drawerTop}><View style={styles.avatar}><Text style={styles.avatarText}>NJ</Text></View><View style={{ flex: 1 }}><Text style={styles.drawerName}>{profile.name}</Text><Text style={styles.drawerEmail}>{profile.email}</Text></View><IconButton label="Close menu" onPress={() => setDrawerOpen(false)}><X size={19} color={colors.ink} /></IconButton></View>
        <Pressable onPress={() => { setDrawerOpen(false); router.push('/account/savings'); }} style={styles.savingsCard}><BadgePercent size={24} color={colors.ink} /><View><Text style={styles.savingsLabel}>TOTAL SAVED</Text><Text style={styles.savingsValue}>₹2,400 this month</Text></View><ChevronRight size={18} color={colors.ink} /></Pressable>
        <View style={styles.statRow}><View><Text style={styles.statValue}>{savedCount}</Text><Text style={styles.statLabel}>Saved</Text></View><View><Text style={styles.statValue}>₹12.5k</Text><Text style={styles.statLabel}>Earned</Text></View><View><Text style={styles.statValue}>{points}</Text><Text style={styles.statLabel}>Points</Text></View></View>
        <DrawerLink icon={Heart} label="Saved items" onPress={() => { setDrawerOpen(false); router.push('/account/saved'); }} />
        <DrawerLink icon={History} label="Savings activity" onPress={() => { setDrawerOpen(false); router.push('/account/savings'); }} />
        <DrawerLink icon={BriefcaseBusiness} label="Creator earnings" onPress={() => { setDrawerOpen(false); router.push('/account/earnings'); }} />
        <DrawerLink icon={Trophy} label="Challenges & rewards" onPress={() => { setDrawerOpen(false); router.push('/rewards'); }} />
        <DrawerLink icon={Gift} label="Gifts" onPress={() => { setDrawerOpen(false); router.push('/account/gifts'); }} />
        <DrawerLink icon={MessageCircle} label="Help & support" onPress={() => { setDrawerOpen(false); router.push('/account/help'); }} />
        <DrawerLink icon={Settings} label="Preferences" onPress={() => { setDrawerOpen(false); router.push('/account/settings'); }} />
        <DrawerLink icon={UserRound} label="Feedback & legal" onPress={() => { setDrawerOpen(false); router.push('/account/feedback'); }} />
        <Text style={styles.version}>Kouponly native prototype · v1.0</Text>
      </Pressable></Pressable>
    </Modal>
  </>;
}

function DrawerLink({ icon: Icon, label, onPress }: { icon: typeof Heart; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.drawerLink, pressed && styles.pressed]}><View style={styles.drawerLinkIcon}><Icon size={18} color={colors.ink} /></View><Text style={styles.drawerLinkText}>{label}</Text><ChevronRight size={18} color={colors.muted} /></Pressable>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, headerCopy: { flex: 1 },
  location: { flexDirection: 'row', color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.3, marginBottom: 3 },
  dot: { position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.lime, borderWidth: 1, borderColor: colors.ink },
  searchEntry: { height: 54, marginVertical: 20, borderRadius: 18, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, ...shadow.card },
  searchText: { flex: 1, color: colors.muted, fontSize: 12 }, filterBadge: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 238, borderRadius: radius.hero, overflow: 'hidden', backgroundColor: colors.ink }, heroCopy: { zIndex: 2, width: '68%', padding: 22 },
  heroKicker: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 6, overflow: 'hidden', borderRadius: radius.pill, backgroundColor: '#252525', color: colors.lime, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  heroTitle: { marginTop: 15, color: colors.white, fontFamily: 'Sora_800ExtraBold', fontSize: 24, lineHeight: 26, letterSpacing: -1 }, heroBody: { marginTop: 8, color: '#CACACA', fontSize: 11, lineHeight: 16 },
  heroCta: { alignSelf: 'flex-start', marginTop: 17, borderRadius: 12, paddingHorizontal: 12, height: 37, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white }, heroCtaText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  heroImage: { position: 'absolute', right: -42, bottom: -12, width: 190, height: 190, borderRadius: 95, borderWidth: 9, borderColor: '#333' }, heroOrb: { position: 'absolute', top: -42, right: 56, width: 86, height: 86, borderRadius: 43, borderWidth: 1, borderColor: '#333' },
  pagination: { height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }, pageDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#C8C8C8' }, pageDotActive: { width: 20, backgroundColor: colors.lime },
  modePicker: { marginTop: 8 }, modePickerLabel: { marginBottom: 8, color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, modeGrid: { flexDirection: 'row', gap: 8 }, modeCard: { flex: 1, minHeight: 100, borderRadius: 20, padding: 12, justifyContent: 'flex-end' }, modeTitle: { marginTop: 12, color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 13 }, modeDetail: { marginTop: 3, color: colors.muted, fontSize: 9 }, modeHero: { minHeight: 190, marginTop: 16, padding: 18, borderRadius: radius.hero, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', backgroundColor: colors.peach }, modeHeroTitle: { marginTop: 9, maxWidth: 220, color: colors.ink, fontFamily: 'Sora_800ExtraBold', fontSize: 22, lineHeight: 25 }, modeHeroBody: { marginTop: 7, maxWidth: 210, color: colors.muted, fontSize: 10, lineHeight: 15 }, modeHeroImage: { width: 125, height: 160, marginRight: -34, borderRadius: 70 }, growModeHero: { marginTop: 16, minHeight: 190, padding: 20, borderRadius: radius.hero, backgroundColor: colors.ink, ...shadow.lime }, growModeButton: { alignSelf: 'flex-start', marginTop: 16, minHeight: 38, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.lime }, growModeButtonText: { color: colors.ink, fontSize: 10, fontWeight: '900' }, pathList: { marginTop: 14, gap: 6 }, pathItem: { minHeight: 34, paddingHorizontal: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#242424' }, pathText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  section: { marginTop: 30 }, categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, category: { width: '22.7%', alignItems: 'center', gap: 7 }, categoryImage: { width: '100%', aspectRatio: 1, borderRadius: 18, backgroundColor: colors.cream }, categoryLabel: { color: colors.ink, fontSize: 9, fontWeight: '800' }, seeAll: { color: colors.ink, fontSize: 11, fontWeight: '900', textDecorationLine: 'underline' },
  horizontal: { gap: 12, paddingBottom: 8, paddingRight: 20 }, storyCard: { width: 178, paddingBottom: 12, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line }, storyImage: { width: '100%', height: 108, backgroundColor: colors.cream }, storyTitle: { marginTop: 10, paddingHorizontal: 12, color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 11 }, storyNote: { marginTop: 4, paddingHorizontal: 12, color: colors.muted, fontSize: 9 },
  underCard: { minHeight: 175, borderRadius: radius.hero, padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', backgroundColor: colors.ink, ...shadow.lime }, underKicker: { color: colors.lime, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, underTitle: { marginTop: 7, color: colors.white, fontFamily: 'Sora_700Bold', fontSize: 19 }, underBody: { maxWidth: 220, marginTop: 7, color: '#BDBDBD', fontSize: 10, lineHeight: 15 }, underButton: { alignSelf: 'flex-start', marginTop: 15, flexDirection: 'row', alignItems: 'center', gap: 4 }, underButtonText: { color: colors.white, fontSize: 10, fontWeight: '900' },
  growCard: { marginTop: 28, minHeight: 110, borderRadius: radius.xl, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line }, growIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }, growKicker: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1 }, growTitle: { marginTop: 4, color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 13 }, growBody: { marginTop: 3, color: colors.muted, fontSize: 9 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.48)', flexDirection: 'row' }, drawer: { width: '88%', height: '100%', paddingTop: 58, paddingHorizontal: 20, backgroundColor: colors.paper, borderTopRightRadius: 32, borderBottomRightRadius: 32 }, drawerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 }, avatar: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink }, avatarText: { color: colors.lime, fontSize: 18, fontWeight: '900' }, drawerName: { color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 14 }, drawerEmail: { marginTop: 3, color: colors.muted, fontSize: 9 },
  savingsCard: { minHeight: 78, marginVertical: 20, borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.lime }, savingsLabel: { color: colors.ink, fontSize: 8, fontWeight: '900', letterSpacing: 1 }, savingsValue: { marginTop: 4, color: colors.ink, fontFamily: 'Sora_700Bold', fontSize: 14 },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15, paddingBottom: 16, borderBottomWidth: 1, borderColor: colors.line }, statValue: { textAlign: 'center', color: colors.ink, fontFamily: 'Sora_800ExtraBold', fontSize: 18 }, statLabel: { marginTop: 3, color: colors.muted, fontSize: 9 },
  drawerLink: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderColor: colors.line }, drawerLinkIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, drawerLinkText: { flex: 1, color: colors.ink, fontSize: 12, fontWeight: '800' }, version: { marginTop: 'auto', marginBottom: 25, textAlign: 'center', color: colors.muted, fontSize: 9 }, pressed: { opacity: 0.72, transform: [{ scale: .985 }] },
});
