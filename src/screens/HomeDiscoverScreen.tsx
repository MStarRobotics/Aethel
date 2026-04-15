import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Animated,
  StatusBar,
  PanResponder,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import TabBar, { TabName } from '../components/TabBar';

// Design canvas: 390 × 844
const SCREEN_W = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_W * 0.3;
const PHOTO_H = rh(42.7);   // 360px / 844 * 100

// ── Mock data ─────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  name: string;
  age: number;
  distance: string;
  bio: string;
  interests: string[];
  compatibility: number;
  photo: string;
}

const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 26,
    distance: '2 km',
    bio: 'Coffee addict & book lover 📚. Looking for someone who can quote Oscar Wilde.',
    interests: ['🎮 Gaming', '🎵 Music', '📚 Books'],
    compatibility: 92,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: '2',
    name: 'Emma',
    age: 24,
    distance: '5 km',
    bio: 'Architect by day, jazz lover by night 🎷. Midnight walks are my love language.',
    interests: ['🎨 Art', '✈️ Travel', '🎵 Music'],
    compatibility: 87,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
  },
  {
    id: '3',
    name: 'Mia',
    age: 28,
    distance: '8 km',
    bio: 'Curator of beautiful things and terrible puns 🌙.',
    interests: ['🎨 Art', '📚 Books', '☕ Coffee'],
    compatibility: 85,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
  },
];

