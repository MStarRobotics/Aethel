import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Platform, Animated, StatusBar, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Confetti particle
interface Particle { x: number; y: Animated.Value; rot: Animated.Value; color: string; size: number; }

const CONFETTI_COLORS = [colors.primary_container, colors.secondary_container, colors.tertiary, colors.on_surface];

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    y: new Animated.Value(-10),
    rot: new Animated.Value(0),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 6,
  }));
}

interface Props {
  visible: boolean;
  matchName: string;
  matchPhoto: string;
  myPhoto: string;
  compatibility: number;
  onSendMessage: () => void;
  onViewProfile: () => void;
  onKeepDiscovering: () => void;
}

export default function MatchScreen({ visible, matchName, matchPhoto, myPhoto, compatibility, onSendMessage, onViewProfile, onKeepDiscovering }: Props) {
  const insets = useSafeAreaInsets();

  // Animations
  const titleScale   = useRef(new Animated.Value(0.5)).current;
  const photoLeft    = useRef(new Animated.Value(-rw(40))).current;
  const photoRight   = useRef(new Animated.Value(rw(40))).current;
  const heartScale   = useRef(new Animated.Value(1)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;
  const particles    = useRef(makeParticles(60)).current;

  useEffect(() => {
    if (!visible) return;
    // Reset
    titleScale.setValue(0.5);
    photoLeft.setValue(-rw(40));
    photoRight.setValue(rw(40));
    btnOpacity.setValue(0);
    particles.forEach(p => { p.y.setValue(-10); p.rot.setValue(0); });

    Animated.sequence([
      Animated.parallel([
        Animated.spring(titleScale, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
        Animated.spring(photoLeft,  { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.spring(photoRight, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Confetti
    particles.forEach((p, i) => {
      Animated.timing(p.y, { toValue: 110, duration: 2500 + Math.random() * 1000, delay: i * 30, useNativeDriver: true }).start();
      Animated.timing(p.rot, { toValue: 360, duration: 2000 + Math.random() * 1000, delay: i * 30, useNativeDriver: true }).start();
    });

    // Heart pulse loop
    const pulse = () => Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.25, duration: 400, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1.0,  duration: 400, useNativeDriver: true }),
    ]).start(() => pulse());
    pulse();
  }, [visible]);

  const CIRCLE = rw(25.6); // 100px

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onKeepDiscovering}>
      <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="light-content" />
        {/* Confetti layer */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {particles.map((p, i) => (
            <Animated.View key={i} style={[styles.confetti, {
              left: `${p.x}%`,
              width: p.size, height: p.size,
              backgroundColor: p.color,
              transform: [
                { translateY: p.y.interpolate({ inputRange: [0, 110], outputRange: [0, rh(100)] }) },
                { rotate: p.rot.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) },
              ],
            }]} />
          ))}
        </View>
        {/* Content */}
        <Animated.Text style={[styles.title, { transform: [{ scale: titleScale }] }]}>
          IT'S A MATCH! \u{1F389}
        </Animated.Text>
        <Text style={styles.subtitle}>You and {matchName} both liked each other!</Text>
        {/* Photos */}
        <View style={styles.photosRow}>
          <Animated.View style={[styles.photoCircle, { width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2, transform: [{ translateX: photoLeft }] }]}>
            <Image source={{ uri: myPhoto }} style={[styles.photoImg, { borderRadius: CIRCLE / 2 }]} />
          </Animated.View>
          <Animated.View style={[styles.heartWrapper, { transform: [{ scale: heartScale }] }]}>
            <Text style={styles.heartIcon}>\u2764\uFE0F</Text>
          </Animated.View>
          <Animated.View style={[styles.photoCircle, { width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2, transform: [{ translateX: photoRight }] }]}>
            <Image source={{ uri: matchPhoto }} style={[styles.photoImg, { borderRadius: CIRCLE / 2 }]} />
          </Animated.View>
        </View>
        <Text style={styles.compat}>{compatibility}% Compatible</Text>
        {/* Buttons */}
        <Animated.View style={[styles.btns, { opacity: btnOpacity }]}>
          <TouchableOpacity style={styles.primaryBtn} onPress={onSendMessage} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>\u{1F4AC} Send a Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} onPress={onViewProfile} activeOpacity={0.8}>
            <Text style={styles.ghostBtnText}>\u{1F464} View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onKeepDiscovering}>
            <Text style={styles.tertiaryText}>Keep Discovering</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2) },
  confetti: { position: 'absolute', top: 0, borderRadius: 2 },
  title: { fontFamily: 'NotoSerif', fontSize: rf(5.3), color: colors.secondary_container, textAlign: 'center', letterSpacing: -0.9, marginBottom: rh(1.2) },
  subtitle: { ...typography['body-lg'], color: `${colors.on_surface}CC`, textAlign: 'center', marginBottom: rh(3.6) },
  photosRow: { flexDirection: 'row', alignItems: 'center', gap: rw(4.1), marginBottom: rh(1.9) },
  photoCircle: { borderWidth: 3, borderColor: colors.primary_container, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20 }, android: { elevation: 8 } }) },
  photoImg: { width: '100%', height: '100%' },
  heartWrapper: { alignItems: 'center', justifyContent: 'center' },
  heartIcon: { fontSize: rf(4.7) },
  compat: { ...typography['label-md'], color: colors.emerald, marginBottom: rh(3.6) },
  btns: { width: '100%', gap: rh(1.4), alignItems: 'center' },
  primaryBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 }, android: { elevation: 6 } }) },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  ghostBtn: { width: '100%', height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
  tertiaryText: { ...typography['body-md'], color: colors.tertiary, paddingVertical: rh(1.2) },
});
