import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Platform, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const CONFETTI_COLORS = [colors.primary_container, colors.secondary_container, colors.tertiary, colors.on_surface];

interface Particle { x: number; y: Animated.Value; rot: Animated.Value; color: string; size: number; }

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    y: new Animated.Value(-10),
    rot: new Animated.Value(0),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 5 + Math.random() * 6,
  }));
}

const WHATS_NEXT = [
  { icon: '\u23F3', text: 'Profile under review — usually within 24 hours' },
  { icon: '\u{1F4AC}', text: 'Answer more Q&A questions to boost compatibility' },
  { icon: '\u270F\uFE0F', text: 'Add profile prompts to stand out' },
  { icon: '\u{1F514}', text: "We'll notify you when your profile goes live" },
];

interface Props {
  userName?: string;
  onAnswerQuestions: () => void;
  onCheckStatus: () => void;
}

export default function OnboardingCompleteScreen({ userName = 'Sarah', onAnswerQuestions, onCheckStatus }: Props) {
  const insets = useSafeAreaInsets();
  const particles = useRef(makeParticles(80)).current;
  const titleScale = useRef(new Animated.Value(0.5)).current;
  const cardSlide = useRef(new Animated.Value(rh(5))).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const btnBounce = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Confetti
    particles.forEach((p, i) => {
      Animated.timing(p.y, { toValue: 110, duration: 2500 + Math.random() * 1000, delay: i * 25, useNativeDriver: true }).start();
      Animated.timing(p.rot, { toValue: 360, duration: 2000 + Math.random() * 1000, delay: i * 25, useNativeDriver: true }).start();
    });

    Animated.sequence([
      Animated.spring(titleScale, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(cardSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(listOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(btnBounce, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  const PHOTO_SIZE = rw(20.5); // ~80px

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* Radial glow */}
      <View style={styles.radialGlow} pointerEvents="none" />

      {/* Confetti */}
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

      <View style={styles.scroll}>
        {/* Tag + title */}
        <Text style={styles.tag}>YOU'RE ALMOST THERE!</Text>
        <Animated.Text style={[styles.title, { transform: [{ scale: titleScale }] }]}>
          Profile Submitted, {userName}! \u{1F389}
        </Animated.Text>
        <Text style={styles.subtitle}>
          Your profile is being reviewed by our team. We'll notify you when you're approved!
        </Text>

        {/* Profile preview card */}
        <Animated.View style={[styles.profileCard, { opacity: cardOpacity, transform: [{ translateY: cardSlide }] }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
            style={[styles.profilePhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]}
          />
          <Text style={styles.profileName}>{userName}, 26</Text>
          <Text style={styles.profileLocation}>\u{1F4CD} New York, NY</Text>
          <Text style={styles.profileQA}>47 Q&A answers</Text>
          <View style={styles.progressTrack}>
            <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: '80%' }]} />
          </View>
          <Text style={styles.progressLabel}>80% complete</Text>
        </Animated.View>

        {/* What's next */}
        <Text style={styles.sectionLabel}>WHAT'S NEXT?</Text>
        <Animated.View style={[styles.nextList, { opacity: listOpacity }]}>
          {WHATS_NEXT.map((item, i) => (
            <View key={i} style={styles.nextItem}>
              <Text style={styles.nextIcon}>{item.icon}</Text>
              <Text style={styles.nextText}>{item.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.btns, { transform: [{ scale: btnBounce }] }]}>
          <LinearGradient colors={['#FFB2B6', colors.primary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGradient}>
            <TouchableOpacity style={styles.ctaBtn} onPress={onAnswerQuestions} activeOpacity={0.85}>
              <Text style={styles.ctaBtnText}>\u{1F4AC}  Answer Questions Now</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity onPress={onCheckStatus}>
            <Text style={styles.statusLink}>Check Review Status</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  radialGlow: { position: 'absolute', top: -rh(5), alignSelf: 'center', width: rw(77), height: rw(77), borderRadius: rw(38.5), backgroundColor: `${colors.primary_container}1A` },
  confetti: { position: 'absolute', top: 0, borderRadius: 2 },
  scroll: { flex: 1, paddingHorizontal: rw(6.2), alignItems: 'center', justifyContent: 'center', gap: rh(1.9) },
  tag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  title: { fontFamily: 'NotoSerif', fontSize: rf(3.8), color: colors.on_surface, textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center', maxWidth: rw(77) },
  profileCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(0.7) },
  profilePhoto: { borderWidth: 2, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high, marginBottom: rh(0.5) },
  profileName: { ...typography['title-md'], color: colors.on_surface },
  profileLocation: { ...typography['label-md'], color: colors.tertiary },
  profileQA: { ...typography['label-sm'], color: colors.emerald },
  progressTrack: { width: '100%', height: 6, backgroundColor: colors.surface_container_high, borderRadius: 9999, overflow: 'hidden', marginTop: rh(0.5) },
  progressFill: { height: '100%', borderRadius: 9999 },
  progressLabel: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, alignSelf: 'flex-start' },
  nextList: { width: '100%', gap: rh(1.2) },
  nextItem: { flexDirection: 'row', alignItems: 'flex-start', gap: rw(3.1) },
  nextIcon: { fontSize: rf(1.9), marginTop: rh(0.2) },
  nextText: { ...typography['body-md'], color: `${colors.on_surface}B3`, flex: 1 },
  btns: { width: '100%', gap: rh(1.2), alignItems: 'center' },
  ctaGradient: { width: '100%', borderRadius: 9999, ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 }, android: { elevation: 8 } }) },
  ctaBtn: { height: rh(6.6), alignItems: 'center', justifyContent: 'center' },
  ctaBtnText: { ...typography['title-md'], color: '#FFFFFF', letterSpacing: 1 },
  statusLink: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
});
