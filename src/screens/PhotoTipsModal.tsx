import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const DO_TIPS = [
  { title: 'Clear face shot', desc: 'Your face should fill at least 60% of frame' },
  { title: 'Natural smile', desc: 'Genuine smiles get 14% more right swipes' },
  { title: 'Good lighting', desc: 'Natural light or soft indoor light works best' },
  { title: 'Solo shot for main', desc: '86% of users prefer photos without groups' },
  { title: 'Show your lifestyle', desc: 'Hobbies, travel, pets — show who you really are' },
];

const AVOID_TIPS = [
  { title: 'Sunglasses on main', desc: 'People want to see your eyes' },
  { title: 'Group photos as main', desc: "It's confusing who the profile belongs to" },
  { title: 'Heavily filtered', desc: 'Filters reduce trust — be authentic' },
  { title: 'Old or blurry photos', desc: 'Use recent photos from the last 2 years' },
];

interface Props { visible: boolean; onClose: () => void; onAddPhotos: () => void; }

export default function PhotoTipsModal({ visible, onClose, onAddPhotos }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Photo Tips</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeBtn}>\u2715</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.statLabel}>GREAT PHOTOS GET 3\u00D7 MORE MATCHES</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Text style={styles.doHeader}>\u2705 DO THIS</Text>
            <View style={styles.tipList}>
              {DO_TIPS.map(tip => (
                <View key={tip.title} style={styles.tipRow}>
                  <Text style={styles.tipCheck}>\u2705</Text>
                  <View style={styles.tipInfo}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDesc}>{tip.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={[styles.avoidHeader, { marginTop: rh(2.4) }]}>\u274C AVOID THIS</Text>
            <View style={styles.tipList}>
              {AVOID_TIPS.map(tip => (
                <View key={tip.title} style={styles.tipRow}>
                  <Text style={styles.tipCheck}>\u274C</Text>
                  <View style={styles.tipInfo}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDesc}>{tip.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={[styles.orderHeader, { marginTop: rh(2.4) }]}>PHOTO ORDER MATTERS</Text>
            <View style={styles.orderCard}>
              {[
                { label: '\u{1F4F8} Photo 1 (Main)', desc: 'Best solo face shot', highlight: true },
                { label: '\u{1F4F8} Photo 2', desc: 'Full body or lifestyle', highlight: false },
                { label: '\u{1F4F8} Photos 3–6', desc: 'Hobbies, travel, social', highlight: false },
              ].map(item => (
                <View key={item.label} style={styles.orderRow}>
                  <Text style={[styles.orderLabel, item.highlight && styles.orderLabelHighlight]}>{item.label}</Text>
                  <Text style={styles.orderDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => { onAddPhotos(); onClose(); }} activeOpacity={0.85}>
              <Text style={styles.addBtnText}>Got it — Add Photos</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: `${colors.surface_variant}F2`, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), maxHeight: rh(85) },
  handle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), marginBottom: rh(0.7) },
  title: { ...typography['title-md'], color: colors.on_surface },
  closeBtn: { ...typography['title-md'], color: colors.tertiary, paddingLeft: rw(4.1) },
  statLabel: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5, paddingHorizontal: rw(6.2), marginBottom: rh(1.9) },
  content: { paddingHorizontal: rw(6.2), paddingBottom: rh(2) },
  doHeader: { ...typography['label-sm'], color: colors.emerald, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  avoidHeader: { ...typography['label-sm'], color: colors.primary_container, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  orderHeader: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  tipList: { gap: rh(0.5) },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface_container, borderRadius: rw(3.1), padding: rw(4.1), gap: rw(3.1) },
  tipCheck: { fontSize: rf(1.6), marginTop: rh(0.2) },
  tipInfo: { flex: 1 },
  tipTitle: { ...typography['label-lg'], color: colors.on_surface, marginBottom: rh(0.3) },
  tipDesc: { ...typography['body-md'], color: `${colors.on_surface}99` },
  orderCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(1.2), marginBottom: rh(2.4) },
  orderRow: { gap: rh(0.3) },
  orderLabel: { ...typography['label-md'], color: colors.on_surface },
  orderLabelHighlight: { color: colors.secondary_container },
  orderDesc: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  addBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  addBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
