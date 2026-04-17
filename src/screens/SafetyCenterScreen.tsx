import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Linking, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const TOOLS = [
  { icon: '\u{1F6AB}', label: 'Block & Report',      sub: 'Block or report users' },
  { icon: '\u{1F441}\uFE0F', label: 'Profile Visibility', sub: 'Control who sees you' },
  { icon: '\u{1F4CD}', label: 'Location Privacy',    sub: 'Manage location data' },
];

const TIPS = [
  { icon: '\u{1F4A1}', title: 'Meeting in Person',   body: 'Always meet in public places first. Tell a friend where you\'re going.' },
  { icon: '\u{1F4A1}', title: 'Protecting Your Info', body: 'Don\'t share personal details like your address or workplace too soon.' },
  { icon: '\u{1F4A1}', title: 'Trust Your Instincts', body: 'If something feels off, it probably is. Block and report suspicious users.' },
];

const EMERGENCY = [
  { label: 'National DV Hotline', number: '1-800-799-7233', tel: '18007997233' },
  { label: 'Crisis Text Line',    number: 'Text HOME to 741741', tel: null },
];

interface Props {
  onBack: () => void;
  onBlockReport: () => void;
  onPrivacySettings: () => void;
}

export default function SafetyCenterScreen({ onBack, onBlockReport, onPrivacySettings }: Props) {
  const insets = useSafeAreaInsets();
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety Center</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>\u{1F6E1}\uFE0F</Text>
          <View style={styles.heroText}>
            <Text style={styles.heroTag}>YOUR SAFETY MATTERS</Text>
            <Text style={styles.heroTitle}>We're committed to keeping you safe.</Text>
            <Text style={styles.heroBody}>Aethel has zero tolerance for harassment, fake profiles, and harmful behavior.</Text>
          </View>
        </View>

        {/* Safety tools */}
        <Text style={styles.sectionLabel}>SAFETY TOOLS</Text>
        <View style={styles.toolList}>
          {TOOLS.map((tool, i) => (
            <TouchableOpacity
              key={tool.label}
              style={[styles.toolRow, i < TOOLS.length - 1 && styles.toolDivider]}
              onPress={tool.label === 'Block & Report' ? onBlockReport : onPrivacySettings}
              activeOpacity={0.7}
            >
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <View style={styles.toolInfo}>
                <Text style={styles.toolLabel}>{tool.label}</Text>
                <Text style={styles.toolSub}>{tool.sub}</Text>
              </View>
              <Text style={styles.toolArrow}>\u203A</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety tips */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>SAFETY TIPS</Text>
        <View style={styles.tipList}>
          {TIPS.map((tip, i) => (
            <TouchableOpacity key={i} style={styles.tipCard} onPress={() => setExpandedTip(expandedTip === i ? null : i)} activeOpacity={0.8}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              {expandedTip === i && (
                <>
                  <Text style={styles.tipBody}>{tip.body}</Text>
                  <TouchableOpacity><Text style={styles.readMore}>Read More</Text></TouchableOpacity>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency resources */}
        <Text style={[styles.sectionLabel, styles.emergencyLabel, { marginTop: rh(3.6) }]}>EMERGENCY RESOURCES</Text>
        <View style={styles.emergencyCard}>
          {EMERGENCY.map((e, i) => (
            <View key={e.label} style={[styles.emergencyRow, i < EMERGENCY.length - 1 && styles.emergencyDivider]}>
              <Text style={styles.emergencyIcon}>\u{1F198}</Text>
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyName}>{e.label}</Text>
                <TouchableOpacity onPress={() => e.tel && Linking.openURL(`tel:${e.tel}`)}>
                  <Text style={styles.emergencyNumber}>{e.number}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:safety@aethel.app')} activeOpacity={0.85}>
          <Text style={styles.contactBtnText}>\u{1F4E7}  Contact Safety Team</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2) },
  heroCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(2.8), ...Platform.select({ ios: { shadowColor: colors.emerald, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 20 }, android: { elevation: 4 } }) },
  heroIcon: { fontSize: rf(3.3) },
  heroText: { flex: 1, gap: rh(0.5) },
  heroTag: { ...typography['label-sm'], color: colors.emerald, textTransform: 'uppercase', letterSpacing: 1.5 },
  heroTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.1), color: colors.on_surface },
  heroBody: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  emergencyLabel: { color: colors.primary_container },
  toolList: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), overflow: 'hidden' },
  toolRow: { flexDirection: 'row', alignItems: 'center', height: rh(7.6), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  toolDivider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  toolIcon: { fontSize: rf(1.9), width: rw(6.2), textAlign: 'center' },
  toolInfo: { flex: 1 },
  toolLabel: { ...typography['label-lg'], color: colors.on_surface },
  toolSub: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  toolArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
  tipList: { gap: rh(1) },
  tipCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(0.9) },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  tipIcon: { fontSize: rf(1.9), color: colors.secondary_container },
  tipTitle: { ...typography['label-lg'], color: colors.on_surface },
  tipBody: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  readMore: { ...typography['label-md'], color: colors.tertiary },
  emergencyCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), overflow: 'hidden', marginBottom: rh(2.4) },
  emergencyRow: { flexDirection: 'row', alignItems: 'center', padding: rw(4.1), gap: rw(3.1) },
  emergencyDivider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  emergencyIcon: { fontSize: rf(1.9), color: colors.primary_container },
  emergencyInfo: { flex: 1 },
  emergencyName: { ...typography['label-md'], color: colors.on_surface, marginBottom: rh(0.3) },
  emergencyNumber: { ...typography['title-md'], color: colors.secondary_container },
  contactBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  contactBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
