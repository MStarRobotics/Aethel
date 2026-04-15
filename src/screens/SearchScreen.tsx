import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  Platform,
  Animated,
  StatusBar,
  PanResponder,
  LayoutChangeEvent,
  Pressable,
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

// ── Mock data ─────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  name: string;
  age: number;
  occupation: string;
  compatibility: number;
  photo: string;
}

const MOCK_RESULTS: SearchResult[] = [
  { id: '1', name: 'Sarah',  age: 26, occupation: 'Artist',    compatibility: 92, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
  { id: '2', name: 'Emma',   age: 24, occupation: 'Architect', compatibility: 87, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300' },
  { id: '3', name: 'Mia',    age: 28, occupation: 'Curator',   compatibility: 85, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300' },
  { id: '4', name: 'Lily',   age: 25, occupation: 'Writer',    compatibility: 81, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300' },
  { id: '5', name: 'Zoe',    age: 27, occupation: 'Designer',  compatibility: 78, photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300' },
  { id: '6', name: 'Ava',    age: 23, occupation: 'Musician',  compatibility: 75, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300' },
];

const GENDER_OPTS = ['All', 'Men', 'Women', 'Other'] as const;
const GOAL_OPTS   = ['Casual', 'Serious', 'Friends'] as const;
const SORT_OPTS   = ['Best Match', 'Newest', 'Closest', 'Most Active', 'Highest Compat'] as const;

const THUMB_SIZE = rw(6.2);
const TRACK_H    = 4;

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  onProfileTap: (id: string) => void;
  onLike: (id: string) => void;
  onTabPress: (tab: TabName) => void;
  activeTab?: TabName;
}

type ViewMode = 'filters' | 'results';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function SearchScreen({
  onProfileTap,
  onLike,
  onTabPress,
  activeTab = 'search',
}: Props) {
  const insets = useSafeAreaInsets();

  const [viewMode, setViewMode] = useState<ViewMode>('filters');
  const [query, setQuery]       = useState('');
  const [ageMin, setAgeMin]     = useState(18);
  const [ageMax, setAgeMax]     = useState(35);
  const [distance, setDistance] = useState(25);
  const [gender, setGender]     = useState<string>('All');
  const [goals, setGoals]       = useState<Set<string>>(new Set());
  const [onlineOnly, setOnlineOnly]     = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy]     = useState('Best Match');
  const [showSort, setShowSort] = useState(false);

  // Search input focus animation
  const searchFocused = useRef(new Animated.Value(0)).current;
  const searchBorder  = searchFocused.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(89,64,65,0.15)', colors.secondary],
  });

  const toggleGoal = (g: string) => {
    setGoals(prev => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  const resetFilters = () => {
    setQuery(''); setAgeMin(18); setAgeMax(35); setDistance(25);
    setGender('All'); setGoals(new Set()); setOnlineOnly(false); setVerifiedOnly(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        {viewMode === 'results' ? (
          <TouchableOpacity onPress={() => setViewMode('filters')} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Filters</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.headerTitle}>Search</Text>
        )}
        {viewMode === 'results' && (
          <Text style={styles.resultCount}>{MOCK_RESULTS.length} Results</Text>
        )}
        <Text style={styles.headerIcon}>🔍</Text>
      </View>

      {viewMode === 'filters' ? (
        // ── FILTER VIEW ──────────────────────────────────────────────────────
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(14) }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search input */}
          <Animated.View style={[styles.searchContainer, { borderBottomColor: searchBorder, borderBottomWidth: 1 }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name..."
              placeholderTextColor={`${colors.on_surface}4D`}
              autoCapitalize="words"
              autoCorrect={false}
              onFocus={() => Animated.timing(searchFocused, { toValue: 1, duration: 180, useNativeDriver: false }).start()}
              onBlur={() => Animated.timing(searchFocused, { toValue: 0, duration: 180, useNativeDriver: false }).start()}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Age range */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>AGE RANGE</Text>
            <RangeSlider min={18} max={80} valueMin={ageMin} valueMax={ageMax} onChangeMin={setAgeMin} onChangeMax={setAgeMax} />
            <Text style={styles.sliderValue}>Showing ages {ageMin} – {ageMax}</Text>
          </View>

          {/* Distance */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DISTANCE</Text>
            <SingleSlider min={1} max={200} value={distance} onChange={setDistance} />
            <Text style={styles.sliderValue}>Within {distance} km</Text>
          </View>

          {/* Gender */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>GENDER</Text>
            <View style={styles.chipsRow}>
              {GENDER_OPTS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, gender === opt && styles.chipSelected]}
                  onPress={() => setGender(opt)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, gender === opt && styles.chipTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Looking for */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>LOOKING FOR</Text>
            <View style={styles.chipsRow}>
              {GOAL_OPTS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, goals.has(opt) && styles.chipSelected]}
                  onPress={() => toggleGoal(opt)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, goals.has(opt) && styles.chipTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Checkboxes */}
          <View style={styles.section}>
            <CheckRow label="Online now only"       checked={onlineOnly}   onToggle={() => setOnlineOnly(v => !v)} />
            <CheckRow label="Verified profiles only" checked={verifiedOnly} onToggle={() => setVerifiedOnly(v => !v)} />
          </View>

          {/* Search button */}
          <TouchableOpacity style={styles.searchBtn} onPress={() => setViewMode('results')} activeOpacity={0.85}>
            <Text style={styles.searchBtnText}>🔍 Search ({MOCK_RESULTS.length} results)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
            <Text style={styles.resetBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        // ── RESULTS VIEW ─────────────────────────────────────────────────────
        <View style={styles.flex}>
          {/* Sort bar */}
          <View style={styles.sortBar}>
            <TouchableOpacity
              style={styles.sortChip}
              onPress={() => setShowSort(v => !v)}
              activeOpacity={0.8}
            >
              <Text style={styles.sortChipText}>Sort: {sortBy} ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Sort dropdown */}
          {showSort && (
            <View style={styles.sortDropdown}>
              {SORT_OPTS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.sortItem, sortBy === opt && styles.sortItemActive]}
                  onPress={() => { setSortBy(opt); setShowSort(false); }}
                >
                  <Text style={[styles.sortItemText, sortBy === opt && styles.sortItemTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Results grid */}
          <FlatList
            data={MOCK_RESULTS}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={[styles.gridContent, { paddingBottom: insets.bottom + rh(12) }]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ResultCard
                item={item}
                onTap={() => onProfileTap(item.id)}
                onLike={() => onLike(item.id)}
              />
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.loadMore}>
                <Text style={styles.loadMoreText}>Load More...</Text>
              </TouchableOpacity>
            }
          />
        </View>
      )}

      <TabBar active={activeTab} onPress={onTabPress} />
    </View>
  );
}

// ── CheckRow ──────────────────────────────────────────────────────────────────

function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <Pressable style={styles.checkRow} onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

// ── ResultCard ────────────────────────────────────────────────────────────────

function ResultCard({ item, onTap, onLike }: { item: SearchResult; onTap: () => void; onLike: () => void }) {
  const cardW = (rw(100) - rw(6.2) * 2 - rw(2.1)) / 2;
  const photoH = rh(19);

  return (
    <TouchableOpacity
      style={[styles.resultCard, { width: cardW }]}
      onPress={onTap}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.photo }} style={[styles.resultPhoto, { height: photoH }]} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', colors.surface_container]}
        style={[StyleSheet.absoluteFill, { top: photoH * 0.4, borderRadius: rw(4.1) }]}
        pointerEvents="none"
      />
      <View style={styles.resultInfo}>
        <View style={styles.resultNameRow}>
          <Text style={styles.resultName}>{item.name}, {item.age}</Text>
        </View>
        <View style={styles.resultCompatRow}>
          <View style={styles.resultCompatTrack}>
            <LinearGradient
              colors={[colors.primary_container, colors.secondary_container]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.resultCompatFill, { width: `${item.compatibility}%` }]}
            />
          </View>
          <Text style={styles.resultCompatPct}>{item.compatibility}%</Text>
        </View>
        <View style={styles.resultFooter}>
          <Text style={styles.resultOccupation}>{item.occupation}</Text>
          <TouchableOpacity style={styles.resultLikeBtn} onPress={onLike} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.resultLikeIcon}>♥</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── RangeSlider (reused from step 5 pattern) ──────────────────────────────────

function RangeSlider({ min, max, valueMin, valueMax, onChangeMin, onChangeMax }: {
  min: number; max: number; valueMin: number; valueMax: number;
  onChangeMin: (v: number) => void; onChangeMax: (v: number) => void;
}) {
  const trackWidth = useRef(0);
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const toP = (v: number) => (v - min) / (max - min);
  const fromP = (p: number) => Math.round(min + p * (max - min));

  const minPan = useRef(new Animated.Value(toP(valueMin))).current;
  const minRef = useRef(toP(valueMin));
  const maxPan = useRef(new Animated.Value(toP(valueMax))).current;
  const maxRef = useRef(toP(valueMax));

  const minResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { minRef.current = toP(valueMin); },
    onPanResponderMove: (_, gs) => {
      if (!trackWidth.current) return;
      const next = clamp(minRef.current + gs.dx / trackWidth.current, 0, toP(valueMax) - 0.05);
      minPan.setValue(next); onChangeMin(fromP(next));
    },
  })).current;

  const maxResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { maxRef.current = toP(valueMax); },
    onPanResponderMove: (_, gs) => {
      if (!trackWidth.current) return;
      const next = clamp(maxRef.current + gs.dx / trackWidth.current, toP(valueMin) + 0.05, 1);
      maxPan.setValue(next); onChangeMax(fromP(next));
    },
  })).current;

  const minLeft  = minPan.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] });
  const maxLeft  = maxPan.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] });
  const fillLeft = minPan.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] });
  const fillRight= maxPan.interpolate({ inputRange: [0,1], outputRange: ['100%','0%'] });

  return (
    <View style={sliderS.wrapper} onLayout={(e: LayoutChangeEvent) => { trackWidth.current = e.nativeEvent.layout.width; }}>
      <View style={sliderS.track}>
        <Animated.View style={[sliderS.fill, { left: fillLeft, right: fillRight }]}>
          <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>
      <Animated.View style={[sliderS.thumbWrap, { left: minLeft }]} {...minResponder.panHandlers}>
        <View style={sliderS.thumb}><View style={sliderS.dot} /></View>
      </Animated.View>
      <Animated.View style={[sliderS.thumbWrap, { left: maxLeft }]} {...maxResponder.panHandlers}>
        <View style={sliderS.thumb}><View style={sliderS.dot} /></View>
      </Animated.View>
    </View>
  );
}

