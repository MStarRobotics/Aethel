import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type VerifyState = 'idle' | 'pending' | 'approved' | 'rejected';

const STEPS = [
  { num: '1', label: 'Take\nselfie' },
  { num: '2', label: 'Hold\npose' },
  { num: '3', label: 'Get\nbadge' },
];

const BENEFITS = [
  'Verified profiles get 3x more matches',
  'Builds trust with potential matches',
  'Verified badge displayed on your profile',
];

interface Props {
  onBack: () => void;
  onTakeSelfie: () => void;
}

export default function VerificationScreen({ onBack, onTakeSelfie }: Props) {
  const insets = useSafeAreaInsets();
  const [state] = useState<VerifyState>('idle');

  const ICON_SIZE = rw(20.5);
  const STEP_SIZE = rw(14.4);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Account</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Verification icon */}
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
            <Text style={styles.iconEmoji}>\u2705</Text>
          </View>
        </View>

        {/* Status badge */}
        {state === 'pending' && <View style={[styles.statusBadge, { backgroundColor: colors.secondary_container }]}><Text style={styles.statusBadgeText}>PENDING REVIEW</Text></View>}
        {state === 'approved' && <View style={[styles.statusBadge, { backgroundColor: colors.emerald }]}><Text style={styles.statusBadgeText}>VERIFIED \u2705</Text></View>}
        {state === 'rejected' && <View style={[styles.statusBadge, { backgroundColor: colors.primary_container }]}><Text style={styles.statusBadgeText}>REJECTED</Text></View>}

        <Text style={styles.tag}>GET VERIFIED</Text>
        <Text style={styles.headline}>Show You're Real</Text>
        <Text style={styles.subtitle}>Show others you're the real deal</Text>

        {/* Benefits card */}
        <View style={styles.benefitsCard}>
          {BENEFITS.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Text style={styles.benefitCheck}>\u2705</Text>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* How it works */}
        <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
        <View style={styles.stepsRow}>
          {STEPS.map((step, i) => (
            <React.Fragment key={step.num}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, { width: STEP_SIZE, height: STEP_SIZE, borderRadius: STEP_SIZE / 2 }]}>
                  <Text style={styles.stepNum}>{step.num}</Text>
                </View>
                <Text style={styles.stepLabel}>{step.label}</Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={styles.stepLine} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onTakeSelfie} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>\u{1F4F7}  Take Verification Selfie</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          \u{1F512} Your selfie is only used for verification and is not shown on your profile.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2), alignItems: 'center' },
  iconWrapper: { alignItems: 'center', marginTop: rh(2.4), marginBottom: rh(2.4) },
  iconCircle: {
    backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: colors.emerald, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 30 },
      android: { elevation: 8 },
    }),
  },
  iconEmoji: { fontSize: rf(4.7) },
  statusBadge: { paddingHorizontal: rw(4.1), paddingVertical: rh(0.5), borderRadius: 9999, marginBottom: rh(1.4) },
  statusBadgeText: { ...typography['label-sm'], color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1.5 },
  tag: { ...typography['label-sm'], color: colors.emerald, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.7) },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center', marginBottom: rh(0.7) },
  subtitle: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center', marginBottom: rh(2.8) },
  benefitsCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(1.2), marginBottom: rh(2.8) },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: rw(3.1) },
  benefitCheck: { fontSize: rf(1.9) },
  benefitText: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.9), alignSelf: 'flex-start' },
  stepsRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: rh(2.8) },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center', marginBottom: rh(0.7) },
  stepNum: { ...typography['title-md'], color: colors.secondary_container },
  stepLabel: { ...typography['label-sm'], color: `${colors.on_surface}B3`, textAlign: 'center' },
  stepLine: { height: 2, flex: 0.5, backgroundColor: colors.primary_container, marginBottom: rh(2.4) },
  primaryBtn: {
    width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container,
    borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.9),
    ...Platform.select({
      ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  disclaimer: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center', lineHeight: rh(2.4) },
});
