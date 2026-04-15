import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, Pressable, ScrollView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const REASONS = [
  'Fake profile / Catfish',
  'Inappropriate photos',
  'Harassment or bullying',
  'Spam or scam',
  'Underage user',
  'Hate speech',
  'Dangerous behavior',
  'Other',
];

interface Props {
  visible: boolean;
  userName: string;
  onClose: () => void;
  onSubmit: (reason: string, details: string, alsoBlock: boolean) => void;
}

export default function ReportModal({ visible, userName, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = reason !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    onSubmit(reason!, details, alsoBlock);
  };

  const handleClose = () => {
    setReason(null);
    setDetails('');
    setAlsoBlock(false);
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>

          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Report {userName}</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeBtn}>\u2715</Text>
            </TouchableOpacity>
          </View>

          {submitted ? (
            /* ── Success state ── */
            <View style={styles.successContent}>
              <View style={styles.successIconCircle}>
                <Text style={styles.successIcon}>\u2705</Text>
              </View>
              <Text style={styles.successTag}>REPORT SUBMITTED</Text>
              <Text style={styles.successTitle}>Thank You</Text>
              <Text style={styles.successBody}>
                Thank you for helping keep our community safe. We'll review this within 24 hours.
              </Text>
              <TouchableOpacity style={styles.doneBtn} onPress={handleClose} activeOpacity={0.85}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Report form ── */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
              <Text style={styles.sectionLabel}>WHY ARE YOU REPORTING?</Text>

              {/* Radio options */}
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

              {/* Details textarea */}
              <TextInput
                style={styles.textarea}
                placeholder="Additional details (optional)"
                placeholderTextColor={`${colors.on_surface}66`}
                value={details}
                onChangeText={setDetails}
                multiline
                numberOfLines={3}
                selectionColor={colors.secondary}
                textAlignVertical="top"
              />

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Submit Report</Text>
              </TouchableOpacity>

              {/* Also block checkbox */}
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setAlsoBlock(v => !v)} activeOpacity={0.7}>
                <View style={[styles.checkbox, alsoBlock && styles.checkboxChecked]}>
                  {alsoBlock && <Text style={styles.checkmark}>\u2713</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Also block {userName}</Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity style={styles.cancelLink} onPress={handleClose}>
                <Text style={styles.cancelLinkText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: `${colors.surface_variant}F2`,
    borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2),
    paddingTop: rh(1.4), maxHeight: rh(85),
  },
  handle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), marginBottom: rh(1.9) },
  title: { ...typography['title-md'], color: colors.on_surface },
  closeBtn: { ...typography['title-md'], color: colors.tertiary, paddingLeft: rw(4.1) },

  /* Form */
  formContent: { paddingHorizontal: rw(6.2), paddingBottom: rh(2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.9) },
  reasonList: { gap: rh(1.7), marginBottom: rh(2.4) },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  radioCircle: { width: rw(5.1), height: rw(5.1), borderRadius: rw(2.6), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: colors.secondary_container, backgroundColor: colors.secondary_container },
  radioDot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1.1), backgroundColor: '#FFFFFF' },
  radioLabel: { ...typography['body-md'], color: colors.on_surface },
  textarea: { backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26`, padding: rw(4.1), ...typography['body-md'], color: colors.on_surface, minHeight: rh(9.5), marginBottom: rh(2.4) },
  submitBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.9), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), marginBottom: rh(1.9) },
  checkbox: { width: rw(5.1), height: rw(5.1), borderRadius: rw(1.3), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.secondary_container, borderColor: colors.secondary_container },
  checkmark: { fontSize: rf(1.6), color: colors.on_secondary, fontWeight: '700' },
  checkboxLabel: { ...typography['body-md'], color: colors.on_surface },
  cancelLink: { alignItems: 'center', paddingVertical: rh(1.2) },
  cancelLinkText: { ...typography['label-md'], color: colors.tertiary },

  /* Success */
  successContent: { paddingHorizontal: rw(6.2), paddingBottom: rh(2), alignItems: 'center', paddingTop: rh(2.4) },
  successIconCircle: {
    width: rw(16.4), height: rw(16.4), borderRadius: rw(8.2),
    backgroundColor: `${colors.emerald}33`, alignItems: 'center', justifyContent: 'center',
    marginBottom: rh(1.9),
    ...Platform.select({
      ios: { shadowColor: colors.emerald, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20 },
      android: { elevation: 6 },
    }),
  },
  successIcon: { fontSize: rf(3.8) },
  successTag: { ...typography['label-sm'], color: colors.emerald, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.7) },
  successTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(1.4) },
  successBody: { ...typography['body-md'], color: `${colors.on_surface}B3`, textAlign: 'center', marginBottom: rh(2.8) },
  doneBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