function SingleSlider({ min, max, value, onChange }: { min: number; max: number; value: number; onChange: (v: number) => void }) {
  const trackWidth = useRef(0);
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const toP = (v: number) => (v - min) / (max - min);
  const fromP = (p: number) => Math.round(min + p * (max - min));
  const pan = useRef(new Animated.Value(toP(value))).current;
  const panRef = useRef(toP(value));

  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { panRef.current = toP(value); },
    onPanResponderMove: (_, gs) => {
      if (!trackWidth.current) return;
      const next = clamp(panRef.current + gs.dx / trackWidth.current, 0, 1);
      pan.setValue(next); onChange(fromP(next));
    },
  })).current;

  const thumbLeft = pan.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] });
  const fillWidth = pan.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] });

  return (
    <View style={sliderS.wrapper} onLayout={(e: LayoutChangeEvent) => { trackWidth.current = e.nativeEvent.layout.width; }}>
      <View style={sliderS.track}>
        <Animated.View style={[sliderS.fill, { left: 0, width: fillWidth }]}>
          <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>
      <Animated.View style={[sliderS.thumbWrap, { left: thumbLeft }]} {...responder.panHandlers}>
        <View style={sliderS.thumb}><View style={sliderS.dot} /></View>
      </Animated.View>
    </View>
  );
}

