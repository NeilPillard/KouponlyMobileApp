import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, Share2 } from 'lucide-react-native';
import { Linking, Share, StyleSheet, Text, View } from 'react-native';

import { IconButton, PrimaryButton, Screen, commonStyles } from '@/components/kouponly-ui';
import { directoryItems } from '@/data/fixtures';
import { colors, radius } from '@/theme';

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = directoryItems.find((candidate) => candidate.id === id);
  if (!item) return <Screen><Text>Listing not found.</Text></Screen>;
  return <Screen>
    <View style={styles.nav}><IconButton label="Back" onPress={() => router.back()}><ArrowLeft size={20} color={colors.ink} /></IconButton><IconButton label="Share listing" onPress={() => Share.share({ message: `${item.title} on Kouponly — ${item.tag}` })}><Share2 size={19} color={colors.ink} /></IconButton></View>
    <View style={styles.hero}><Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" /><Text style={styles.type}>{item.type}</Text></View>
    <Text style={styles.title}>{item.title}</Text><View style={styles.meta}><MapPin size={15} color={colors.muted} /><Text style={commonStyles.muted}>{item.subtitle}</Text></View>
    <View style={styles.tag}><Text style={styles.tagText}>{item.tag}</Text></View>
    <View style={styles.about}><Text style={commonStyles.h3}>Why it is worth a look</Text><Text style={[commonStyles.body, { marginTop: 9 }]}>{item.description}</Text></View>
    <PrimaryButton label={item.action} onPress={() => item.externalUrl ? Linking.openURL(item.externalUrl) : router.push('/grow')} />
    {item.externalUrl ? <View style={styles.external}><ExternalLink size={14} color={colors.muted} /><Text style={commonStyles.muted}>Opens a verified external destination</Text><ArrowRight size={14} color={colors.muted} /></View> : null}
  </Screen>;
}

const styles = StyleSheet.create({ nav:{ marginBottom:12 }, hero:{ height:260,borderRadius:radius.hero,overflow:'hidden',justifyContent:'flex-end',alignItems:'flex-start' },type:{ margin:16,paddingHorizontal:10,paddingVertical:6,borderRadius:10,overflow:'hidden',backgroundColor:colors.lime,color:colors.ink,fontSize:9,fontWeight:'900',letterSpacing:1 },title:{ marginTop:20,color:colors.ink,fontFamily:'Sora_800ExtraBold',fontSize:26,lineHeight:30 },meta:{ marginTop:8,flexDirection:'row',alignItems:'center',gap:5 },tag:{ alignSelf:'flex-start',marginTop:15,borderRadius:999,paddingHorizontal:11,paddingVertical:7,backgroundColor:colors.lime },tagText:{fontSize:10,fontWeight:'900'},about:{marginVertical:24,padding:18,borderRadius:radius.xl,backgroundColor:colors.white,borderWidth:1,borderColor:colors.line},external:{marginTop:15,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6} });
