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

const FEATURES = [
  'See who liked you',
  'Unlimited Super Likes',
  'See all profile visitors',
  'Boost your profile',
  'Advanced filters',
  'Read receipts',
  'Undo last swipe',
  'No ads',
];

interface Plan { id: string; label: string; price: string; period: string; badge?: string; save?: string; saveColor?: string; highlight?: boolean; }

const PLANS: Plan[] = [
  { id: '1m', label: '1 Month',   price: '$9.99', period: '/ month' },
  { id: '3m', label: '3 Months',  price: '$6.99', period: '/ month', badge: 'BEST VALUE', save: 'Save 30%', saveColor: colors.secondary_container, highlight: true },
  { id: '12m', label: '12 Months', price: '$4.99', period: '/ month', save: 'Save 50%', saveColor: colors.emerald },
];

interface Props {
  onClose: () => void;
  onPurchase: (planId: string) => void;
  onRestore: () => void;
}

export default function PremiumGoldScreen({ onClose, onPurchase, onRestore }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState('3m');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* Close */}
      <TouchableOpacity style={[styles.closeBtn, { top: insets.top + rh(1.4) }]} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.closeBtnText}>\u2715</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Hero banner */}
        <LinearGradient
          colors={[colors.primary_container, colors.surface]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <Text style={styles.heroIcon}>\u{1F451}</Text>
          <Text style={styles.heroTitle}>GET GOLD</Text>
          <Text style={styles.heroSubtitle}>Unlock your full potential</Text>
        </LinearGradient>

        {/* Features */}
        <Text style={styles.sectionLabel}>WHAT YOU GET</Text>
        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureCheck}>\u2705</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>CHOOSE YOUR PLAN</Text>
        <View style={styles.planList}>
          {PLANS.map(plan => {
            const isSelected = plan.id === selectedPlan;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  plan.highlight && styles.planCardHighlight,
                  isSelected && !plan.highlight && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}
              >
                {plan.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <View style={styles.planRow}>
                  <Text style={styles.planLabel}>{plan.label}</Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                </View>
                {plan.save && (
                  <Text style={[styles.planSave, { color: plan.saveColor }]}>{plan.save}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA */}
        <LinearGradient
          colors={['#FFB2B6', colors.primary_container]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.ctaGradient}
        >
          <TouchableOpacity style={styles.ctaBtn} onPress={() => onPurchase(selectedPlan)} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>\u{1F451}  Get Gold Now</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.secureNote}>\u{1F512} Secure payment via App Store / Google Play</Text>

        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={onRestore}>
            <Text style={styles.footerLink}>Restore Purchase</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>\u00B7</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>\u00B7</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  closeBtn: { position: 'absolute', left: rw(6.2), zIndex: 10, padding: rw(2) },
  closeBtnText: { ...typography['title-md'], color: colors.tertiary },
  scroll: { paddingHorizontal: rw(6.2) },
  heroBanner: { height: rh(19), borderRadius: rw(5.1), alignItems: 'center', justifyContent: 'center', marginTop: rh(6.6), marginBottom: rh(2.8), gap: rh(0.7) },
  heroIcon: { fontSize: rf(5.6) },
  heroTitle: { fontFamily: 'NotoSerif', fontSize: rf(5.3), color: colors.secondary_container, letterSpacing: -0.9 },
  heroSubtitle: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  featuresCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(4.1), gap: rh(1.2), marginBottom: rh(0.5) },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  featureCheck: { fontSize: rf(1.9) },
  featureText: { ...typography['body-md'], color: colors.on_surface },
  planList: { gap: rh(1.2), marginBottom: rh(2.4) },
  planCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), position: 'relative', overflow: 'hidden' },
  planCardHighlight: { backgroundColor: colors.primary_container },
  planCardSelected: { backgroundColor: colors.surface_container_high, borderLeftWidth: 2, borderLeftColor: colors.secondary_container },
  planBadge: { position: 'absolute', top: rh(1.2), right: rw(4.1), backgroundColor: colors.secondary_container, paddingHorizontal: rw(2.6), paddingVertical: rh(0.3), borderRadius: 9999 },
  planBadgeText: { ...typography['label-sm'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planLabel: { ...typography['title-md'], color: colors.on_surface },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: rw(1) },
  planPrice: { ...typography['headline-sm'], color: colors.on_surface, fontFamily: 'NotoSerif' },
  planPeriod: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  planSave: { ...typography['label-sm'], marginTop: rh(0.4) },
  ctaGradient: { borderRadius: 9999, marginBottom: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 }, android: { elevation: 8 } }) },
  ctaBtn: { height: rh(6.6), alignItems: 'center', justifyContent: 'center' },
  ctaBtnText: { ...typography['title-md'], color: '#FFFFFF', letterSpacing: 1 },
  secureNote: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center', marginBottom: rh(1.4) },
  footerLinks: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rw(2.1), marginBottom: rh(1) },
  footerLink: { ...typography['label-sm'], color: colors.tertiary },
  footerDot: { ...typography['label-sm'], color: `${colors.on_surface}66` },
});
