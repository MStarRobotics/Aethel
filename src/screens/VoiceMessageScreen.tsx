import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type RecordState = 'recording' | 'preview';

const BAR_COUNT = 32;

interface Props {
  onCancel: () => void;
  onSend: (durationSecs: number) => void;
}

export default function VoiceMessageScreen({ onCancel, onSend }: Props) {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<RecordState>('recording');
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animations
  const micPulse = useRef(new Animated.Value(1)).current;
  const labelOpacity = useRef(new Animated.Value(1)).current;
  const bars = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.2 + Math.random() * 0.8))).current;

  // Timer
  useEffect(() => {
    if (state !== 'recording') return;
    const id = setInterval(() => setSeconds(s => {
      if (s >= 119) { setState('preview'); return s; }
      return s + 1;
    }), 1000);
    return () => clearInterval(id);
  }, [state]);

  // Mic pulse
  useEffect(() => {
    if (state !== 'recording') return;
    const pulse = () => Animated.sequence([
      Animated.timing(micPulse, { toValue: 1.15, duration: 400, useNativeDriver: true }),
      Animated.timing(micPulse, { toValue: 1.0,  duration: 400, useNativeDriver: true }),
    ]).start(() => pulse());
    pulse();
  }, [state]);

  // Label blink
  useEffect(() => {
    if (state !== 'recording') return;
    const blink = () => Animated.sequence([
      Animated.timing(labelOpacity, { toValue: 0.4, duration: 500, useNativeDriver: true }),
      Animated.timing(labelOpacity, { toValue: 1.0, duration: 500, useNativeDriver: true }),
    ]).start(() => blink());
    blink();
  }, [state]);

  // Waveform animation
  useEffect(() => {
    if (state !== 'recording') return;
    bars.forEach(bar => {
      const animate = () => Animated.timing(bar, {
        toValue: 0.1 + Math.random() * 0.9,
        duration: 150 + Math.random() * 200,
        useNativeDriver: true,
      }).start(() => animate());
      animate();
    });
  }, [state]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const ICON_SIZE = rw(20.5);

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      <TouchableOpacity style={styles.cancelLink} onPress={onCancel}>
        <Text style={styles.cancelText}>{state === 'recording' ? '\u2190 Cancel' : '\u2190 Discard'}</Text>
      </TouchableOpacity>

      {state === 'recording' ? (
        <View style={styles.content}>
          {/* Mic icon */}
          <Animated.View style={[styles.micCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2, transform: [{ scale: micPulse }] }]}>
            <Text style={styles.micEmoji}>\u{1F3A4}</Text>
          </Animated.View>

          <Animated.Text style={[styles.recordingLabel, { opacity: labelOpacity }]}>RECORDING</Animated.Text>
          <Text style={styles.timer}>{formatTime(seconds)}</Text>

          {/* Waveform */}
          <View style={styles.waveform}>
            {bars.map((bar, i) => (
              <Animated.View key={i} style={[styles.waveBar, { transform: [{ scaleY: bar }] }]} />
            ))}
          </View>

          <TouchableOpacity style={styles.stopBtn} onPress={() => setState('preview')} activeOpacity={0.85}>
            <Text style={styles.stopBtnText}>\u23F9\uFE0F  Stop Recording</Text>
          </TouchableOpacity>
          <Text style={styles.slideHint}>\u2190 Slide to cancel</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.previewLabel}>VOICE MESSAGE</Text>
          <Text style={styles.previewDuration}>{formatTime(seconds)}</Text>

          {/* Playback waveform */}
          <View style={styles.playbackRow}>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => setIsPlaying(v => !v)}
              activeOpacity={0.85}
            >
              <Text style={styles.playBtnText}>{isPlaying ? '\u23F8' : '\u25B6\uFE0F'}</Text>
            </TouchableOpacity>
            <View style={styles.waveform}>
              {bars.map((_, i) => {
                const played = i < BAR_COUNT * 0.4;
                return (
                  <View key={i} style={[styles.waveBar, played && styles.waveBarPlayed]} />
                );
              })}
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.deleteBtn} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.deleteBtnText}>\u{1F5D1}\uFE0F Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendBtn} onPress={() => onSend(seconds)} activeOpacity={0.85}>
              <Text style={styles.sendBtnText}>\u27A4 Send</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.rerecordBtn} onPress={() => { setSeconds(0); setState('recording'); }} activeOpacity={0.8}>
            <Text style={styles.rerecordBtnText}>\u{1F504}  Re-record</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface, alignItems: 'center' },
  cancelLink: { alignSelf: 'flex-start', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  cancelText: { ...typography['label-md'], color: colors.tertiary },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: rw(6.2), gap: rh(2.4) },
  micCircle: { backgroundColor: `${colors.primary_container}33`, alignItems: 'center', justifyContent: 'center' },
  micEmoji: { fontSize: rf(4.7) },
  recordingLabel: { ...typography['label-sm'], color: colors.primary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  timer: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface },
  waveform: { flexDirection: 'row', alignItems: 'center', height: rh(7.1), gap: rw(0.8), width: '100%' },
  waveBar: { flex: 1, height: '100%', backgroundColor: colors.primary_container, borderRadius: 2, transformOrigin: 'center' },
  waveBarPlayed: { backgroundColor: colors.secondary_container },
  stopBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  stopBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  slideHint: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  previewLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5 },
  previewDuration: { ...typography['label-md'], color: `${colors.on_surface}99` },
  playbackRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), width: '100%' },
  playBtn: { width: rw(10.3), height: rw(10.3), borderRadius: rw(5.1), backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  playBtnText: { fontSize: rf(2.1) },
  actionRow: { flexDirection: 'row', gap: rw(3.1), width: '100%' },
  deleteBtn: { flex: 1, height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { ...typography['label-lg'], color: colors.primary },
  sendBtn: { flex: 1, height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { ...typography['label-lg'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  rerecordBtn: { width: '100%', height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  rerecordBtnText: { ...typography['label-lg'], color: colors.primary },
});
