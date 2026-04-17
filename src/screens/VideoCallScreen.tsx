import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Platform, StatusBar, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type CallState = 'incoming' | 'active' | 'ended';

interface Props {
  callerName?: string;
  callerPhoto?: string;
  initialState?: CallState;
  onAccept?: () => void;
  onDecline?: () => void;
  onEnd?: () => void;
  onMessage?: () => void;
  onCallAgain?: () => void;
}

export default function VideoCallScreen({
  callerName = 'Sarah',
  callerPhoto = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  initialState = 'incoming',
  onAccept, onDecline, onEnd, onMessage, onCallAgain,
}: Props) {
  const insets = useSafeAreaInsets();
  const [callState, setCallState] = useState<CallState>(initialState);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [seconds, setSeconds] = useState(0);

  // Pulsing rings for incoming call
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (callState !== 'incoming') return;
    const animate = (anim: Animated.Value, delay: number) => {
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 2.0, duration: 1500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1.0, duration: 0, useNativeDriver: true }),
      ])).start();
    };
    animate(ring1, 0);
    animate(ring2, 500);
    animate(ring3, 1000);
  }, [callState]);

  // Call timer
  useEffect(() => {
    if (callState !== 'active') return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [callState]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const PHOTO_SIZE = callState === 'incoming' ? rw(30.8) : rw(20.5);
  const BTN_SIZE = rw(14.4);
  const END_SIZE = rw(16.4);
  const ACCEPT_DECLINE_SIZE = rw(18.5);

  const handleAccept = () => { setCallState('active'); onAccept?.(); };
  const handleDecline = () => { onDecline?.(); };
  const handleEnd = () => { setCallState('ended'); onEnd?.(); };

  if (callState === 'incoming') {
    return (
      <View style={[styles.incomingRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="light-content" translucent />
        {/* Pulsing rings */}
        {[ring1, ring2, ring3].map((ring, i) => (
          <Animated.View key={i} style={[styles.pulseRing, { width: PHOTO_SIZE + rw(10), height: PHOTO_SIZE + rw(10), borderRadius: (PHOTO_SIZE + rw(10)) / 2, transform: [{ scale: ring }], opacity: ring.interpolate({ inputRange: [1, 2], outputRange: [0.2 - i * 0.05, 0] }) }]} />
        ))}
        <Image source={{ uri: callerPhoto }} style={[styles.incomingPhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
        <Text style={styles.incomingName}>{callerName} is calling...</Text>
        <Text style={styles.incomingType}>\u{1F4F9} Video Call</Text>
        <View style={styles.incomingBtns}>
          <View style={styles.incomingBtnItem}>
            <TouchableOpacity style={[styles.declineBtn, { width: ACCEPT_DECLINE_SIZE, height: ACCEPT_DECLINE_SIZE, borderRadius: ACCEPT_DECLINE_SIZE / 2 }]} onPress={handleDecline} activeOpacity={0.85}>
              <Text style={styles.callBtnIcon}>\u2715</Text>
            </TouchableOpacity>
            <Text style={styles.callBtnLabel}>Decline</Text>
          </View>
          <View style={styles.incomingBtnItem}>
            <TouchableOpacity style={[styles.acceptBtn, { width: ACCEPT_DECLINE_SIZE, height: ACCEPT_DECLINE_SIZE, borderRadius: ACCEPT_DECLINE_SIZE / 2 }]} onPress={handleAccept} activeOpacity={0.85}>
              <Text style={styles.callBtnIcon}>\u2713</Text>
            </TouchableOpacity>
            <Text style={styles.callBtnLabel}>Accept</Text>
          </View>
        </View>
        <TouchableOpacity><Text style={styles.remindLater}>Remind me later</Text></TouchableOpacity>
      </View>
    );
  }

  if (callState === 'ended') {
    return (
      <View style={[styles.endedRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
        <Image source={{ uri: callerPhoto }} style={[styles.endedPhoto, { width: rw(20.5), height: rw(20.5), borderRadius: rw(10.3) }]} />
        <Text style={styles.endedTag}>CALL ENDED</Text>
        <Text style={styles.endedName}>{callerName}, 26</Text>
        <Text style={styles.endedDuration}>Duration: {formatTime(seconds)}</Text>
        <TouchableOpacity style={styles.callAgainBtn} onPress={onCallAgain} activeOpacity={0.85}>
          <Text style={styles.callAgainBtnText}>\u{1F4F9}  Call Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageBtn} onPress={onMessage} activeOpacity={0.8}>
          <Text style={styles.messageBtnText}>\u{1F4AC}  Send a Message</Text>
        </TouchableOpacity>
        <TouchableOpacity><Text style={styles.backToChat}>Back to Chat</Text></TouchableOpacity>
      </View>
    );
  }

  // Active call
  return (
    <View style={styles.activeRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />
      {/* Remote video placeholder */}
      <Image source={{ uri: callerPhoto }} style={styles.remoteVideo} resizeMode="cover" />

      {/* Header overlay */}
      <TouchableOpacity style={[styles.activeOverlay, styles.headerOverlay, { paddingTop: insets.top + rh(1) }]} onPress={() => setOverlayVisible(v => !v)} activeOpacity={1}>
        <Text style={styles.activeName}>{callerName}, 26</Text>
        <Text style={styles.activeTimer}>{formatTime(seconds)}</Text>
      </TouchableOpacity>

      {/* Self-view PIP */}
      <View style={[styles.selfView, { bottom: insets.bottom + rh(14), right: rw(4.1) }]}>
        {cameraOff ? (
          <View style={styles.selfViewOff}><Text style={styles.selfViewOffIcon}>\u{1F464}</Text></View>
        ) : (
          <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }} style={styles.selfViewImg} resizeMode="cover" />
        )}
      </View>

      {/* Controls overlay */}
      <View style={[styles.controlsOverlay, { paddingBottom: insets.bottom + rh(2) }]}>
        <View style={styles.controlBtns}>
          {[
            { icon: muted ? '\u{1F507}' : '\u{1F3A4}', active: muted, onPress: () => setMuted(v => !v) },
            { icon: cameraOff ? '\u{1F4F5}' : '\u{1F4F9}', active: cameraOff, onPress: () => setCameraOff(v => !v) },
            { icon: '\u{1F504}', active: false, onPress: () => {} },
          ].map((btn, i) => (
            <TouchableOpacity key={i} style={[styles.controlBtn, { width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_SIZE / 2 }, btn.active && styles.controlBtnActive]} onPress={btn.onPress} activeOpacity={0.8}>
              <Text style={styles.controlBtnIcon}>{btn.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.endCallBtn, { width: END_SIZE, height: END_SIZE, borderRadius: END_SIZE / 2 }]} onPress={handleEnd} activeOpacity={0.85}>
          <Text style={styles.endCallIcon}>\u{1F4F5}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Incoming
  incomingRoot: { flex: 1, backgroundColor: `${colors.surface_container_lowest}E6`, alignItems: 'center', justifyContent: 'center', gap: rh(1.9) },
  pulseRing: { position: 'absolute', borderWidth: 2, borderColor: colors.primary_container },
  incomingPhoto: { borderWidth: 3, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high },
  incomingName: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  incomingType: { ...typography['label-md'], color: colors.tertiary },
  incomingBtns: { flexDirection: 'row', gap: rw(12.8), marginTop: rh(1.9) },
  incomingBtnItem: { alignItems: 'center', gap: rh(0.9) },
  declineBtn: { backgroundColor: colors.primary_container, alignItems: 'center', justifyContent: 'center' },
  acceptBtn: { backgroundColor: colors.emerald, alignItems: 'center', justifyContent: 'center' },
  callBtnIcon: { fontSize: rf(2.8), color: '#FFFFFF' },
  callBtnLabel: { ...typography['label-sm'], color: `${colors.on_surface}B3` },
  remindLater: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
  // Active
  activeRoot: { flex: 1, backgroundColor: '#000' },
  remoteVideo: { position: 'absolute', width: '100%', height: '100%' },
  activeOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: rw(6.2), paddingBottom: rh(1.4), backgroundColor: 'rgba(0,0,0,0.4)' },
  headerOverlay: { height: rh(9.5) },
  activeName: { ...typography['title-md'], color: '#FFFFFF' },
  activeTimer: { ...typography['label-md'], color: 'rgba(255,255,255,0.6)' },
  selfView: { position: 'absolute', width: rw(25.6), height: rh(16.6), borderRadius: rw(3.1), overflow: 'hidden', borderWidth: 2, borderColor: colors.surface_container_high },
  selfViewOff: { flex: 1, backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center' },
  selfViewOffIcon: { fontSize: rf(3.3) },
  selfViewImg: { width: '100%', height: '100%' },
  controlsOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', gap: rh(1.9), paddingTop: rh(2.4), backgroundColor: 'rgba(0,0,0,0.5)' },
  controlBtns: { flexDirection: 'row', gap: rw(6.2) },
  controlBtn: { backgroundColor: `${colors.surface_variant}99`, alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: colors.primary_container },
  controlBtnIcon: { fontSize: rf(2.4) },
  endCallBtn: { backgroundColor: colors.primary_container, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 16 }, android: { elevation: 8 } }) },
  endCallIcon: { fontSize: rf(2.8) },
  // Ended
  endedRoot: { flex: 1, backgroundColor: colors.surface_container_lowest, alignItems: 'center', justifyContent: 'center', gap: rh(1.9), paddingHorizontal: rw(6.2) },
  endedPhoto: { borderWidth: 2, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high },
  endedTag: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5 },
  endedName: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  endedDuration: { ...typography['label-md'], color: `${colors.on_surface}99` },
  callAgainBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  callAgainBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  messageBtn: { width: '100%', height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  messageBtnText: { ...typography['label-lg'], color: colors.primary },
  backToChat: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
});