const FILTER_CHIPS = ['All', '🔥 Hot', '🆕 New', '📍 Nearby', '⭐ Top Match'];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  onNotifications: () => void;
  onSettings: () => void;
  onCardTap: (profile: Profile) => void;
  onSendMessage: (profile: Profile) => void;
  onAdjustPreferences: () => void;
  onTabPress: (tab: TabName) => void;
  activeTab?: TabName;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeDiscoverScreen({
  onNotifications,
  onSettings,
  onCardTap,
  onSendMessage,
  onAdjustPreferences,
  onTabPress,
  activeTab = 'feed',
}: Props) {
  const insets = useSafeAreaInsets();

  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [activeFilter, setActiveFilter] = useState('All');
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);

  // Swipe animation values
  const pan = useRef(new Animated.ValueXY()).current;
  const cardRotate = pan.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD / 2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD / 2, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const currentProfile = profiles[0];

  const dismissCard = useCallback((direction: 'left' | 'right' | 'up') => {
    const toX = direction === 'left' ? -SCREEN_W * 1.5
              : direction === 'right' ? SCREEN_W * 1.5 : 0;
    const toY = direction === 'up' ? -SCREEN_W * 1.5 : 0;

    Animated.timing(pan, {
      toValue: { x: toX, y: toY },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      if (direction === 'right') {
        // 30% chance of match for demo
        if (Math.random() < 0.3) setMatchProfile(currentProfile);
      }
      setProfiles((prev) => prev.slice(1));
    });
  }, [pan, currentProfile]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD) {
          dismissCard('right');
        } else if (gs.dx < -SWIPE_THRESHOLD) {
          dismissCard('left');
        } else if (gs.dy < -SWIPE_THRESHOLD) {
          dismissCard('up');
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const cardStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { rotate: cardRotate },
    ],
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={onNotifications}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSettings}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Filter chips — horizontal scroll ───────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {FILTER_CHIPS.map((chip) => {
          const isActive = chip === activeFilter;
          return (
            <TouchableOpacity
              key={chip}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(chip)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {chip}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Card stack ─────────────────────────────────────────────────────── */}
      <View style={styles.cardArea}>
        {profiles.length === 0 ? (
          // Empty state
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌙</Text>
            <Text style={styles.emptyTitle}>You've seen everyone nearby!</Text>
            <Text style={styles.emptyBody}>
              Expand your distance or check back later.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={onAdjustPreferences}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyBtnText}>Adjust Preferences</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Background card (next in stack) */}
            {profiles[1] && (
              <View style={[styles.card, styles.cardBehind]} pointerEvents="none">
                <Image
                  source={{ uri: profiles[1].photo }}
                  style={styles.cardPhoto}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Top card — swipeable */}
            <Animated.View
              style={[styles.card, cardStyle]}
              {...panResponder.panHandlers}
            >
              {/* Photo */}
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => onCardTap(currentProfile)}
                style={styles.photoWrapper}
              >
                <Image
                  source={{ uri: currentProfile.photo }}
                  style={styles.cardPhoto}
                  resizeMode="cover"
                />
                {/* Bottom gradient over photo */}
                <LinearGradient
                  colors={['transparent', colors.surface_container]}
                  style={styles.photoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  pointerEvents="none"
                />
                {/* Compat bar — overlaid on photo bottom */}
                <View style={styles.compatWrapper}>
                  <View style={styles.compatRow}>
                    <Text style={styles.compatLabel}>Compatibility</Text>
                    <Text style={styles.compatPct}>{currentProfile.compatibility}%</Text>
                  </View>
                  <View style={styles.compatTrack}>
                    <LinearGradient
                      colors={[colors.primary_container, colors.secondary_container]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.compatFill,
                        { width: `${currentProfile.compatibility}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* Swipe overlays */}
                <Animated.View
                  style={[styles.overlay, styles.overlayLike, { opacity: likeOpacity }]}
                  pointerEvents="none"
                >
                  <Text style={styles.overlayText}>❤️ LIKE</Text>
                </Animated.View>
                <Animated.View
                  style={[styles.overlay, styles.overlayNope, { opacity: nopeOpacity }]}
                  pointerEvents="none"
                >
                  <Text style={styles.overlayText}>✕ NOPE</Text>
                </Animated.View>
              </TouchableOpacity>

              {/* Profile info */}
              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>
                    {currentProfile.name}, {currentProfile.age}
                  </Text>
                  <Text style={styles.distanceText}>📍 {currentProfile.distance}</Text>
                </View>
                <Text style={styles.bioText} numberOfLines={2}>
                  {currentProfile.bio}
                </Text>
                <View style={styles.interestChips}>
                  {currentProfile.interests.slice(0, 3).map((interest) => (
                    <View key={interest} style={styles.interestChip}>
                      <Text style={styles.interestChipText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          </>
        )}
      </View>

      {/* ── Action buttons ──────────────────────────────────────────────────── */}
      {profiles.length > 0 && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.btnSkip}
            onPress={() => dismissCard('left')}
            activeOpacity={0.8}
            accessibilityLabel="Skip"
            accessibilityRole="button"
          >
            <Text style={styles.btnSkipIcon}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnLike}
            onPress={() => dismissCard('right')}
            activeOpacity={0.8}
            accessibilityLabel="Like"
            accessibilityRole="button"
          >
            <Text style={styles.btnLikeIcon}>♥</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSuperLike}
            onPress={() => dismissCard('up')}
            activeOpacity={0.8}
            accessibilityLabel="Super Like"
            accessibilityRole="button"
          >
            <Text style={styles.btnSuperLikeIcon}>⭐</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <TabBar active={activeTab} onPress={onTabPress} />

      {/* ── Match modal ─────────────────────────────────────────────────────── */}
      <Modal
        visible={matchProfile !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setMatchProfile(null)}
      >
        <View style={styles.matchOverlay}>
          <View style={styles.matchCard}>
            <Text style={styles.matchEmoji}>✨</Text>
            <Text style={styles.matchTitle}>IT'S A MATCH! 🎉</Text>
            <Text style={styles.matchSubtitle}>
              You and {matchProfile?.name} liked each other
            </Text>

            <View style={styles.matchPhotos}>
              <View style={styles.matchPhotoCircle}>
                <Text style={styles.matchPhotoPlaceholder}>You</Text>
              </View>
              <Text style={styles.matchHeart}>❤️</Text>
              <View style={styles.matchPhotoCircle}>
                {matchProfile?.photo ? (
                  <Image
                    source={{ uri: matchProfile.photo }}
                    style={styles.matchPhotoImg}
                  />
                ) : (
                  <Text style={styles.matchPhotoPlaceholder}>{matchProfile?.name}</Text>
                )}
              </View>
            </View>

            <Text style={styles.matchCompat}>
              {matchProfile?.compatibility}% Compatible
            </Text>

            <TouchableOpacity
              style={styles.matchPrimaryBtn}
              onPress={() => {
                setMatchProfile(null);
                if (matchProfile) onSendMessage(matchProfile);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.matchPrimaryBtnText}>Send a Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.matchSecondaryBtn}
              onPress={() => {
                setMatchProfile(null);
                if (matchProfile) onCardTap(matchProfile);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.matchSecondaryBtnText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMatchProfile(null)}
              accessibilityLabel="Keep discovering"
              accessibilityRole="button"
            >
              <Text style={styles.matchTertiaryText}>Keep Discovering</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const CARD_RADIUS = rw(6.2);   // 24px
const BTN_LG = rw(16.4);       // 64px
const BTN_MD = rw(20.5);       // 80px — like button larger
const BTN_SM = rw(14.4);       // 56px — super like

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface_container_lowest,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(6.2),
    paddingVertical: rh(1.4),
  },

  headerTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
  },

  headerIcons: {
    flexDirection: 'row',
    gap: rw(4.1),
  },

  headerIcon: {
    fontSize: rf(2.6),
    opacity: 0.6,
  },

  filterScroll: {
    flexGrow: 0,
    marginBottom: rh(1.9),
  },

  filterRow: {
    paddingHorizontal: rw(6.2),
    gap: rw(2.1),
    paddingVertical: rh(0.5),
  },

  filterChip: {
    height: rh(4.3),
    paddingHorizontal: rw(4.1),
    borderRadius: 9999,
    backgroundColor: colors.tertiary_container,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterChipActive: {
    backgroundColor: colors.secondary_container,
  },

  filterChipText: {
    ...typography['label-md'],
    color: colors.on_tertiary_container,
  },

  filterChipTextActive: {
    color: colors.on_secondary,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  // Card area — fills remaining space above action buttons
  cardArea: {
    flex: 1,
    paddingHorizontal: rw(6.2),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile card
  card: {
    width: '100%',
    backgroundColor: colors.surface_container,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.surface_container_lowest,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 40,
      },
      android: { elevation: 6 },
    }),
  },

  cardBehind: {
    position: 'absolute',
    transform: [{ rotate: '2deg' }, { translateX: rw(1) }, { translateY: rh(0.5) }],
    opacity: 0.5,
    zIndex: -1,
  },

  photoWrapper: {
    width: '100%',
    height: PHOTO_H,
    position: 'relative',
  },

  cardPhoto: {
    width: '100%',
    height: PHOTO_H,
    backgroundColor: colors.surface_container_high,
  },

  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PHOTO_H * 0.5,
  },

  // Compat bar — overlaid on photo bottom
  compatWrapper: {
    position: 'absolute',
    bottom: rh(1.9),
    left: rw(6.2),
    right: rw(6.2),
  },

  compatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rh(0.7),
  },

  compatLabel: {
    ...typography['label-sm'],
    color: `${colors.on_surface}99`,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  compatPct: {
    fontFamily: 'NotoSerif',
    fontSize: rf(2.1),
    color: colors.secondary_container,
    fontStyle: 'italic',
  },

  compatTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 9999,
    overflow: 'hidden',
  },

  compatFill: {
    height: '100%',
    borderRadius: 9999,
  },

  // Swipe overlays
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CARD_RADIUS,
  },

  overlayLike: {
    backgroundColor: `${colors.emerald}33`,
  },

  overlayNope: {
    backgroundColor: `${colors.primary_container}33`,
  },

  overlayText: {
    ...typography['headline-sm'],
    color: colors.on_surface,
    fontFamily: 'PlusJakartaSans-SemiBold',
    letterSpacing: 3,
  },

  // Card info section
  cardInfo: {
    padding: rw(6.2),
    paddingTop: rh(1.4),
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: rw(2.1),
    marginBottom: rh(0.7),
  },

  nameText: {
    fontFamily: 'NotoSerif',
    fontSize: rf(2.8),
    color: colors.on_surface,
  },

  distanceText: {
    ...typography['label-md'],
    color: colors.tertiary,
  },

  bioText: {
    ...typography['body-md'],
    color: `${colors.on_surface}B3`,
    marginBottom: rh(1.2),
  },

  interestChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rw(1.5),
  },

  interestChip: {
    backgroundColor: colors.tertiary_container,
    borderRadius: 9999,
    paddingHorizontal: rw(2.6),
    paddingVertical: rh(0.4),
  },

  interestChipText: {
    ...typography['label-sm'],
    color: colors.on_tertiary_container,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rw(4.1),
    paddingVertical: rh(2.4),
    paddingBottom: rh(12),   // clear tab bar
  },

  btnSkip: {
    width: BTN_LG,
    height: BTN_LG,
    borderRadius: BTN_LG / 2,
    backgroundColor: colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },

  btnSkipIcon: {
    fontSize: rf(2.6),
    color: colors.on_surface,
  },

  btnLike: {
    width: BTN_MD,
    height: BTN_MD,
    borderRadius: BTN_MD / 2,
    backgroundColor: colors.primary_container,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary_container,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },

  btnLikeIcon: {
    fontSize: rf(3.3),
    color: '#FFFFFF',
  },

  btnSuperLike: {
    width: BTN_SM,
    height: BTN_SM,
    borderRadius: BTN_SM / 2,
    backgroundColor: colors.secondary_container,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.secondary_container,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },

  btnSuperLikeIcon: {
    fontSize: rf(2.4),
    color: colors.on_secondary,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: rw(6.2),
  },

  emptyIcon: {
    fontSize: rf(7),
    marginBottom: rh(2.4),
  },

  emptyTitle: {
    fontFamily: 'NotoSerif',
    fontSize: rf(2.8),
    color: colors.on_surface,
    textAlign: 'center',
    marginBottom: rh(1.2),
  },

  emptyBody: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,
    textAlign: 'center',
    marginBottom: rh(3.6),
  },

  emptyBtn: {
    height: rh(6.6),
    paddingHorizontal: rw(8.2),
    backgroundColor: colors.secondary_container,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  // Match modal
  matchOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 11, 46, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rw(6.2),
  },

  matchCard: {
    width: '100%',
    backgroundColor: colors.surface_container,
    borderRadius: rw(6.2),
    padding: rw(6.2),
    alignItems: 'center',
  },

  matchEmoji: {
    fontSize: rf(4.7),
    marginBottom: rh(0.9),
  },

  matchTitle: {
    fontFamily: 'NotoSerif',
    fontSize: rf(5.3),
    color: colors.secondary_container,
    textAlign: 'center',
    marginBottom: rh(0.9),
  },

  matchSubtitle: {
    ...typography['body-md'],
    color: `${colors.on_surface}B3`,
    textAlign: 'center',
    marginBottom: rh(2.8),
  },

  matchPhotos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(4.1),
    marginBottom: rh(1.9),
  },

  matchPhotoCircle: {
    width: rw(25.6),
    height: rw(25.6),
    borderRadius: rw(12.8),
    backgroundColor: colors.surface_container_high,
    borderWidth: 2,
    borderColor: colors.primary_container,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  matchPhotoImg: {
    width: '100%',
    height: '100%',
  },

  matchPhotoPlaceholder: {
    ...typography['label-sm'],
    color: colors.on_surface,
  },

  matchHeart: {
    fontSize: rf(3.3),
  },

  matchCompat: {
    ...typography['label-md'],
    color: colors.emerald,
    marginBottom: rh(2.8),
  },

  matchPrimaryBtn: {
    width: '100%',
    height: rh(6.6),
    backgroundColor: colors.secondary_container,
    borderRadius: rw(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(1.4),
  },

  matchPrimaryBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  matchSecondaryBtn: {
    width: '100%',
    height: rh(6.6),
    borderRadius: rw(1),
    borderWidth: 1,
    borderColor: 'rgba(255,178,182,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(1.4),
  },

  matchSecondaryBtnText: {
    ...typography['label-lg'],
    color: colors.primary,
  },

  matchTertiaryText: {
    ...typography['body-md'],
    color: colors.tertiary,
    paddingVertical: rh(1.2),
  },
});