const sliderS = StyleSheet.create({
  wrapper: { width: '100%', height: THUMB_SIZE + rh(1.2), justifyContent: 'center', marginBottom: rh(0.9) },
  track: { width: '100%', height: TRACK_H, backgroundColor: colors.surface_container, borderRadius: 9999, overflow: 'visible' },
  fill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 9999, overflow: 'hidden' },
  thumbWrap: { position: 'absolute', width: THUMB_SIZE, height: THUMB_SIZE, marginLeft: -(THUMB_SIZE/2), top: '50%', marginTop: -(THUMB_SIZE/2) + TRACK_H/2 - rh(0.6), alignItems: 'center', justifyContent: 'center' },
  thumb: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_SIZE/2, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: {width:0,height:0}, shadowOpacity: 0.5, shadowRadius: 12 }, android: { elevation: 4 } }) },
  dot: { width: rw(1.5), height: rw(1.5), borderRadius: rw(0.75), backgroundColor: '#FFFFFF' },
});

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  headerIcon: { fontSize: rf(2.4), opacity: 0.6 },
  backLink: { flexDirection: 'row', alignItems: 'center' },
  backLinkText: { ...typography['label-md'], color: colors.primary },
  resultCount: { ...typography['title-lg'], color: colors.on_surface },

  scroll: { paddingHorizontal: rw(6.2), paddingTop: rh(1.4) },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container_highest, height: rh(6.6), borderTopLeftRadius: rw(3.1), borderTopRightRadius: rw(3.1), paddingHorizontal: rw(4.1), gap: rw(2.6), marginBottom: rh(3.8) },
  searchIcon: { fontSize: rf(2.1), opacity: 0.6 },
  searchInput: { flex: 1, ...typography['body-lg'], color: colors.on_surface, padding: 0, margin: 0 },
  clearIcon: { ...typography['label-md'], color: `${colors.on_surface}66` },

  section: { marginBottom: rh(3.8) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.9) },
  sliderValue: { ...typography['label-sm'], color: colors.emerald, marginTop: rh(0.9) },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: colors.primary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextSelected: { color: colors.on_surface },

  checkRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.6), marginBottom: rh(1.9) },
  checkbox: { width: rw(5.6), height: rw(5.6), borderRadius: rw(1), borderWidth: 1.5, borderColor: 'rgba(89,64,65,0.30)', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.secondary_container, borderColor: colors.secondary_container },
  checkmark: { fontSize: rf(1.3), color: colors.on_secondary, fontWeight: '700' },
  checkLabel: { ...typography['body-md'], color: `${colors.on_surface}CC` },

  searchBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.9), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: {width:0,height:4}, shadowOpacity: 0.35, shadowRadius: 12 }, android: { elevation: 6 } }) },
  searchBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  resetBtn: { alignItems: 'center', paddingVertical: rh(1.2) },
  resetBtnText: { ...typography['label-md'], color: colors.tertiary },

  sortBar: { paddingHorizontal: rw(6.2), paddingVertical: rh(1.2) },
  sortChip: { alignSelf: 'flex-start', height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center' },
  sortChipText: { ...typography['label-md'], color: `${colors.on_surface}CC` },
  sortDropdown: { position: 'absolute', top: rh(8), left: rw(6.2), backgroundColor: colors.surface_container, borderRadius: rw(3.1), zIndex: 20, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: {width:0,height:4}, shadowOpacity: 0.2, shadowRadius: 12 }, android: { elevation: 8 } }) },
  sortItem: { paddingHorizontal: rw(4.1), paddingVertical: rh(1.4) },
  sortItemActive: { backgroundColor: `${colors.secondary_container}26` },
  sortItemText: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  sortItemTextActive: { color: colors.secondary, fontFamily: 'PlusJakartaSans-SemiBold' },

  gridRow: { paddingHorizontal: rw(6.2), gap: rw(2.1), marginBottom: rw(2.1) },
  gridContent: { paddingTop: rh(1.4) },

  resultCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), overflow: 'hidden' },
  resultPhoto: { width: '100%', backgroundColor: colors.surface_container_high },
  resultInfo: { padding: rw(3.1) },
  resultNameRow: { marginBottom: rh(0.7) },
  resultName: { ...typography['label-lg'], color: colors.on_surface },
  resultCompatRow: { flexDirection: 'row', alignItems: 'center', gap: rw(1.5), marginBottom: rh(0.9) },
  resultCompatTrack: { flex: 1, height: 4, backgroundColor: colors.surface_container_highest, borderRadius: 9999, overflow: 'hidden' },
  resultCompatFill: { height: '100%', borderRadius: 9999 },
  resultCompatPct: { ...typography['label-sm'], color: colors.primary, fontSize: rf(1.1) },
  resultFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultOccupation: { ...typography['label-sm'], color: `${colors.on_surface}66`, textTransform: 'uppercase', letterSpacing: 1 },
  resultLikeBtn: { width: rw(9.2), height: rw(9.2), borderRadius: rw(4.6), backgroundColor: colors.primary_container, alignItems: 'center', justifyContent: 'center' },
  resultLikeIcon: { fontSize: rf(1.9), color: '#FFFFFF' },

  loadMore: { alignItems: 'center', paddingVertical: rh(2.4) },
  loadMoreText: { ...typography['label-md'], color: colors.tertiary },
});
