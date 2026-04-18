import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, Pressable, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const MAX_PROMPTS = 3;
const MAX_CHARS = 150;

const PROMPT_LIBRARY: { category: string; prompts: string[] }[] = [
  { category: 'FUN & LIGHT', prompts: ["My love language is...", "The most spontaneous thing I've done is...", "I'm weirdly good at...", "My simple pleasures...", "Two truths and a lie..."] },
  { category: 'DEEP & MEANINGFUL', prompts: ["I'll know it's love when...", "The one thing I want you to know about me...", "My biggest life lesson so far...", "I'm inspired by..."] },
  { category: 'QUIRKY & UNIQUE', prompts: ["My most controversial opinion...", "I'm convinced that...", "The thing I can't stop talking about...", "My guilty pleasure..."] },
  { category: 'LIFESTYLE', prompts: ["On weekends you'll find me...", "My ideal Sunday looks like...", "I'm happiest when...", "I'm currently obsessed with..."] },
];

interface Prompt { question: string; answer: string; }

interface Props { onBack: () => void; onSave: (prompts: Prompt[]) => void; }

export default function ProfilePromptsScreen({ onBack, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const [prompts, setPrompts] = useState<(Prompt | null)[]>([
    { question: "The most spontaneous thing I've done is...", answer: "Booked a one-way ticket to Bali with 2 hours notice \u{1F334}" },
    { question: "I'll know it's love when...", answer: "We can sit in silence and it still feels like home \u{1F3E1}" },
    null,
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingAnswer, setEditingAnswer] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [pickerSearch, setPickerSearch] = useState('');

  const openPicker = (idx: number) => { setEditingIdx(idx); setShowPicker(true); };
  const selectPrompt = (q: string) => { setSelectedQuestion(q); setShowPicker(false); setEditingAnswer(''); };
  const saveAnswer = () => {
    if (editingIdx === null) return;
    const next = [...prompts];
    next[editingIdx] = { question: selectedQuestion, answer: editingAnswer };
    setPrompts(next);
    setEditingIdx(null);
    setSelectedQuestion('');
  };
  const removePrompt = (idx: number) => {
    const next = [...prompts];
    next[idx] = null;
    setPrompts(next);
  };

  const filteredLibrary = PROMPT_LIBRARY.map(cat => ({
    ...cat,
    prompts: cat.prompts.filter(p => p.toLowerCase().includes(pickerSearch.toLowerCase())),
  })).filter(cat => cat.prompts.length > 0);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Prompts</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.tag}>SHOW YOUR PERSONALITY</Text>
        <Text style={styles.headline}>Pick 3 Prompts</Text>
        <Text style={styles.subtitle}>"Your answers appear on your profile for others to see."</Text>

        <Text style={styles.countLabel}>YOUR PROMPTS ({prompts.filter(Boolean).length}/{MAX_PROMPTS})</Text>

        {prompts.map((prompt, idx) => (
          prompt ? (
            <View key={idx} style={styles.filledCard}>
              <Text style={styles.promptQuestion}>{prompt.question}</Text>
              <View style={styles.promptDivider} />
              <Text style={styles.promptAnswer}>{prompt.answer}</Text>
              <View style={styles.promptActions}>
                <TouchableOpacity onPress={() => { setEditingIdx(idx); setSelectedQuestion(prompt.question); setEditingAnswer(prompt.answer); }}>
                  <Text style={styles.promptActionText}>\u270F\uFE0F Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removePrompt(idx)}>
                  <Text style={styles.promptActionText}>\u{1F5D1}\uFE0F Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity key={idx} style={styles.emptySlot} onPress={() => openPicker(idx)} activeOpacity={0.8}>
              <Text style={styles.emptySlotPlus}>+</Text>
              <Text style={styles.emptySlotLabel}>Add a prompt</Text>
              <Text style={styles.emptySlotHint}>"Let people know what makes you, you"</Text>
            </TouchableOpacity>
          )
        ))}

        <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(prompts.filter(Boolean) as Prompt[])} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>\u2713  Save Prompts</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Answer editor */}
      {editingIdx !== null && selectedQuestion && (
        <View style={[styles.editorOverlay, { paddingBottom: insets.bottom + rh(2) }]}>
          <View style={styles.editorCard}>
            <TouchableOpacity style={styles.editorBack} onPress={() => { setEditingIdx(null); setSelectedQuestion(''); }}>
              <Text style={styles.backText}>\u2190 Back</Text>
            </TouchableOpacity>
            <View style={styles.promptDisplayCard}>
              <Text style={styles.promptQuestion}>{selectedQuestion}</Text>
            </View>
            <Text style={styles.sectionLabel}>YOUR ANSWER</Text>
            <TextInput
              style={styles.answerInput}
              placeholder="Write your answer..."
              placeholderTextColor={`${colors.on_surface}66`}
              value={editingAnswer}
              onChangeText={setEditingAnswer}
              multiline
              maxLength={MAX_CHARS}
              selectionColor={colors.secondary}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, editingAnswer.length > 130 && styles.charCountWarn]}>
              {editingAnswer.length} / {MAX_CHARS}
            </Text>
            <TouchableOpacity style={[styles.saveBtn, !editingAnswer.trim() && styles.saveBtnDisabled]} onPress={saveAnswer} disabled={!editingAnswer.trim()} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>\u2713  Save Answer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Prompt picker */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setShowPicker(false)}>
          <Pressable style={[styles.pickerSheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Choose a Prompt</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}><Text style={styles.sheetClose}>\u2715</Text></TouchableOpacity>
            </View>
            <View style={styles.searchWrapper}>
              <Text style={styles.searchIcon}>\u{1F50D}</Text>
              <TextInput style={styles.searchInput} placeholder="Search prompts..." placeholderTextColor={`${colors.on_surface}66`} value={pickerSearch} onChangeText={setPickerSearch} selectionColor={colors.secondary} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pickerContent}>
              {filteredLibrary.map(cat => (
                <View key={cat.category}>
                  <Text style={styles.sectionLabel}>{cat.category}</Text>
                  <View style={styles.promptRows}>
                    {cat.prompts.map(p => (
                      <TouchableOpacity key={p} style={styles.promptRow} onPress={() => selectPrompt(p)} activeOpacity={0.7}>
                        <Text style={styles.promptRowText}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
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
  tag: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.7) },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, marginBottom: rh(0.5) },
  subtitle: { ...typography['body-md'], color: `${colors.on_surface}99`, marginBottom: rh(2.4) },
  countLabel: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  filledCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(4.1), gap: rh(0.9), marginBottom: rh(1.4) },
  promptQuestion: { ...typography['label-sm'], color: colors.tertiary },
  promptDivider: { height: 1, backgroundColor: `${colors.outline_variant}26` },
  promptAnswer: { fontFamily: 'NotoSerif', fontSize: rf(1.9), color: colors.on_surface, lineHeight: rh(3.1) },
  promptActions: { flexDirection: 'row', gap: rw(4.1), justifyContent: 'flex-end' },
  promptActionText: { ...typography['label-md'], color: colors.tertiary },
  emptySlot: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(4.1), alignItems: 'center', gap: rh(0.5), marginBottom: rh(1.4) },
  emptySlotPlus: { fontSize: rf(2.8), color: `${colors.on_surface}4D` },
  emptySlotLabel: { ...typography['label-lg'], color: `${colors.on_surface}66` },
  emptySlotHint: { ...typography['body-md'], color: `${colors.on_surface}4D`, textAlign: 'center' },
  saveBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  saveBtnDisabled: { backgroundColor: colors.surface_container, ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }) },
  saveBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  editorOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.surface, paddingTop: rh(6) },
  editorCard: { flex: 1, paddingHorizontal: rw(6.2) },
  editorBack: { paddingVertical: rh(1.4) },
  promptDisplayCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(2.4) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  answerInput: { backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26`, padding: rw(4.1), fontFamily: 'NotoSerif', fontSize: rf(1.9), color: colors.on_surface, minHeight: rh(14.2), marginBottom: rh(0.5) },
  charCount: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'right', marginBottom: rh(2.4) },
  charCountWarn: { color: colors.primary_container },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  pickerSheet: { backgroundColor: `${colors.surface_variant}F2`, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), maxHeight: rh(80) },
  sheetHandle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), marginBottom: rh(1.4) },
  sheetTitle: { ...typography['title-md'], color: colors.on_surface },
  sheetClose: { ...typography['title-md'], color: colors.tertiary },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', marginHorizontal: rw(6.2), backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(5.7), marginBottom: rh(1.4), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  searchIcon: { fontSize: rf(1.9), marginRight: rw(2.6), opacity: 0.5 },
  searchInput: { flex: 1, ...typography['body-md'], color: colors.on_surface },
  pickerContent: { paddingHorizontal: rw(6.2), paddingBottom: rh(2) },
  promptRows: { gap: rh(0.5), marginBottom: rh(2.4) },
  promptRow: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), padding: rw(4.1), minHeight: rh(6.6), justifyContent: 'center' },
  promptRowText: { ...typography['body-md'], color: colors.on_surface },
});
