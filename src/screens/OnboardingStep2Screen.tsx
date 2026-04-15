/**
 * Onboarding Step 2 — Profile Photos
 *
 * Requires: expo-image-picker
 * Install:  npx expo install expo-image-picker
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Modal,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Design canvas: 390 × 844 (iPhone 14)
// Width%  = (px / 390) * 100
// Height% = (px / 844) * 100

const TOTAL_STEPS = 6;
const CURRENT_STEP = 2;
const PROGRESS = CURRENT_STEP / TOTAL_STEPS; // 33.3%

const MAX_PHOTOS = 6;

// Main slot: 180×180px on canvas
const MAIN_SLOT_SIZE = rw(46.2);  // 180 / 390 * 100

// Secondary slots: 100×100px on canvas, 3-column grid with 8px gaps
// Available width = screen - 2×24px padding - 2×8px gaps = 390 - 48 - 16 = 326px
// Each slot = 326 / 3 ≈ 108px → use rw to keep it responsive
const SEC_SLOT_SIZE = rw(27.7);   // ~108px

const SLOT_RADIUS = rw(4.1);      // 16px / 390 * 100
const SLOT_GAP = rw(2.1);         // 8px / 390 * 100

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PhotoSlot {
  uri: string | null;
}

export interface OnboardingStep2Data {
  photos: string[];  // URIs of selected photos, index 0 = main
}

interface Props {
  onBack: () => void;
  onContinue: (data: OnboardingStep2Data) => void;
  onSkip: () => void;
  onPhotoGuide: () => void;
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function OnboardingStep2Screen({
  onBack,
  onContinue,
  onSkip,
  onPhotoGuide,
}: Props) {
  const insets = useSafeAreaInsets();

  const [photos, setPhotos] = useState<Array<string | null>>(
    Array(MAX_PHOTOS).fill(null)
  );
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number>(0);

  const filledCount = photos.filter(Boolean).length;

  // ── Permission + picker helpers ───────────────────────────────────────────

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const pickFromCamera = useCallback(async () => {
    setSheetVisible(false);
    const granted = await requestCameraPermission();
    if (!granted) {
      Alert.alert('Permission needed', 'Camera access is required to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      insertPhoto(result.assets[0].uri);
    }
  }, [activeSlot, photos]);

  const pickFromLibrary = useCallback(async () => {
    setSheetVisible(false);
    const granted = await requestLibraryPermission();
    if (!granted) {
      Alert.alert('Permission needed', 'Photo library access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      insertPhoto(result.assets[0].uri);
    }
  }, [activeSlot, photos]);

  const insertPhoto = useCallback((uri: string) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[activeSlot] = uri;
      return next;
    });
  }, [activeSlot]);

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

  const openSheet = useCallback((slotIndex: number) => {
    setActiveSlot(slotIndex);
    setSheetVisible(true);
  }, []);

  const handleContinue = () => {
    const filled = photos.filter(Boolean) as string[];
    if (filled.length === 0) {
      Alert.alert('Add a photo', 'Please add at least one photo to continue.');
      return;
    }
    onContinue({ photos: filled });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.surface_container_lowest}
        translucent
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aethel</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      <View style={styles.progressTrack}>
        <LinearGradient
          colors={[colors.primary_container, colors.secondary_container]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]}
        />
      </View>

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + rh(16) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tag + Headline */}
        <View style={styles.headingBlock}>
          <Text style={styles.tag}>YOUR PHOTOS</Text>
          <Text style={styles.headline}>Add Your Photos</Text>
          <Text style={styles.subheadline}>Show your best self</Text>
        </View>

        {/* ── Photo grid ───────────────────────────────────────────────────── */}
        <View style={styles.gridWrapper}>

          {/* Top row: main slot (large) + slot 1 (secondary) */}
          <View style={styles.topRow}>
            <PhotoSlotMain
              uri={photos[0]}
              onPress={() => photos[0] ? null : openSheet(0)}
              onDelete={() => removePhoto(0)}
              onAdd={() => openSheet(0)}
            />
            <PhotoSlotSecondary
              uri={photos[1]}
              onPress={() => photos[1] ? null : openSheet(1)}
              onDelete={() => removePhoto(1)}
              onAdd={() => openSheet(1)}
            />
          </View>

          {/* Bottom rows: slots 2–5 in a 3-column grid */}
          <View style={styles.secGrid}>
            {[2, 3, 4, 5].map((i) => (
              <PhotoSlotSecondary
                key={i}
                uri={photos[i]}
                onPress={() => photos[i] ? null : openSheet(i)}
                onDelete={() => removePhoto(i)}
                onAdd={() => openSheet(i)}
              />
            ))}
          </View>

          {/* Photo count indicator */}
          <Text style={styles.photoCount}>
            {filledCount} of {MAX_PHOTOS} photos added
          </Text>
        </View>

        {/* ── Photo tips ───────────────────────────────────────────────────── */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsLabel}>💡 PHOTO TIPS</Text>
          <View style={styles.tipsList}>
            {[
              'Clear face photo — no filters',
              'Smile — it increases your match rate',
              'No sunglasses or hats for your main photo',
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={onPhotoGuide}
            accessibilityLabel="See full photo guide"
            accessibilityRole="link"
          >
            <Text style={styles.tipsLink}>See Full Photo Guide →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Sticky footer ──────────────────────────────────────────────────── */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + rh(1.9) },
        ]}
      >
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
          accessibilityLabel="Continue to step 3"
          accessibilityRole="button"
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={onSkip}
          accessibilityLabel="Skip for now"
          accessibilityRole="button"
        >
          <Text style={styles.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

      {/* ── Photo source bottom sheet ───────────────────────────────────────── */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable
          style={styles.sheetOverlay}
          onPress={() => setSheetVisible(false)}
        >
          <View
            style={[
              styles.sheet,
              { paddingBottom: insets.bottom + rh(2) },
            ]}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add Photo</Text>

            <TouchableOpacity
              style={styles.sheetItem}
              onPress={pickFromCamera}
              accessibilityLabel="Take a photo"
              accessibilityRole="button"
            >
              <Text style={styles.sheetItemIcon}>📷</Text>
              <Text style={styles.sheetItemText}>Take a Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetItem}
              onPress={pickFromLibrary}
              accessibilityLabel="Choose from library"
              accessibilityRole="button"
            >
              <Text style={styles.sheetItemIcon}>🖼️</Text>
              <Text style={styles.sheetItemText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sheetItem, styles.sheetItemCancel]}
              onPress={() => setSheetVisible(false)}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
            >
              <Text style={styles.sheetItemIcon}>✕</Text>
              <Text style={[styles.sheetItemText, styles.sheetItemCancelText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// ── PhotoSlotMain ─────────────────────────────────────────────────────────────

interface SlotProps {
  uri: string | null;
  onPress: () => void;
  onDelete: () => void;
  onAdd: () => void;
}

function PhotoSlotMain({ uri, onPress, onDelete, onAdd }: SlotProps) {
  return (
    <View style={mainSlotStyles.wrapper}>
      <TouchableOpacity
        style={mainSlotStyles.slot}
        onPress={uri ? undefined : onAdd}
        activeOpacity={uri ? 1 : 0.75}
        accessibilityLabel={uri ? 'Main profile photo' : 'Add main profile photo'}
        accessibilityRole="button"
      >
        {uri ? (
          <Image source={{ uri }} style={mainSlotStyles.image} resizeMode="cover" />
        ) : (
          <View style={mainSlotStyles.empty}>
            <Text style={mainSlotStyles.addIcon}>＋</Text>
            <Text style={mainSlotStyles.addLabel}>Tap to upload</Text>
          </View>
        )}

        {/* MAIN badge — always visible */}
        <View style={mainSlotStyles.badge}>
          <Text style={mainSlotStyles.badgeStar}>★</Text>
          <Text style={mainSlotStyles.badgeText}>MAIN</Text>
        </View>
      </TouchableOpacity>

      {/* Delete button — only when filled */}
      {uri && (
        <TouchableOpacity
          style={mainSlotStyles.deleteBtn}
          onPress={onDelete}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          accessibilityLabel="Remove main photo"
          accessibilityRole="button"
        >
          <Text style={mainSlotStyles.deleteIcon}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const mainSlotStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  slot: {
    width: MAIN_SLOT_SIZE,
    height: MAIN_SLOT_SIZE,
    borderRadius: SLOT_RADIUS,
    backgroundColor: colors.surface_container,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  empty: {
    alignItems: 'center',
    gap: rh(0.7),
  },
  addIcon: {
    fontSize: rf(4.7),
    color: `${colors.on_surface}66`,  // 40% opacity
  },
  addLabel: {
    ...typography['label-sm'],
    color: `${colors.on_surface}66`,
  },
  badge: {
    position: 'absolute',
    bottom: rw(2.6),
    left: rw(2.6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(1),
    backgroundColor: colors.secondary_container,
    borderRadius: 9999,
    paddingHorizontal: rw(2.6),
    paddingVertical: rh(0.5),
  },
  badgeStar: {
    fontSize: rf(1.3),
    color: colors.on_secondary,
  },
  badgeText: {
    ...typography['label-sm'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },
  deleteBtn: {
    position: 'absolute',
    top: rw(2.1),
    right: rw(2.1),
    width: rw(7.2),   // 28px
    height: rw(7.2),
    borderRadius: rw(3.6),
    backgroundColor: colors.primary_container,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  deleteIcon: {
    fontSize: rf(2.1),
    color: colors.on_surface,
    lineHeight: rf(2.4),
  },
});

// ── PhotoSlotSecondary ────────────────────────────────────────────────────────

function PhotoSlotSecondary({ uri, onPress, onDelete, onAdd }: SlotProps) {
  return (
    <View style={secSlotStyles.wrapper}>
      <TouchableOpacity
        style={secSlotStyles.slot}
        onPress={uri ? undefined : onAdd}
        activeOpacity={uri ? 1 : 0.75}
        accessibilityLabel={uri ? 'Profile photo' : 'Add photo'}
        accessibilityRole="button"
      >
        {uri ? (
          <Image source={{ uri }} style={secSlotStyles.image} resizeMode="cover" />
        ) : (
          <Text style={secSlotStyles.addIcon}>＋</Text>
        )}
      </TouchableOpacity>

      {uri && (
        <TouchableOpacity
          style={secSlotStyles.deleteBtn}
          onPress={onDelete}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          accessibilityLabel="Remove photo"
          accessibilityRole="button"
        >
          <Text style={secSlotStyles.deleteIcon}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const secSlotStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  slot: {
    width: SEC_SLOT_SIZE,
    height: SEC_SLOT_SIZE,
    borderRadius: SLOT_RADIUS,
    backgroundColor: colors.surface_container,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addIcon: {
    fontSize: rf(3.3),
    color: `${colors.on_surface}66`,  // 40% opacity
  },
  deleteBtn: {
    position: 'absolute',
    top: rw(1.5),
    right: rw(1.5),
    width: rw(6.2),   // ~24px
    height: rw(6.2),
    borderRadius: rw(3.1),
    backgroundColor: colors.primary_container,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  deleteIcon: {
    fontSize: rf(1.9),
    color: colors.on_surface,
    lineHeight: rf(2.2),
  },
});

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface_container_lowest,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4.6),
    paddingVertical: rh(1.2),
    backgroundColor: colors.surface_container_lowest,
  },

  backBtn: {
    padding: rw(2),
    width: rw(10.3),
  },

  backIcon: {
    ...typography['title-lg'],
    color: colors.primary,
  },

  headerTitle: {
    ...typography['headline-sm'],
    color: colors.on_surface,
    fontStyle: 'italic',
  },

  headerSpacer: {
    width: rw(10.3),
  },

  // Progress bar
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.surface_container,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 9999,
  },

  scroll: {
    paddingHorizontal: rw(6.2),
    paddingTop: rh(3.6),
  },

  // Tag + Headline
  headingBlock: {
    marginBottom: rh(3.6),
    paddingRight: rw(12.3),
  },

  tag: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(0.7),
  },

  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: rh(0.7),
  },

  subheadline: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,
  },

  // Photo grid
  gridWrapper: {
    marginBottom: rh(3.8),
  },

  topRow: {
    flexDirection: 'row',
    gap: SLOT_GAP,
    marginBottom: SLOT_GAP,
    alignItems: 'flex-start',
  },

  secGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SLOT_GAP,
  },

  photoCount: {
    ...typography['label-sm'],
    color: `${colors.on_surface}66`,
    marginTop: rh(1.4),
  },

  // Photo tips
  tipsSection: {
    marginBottom: rh(3.8),
  },

  tipsLabel: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: rh(1.4),
  },

  tipsList: {
    gap: rh(0.9),
    marginBottom: rh(1.9),
  },

  tipRow: {
    flexDirection: 'row',
    gap: rw(2.1),
    alignItems: 'flex-start',
  },

  tipBullet: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,
    lineHeight: rf(2.4),
  },

  tipText: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,
    flex: 1,
  },

  tipsLink: {
    ...typography['label-md'],
    color: colors.tertiary,
  },

  // Sticky footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: rw(6.2),
    paddingTop: rh(1.9),
    backgroundColor: 'rgba(21, 6, 41, 0.92)',
    ...Platform.select({
      ios: {
        shadowColor: colors.surface_container_lowest,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.7,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },

  continueBtn: {
    height: rh(6.6),
    backgroundColor: colors.secondary_container,
    borderRadius: rw(2.1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(0.9),
    ...Platform.select({
      ios: {
        shadowColor: colors.secondary_container,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },

  continueBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  skipBtn: {
    alignItems: 'center',
    paddingVertical: rh(1.2),
  },

  skipBtnText: {
    ...typography['label-md'],
    color: colors.tertiary,
  },

  // Bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 6, 41, 0.6)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: 'rgba(46, 26, 64, 0.97)',
    borderTopLeftRadius: rw(6.2),
    borderTopRightRadius: rw(6.2),
    paddingTop: rh(1.4),
    paddingHorizontal: rw(6.2),
  },

  sheetHandle: {
    width: rw(8.2),
    height: 4,
    borderRadius: 9999,
    backgroundColor: `${colors.on_surface}4D`,
    alignSelf: 'center',
    marginBottom: rh(2.4),
  },

  sheetTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
    marginBottom: rh(2.4),
  },

  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(4.1),
    paddingVertical: rh(1.9),
  },

  sheetItemCancel: {
    marginTop: rh(0.9),
    borderTopWidth: 1,
    borderTopColor: `${colors.on_surface}1A`,
  },

  sheetItemIcon: {
    fontSize: rf(2.6),
    width: rw(7.7),
    textAlign: 'center',
  },

  sheetItemText: {
    ...typography['body-lg'],
    color: colors.on_surface,
  },

  sheetItemCancelText: {
    color: colors.primary_container,
  },
});
