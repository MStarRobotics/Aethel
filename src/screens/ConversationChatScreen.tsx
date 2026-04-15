import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, TextInput, Platform, StatusBar, KeyboardAvoidingView,
  Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Message {
  id: string; text: string; isMine: boolean; timestamp: string;
  read?: boolean; type?: 'text' | 'photo' | 'gif';
}

const MESSAGES: Message[] = [
  { id: '1', text: 'Hey! \u{1F44B}',                    isMine: true,  timestamp: '10:32', read: true },
  { id: '2', text: 'Hi! How are you?',                  isMine: false, timestamp: '10:33' },
  { id: '3', text: "I'm great! How about you? \u{1F60A}", isMine: true,  timestamp: '10:34', read: true },
  { id: '4', text: 'Doing well, thanks for asking!',    isMine: false, timestamp: '2:10 PM' },
  { id: '5', text: 'Would you like to grab coffee sometime?', isMine: false, timestamp: '2:14 PM' },
];

const MORE_MENU = ['View Profile', 'Mute Notifications', 'Clear Chat', 'Block', 'Report', 'Unmatch'];

interface Props {
  onBack: () => void;
  onProfile: () => void;
  onGifPicker: () => void;
}

export default function ConversationChatScreen({ onBack, onProfile, onGifPicker }: Props) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [showMore, setShowMore] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const canSend = message.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Glass header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCenter} onPress={onProfile} activeOpacity={0.8}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <View>
            <Text style={styles.headerName}>Sarah, 26</Text>
            <Text style={styles.headerStatus}>Last active 2 min ago</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowMore(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.moreText}>\u22EE</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageArea}
        contentContainerStyle={[styles.messageScroll, { paddingBottom: rh(2) }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {/* Match intro card */}
        <View style={styles.introCard}>
          <Text style={styles.introLabel}>\u{1F495} YOU MATCHED WITH SARAH!</Text>
          <Text style={styles.introBody}>92% Compatible \u2014 Start the conversation!</Text>
          <TouchableOpacity onPress={onProfile}>
            <Text style={styles.introLink}>View Profile \u2192</Text>
          </TouchableOpacity>
        </View>

        {/* Date separator */}
        <View style={styles.dateSep}>
          <Text style={styles.dateSepText}>TODAY</Text>
        </View>

        {MESSAGES.map((msg, i) => {
          const prevMine = i > 0 && MESSAGES[i - 1].isMine === msg.isMine;
          return (
            <View key={msg.id} style={[styles.bubbleRow, msg.isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs, prevMine && styles.bubbleRowGrouped]}>
              {!msg.isMine && !prevMine && (
                <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }} style={styles.bubbleAvatar} />
              )}
              {!msg.isMine && prevMine && <View style={styles.bubbleAvatarSpacer} />}
              <View style={[styles.bubble, msg.isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={styles.bubbleText}>{msg.text}</Text>
                <View style={styles.bubbleMeta}>
                  <Text style={styles.bubbleTime}>{msg.timestamp}</Text>
                  {msg.isMine && (
                    <Text style={[styles.readReceipt, msg.read && styles.readReceiptRead]}>
                      {msg.read ? '\u2713\u2713' : '\u2713'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {/* Typing indicator */}
        <View style={styles.typingRow}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }} style={styles.bubbleAvatar} />
          <View style={styles.typingBubble}>
            <Text style={styles.typingDots}>\u25CF\u25CF\u25CF</Text>
          </View>
        </View>
      </ScrollView>

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + rh(1) }]}>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.inputAction}>\u{1F60A}</Text>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.inputAction}>\u{1F4F7}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGifPicker} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.gifBtn}>GIF</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={`${colors.on_surface}66`}
          value={message}
          onChangeText={setMessage}
          multiline
          selectionColor={colors.secondary}
        />
        <TouchableOpacity
          style={[styles.sendBtn, canSend && styles.sendBtnActive]}
          disabled={!canSend}
          activeOpacity={0.8}
        >
          <Text style={[styles.sendIcon, canSend && styles.sendIconActive]}>\u27A4</Text>
        </TouchableOpacity>
      </View>

      {/* More menu */}
      <Modal visible={showMore} transparent animationType="slide" onRequestClose={() => setShowMore(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setShowMore(false)}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + rh(2) }]}>
            <View style={styles.sheetHandle} />
            {MORE_MENU.map(item => (
              <TouchableOpacity key={item} style={styles.sheetItem} onPress={() => setShowMore(false)}>
                <Text style={[styles.sheetItemText, ['Block', 'Report', 'Unmatch'].includes(item) && styles.sheetItemDestructive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const AVATAR_SIZE = rw(10.3); // ~40px
const BUBBLE_AVATAR = rw(8.2); // ~32px

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: rw(4.1), paddingVertical: rh(1.2),
    backgroundColor: `${colors.surface_variant}99`,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: { shadowColor: colors.surface_container_lowest, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  backText: { ...typography['title-md'], color: colors.tertiary, paddingHorizontal: rw(2) },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: rw(3.1), paddingHorizontal: rw(2) },
  avatarWrapper: { position: 'relative' },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, backgroundColor: colors.surface_container_high },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: rw(2.6), height: rw(2.6), borderRadius: rw(1.3), backgroundColor: colors.emerald, borderWidth: 2, borderColor: colors.surface_container_lowest },
  headerName: { ...typography['title-md'], color: colors.on_surface },
  headerStatus: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  moreText: { ...typography['title-lg'], color: `${colors.on_surface}99`, paddingHorizontal: rw(2) },
  messageArea: { flex: 1 },
  messageScroll: { paddingHorizontal: rw(4.1), paddingTop: rh(2) },
  introCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(2.4), alignItems: 'center' },
  introLabel: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.5) },
  introBody: { ...typography['body-md'], color: `${colors.on_surface}B3`, marginBottom: rh(0.9) },
  introLink: { ...typography['label-md'], color: colors.tertiary },
  dateSep: { alignItems: 'center', marginVertical: rh(2.4) },
  dateSepText: { ...typography['label-sm'], color: `${colors.on_surface}4D`, textTransform: 'uppercase', letterSpacing: 1.5 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: rh(0.7), gap: rw(2.1) },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubbleRowTheirs: { justifyContent: 'flex-start' },
  bubbleRowGrouped: { marginBottom: rh(0.3) },
  bubbleAvatar: { width: BUBBLE_AVATAR, height: BUBBLE_AVATAR, borderRadius: BUBBLE_AVATAR / 2, backgroundColor: colors.surface_container_high },
  bubbleAvatarSpacer: { width: BUBBLE_AVATAR },
  bubble: { maxWidth: '70%', paddingHorizontal: rw(4.1), paddingVertical: rh(1.2), gap: rh(0.4) },
  bubbleMine: { backgroundColor: colors.primary_container, borderRadius: rw(4.6), borderBottomRightRadius: rw(1) },
  bubbleTheirs: { backgroundColor: colors.surface_container, borderRadius: rw(4.6), borderBottomLeftRadius: rw(1) },
  bubbleText: { ...typography['body-md'], color: colors.on_surface },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', gap: rw(1), justifyContent: 'flex-end' },
  bubbleTime: { ...typography['label-sm'], color: `${colors.on_surface}66`, fontSize: rf(1.1) },
  readReceipt: { fontSize: rf(1.1), color: `${colors.on_surface}66` },
  readReceiptRead: { color: colors.secondary_container },
  typingRow: { flexDirection: 'row', alignItems: 'flex-end', gap: rw(2.1), marginTop: rh(0.7) },
  typingBubble: { backgroundColor: colors.surface_container, borderRadius: rw(4.6), borderBottomLeftRadius: rw(1), paddingHorizontal: rw(4.1), paddingVertical: rh(1.4) },
  typingDots: { color: colors.tertiary, letterSpacing: 2, fontSize: rf(1.4) },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: rw(2.6),
    paddingHorizontal: rw(4.1), paddingTop: rh(1.2),
    backgroundColor: `${colors.surface_variant}99`,
    borderTopWidth: 0,
  },
  inputAction: { fontSize: rf(2.1), opacity: 0.6 },
  gifBtn: { ...typography['label-md'], color: `${colors.on_surface}99`, paddingHorizontal: rw(1) },
  textInput: { flex: 1, ...typography['body-md'], color: colors.on_surface, backgroundColor: colors.surface_container_highest, borderRadius: rw(5.1), paddingHorizontal: rw(4.1), paddingVertical: rh(1.2), maxHeight: rh(12) },
  sendBtn: { width: rw(10.3), height: rw(10.3), borderRadius: rw(5.1), backgroundColor: `${colors.on_surface}33`, alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: { backgroundColor: colors.secondary_container, ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 8 }, android: { elevation: 4 } }) },
  sendIcon: { fontSize: rf(1.9), color: `${colors.on_surface}66` },
  sendIconActive: { color: colors.on_secondary },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface_container, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), paddingHorizontal: rw(6.2) },
  sheetHandle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.9) },
  sheetItem: { paddingVertical: rh(1.9), borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  sheetItemText: { ...typography['body-lg'], color: colors.on_surface },
  sheetItemDestructive: { color: colors.primary_container },
});
