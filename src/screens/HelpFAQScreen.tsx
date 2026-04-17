import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Animated, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const CATEGORIES = [
  { icon: '\u{1F464}', label: 'Account & Profile' },
  { icon: '\u{1F495}', label: 'Matching & Discovery' },
  { icon: '\u{1F4AC}', label: 'Messages & Chat' },
  { icon: '\u{1F4B3}', label: 'Billing & Premium' },
  { icon: '\u{1F512}', label: 'Safety & Privacy' },
  { icon: '\u{1F41B}', label: 'Technical Issues' },
];

const FAQS = [
  { q: 'How does matching work?', a: 'Our matching algorithm uses your Q&A answers, interests, and preferences to calculate a compatibility score. The higher the score, the more likely you are to connect.' },
  { q: 'Why am I not getting matches?', a: 'Try completing your profile, adding more photos, and answering Q&A questions. A complete profile gets 3x more matches.' },
  { q: 'How do I improve my compatibility score?', a: 'Answer more Q&A questions honestly. The more answers you provide, the more accurate your compatibility scores become.' },
];

interface Props {
  onBack: () => void;
  onCategory: (label: string) => void;
  onLiveChat: () => void;
  onEmailSupport: () => void;
}

export default function HelpFAQScreen({ onBack, onCategory, onLiveChat, onEmailSupport }: Props) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>\u{1F50D}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search help articles"
            placeholderTextColor={`${colors.on_surface}66`}
            value={search}
            onChangeText={setSearch}
            selectionColor={colors.secondary}
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionLabel}>POPULAR TOPICS</Text>
        <View style={styles.categoryList}>
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.categoryRow, i < CATEGORIES.length - 1 && styles.categoryDivider]}
              onPress={() => onCategory(cat.label)}
              activeOpacity={0.7}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catLabel}>{cat.label}</Text>
              <Text style={styles.catArrow}>\u203A</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ accordion */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>FREQUENTLY ASKED</Text>
        <View style={styles.faqList}>
          {FAQS.map((faq, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqItem}
              onPress={() => setOpenFaq(openFaq === i ? null : i)}
              activeOpacity={0.8}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Text style={[styles.faqChevron, openFaq === i && styles.faqChevronOpen]}>
                  {openFaq === i ? '\u25BC' : '\u25B6'}
                </Text>
              </View>
              {openFaq === i && (
                <View style={styles.faqAnswer}>
                  <View style={styles.faqDivider} />
                  <Text style={styles.faqAnswerText}>{faq.a}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact support */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>CONTACT SUPPORT</Text>
        <TouchableOpacity style={styles.liveChatBtn} onPress={onLiveChat} activeOpacity={0.85}>
          <Text style={styles.liveChatBtnText}>\u{1F4AC}  Live Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emailBtn} onPress={onEmailSupport} activeOpacity={0.8}>
          <Text style={styles.emailBtnText}>\u{1F4E7}  Email Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rateLink}>
          <Text style={styles.rateLinkText}>\u2B50 Rate Aethel</Text>
        </TouchableOpacity>
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
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.2), marginBottom: rh(2.4), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  searchIcon: { fontSize: rf(1.9), marginRight: rw(2.6), opacity: 0.5 },
  searchInput: { flex: 1, ...typography['body-md'], color: colors.on_surface },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  categoryList: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), overflow: 'hidden' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', height: rh(6.6), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  categoryDivider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  catIcon: { fontSize: rf(1.9), width: rw(6.2), textAlign: 'center' },
  catLabel: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  catArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
  faqList: { gap: rh(1) },
  faqItem: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1) },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: rw(3.1) },
  faqQuestion: { ...typography['label-lg'], color: colors.on_surface, flex: 1 },
  faqChevron: { ...typography['label-md'], color: colors.tertiary },
  faqChevronOpen: { color: colors.secondary_container },
  faqAnswer: { marginTop: rh(1.2) },
  faqDivider: { height: 1, backgroundColor: `${colors.outline_variant}26`, marginBottom: rh(1.2) },
  faqAnswerText: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  liveChatBtn: {
    height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999,
    alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4),
    ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }),
  },
  liveChatBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  emailBtn: { height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.9) },
  emailBtnText: { ...typography['label-lg'], color: colors.primary },
  rateLink: { alignItems: 'center', paddingVertical: rh(1.4) },
  rateLinkText: { ...typography['label-md'], color: colors.tertiary },
});
