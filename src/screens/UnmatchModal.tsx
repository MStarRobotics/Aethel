import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const REASONS = [
  'We met in person \u{1F389}',
  'Not interested anymore',
  'Conversation fizzled out',
  'Felt uncomfortable',
  'Inappropriate behaviour',
  'Fake or suspicious profile',
  'Other',
];

const SAFETY_REASONS = new Set(['Felt uncomfortable', 'Inappropriate behaviour', 'Fake or suspicious profile']);

interface Props {
  visible: boolean;
  userName: string;
  onClose: () => void;
  onUnmatch: (reason: string | null, alsoBlock: boolean) => void;
  onReportAndUnmatch: () => void;
}

export default function UnmatchModal({ visible, userName, onClose, onUnmatch, onReportAndUnmatch }: Props) {
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<string | null>(null);
  const [alsoBlock, setAlsoBlock] = useState(false);
  const [showSafety, setShowSafety] = useState(false);

  const handleUnmatch = () => {
    if (reason && SAFETY_REASONS.has(reason)) { setShowSafety(true); return; }
    onUnmatch(reason, alsoBlock);
    onClose();
  };

  const reset = () => { setReason(null); setAlsoBlock(false); setShowSafety(false); };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { reset(); onClose(); }}>
      <Pressable style={styles.overlay} onPress={() => { reset(); onClose(); }}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
          <View style={styles.handle} />

          {!showSafety ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Unmatch {userName}</Text>
                <TouchableOpacity onPress={() => { reset(); onClose(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.closeBtn}>\u2715</Text>
                </TouchableOpacity>
              </View>

              {/* Warning card */}
              <View style={styles.warningCard}>
                <Text style={styles.warningIcon}>\u26A0\uFE0F</Text>
                <View style={styles.warningText}>
                  <Text style={styles.warningTitle}>This will:</Text>
                  <Text style={styles.warningBody}>• Delete your entire conversation{'\n'}• Remove the match</Text>
                  <Text style={styles.warningDanger}>• This cannot be undone</Text>
                </View>
              </View>

              <Text style={styles.sectionLabel}>WHY ARE YOU UNMATCHING?</Text>
              <Text style={styles.sectionSub}>(optional — helps us improve)</Text>

              <View style={styles.reasonList}>
                {REASONS.map(r => (
                  <TouchableOpacity key={r} style={styles.radioRow} onPress={() => setReason(r)} activeOpacity={0.7}>
                    <View style={[styles.radioCircle, reason === r && styles.radioCircleSelected]}>
                      {reason === r && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioLabel}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.checkboxRow} onPress={() => setAlsoBlock(v => !v)} activeOpacity={0.7}>
                <View style={[styles.checkbox, alsoBlock && styles.checkboxChecked]}>
                  {alsoBlock && <Text style={styles.checkmark}>\u2713</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Also block {userName}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.unmatchBtn} onPress={handleUnmatch} activeOpacity={0.85}>
                <Text style={styles.unmatchBtnText}>Unmatch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={() => { reset(); onClose(); }}>
                <Text style={styles.cancelLinkText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Before You Unmatch</Text>
                <TouchableOpacity onPress={() => { reset(); onClose(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.closeBtn}>\u2715</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.safetyCard}>
                <Text style={styles.safetyIcon}>\u{1F6E1}\uFE0F</Text>
                <View>
                  <Text style={styles.safetyTitle}>REPORT FIRST?</Text>
                  <Text style={styles.safetyBody}>Reporting helps protect others in the community.</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.reportBtn} onPress={() => { reset(); onReportAndUnmatch(); }} activeOpacity={0.85}>
                <Text style={styles.reportBtnText}>\u{1F6A8}  Report & Unmatch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ghostBtn} onPress={() => { onUnmatch(reason, alsoBlock); reset(); onClose(); }} activeOpacity={0.8}>
                <Text style={styles.ghostBtnText}>Just Unmatch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={() => { reset(); onClose(); }}>
                <Text style={styles.cancelLinkText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: `${colors.surface_variant}F2`, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), paddingHorizontal: rw(6.2) },
  handle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: rh(1.9) },
  title: { ...typography['title-md'], color: colors.on_surface },
  closeBtn: { ...typography['title-md'], color: colors.tertiary, paddingLeft: rw(4.1) },
  warningCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(1.9) },
  warningIcon: { fontSize: rf(1.9) },
  warningText: { flex: 1 },
  warningTitle: { ...typography['label-sm'], color: colors.secondary_container, marginBottom: rh(0.4) },
  warningBody: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  warningDanger: { ...typography['body-md'], color: colors.primary_container, marginTop: rh(0.3) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.3) },
  sectionSub: { ...typography['label-sm'], color: `${colors.on_surface}66`, marginBottom: rh(1.4) },
  reasonList: { gap: rh(1.4), marginBottom: rh(1.9) },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  radioCircle: { width: rw(5.1), height: rw(5.1), borderRadius: rw(2.6), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: colors.secondary_container, backgroundColor: colors.secondary_container },
  radioDot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1.1), backgroundColor: '#FFFFFF' },
  radioLabel: { ...typography['body-md'], color: colors.on_surface },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), marginBottom: rh(1.9) },
  checkbox: { width: rw(5.1), height: rw(5.1), borderRadius: rw(1.3), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.secondary_container, borderColor: colors.secondary_container },
  checkmark: { fontSize: rf(1.6), color: colors.on_secondary, fontWeight: '700' },
  checkboxLabel: { ...typography['body-md'], color: colors.on_surface },
  unmatchBtn: { height: rh(6.6), backgroundColor: colors.primary_container, borderRadius: rw(1.5), alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  unmatchBtnText: { ...typography['label-lg'], color: '#FFFFFF', letterSpacing: 1 },
  cancelLink: { alignItems: 'center', paddingVertical: rh(1.2), marginBottom: rh(0.5) },
  cancelLinkText: { ...typography['label-md'], color: colors.tertiary },
  safetyCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.primary_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(1.9) },
  safetyIcon: { fontSize: rf(2.4) },
  safetyTitle: { ...typography['label-sm'], color: colors.on_surface, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.4) },
  safetyBody: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  reportBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  reportBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  ghostBtn: { height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
});
