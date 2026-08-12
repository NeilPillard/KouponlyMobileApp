import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bookmark, Heart, Info, MapPin, Navigation, Phone, Share2, Star, TicketPercent } from 'lucide-react-native';
import { Alert, Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { IconButton, Screen, commonStyles } from '@/components/kouponly-ui';
import { offers, partners } from '@/data/fixtures';
import { useAppStore } from '@/store/use-app-store';
import { colors, radius } from '@/theme';

export default function PartnerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const partner = partners.find((candidate) => candidate.id === id);
  const savedIds = useAppStore((state) => state.savedPartnerIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const redemptions = useAppStore((state) => state.redemptions);
  if (!partner) return <Screen><Text>Partner not found.</Text></Screen>;
  const partnerOffers = offers.filter((offer) => partner.offerIds.includes(offer.id));
  const saved = savedIds.includes(partner.id);
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${partner.name}, ${partner.place}, Kerala`)}`;

  return <Screen style={{ paddingHorizontal: 0, paddingTop: 0 }}>
    <View style={styles.hero}><Image source={{ uri: partner.image }} style={StyleSheet.absoluteFill} contentFit="cover" /><View style={styles.overlay} /><View style={styles.nav}><IconButton label="Back" onPress={() => router.back()}><ArrowLeft size={20} color={colors.ink} /></IconButton><View style={styles.navActions}><IconButton label={saved ? 'Remove from saved' : 'Save'} onPress={() => toggleSaved(partner.id)}><Heart size={19} color={colors.ink} fill={saved ? colors.lime : 'transparent'} /></IconButton><IconButton label="Share" onPress={() => Share.share({ message: `${partner.name} on Kouponly — ${partnerOffers[0]?.title ?? 'Member offers'}` })}><Share2 size={19} color={colors.ink} /></IconButton></View></View><Text style={styles.category}>{partner.category}</Text></View>
    <View style={styles.content}><View style={styles.heading}><View style={{ flex: 1 }}><Text style={styles.title}>{partner.name}</Text><View style={styles.meta}><MapPin size={14} color={colors.muted} /><Text style={commonStyles.muted}>{partner.place} · {partner.branch.distanceKm} km</Text></View></View><View style={styles.rating}><Star size={15} color={colors.ink} fill={colors.lime} /><Text style={styles.ratingText}>{partner.rating}</Text></View></View>
      <View style={styles.actions}><Action icon={Phone} label="Call" onPress={() => Linking.openURL('tel:+914844002400')} /><Action icon={Navigation} label="Directions" onPress={() => Linking.openURL(directions)} /><Action icon={Info} label="Info" onPress={() => Alert.alert(partner.name, partner.description)} /></View>
      <View style={styles.sectionHeading}><View><Text style={styles.eyebrow}>MEMBER PRICES</Text><Text style={commonStyles.h2}>Available offers</Text></View><Text style={styles.count}>{partnerOffers.length}</Text></View>
      <View style={styles.offerList}>{partnerOffers.map((offer, index) => { const used = redemptions[offer.id]?.used ?? 0; const remaining = 3 - used; return <View key={offer.id} testID={`partner-offer-${offer.id}`} style={styles.ticket}><View style={styles.ticketIcon}><TicketPercent size={20} color={colors.ink} /></View><Pressable accessibilityLabel={`View ${offer.title}`} onPress={() => router.push(`/offer/${offer.id}`)} style={styles.ticketCopy}><Text style={styles.offerNumber}>OFFER {String(index + 1).padStart(2,'0')}</Text><Text style={styles.offerTitle}>{offer.title}</Text><Text style={styles.saving}>{offer.saving}</Text><Text style={styles.remaining}>{remaining ? `${remaining}/3 remaining · renews ${offer.renewalDate}` : `Expired · renews ${offer.renewalDate}`}</Text></Pressable><View style={styles.ticketActions}><Pressable accessibilityLabel="Copy offer" onPress={() => Clipboard.setStringAsync(offer.title)} style={styles.bookmark}><Bookmark size={17} color={colors.ink} /></Pressable><Pressable testID={`redeem-${offer.id}`} accessibilityLabel={`Redeem ${offer.title}`} disabled={!remaining} onPress={() => router.push(`/redemption/${offer.id}`)} style={[styles.redeem, !remaining && { opacity:.35 }]}><Text style={styles.redeemText}>{remaining ? 'Redeem' : 'Expired'}</Text></Pressable></View></View>; })}</View>
      <View style={styles.about}><Text style={commonStyles.h3}>Why you’ll love it</Text><Text style={[commonStyles.body,{marginTop:8}]}>{partner.description}</Text></View>
    </View>
  </Screen>;
}

function Action({ icon: Icon, label, onPress }: { icon: typeof Phone; label: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.action}><Icon size={18} color={colors.ink} /><Text style={styles.actionText}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  hero:{height:285,justifyContent:'space-between'},overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,.14)'},nav:{paddingHorizontal:20,paddingTop:18,flexDirection:'row',justifyContent:'space-between'},navActions:{flexDirection:'row',gap:8},category:{alignSelf:'flex-start',margin:20,paddingHorizontal:10,paddingVertical:6,borderRadius:10,overflow:'hidden',backgroundColor:colors.lime,color:colors.ink,fontSize:9,fontWeight:'900'},content:{padding:20},heading:{flexDirection:'row',alignItems:'flex-start',gap:10},title:{color:colors.ink,fontFamily:'Sora_800ExtraBold',fontSize:27,lineHeight:31},meta:{marginTop:7,flexDirection:'row',alignItems:'center',gap:4},rating:{paddingHorizontal:10,height:34,borderRadius:12,flexDirection:'row',alignItems:'center',gap:4,backgroundColor:colors.white},ratingText:{fontWeight:'900',fontSize:11},actions:{marginVertical:21,flexDirection:'row',gap:8},action:{flex:1,height:55,borderRadius:15,alignItems:'center',justifyContent:'center',gap:4,backgroundColor:colors.white,borderWidth:1,borderColor:colors.line},actionText:{fontSize:9,fontWeight:'800'},sectionHeading:{marginTop:5,marginBottom:13,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'},eyebrow:{marginBottom:5,color:colors.muted,fontSize:9,fontWeight:'900',letterSpacing:1.2},count:{width:30,height:30,paddingTop:7,borderRadius:15,overflow:'hidden',textAlign:'center',backgroundColor:colors.lime,fontSize:10,fontWeight:'900'},offerList:{gap:10},ticket:{minHeight:145,padding:14,borderRadius:radius.xl,flexDirection:'row',alignItems:'flex-start',gap:10,backgroundColor:colors.white,borderWidth:1,borderColor:colors.line},ticketIcon:{width:40,height:40,borderRadius:13,alignItems:'center',justifyContent:'center',backgroundColor:colors.lime},ticketCopy:{flex:1},offerNumber:{color:colors.muted,fontSize:8,fontWeight:'900',letterSpacing:1},offerTitle:{marginTop:5,color:colors.ink,fontFamily:'Sora_700Bold',fontSize:12,lineHeight:17},saving:{marginTop:5,color:colors.success,fontSize:10,fontWeight:'900'},remaining:{marginTop:5,color:colors.muted,fontSize:8},ticketActions:{alignItems:'center',gap:10},bookmark:{width:34,height:34,borderRadius:11,alignItems:'center',justifyContent:'center',backgroundColor:colors.cream},redeem:{minWidth:68,height:38,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:colors.ink},redeemText:{color:colors.white,fontSize:9,fontWeight:'900'},about:{marginTop:24,padding:18,borderRadius:radius.xl,backgroundColor:colors.white,borderWidth:1,borderColor:colors.line},
});
