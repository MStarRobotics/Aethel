import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Step = 1 | 2 | 3 | 'done' | 'safety';

const STEP1_OPTIONS = [
  { emoji: '\u2705', label: 'Yes, we met!' },
  { emoji: '\u274C', label: "No, we didn't meet" },
  { emoji: '\u{1F4C5}', label: "We're still planning" },
];

const STEP2_OPTIONS = [
  { emoji: '\u{1F60D}', label: "Amazing — I'd love to see them again" },
  { emoji: '\u{1F60A}', label: 'Good — maybe again' },
  { emoji: '\u{1F610}', label: 'Okay — not sure' },
  { emoji: '\u{1F615}', label: 'Not great — no spark' },
  { emoji: '\u{1F6A9}', label: 'I felt unsafe', safety: true },
];

interface Props {
  matchName?: string;
  matchPhoto?: string;
  onDone: () => void;
  onReport: () => void;
  onBlock: () => void;
}

export default function PostDateFeedbackScreen({ matchName = 'Sarah', matchPhoto = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', onDone, onReport, onBlock }: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(1);
  const [step2Answer, setStep2Answer] = useState('');
  const PHOTO_SIZE = rw(20.5);

  const handleStep1 = (label: string) => {
    if (label === 'Yes, we met!') setStep(2);
    else if (label === "We're still planning") setStep('done');
    else setStep('done');
  };

  const handleStep2 = (label: string, safety?: boolean) => {
    setStep2Answer(label);
    if (safety) { setStep('safety'); return; }
    setStep(3);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <TouchableOpacity style={styles.skipBtn} onPress={onDone}>
        <Text style={styles.skipText}>\u2715 Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {step !== 'done' && step !== 'safety' && (
          <Image source={{ uri: matchPhoto }} style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
        )}

        {step === 1 && (
          <>
            <Text style={styles.tag}>HOW DID IT GO?</Text>
            <Text style={styles.headline}>Did You Meet {matchName}?</Text>
            <Text style={styles.subtitle}>"Your coffee date was Saturday, May 10"</Text>
            <View style={styles.optionList}>
              {STEP1_OPTIONS.map(opt => (
                <TouchableOpacity key={opt.label} style={styles.optionCard} onPress={() => handleStep1(opt.label)} activeOpacity={0.8}>
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.privacyNote}>Your answer is private and only used to improve your matches. {matchName} won't see it.</Text>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.emeraldTag}>GREAT, YOU MET! \u{1F389}</Text>
            <Text style={styles.headline}>How Was the Date?</Text>
            <View style={styles.optionList}>
              {STEP2_OPTIONS.map(opt => (
                <TouchableOpacity key={opt.label} style={[styles.optionCard, (opt as any).safety && styles.safetyCard]} onPress={() => handleStep2(opt.label, (opt as any).safety)} activeOpacity={0.8}>
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.optionLabel, (opt as any).safety && styles.safetyLabel]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.tag}>ONE MORE THING</Text>
            <Text style={styles.headline}>Would You See {matchName} Again?</Text>
            <View style={styles.yesNoRow}>
              <TouchableOpacity style={styles.yesCard} onPress={() => setStep('done')} activeOpacity={0.85}>
                <Text style={styles.yesCardText}>\u{1F49A} Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.noCard} onPress={() => setStep('done')} activeOpacity={0.8}>
                <Text style={styles.noCardText}>\u274C No</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.optionCard} onPress={() => setStep('done')} activeOpacity={0.8}>
              <Text style={styles.optionEmoji}>\u{1F914}</Text>
              <Text style={styles.optionLabel}>Not sure yet</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'done' && (
          <>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>\u2705</Text>
            </View>
            <Text style={styles.emeraldTag}>THANKS FOR SHARING!</Text>
            <Text style={styles.headline}>Your Feedback Helps</Text>
            <Text style={styles.subtitle}>"We'll use this to show you even better matches."</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onDone} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>\u{1F50D}  Keep Discovering</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'safety' && (
          <>
            <Text style={styles.emeraldTag}>\u{1F6E1}\uFE0F YOUR SAFETY MATTERS</Text>
            <Text style={styles.headline}>We're Here to Help</Text>
            <Text style={styles.subtitle}>"We're sorry to hear that. Your safety is our priority."</Text>
            <TouchableOpacity style={styles.reportBtn} onPress={onReport} activeOpacity={0.85}>
              <Text style={styles.reportBtnText}>\u{1F6A8}  Report This Person</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={onBlock} activeOpacity={0.8}>
              <Text style={styles.ghostBtnText}>\u{1F6AB}  Block This Person</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} activeOpacity={0.8}>
              <Text style={styles.ghostBtnText}>\u{1F4E7}  Contact Safety Team</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDone}>
              <Text style={styles.continueLink}>Continue without reporting</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  skipBtn: { alignSelf: 'flex-end', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  skipText: { ...typography['label-md'], color: colors.tertiary },
  content: { flex: 1, paddingHorizontal: rw(6.2), alignItems: 'center', justifyContent: 'center', gap: rh(1.9) },
  photo: { borderWidth: 2, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high },
  tag: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5 },
  emeraldTag: { ...typography['label-sm'], color: colors.emerald, textTransform: 'uppercase', letterSpacing: 1.5 },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center' },
  subtitle: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center' },
  optionList: { width: '100%', gap: rh(1) },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), height: rh(7.6), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  safetyCard: { borderLeftWidth: 3, borderLeftColor: colors.primary_container },
  optionEmoji: { fontSize: rf(2.4) },
  optionLabel: { ...typography['body-lg'], color: colors.on_surface },
  safetyLabel: { color: colors.primary_container },
  privacyNote: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center' },
  yesNoRow: { flexDirection: 'row', gap: rw(3.1), width: '100%' },
  yesCard: { flex: 1, height: rh(14.2), backgroundColor: colors.emerald, borderRadius: rw(4.1), alignItems: 'center', justifyContent: 'center' },
  yesCardText: { ...typography['title-lg'], color: '#FFFFFF' },
  noCard: { flex: 1, height: rh(14.2), backgroundColor: colors.surface_container, borderRadius: rw(4.1), alignItems: 'center', justifyContent: 'center' },
  noCardText: { ...typography['title-lg'], color: colors.on_surface },
  successIcon: { width: rw(16.4), height: rw(16.4), borderRadius: rw(8.2), backgroundColor: `${colors.emerald}33`, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.emerald, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20 }, android: { elevation: 6 } }) },
  successEmoji: { fontSize: rf(3.8) },
  primaryBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  reportBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.primary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  reportBtnText: { ...typography['label-lg'], color: '#FFFFFF' },
  ghostBtn: { width: '100%', height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
  continueLink: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
});
