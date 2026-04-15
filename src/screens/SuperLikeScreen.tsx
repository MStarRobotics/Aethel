import React, { useRef, useEffect } from 'react';
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

type Mode = 'received' | 'sent';

interface StarParticle { x: number; y: Animated.Value; opacity: Animated.Value; scale: Animated.Value; }

function makeStars(count: number): StarParticle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: new Animated.Value(Math.random() * 80),
    opacity: new Animated.Value(0.4 + Math.random() * 0.6),
    scale: new Animated.Value(0.6 + Math.random() * 0.8),
  }));
}

interface Props {
  mode?: Mode;
  matchName?: string;
  matchPhoto?: string;
  superLikesLeft?: number;
  onLikeBack: () => void;
  onViewProfile: () => void;
  onMaybeLater: () => void;
  onGetMore: () => void;
  onContinueSwiping: () => void;
}

export default function SuperLikeScreen({
  mode = 'received',
  matchName = 'Sarah',
  matchPhoto = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  superLikesLeft = 2,
  onLikeBack, onViewProfile, onMaybeLater, onGetMore, onContinueSwiping,
}: Props) {
  const insets = useSafeAreaInsets();
  const stars = useRef(makeStars(24)).current;

  // Star twinkle animations
  useEffect(() => {
    stars.forEach(star => {
      const twinkle = () => Animated.sequence([
        Animated.timing(star.opacity, { toValue: 0.2, duration: 800 + Math.random() * 800, useNativeDriver: true }),
        Animated.timing(star.opacity, { toValue: 1.0, duration: 800 + Math.random() * 800, useNativeDriver: true }),
      ]).start(() => twinkle());
      twinkle();
    });
  }, []);

  // Photo pulse
  const photoPulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = () => Animated.sequence([
      Animated.timing(photoPulse, { toValue: 1.04, duration: 900, useNativeDriver: true }),
      Animated.timing(photoPulse, { toValue: 1.0,  duration: 900, useNativeDriver: true }),
    ]).start(() => pulse());
    pulse();
  }, []);

  const PHOTO_SIZE = rw(41); // ~160px

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* Star particles */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((star, i) => (
          <Animated.Text
            key={i}
            style={[styles.starParticle, {
              left: `${star.x}%`,
              top: star.y.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              opacity: star.opacity,
              transform: [{ scale: star.scale }],
            }]}
          >
            \u2B50
          </Animated.Text>
        ))}
      </View>

      {/* Radial glow behind photo */}
      <View style={styles.radialGlow} pointerEvents="none" />

      {mode === 'received' ? (
        <View style={styles.content}>
          <Text style={styles.tag}>SUPER LIKE!</Text>
          <Text style={styles.headline}>Someone Thinks You're{'\n'}Amazing \u2B50</Text>

          {/* Profile photo */}
          <Animated.View style={[styles.photoWrapper, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2, transform: [{ scale: photoPulse }] }]}>
            <Image source={{ uri: matchPhoto }} style={[styles.photo, { borderRadius: PHOTO_SIZE / 2 }]} />
          </Animated.View>

          {/* Stars below photo */}
          <View style={styles.starsRow}>
            {[0, 1, 2].map(i => <Text key={i} style={styles.starIcon}>\u2B50</Text>)}
          </View>

          <Text style={styles.superLikedText}>{matchName} super liked you!</Text>
          <Text style={styles.superLikedSub}>"She thinks you're amazing"</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaName}>{matchName}, 26</Text>
            <Text style={styles.metaDist}>\u{1F4CD} 2 km</Text>
            <Text style={styles.metaCompat}>92% \u2665</Text>
          </View>

          <View style={styles.btns}>
            <TouchableOpacity style={styles.likeBackBtn} onPress={onLikeBack} activeOpacity={0.85}>
              <Text style={styles.likeBackBtnText}>\u2764\uFE0F  Like Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={onViewProfile} activeOpacity={0.8}>
              <Text style={styles.ghostBtnText}>\u{1F464}  View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onMaybeLater}>
              <Text style={styles.tertiaryText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.sentTag}>\u2B50 SUPER LIKE SENT!</Text>
          <Text style={styles.sentHeadline}>You super liked {matchName}!</Text>
          <Text style={styles.sentSub}>She'll be notified.</Text>

          <View style={styles.sentCountCard}>
            <Text style={styles.sentCountText}>You have {superLikesLeft} Super Likes left today.</Text>
          </View>

          <View style={styles.btns}>
            <TouchableOpacity style={styles.ghostBtn} onPress={onGetMore} activeOpacity={0.8}>
              <Text style={styles.ghostBtnText}>Get More Super Likes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onContinueSwiping}>
              <Text style={styles.tertiaryText}>Continue Swiping</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest, alignItems: 'center', justifyContent: 'center' },
  starParticle: { position: 'absolute', fontSize: rf(1.6), color: colors.secondary_container },
  radialGlow: {
    position: 'absolute', width: rw(61.5), height: rw(61.5), borderRadius: rw(30.8),
    backgroundColor: `${colors.secondary_container}1A`,
    top: '25%', alignSelf: 'center',
  },
  content: { width: '100%', paddingHorizontal: rw(6.2), alignItems: 'center', gap: rh(1.4) },
  tag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center', letterSpacing: -0.3 },
  photoWrapper: {
    overflow: 'hidden', borderWidth: 3, borderColor: colors.secondary_container,
    ...Platform.select({
      ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 30 },
      android: { elevation: 10 },
    }),
  },
  photo: { width: '100%', height: '100%' },
  starsRow: { flexDirection: 'row', gap: rw(2.1) },
  starIcon: { fontSize: rf(2.4), color: colors.secondary_container },
  superLikedText: { ...typography['title-md'], color: colors.on_surface },
  superLikedSub: { ...typography['body-md'], color: `${colors.on_surface}99` },
  metaRow: { flexDirection: 'row', gap: rw(3.1), alignItems: 'center' },
  metaName: { ...typography['label-md'], color: colors.tertiary },
  metaDist: { ...typography['label-md'], color: colors.tertiary },
  metaCompat: { ...typography['label-md'], color: colors.emerald },
  btns: { width: '100%', gap: rh(1.2), alignItems: 'center', marginTop: rh(0.9) },
  likeBackBtn: {
    width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container,
    borderRadius: 9999, alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  likeBackBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  ghostBtn: { width: '100%', height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
  tertiaryText: { ...typography['body-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
  sentTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  sentHeadline: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, textAlign: 'center' },
  sentSub: { ...typography['body-md'], color: `${colors.on_surface}99` },
  sentCountCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), paddingHorizontal: rw(4.1), paddingVertical: rh(1.4) },
  sentCountText: { ...typography['label-md'], color: `${colors.on_surface}B3` },
});
