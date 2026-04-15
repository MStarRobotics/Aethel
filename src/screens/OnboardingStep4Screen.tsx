/**
 * Onboarding Step 4 — Location
 *
 * Requires: expo-location
 * Install:  npx expo install expo-location
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
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
const CURRENT_STEP = 4;
const PROGRESS = CURRENT_STEP / TOTAL_STEPS; // 66.7%

const ICON_SIZE = rw(20.5); // 80px / 390 * 100
const DEBOUNCE_MS = 300;

// ── Mock city search ──────────────────────────────────────────────────────────
// Replace with a real geocoding API (e.g. Google Places, OpenStreetMap Nominatim)

interface CityResult {
  id: string;
  label: string;
  flag: string;
  country: string;
}

function mockSearch(query: string): CityResult[] {
  if (!query.trim()) return [];
  const all: CityResult[] = [
    { id: '1', label: 'New York, NY',        flag: '🇺🇸', country: 'USA' },
    { id: '2', label: 'New York City, NY',   flag: '🇺🇸', country: 'USA' },
    { id: '3', label: 'Newark, NJ',          flag: '🇺🇸', country: 'USA' },
    { id: '4', label: 'London',              flag: '🇬🇧', country: 'UK' },
    { id: '5', label: 'Los Angeles, CA',     flag: '🇺🇸', country: 'USA' },
    { id: '6', label: 'Mumbai',              flag: '🇮🇳', country: 'India' },
    { id: '7', label: 'Paris',               flag: '🇫🇷', country: 'France' },
    { id: '8', label: 'Toronto',             flag: '🇨🇦', country: 'Canada' },
    { id: '9', label: 'Sydney',              flag: '🇦🇺', country: 'Australia' },
    { id: '10', label: 'Dubai',              flag: '🇦🇪', country: 'UAE' },
  ];
  const q = query.toLowerCase();
  return all.filter(
    (c) =>
      c.label.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OnboardingStep4Data {
  city: string;
  source: 'gps' | 'manual';
}

interface Props {
  onBack: () => void;
  onContinue: (data: OnboardingStep4Data) => void;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function OnboardingStep4Screen({ onBack, onContinue }: Props) {
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityResult[]>([]);
  const [selected, setSelected] = useState<CityResult | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsDenied, setGpsDenied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');

  // Search input focus animation
  const searchFocused = useRef(new Animated.Value(0)).current;
  const animateFocus = (focused: boolean) => {
    Animated.timing(searchFocused, {
      toValue: focused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const searchBorderColor = searchFocused.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(89,64,65,0.15)', colors.secondary],
  });

  // Debounced search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    setSelected(null);
    setError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const found = mockSearch(text);
      setResults(found);
      setShowDropdown(found.length > 0);
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // GPS location
  const handleUseCurrentLocation = async () => {
    setGpsLoading(true);
    setError('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsDenied(true);
        setGpsLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const city = [geo.city, geo.region, geo.country]
        .filter(Boolean)
        .join(', ');
      setSelected({ id: 'gps', label: city, flag: '📍', country: geo.country ?? '' });
      setQuery(city);
      setShowDropdown(false);
      setGpsDenied(false);
    } catch {
      setError('Could not detect location. Please search manually.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleSelectResult = (result: CityResult) => {
    setSelected(result);
    setQuery(result.label);
    setShowDropdown(false);
    setResults([]);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSelected(null);
    setResults([]);
    setShowDropdown(false);
  };

  const handleContinue = () => {
    if (!selected) {
      setError('Please select a location to continue.');
      return;
    }
    onContinue({
      city: selected.label,
      source: selected.id === 'gps' ? 'gps' : 'manual',
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.surface_container_lowest}
        translucent
      />

      {/* Ambient glows */}
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />

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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + rh(7)}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + rh(16) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Tag + Headline */}
          <View style={styles.headingBlock}>
            <Text style={styles.tag}>YOUR LOCATION</Text>
            <Text style={styles.headline}>Where Are You Based?</Text>
            <Text style={styles.subheadline}>
              We use your location to show you nearby matches.
            </Text>
          </View>

          {/* Location pin icon — 80px circle, crimson glow */}
          <View style={styles.iconWrapper}>
            <View
              style={[
                styles.iconCircle,
                { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 },
              ]}
            >
              <Text style={styles.iconEmoji}>📍</Text>
            </View>
          </View>

          {/* ── Use current location button ─────────────────────────────────── */}
          <TouchableOpacity
            style={styles.gpsBtn}
            onPress={handleUseCurrentLocation}
            disabled={gpsLoading}
            activeOpacity={0.8}
            accessibilityLabel="Use my current location"
            accessibilityRole="button"
          >
            {gpsLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.gpsBtnIcon}
              />
            ) : (
              <Text style={styles.gpsBtnIcon}>📍</Text>
            )}
            <Text style={styles.gpsBtnText}>
              {gpsLoading ? 'Detecting location…' : 'Use My Current Location'}
            </Text>
          </TouchableOpacity>

          {/* Permission denied message */}
          {gpsDenied && (
            <Text style={styles.deniedText}>
              No problem! Search for your city below.
            </Text>
          )}

          {/* OR separator — no lines, just spacing + muted text */}
          <View style={styles.orRow}>
            <Text style={styles.orText}>OR</Text>
          </View>

          {/* ── Search input + dropdown ─────────────────────────────────────── */}
          <View style={styles.searchWrapper}>
            <Animated.View
              style={[
                styles.searchContainer,
                {
                  borderBottomColor: searchBorderColor,
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={handleQueryChange}
                placeholder="Search city or ZIP code..."
                placeholderTextColor={`${colors.on_surface}4D`}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="search"
                onFocus={() => animateFocus(true)}
                onBlur={() => {
                  animateFocus(false);
                  // Delay hide so tap on result registers
                  setTimeout(() => setShowDropdown(false), 150);
                }}
                accessibilityLabel="Search city"
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearSearch}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Clear search"
                  accessibilityRole="button"
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Search results dropdown */}
            {showDropdown && results.length > 0 && (
              <View style={styles.dropdown}>
                {results.map((result, index) => (
                  <TouchableOpacity
                    key={result.id}
                    style={[
                      styles.dropdownItem,
                      index < results.length - 1 && styles.dropdownItemBorder,
                    ]}
                    onPress={() => handleSelectResult(result)}
                    activeOpacity={0.75}
                    accessibilityLabel={result.label}
                    accessibilityRole="menuitem"
                  >
                    <Text style={styles.dropdownFlag}>{result.flag}</Text>
                    <View style={styles.dropdownTextBlock}>
                      <Text style={styles.dropdownCity}>{result.label}</Text>
                      <Text style={styles.dropdownCountry}>{result.country}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Selected location — emerald */}
          {selected && (
            <Text style={styles.selectedText}>
              📍 Selected: {selected.label}
            </Text>
          )}

          {/* Error message */}
          {error.length > 0 && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {/* Privacy note */}
          <View style={styles.privacyRow}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.privacyText}>
              Your exact location is never shared with others.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Sticky footer ──────────────────────────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + rh(1.9) }]}>
        <TouchableOpacity
          style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
          accessibilityLabel="Continue to step 5"
          accessibilityRole="button"
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },

  root: {
    flex: 1,
    backgroundColor: colors.surface_container_lowest,
  },

  // Ambient glows
  glowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: rh(42),
    backgroundColor: 'rgba(178, 31, 60, 0.05)',
  },

  glowBottom: {
    position: 'absolute',
    bottom: -rw(15),
    right: -rw(15),
    width: rw(60),
    height: rw(60),
    borderRadius: rw(30),
    backgroundColor: 'rgba(253, 139, 0, 0.05)',
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

  headerSpacer: { width: rw(10.3) },

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
    alignItems: 'center',
  },

  // Tag + Headline — centered per HTML reference
  headingBlock: {
    alignItems: 'center',
    marginBottom: rh(3.6),
    width: '100%',
  },

  tag: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(0.9),
    textAlign: 'center',
  },

  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: rh(0.7),
    textAlign: 'center',
  },

  subheadline: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,
    textAlign: 'center',
    maxWidth: rw(71.8),  // 280px / 390 * 100
  },

  // Location pin icon — 80px circle, crimson glow
  iconWrapper: {
    alignSelf: 'center',
    marginBottom: rh(3.6),
    ...Platform.select({
      ios: {
        shadowColor: colors.primary_container,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 40,
      },
      android: { elevation: 8 },
    }),
  },

  iconCircle: {
    backgroundColor: colors.surface_container,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${colors.primary_container}33`,  // 20% opacity
  },

  iconEmoji: {
    fontSize: rf(4.7),
  },

  // GPS ghost button — transparent, pink border
  gpsBtn: {
    width: '100%',
    height: rh(6.6),  // 56px
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rw(2.6),
    borderRadius: rw(1.5),
    borderWidth: 1,
    borderColor: 'rgba(255, 178, 182, 0.20)',
    backgroundColor: 'transparent',
    marginBottom: rh(1.4),
  },

  gpsBtnIcon: {
    fontSize: rf(2.1),
  },

  gpsBtnText: {
    ...typography['label-lg'],
    color: colors.primary,
  },

  deniedText: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,
    textAlign: 'center',
    marginBottom: rh(1.4),
  },

  // OR — no lines, just spacing
  orRow: {
    alignItems: 'center',
    marginVertical: rh(2.4),
  },

  orText: {
    ...typography['label-sm'],
    color: `${colors.on_surface}4D`,  // 30% opacity
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Search input
  searchWrapper: {
    width: '100%',
    marginBottom: rh(1.4),
    zIndex: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface_container_highest,
    height: rh(6.6),
    borderTopLeftRadius: rw(3.1),
    borderTopRightRadius: rw(3.1),
    paddingHorizontal: rw(4.1),
    gap: rw(2.6),
  },

  searchIcon: {
    fontSize: rf(2.1),
    opacity: 0.6,
  },

  searchInput: {
    flex: 1,
    ...typography['body-lg'],
    color: colors.on_surface,
    padding: 0,
    margin: 0,
  },

  clearIcon: {
    ...typography['label-md'],
    color: `${colors.on_surface}66`,
  },

  // Dropdown — surface_container bg, rounded bottom, no border
  dropdown: {
    width: '100%',
    backgroundColor: colors.surface_container,
    borderBottomLeftRadius: rw(3.1),
    borderBottomRightRadius: rw(3.1),
    overflow: 'hidden',
    zIndex: 20,
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(3.1),
    paddingHorizontal: rw(4.1),
    height: rh(6.2),  // 52px
  },

  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: `${colors.outline_variant}26`,  // very subtle
  },

  dropdownFlag: {
    fontSize: rf(2.1),
  },

  dropdownTextBlock: {
    flex: 1,
  },

  dropdownCity: {
    ...typography['body-md'],
    color: colors.on_surface,
  },

  dropdownCountry: {
    ...typography['label-sm'],
    color: `${colors.on_surface}80`,
  },

  // Selected location — emerald
  selectedText: {
    ...typography['label-md'],
    color: colors.emerald,
    alignSelf: 'flex-start',
    marginBottom: rh(1.9),
  },

  errorText: {
    ...typography['label-sm'],
    color: colors.primary_container,
    alignSelf: 'flex-start',
    marginBottom: rh(1.4),
  },

  // Privacy note
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(2.1),
    marginTop: rh(1.9),
    alignSelf: 'center',
  },

  privacyIcon: {
    fontSize: rf(1.6),
    opacity: 0.5,
  },

  privacyText: {
    ...typography['label-sm'],
    color: `${colors.on_surface}66`,
    flexShrink: 1,
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
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
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

  continueBtnDisabled: {
    backgroundColor: colors.surface_container,
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },

  continueBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },
});
