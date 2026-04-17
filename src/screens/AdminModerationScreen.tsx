import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Report { id: string; reporterName: string; reporterPhoto: string; reportedName: string; reason: string; timeAgo: string; }

const REPORTS: Report[] = [
  { id: '1', reporterName: 'John',  reporterPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80', reportedName: 'Mike',  reason: 'Spam',         timeAgo: '2 hours ago' },
  { id: '2', reporterName: 'Sarah', reporterPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', reportedName: 'Tom',   reason: 'Fake profile', timeAgo: '4 hours ago' },
  { id: '3', reporterName: 'Emma',  reporterPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80', reportedName: 'Alex',  reason: 'Harassment',   timeAgo: '6 hours ago' },
];

const STATS = [
  { label: 'Users Total',    count: '1,247', alert: false },
  { label: 'Active Today',   count: '89',    alert: false },
  { label: 'Pending Reports', count: '12',   alert: true },
  { label: 'Flagged Profiles', count: '3',   alert: true },
];

const TOOLS = [
  { icon: '\u{1F50D}', label: 'Search Users' },
  { icon: '\u{1F6AB}', label: 'Banned Users' },
  { icon: '\u2705',    label: 'Verification Queue' },
];

const CONTENT_TOOLS = [
  { icon: '\u{1F5BC}\uFE0F', label: 'Flagged Photos' },
  { icon: '\u{1F4AC}',       label: 'Flagged Messages' },
];

interface Props {
  onBack: () => void;
  onReview: (id: string) => void;
}

export default function AdminModerationScreen({ onBack, onReview }: Props) {
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState(REPORTS);
  const PHOTO_SIZE = rw(12.3);
  const STAT_W = (rw(100) - rw(6.2) * 2 - rw(2.1)) / 2;

  const dismiss = (id: string) => setReports(prev => prev.filter(r => r.id !== id));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={styles.notifBadge}>
          <Text style={styles.notifIcon}>\u{1F514}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Overview stats */}
        <Text style={styles.sectionLabel}>OVERVIEW</Text>
        <View style={styles.statsGrid}>
          {STATS.map(stat => (
            <View key={stat.label} style={[styles.statCard, { width: STAT_W }, stat.alert && styles.statCardAlert]}>
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Pending reports */}
        <Text style={[styles.sectionLabel, styles.alertLabel, { marginTop: rh(2.8) }]}>PENDING REPORTS</Text>
        <View style={styles.reportList}>
          {reports.map(report => (
            <View key={report.id} style={styles.reportItem}>
              <Image source={{ uri: report.reporterPhoto }} style={[styles.reportPhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
              <View style={styles.reportInfo}>
                <Text style={styles.reportText}>
                  <Text style={styles.reportName}>{report.reporterName}</Text>
                  {' reported '}
                  <Text style={styles.reportName}>{report.reportedName}</Text>
                  {' for '}
                  <Text style={styles.reportReason}>{report.reason}</Text>
                </Text>
                <Text style={styles.reportTime}>{report.timeAgo}</Text>
              </View>
              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.reviewBtn} onPress={() => onReview(report.id)} activeOpacity={0.85}>
                  <Text style={styles.reviewBtnText}>Review</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dismiss(report.id)}>
                  <Text style={styles.dismissText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* User management */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>USER MANAGEMENT</Text>
        <View style={styles.toolList}>
          {TOOLS.map((tool, i) => (
            <TouchableOpacity key={tool.label} style={[styles.toolRow, i < TOOLS.length - 1 && styles.toolDivider]} activeOpacity={0.7}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <Text style={styles.toolLabel}>{tool.label}</Text>
              <Text style={styles.toolArrow}>\u203A</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content moderation */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>CONTENT MODERATION</Text>
        <View style={styles.toolList}>
          {CONTENT_TOOLS.map((tool, i) => (
            <TouchableOpacity key={tool.label} style={[styles.toolRow, i < CONTENT_TOOLS.length - 1 && styles.toolDivider]} activeOpacity={0.7}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <Text style={styles.toolLabel}>{tool.label}</Text>
              <Text style={styles.toolArrow}>\u203A</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  notifBadge: { position: 'relative' },
  notifIcon: { fontSize: rf(2.1) },
  badge: { position: 'absolute', top: -rh(0.5), right: -rw(1.5), backgroundColor: colors.primary_container, borderRadius: 9999, minWidth: rw(4.1), height: rw(4.1), alignItems: 'center', justifyContent: 'center' },
  badgeText: { ...typography['label-sm'], color: '#FFFFFF', fontSize: rf(1.1) },
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  alertLabel: { color: colors.primary_container },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  statCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), alignItems: 'center', gap: rh(0.4) },
  statCardAlert: { backgroundColor: colors.primary_container },
  statCount: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  statLabel: { ...typography['label-sm'], color: `${colors.on_surface}80`, textAlign: 'center' },
  reportList: { gap: rh(1) },
  reportItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), borderLeftWidth: 3, borderLeftColor: colors.primary_container },
  reportPhoto: { backgroundColor: colors.surface_container_high },
  reportInfo: { flex: 1 },
  reportText: { ...typography['body-md'], color: `${colors.on_surface}B3`, marginBottom: rh(0.4) },
  reportName: { color: colors.on_surface, fontFamily: 'PlusJakartaSans-SemiBold' },
  reportReason: { color: colors.primary_container },
  reportTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  reportActions: { gap: rh(0.7), alignItems: 'flex-end' },
  reviewBtn: { height: rh(3.8), paddingHorizontal: rw(3.1), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  reviewBtnText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  dismissText: { ...typography['label-sm'], color: colors.tertiary },
  toolList: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), overflow: 'hidden' },
  toolRow: { flexDirection: 'row', alignItems: 'center', height: rh(6.2), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  toolDivider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  toolIcon: { fontSize: rf(1.9), width: rw(6.2), textAlign: 'center' },
  toolLabel: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  toolArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
});
