import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, Pressable, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const FEATURES = ['Unlimited swipes', 'See who liked you', 'Unlimited Super Likes', 'Profile Boost (1/wk)', 'Undo last swipe', 'Advanced filters', 'Read receipts', 'No ads'];
const HISTORY = [
  { date: 'May 7, 2026', amount: '$6.99', plan: '3-Month Plan' },
  { date: 'Mar 7, 2026', amount: '$6.99', plan: '3-Month Plan' },
];
const CANCEL_REASONS = ['Too expensive', 'Not enough matches', 'Found someone', 'Taking a break', 'Features not useful', 'Other'];

interface Props { onBack: () => void; onUpgrade: () => void; isActive?: boolean; }

export default function SubscriptionScreen({ onBack, onUpgrade, isActive = true }: Props) {
  const insets = useSafeAreaInsets();
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        {isActive ? (
          <>
            <LinearGradient colors={[colors.primary_container, colors.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.planCard}>
              <Text style={styles.planIcon}>\u{1F451}</Text>
              <Text style={styles.planTag}>AETHEL GOLD</Text>
              <Text style={styles.planName}>3-Month Plan</Text>
              <Text style={styles.planPrice}>$6.99 / month</Text>
              <Text style={styles.planActive}>\u2705 ACTIVE</Text>
            </LinearGradient>

            <Text style={styles.sectionLabel}>BILLING DETAILS</Text>
            <View style={styles.billingCard}>
              {[['Next billing date', 'June 7, 2026'], ['Payment method', 'Apple App Store'], ['Total paid to date', '$13.98']].map(([label, value]) => (
                <View key={label} style={styles.billingRow}>
                  <Text style={styles.billingLabel}>{label}</Text>
                  <Text style={styles.billingValue}>{value}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>YOUR GOLD FEATURES</Text>
            <View style={styles.featuresCard}>
              {FEATURES.map(f => (
                <View key={f} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>\u2705</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>BILLING HISTORY</Text>
            <View style={styles.historyList}>
              {HISTORY.map(h => (
                <View key={h.date} style={styles.historyRow}>
                  <View>
                    <Text style={styles.historyDate}>{h.date}</Text>
                    <Text style={styles.historyPlan}>{h.plan} · <Text style={styles.historyPaid}>Paid</Text></Text>
                  </View>
                  <Text style={styles.historyAmount}>{h.amount}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>MANAGE PLAN</Text>
            <View style={styles.manageList}>
              {['\u{1F504} Change Plan', '\u{1F501} Restore Purchase'].map((item, i, arr) => (
                <TouchableOpacity key={item} style={[styles.manageRow, i < arr.length - 1 && styles.manageDivider]} activeOpacity={0.7}>
                  <Text style={styles.manageText}>{item}</Text>
                  <Text style={styles.manageArrow}>\u203A</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.manageRow} onPress={() => setShowCancel(true)} activeOpacity={0.7}>
                <Text style={styles.cancelText}>\u274C Cancel Subscription</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.freePlanCard}>
              <Text style={styles.freePlanTag}>FREE PLAN</Text>
              <Text style={styles.freePlanBody}>Basic features only</Text>
            </View>
            <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade} activeOpacity={0.85}>
              <Text style={styles.upgradeBtnText}>\u{1F451}  Upgrade to Gold</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.restoreLink}>
              <Text style={styles.restoreLinkText}>Restore Purchase</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Cancel bottom sheet */}
      <Modal visible={showCancel} transparent animationType="slide" onRequestClose={() => setShowCancel(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setShowCancel(false)}>
          <Pressable style={[styles.cancelSheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Cancel Subscription</Text>
              <TouchableOpacity onPress={() => setShowCancel(false)}><Text style={styles.sheetClose}>\u2715</Text></TouchableOpacity>
            </View>
            <Text style={styles.sheetSectionLabel}>WHY ARE YOU CANCELLING?</Text>
            <View style={styles.reasonList}>
              {CANCEL_REASONS.map(r => (
                <TouchableOpacity key={r} style={styles.radioRow} onPress={() => setCancelReason(r)} activeOpacity={0.7}>
                  <View style={[styles.radioCircle, cancelReason === r && styles.radioCircleSelected]}>
                    {cancelReason === r && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.retentionCard}>
              <Text style={styles.retentionTag}>\u{1F381} BEFORE YOU GO...</Text>
              <Text style={styles.retentionBody}>Get 1 month free if you stay. Offer expires in</Text>
              <Text style={styles.retentionTimer}>10:00</Text>
              <TouchableOpacity style={styles.claimBtn} onPress={() => setShowCancel(false)} activeOpacity={0.85}>
                <Text style={styles.claimBtnText}>Claim Free Month</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cancelAnywayBtn} onPress={() => setShowCancel(false)} activeOpacity={0.8}>
              <Text style={styles.cancelAnywayText}>Cancel Anyway</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2) },
  planCard: { borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(0.5), marginBottom: rh(2.8) },
  planIcon: { fontSize: rf(3.3) },
  planTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  planName: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  planPrice: { ...typography['title-md'], color: colors.on_surface },
  planActive: { ...typography['label-sm'], color: colors.emerald },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  billingCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(1.2) },
  billingRow: { gap: rh(0.3) },
  billingLabel: { ...typography['label-md'], color: `${colors.on_surface}99` },
  billingValue: { ...typography['body-md'], color: colors.on_surface },
  featuresCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(0.9) },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: rw(2.6) },
  featureCheck: { fontSize: rf(1.6) },
  featureText: { ...typography['body-md'], color: colors.on_surface },
  historyList: { gap: rh(0.5) },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(3.1), padding: rw(4.1) },
  historyDate: { ...typography['body-md'], color: colors.on_surface },
  historyPlan: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  historyPaid: { color: colors.emerald },
  historyAmount: { ...typography['title-md'], color: colors.on_surface },
  manageList: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), overflow: 'hidden' },
  manageRow: { flexDirection: 'row', alignItems: 'center', height: rh(6.2), paddingHorizontal: rw(4.1) },
  manageDivider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  manageText: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  manageArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
  cancelText: { ...typography['body-md'], color: colors.primary_container, flex: 1 },
  freePlanCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(0.5), marginBottom: rh(2.4) },
  freePlanTag: { ...typography['label-sm'], color: `${colors.on_surface}80`, textTransform: 'uppercase', letterSpacing: 1.5 },
  freePlanBody: { ...typography['body-md'], color: `${colors.on_surface}99` },
  upgradeBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  upgradeBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  restoreLink: { alignItems: 'center', paddingVertical: rh(0.9) },
  restoreLinkText: { ...typography['label-md'], color: colors.tertiary },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  cancelSheet: { backgroundColor: `${colors.surface_variant}F2`, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), paddingHorizontal: rw(6.2) },
  sheetHandle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: rh(1.9) },
  sheetTitle: { ...typography['title-md'], color: colors.on_surface },
  sheetClose: { ...typography['title-md'], color: colors.tertiary },
  sheetSectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  reasonList: { gap: rh(1.4), marginBottom: rh(2.4) },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  radioCircle: { width: rw(5.1), height: rw(5.1), borderRadius: rw(2.6), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: colors.secondary_container, backgroundColor: colors.secondary_container },
  radioDot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1.1), backgroundColor: '#FFFFFF' },
  radioLabel: { ...typography['body-md'], color: colors.on_surface },
  retentionCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(0.7), marginBottom: rh(1.9) },
  retentionTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  retentionBody: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  retentionTimer: { ...typography['title-md'], color: colors.secondary_container, fontFamily: 'PlusJakartaSans-SemiBold' },
  claimBtn: { height: rh(5.2), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  claimBtnText: { ...typography['label-lg'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  cancelAnywayBtn: { height: rh(5.2), alignItems: 'center', justifyContent: 'center', marginBottom: rh(0.5) },
  cancelAnywayText: { ...typography['label-lg'], color: colors.primary_container },
});
