import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Copy, Info, Store, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { offers, partners } from '@/data/fixtures';
import { isCodeActive, redemptionCode } from '@/domain/rules';
import { useAppStore } from '@/store/use-app-store';
import { colors, radius, shadow } from '@/theme';

type Step = 'warning' | 'pin' | 'code' | 'success';

export default function RedemptionScreen() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const offer = offers.find((item) => item.id === offerId);
  const partner = partners.find((item) => item.id === offer?.partnerId);
  const consumeOffer = useAppStore((state) => state.consumeOffer);
  const record = useAppStore((state) => offer ? state.redemptions[offer.id] : undefined);
  const active = isCodeActive(record?.activeCodeExpiresAt);
  const [step, setStep] = useState<Step>(active ? 'code' : offer?.mode === 'online' ? 'warning' : 'pin');
  const [pin, setPin] = useState('');
  const [expiresAt, setExpiresAt] = useState(record?.activeCodeExpiresAt ?? 0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { if (step !== 'code') return; const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, [step]);
  const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const code = useMemo(() => offer ? redemptionCode(offer.title) : '', [offer]);
  if (!offer || !partner) return null;

  const reveal = () => { const expiry = Date.now() + 600000; if (consumeOffer(offer.id, expiry)) { setExpiresAt(expiry); setNow(Date.now()); setStep('code'); } };
  const verify = () => { if (pin.length === 4 && consumeOffer(offer.id)) setStep('success'); };
  const minutes = String(Math.floor(remaining / 60)).padStart(2,'0'); const seconds = String(remaining % 60).padStart(2,'0');

  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}><View style={styles.sheet}><Pressable accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}><X size={19} color={colors.ink} /></Pressable>
    {step === 'warning' ? <><Symbol icon={<Info size={25} color={colors.ink} />} /><Text style={styles.eyebrow}>ONLINE REDEMPTION</Text><Text style={styles.title}>Use this offer now?</Text><Text style={styles.body}>Continuing uses one redemption and cannot be restored. Only proceed when you are ready to purchase.</Text><View style={styles.warning}><Text style={styles.warningTitle}>{partner.name}</Text><Text style={styles.warningBody}>{offer.title} · active for 10 minutes</Text></View><Primary label="Yes, reveal my code" onPress={reveal} /><Secondary label="Not yet" onPress={() => router.back()} /></> : null}
    {step === 'pin' ? <><Symbol icon={<Store size={25} color={colors.ink} />} /><Text style={styles.eyebrow}>IN-STORE REDEMPTION</Text><Text style={styles.title}>Hand this phone to the partner</Text><Text style={styles.body}>A staff member must enter their four-digit Kouponly PIN. Do not enter a code yourself.</Text><Text style={styles.pinLabel}>PARTNER PIN</Text><TextInput autoFocus keyboardType="number-pad" maxLength={4} value={pin} onChangeText={(value) => setPin(value.replace(/\D/g,'').slice(0,4))} placeholder="••••" style={styles.pin} secureTextEntry /><Primary label="Verify and redeem" disabled={pin.length !== 4} onPress={verify} /><Secondary label="Cancel" onPress={() => router.back()} /></> : null}
    {step === 'code' ? <><Symbol success icon={<Check size={25} color={colors.ink} />} /><Text style={styles.eyebrow}>CODE ACTIVE</Text><Text style={styles.title}>{remaining ? `Complete it in ${minutes}:${seconds}` : 'Code expired'}</Text><Text style={styles.body}>Copy the code, open the partner website and enter it during checkout before the timer ends.</Text><Pressable disabled={!remaining} onPress={() => Clipboard.setStringAsync(code)} style={styles.code}><Copy size={17} color={colors.ink} /><Text style={styles.codeLabel}>TAP TO COPY</Text><Text style={styles.codeValue}>{remaining ? code : 'CODE EXPIRED'}</Text></Pressable>{offer.externalUrl ? <Primary label="Open partner website" disabled={!remaining} onPress={() => Linking.openURL(offer.externalUrl!)} /> : null}<Secondary label="Done" onPress={() => router.back()} /></> : null}
    {step === 'success' ? <><Symbol success icon={<Check size={25} color={colors.ink} />} /><Text style={styles.eyebrow}>REDEEMED</Text><Text style={styles.title}>Partner PIN accepted</Text><Text style={styles.body}>One redemption has been used and added to your savings activity. Enjoy your visit to {partner.name}.</Text><Primary label="Done" onPress={() => router.back()} /></> : null}
  </View></KeyboardAvoidingView>;
}

function Symbol({ icon, success }: { icon: React.ReactNode; success?: boolean }) { return <View style={[styles.symbol, success && { backgroundColor: colors.lime }]}>{icon}</View>; }
function Primary({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) { return <Pressable disabled={disabled} onPress={onPress} style={[styles.primary, disabled && { opacity:.35, shadowOpacity:0 }]}><Text style={styles.primaryText}>{label}</Text></Pressable>; }
function Secondary({ label, onPress }: { label: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.secondary}><Text style={styles.secondaryText}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({ overlay:{flex:1,justifyContent:'center',padding:20,backgroundColor:'rgba(0,0,0,.55)'},sheet:{maxHeight:'92%',padding:24,borderRadius:30,backgroundColor:colors.white},close:{position:'absolute',right:17,top:17,width:37,height:37,borderRadius:13,alignItems:'center',justifyContent:'center',backgroundColor:colors.cream},symbol:{width:54,height:54,borderRadius:18,alignItems:'center',justifyContent:'center',backgroundColor:'#FFF0DA',marginBottom:18},eyebrow:{color:colors.muted,fontSize:9,fontWeight:'900',letterSpacing:1.4},title:{marginTop:7,color:colors.ink,fontFamily:'Sora_800ExtraBold',fontSize:24,lineHeight:29},body:{marginVertical:12,color:colors.muted,fontSize:12,lineHeight:19},warning:{marginBottom:18,padding:14,borderRadius:radius.lg,backgroundColor:colors.cream},warningTitle:{fontFamily:'Sora_700Bold',fontSize:12},warningBody:{marginTop:5,color:colors.muted,fontSize:10},pinLabel:{marginTop:8,color:colors.muted,fontSize:9,fontWeight:'900',letterSpacing:1.2},pin:{height:64,marginVertical:10,borderRadius:radius.lg,borderWidth:1,borderColor:colors.ink,textAlign:'center',fontFamily:'Sora_800ExtraBold',fontSize:26,letterSpacing:12,backgroundColor:colors.paper},primary:{height:49,marginTop:8,borderRadius:radius.md,alignItems:'center',justifyContent:'center',backgroundColor:colors.ink,...shadow.lime},primaryText:{color:colors.white,fontSize:11,fontWeight:'900'},secondary:{height:47,marginTop:11,borderRadius:radius.md,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line},secondaryText:{color:colors.muted,fontSize:11,fontWeight:'800'},code:{minHeight:100,marginVertical:12,borderRadius:radius.lg,borderWidth:2,borderStyle:'dashed',alignItems:'center',justifyContent:'center',backgroundColor:colors.lime},codeLabel:{marginTop:4,fontSize:8,fontWeight:'900',letterSpacing:1.2},codeValue:{marginTop:6,fontFamily:'Sora_800ExtraBold',fontSize:21,letterSpacing:1}, });
