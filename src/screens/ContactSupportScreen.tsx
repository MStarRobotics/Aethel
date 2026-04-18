import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type View2 = 'main' | 'new-ticket' | 'ticket-detail';

const TICKETS = [
  { id: 'TK-1042', subject: 'Account access issue', status: 'in-progress', timeAgo: '2d ago' },
  { id: 'TK-1038', subject: 'Photo not approved',   status: 'resolved',    timeAgo: '5d ago' },
];

const CATEGORIES = ['\u{1F464} Account', '\u{1F495} Matching', '\u{1F4AC} Chat', '\u{1F4B3} Billing', '\u{1F512} Safety', '\u{1F41B} Bug', '\u2753 Other'];

const STATUS_COLOR: Record<string, string> = { 'in-progress': colors.secondary_container, resolved: colors.emerald, open: colors.primary_container };
const STATUS_LABEL: Record<string, string> = { 'in-progress': '\u{1F7E1} In Progress', resolved: '\u2705 Resolved', open: '\u{1F534} Open' };

interface Props { onBack: () => void; }

export default function ContactSupportScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<View2>('main');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<typeof TICKETS[0] | null>(null);
  const [reply, setReply] = useState('');

  if (view === 'new-ticket') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('main')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backText}>\u2190 Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Ticket</Text>
          <View style={{ width: rw(12) }} />
        </View>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>WHAT'S THE ISSUE?</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} style={[styles.catChip, selectedCategory === cat && styles.catChipSelected]} onPress={() => setSelectedCategory(cat)} activeOpacity={0.75}>
                <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextSelected]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.fieldLabel}>SUBJECT</Text>
          <TextInput style={styles.input} placeholder="Brief description..." placeholderTextColor={`${colors.on_surface}66`} value={subject} onChangeText={setSubject} selectionColor={colors.secondary} />
          <Text style={[styles.fieldLabel, { marginTop: rh(1.9) }]}>DESCRIBE THE ISSUE</Text>
          <TextInput style={styles.textarea} placeholder="Tell us what happened..." placeholderTextColor={`${colors.on_surface}66`} value={description} onChangeText={setDescription} multiline numberOfLines={5} selectionColor={colors.secondary} textAlignVertical="top" />
          <Text style={styles.charCount}>{description.length} / 1000</Text>
          <TouchableOpacity style={styles.ghostBtn} activeOpacity={0.8}>
            <Text style={styles.ghostBtnText}>\u{1F4CE}  Add Screenshot (optional)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtn, (!subject.trim() || !selectedCategory) && styles.primaryBtnDisabled]} disabled={!subject.trim() || !selectedCategory} onPress={() => setView('main')} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Submit Ticket</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (view === 'ticket-detail' && selectedTicket) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('main')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backText}>\u2190 Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ticket #{selectedTicket.id}</Text>
          <View style={{ width: rw(12) }} />
        </View>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(10) }]} showsVerticalScrollIndicator={false}>
          <View style={styles.ticketStatusCard}>
            <Text style={styles.ticketSubject}>{selectedTicket.subject}</Text>
            <Text style={[styles.ticketStatus, { color: STATUS_COLOR[selectedTicket.status] }]}>{STATUS_LABEL[selectedTicket.status]}</Text>
            <Text style={styles.ticketTime}>Submitted {selectedTicket.timeAgo}</Text>
          </View>
          <Text style={styles.sectionLabel}>CONVERSATION</Text>
          <View style={styles.bubbleUser}>
            <Text style={styles.bubbleMeta}>You · {selectedTicket.timeAgo}</Text>
            <Text style={styles.bubbleText}>I can't log in to my account after changing my phone number.</Text>
          </View>
          <View style={styles.bubbleSupport}>
            <Text style={[styles.bubbleMeta, { color: colors.secondary_container }]}>Aethel Support · 1d ago</Text>
            <Text style={styles.bubbleText}>Hi! We're looking into this for you. Can you confirm your registered email?</Text>
          </View>
        </ScrollView>
        <View style={[styles.replyBar, { paddingBottom: insets.bottom + rh(1) }]}>
          <TextInput style={styles.replyInput} placeholder="Reply..." placeholderTextColor={`${colors.on_surface}66`} value={reply} onChangeText={setReply} selectionColor={colors.secondary} />
          <TouchableOpacity style={[styles.sendBtn, reply.trim() && styles.sendBtnActive]} disabled={!reply.trim()} activeOpacity={0.85}>
            <Text style={styles.sendBtnText}>\u27A4</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: rw(12) }} />
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>HOW CAN WE HELP?</Text>
        <LinearGradient colors={[colors.primary_container, colors.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.liveChatCard}>
          <Text style={styles.liveChatIcon}>\u{1F4AC}</Text>
          <View>
            <Text style={styles.liveChatTitle}>Live Chat</Text>
            <Text style={styles.liveChatDesc}>Chat with our team now</Text>
            <Text style={styles.liveChatTime}>Avg. response: ~2 min</Text>
          </View>
        </LinearGradient>
        {[{ icon: '\u{1F4DD}', title: 'Submit a Ticket', desc: "We'll reply within 24h", onPress: () => setView('new-ticket') }, { icon: '\u{1F41B}', title: 'Report a Bug', desc: 'Something not working?', onPress: () => setView('new-ticket') }].map(opt => (
          <TouchableOpacity key={opt.title} style={styles.optionCard} onPress={opt.onPress} activeOpacity={0.8}>
            <Text style={styles.optionIcon}>{opt.icon}</Text>
            <View>
              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>MY TICKETS</Text>
        <View style={styles.ticketList}>
          {TICKETS.map(t => (
            <TouchableOpacity key={t.id} style={styles.ticketRow} onPress={() => { setSelectedTicket(t); setView('ticket-detail'); }} activeOpacity={0.8}>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketId}>#{t.id}</Text>
                <Text style={styles.ticketSubjectSmall}>{t.subject}</Text>
                <Text style={[styles.ticketStatusSmall, { color: STATUS_COLOR[t.status] }]}>{STATUS_LABEL[t.status]}</Text>
              </View>
              <Text style={styles.ticketTime}>{t.timeAgo}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>OTHER WAYS TO REACH US</Text>
        <View style={styles.contactList}>
          {['\u{1F4E7} support@aethel.app', '\u{1F426} @AethelSupport'].map((item, i, arr) => (
            <TouchableOpacity key={item} style={[styles.contactRow, i < arr.length - 1 && styles.contactDivider]} activeOpacity={0.7}>
              <Text style={styles.contactText}>{item}</Text>
              <Text style={styles.contactArrow}>\u203A</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  liveChatCard: { flexDirection: 'row', alignItems: 'center', borderRadius: rw(5.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(1.4) },
  liveChatIcon: { fontSize: rf(3.3) },
  liveChatTitle: { ...typography['label-lg'], color: colors.on_surface },
  liveChatDesc: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  liveChatTime: { ...typography['label-sm'], color: colors.emerald },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(1) },
  optionIcon: { fontSize: rf(2.4) },
  optionTitle: { ...typography['label-lg'], color: colors.on_surface },
  optionDesc: { ...typography['body-md'], color: `${colors.on_surface}99` },
  ticketList: { gap: rh(1) },
  ticketRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1) },
  ticketInfo: { flex: 1 },
  ticketId: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  ticketSubjectSmall: { ...typography['label-lg'], color: colors.on_surface },
  ticketStatusSmall: { ...typography['label-sm'] },
  ticketTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  contactList: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), overflow: 'hidden' },
  contactRow: { flexDirection: 'row', alignItems: 'center', height: rh(6.2), paddingHorizontal: rw(4.1) },
  contactDivider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  contactText: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  contactArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1), marginBottom: rh(2.4) },
  catChip: { height: rh(5.2), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  catChipSelected: { backgroundColor: colors.primary_container },
  catChipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  catChipTextSelected: { color: colors.on_surface },
  fieldLabel: { ...typography['label-md'], color: colors.tertiary, marginBottom: rh(0.7) },
  input: { backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.6), ...typography['body-md'], color: colors.on_surface, borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26`, marginBottom: rh(0.5) },
  textarea: { backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), padding: rw(4.1), ...typography['body-md'], color: colors.on_surface, minHeight: rh(14.2), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26`, marginBottom: rh(0.5) },
  charCount: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'right', marginBottom: rh(1.9) },
  ghostBtn: { height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
  primaryBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  primaryBtnDisabled: { backgroundColor: colors.surface_container, ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }) },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  ticketStatusCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(0.5), marginBottom: rh(2.4) },
  ticketSubject: { ...typography['title-md'], color: colors.on_surface },
  ticketStatus: { ...typography['label-sm'] },
  bubbleUser: { backgroundColor: colors.surface_container_high, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(1), alignSelf: 'flex-end', maxWidth: '80%' },
  bubbleSupport: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(1), alignSelf: 'flex-start', maxWidth: '80%' },
  bubbleMeta: { ...typography['label-sm'], color: `${colors.on_surface}66`, marginBottom: rh(0.4) },
  bubbleText: { ...typography['body-md'], color: colors.on_surface },
  replyBar: { flexDirection: 'row', alignItems: 'center', gap: rw(2.6), paddingHorizontal: rw(4.1), paddingTop: rh(1.2), backgroundColor: `${colors.surface_variant}99` },
  replyInput: { flex: 1, backgroundColor: colors.surface_container_highest, borderRadius: rw(5.1), paddingHorizontal: rw(4.1), paddingVertical: rh(1.2), ...typography['body-md'], color: colors.on_surface },
  sendBtn: { width: rw(10.3), height: rw(10.3), borderRadius: rw(5.1), backgroundColor: `${colors.on_surface}33`, alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: { backgroundColor: colors.secondary_container },
  sendBtnText: { fontSize: rf(1.9), color: colors.on_secondary },
});
