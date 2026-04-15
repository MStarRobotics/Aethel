import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Image, Modal, Pressable, FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const CATEGORIES = ['Trending', 'Love', 'Funny', 'Reactions', 'Cute', 'Sad', 'Celebration', 'Animals'];

// Placeholder GIF thumbnails (alternating heights for masonry feel)
const GIFS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=200', h: rh(14) },
  { id: '2', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200', h: rh(18) },
  { id: '3', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200', h: rh(16) },
  { id: '4', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200', h: rh(14) },
  { id: '5', url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200', h: rh(18) },
  { id: '6', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=200', h: rh(15) },
  { id: '7', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200', h: rh(17) },
  { id: '8', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200', h: rh(14) },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (gifUrl: string) => void;
}

export default function GifPickerModal({ visible, onClose, onSelect }: Props) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Trending');

  const cellW = (rw(100) - rw(6.2) * 2 - rw(1)) / 2;

  // Split into two columns for masonry
  const leftCol = GIFS.filter((_, i) => i % 2 === 0);
  const rightCol = GIFS.filter((_, i) => i % 2 !== 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>GIFs</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeBtn}>\u2715</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>\u{1F50D}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search GIFs..."
              placeholderTextColor={`${colors.on_surface}66`}
              value={search}
              onChangeText={setSearch}
              selectionColor={colors.secondary}
            />
          </View>

          {/* Category chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow} style={styles.chipsScroll}>
            {CATEGORIES.map(cat => {
              const isActive = cat === activeCategory;
              return (
                <TouchableOpacity key={cat} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setActiveCategory(cat)} activeOpacity={0.75}>
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Section label */}
          <Text style={styles.sectionLabel}>{activeCategory.toUpperCase()} GIFS</Text>

          {/* GIF masonry grid */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridScroll}>
            <View style={styles.grid}>
              {/* Left column */}
              <View style={[styles.column, { width: cellW }]}>
                {leftCol.map(gif => (
                  <TouchableOpacity key={gif.id} style={[styles.gifCell, { height: gif.h }]} onPress={() => { onSelect(gif.url); onClose(); }} activeOpacity={0.85}>
                    <Image source={{ uri: gif.url }} style={styles.gifImg} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>
              {/* Right column */}
              <View style={[styles.column, { width: cellW }]}>
                {rightCol.map(gif => (
                  <TouchableOpacity key={gif.id} style={[styles.gifCell, { height: gif.h }]} onPress={() => { onSelect(gif.url); onClose(); }} activeOpacity={0.85}>
                    <Image source={{ uri: gif.url }} style={styles.gifImg} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.loadMore}>
              <Text style={styles.loadMoreText}>Load More...</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: `${colors.surface_variant}F2`,
    borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2),
    maxHeight: rh(72), paddingTop: rh(1.4),
  },
  handle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), marginBottom: rh(1.4) },
  title: { ...typography['title-md'], color: colors.on_surface },
  closeBtn: { ...typography['title-md'], color: colors.tertiary, paddingLeft: rw(4.1) },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', marginHorizontal: rw(6.2), backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(5.7), marginBottom: rh(1.4), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  searchIcon: { fontSize: rf(1.9), marginRight: rw(2.6), opacity: 0.5 },
  searchInput: { flex: 1, ...typography['body-md'], color: colors.on_surface },
  chipsScroll: { flexGrow: 0, marginBottom: rh(1.9) },
  chipsRow: { paddingHorizontal: rw(6.2), gap: rw(2.1) },
  chip: { height: rh(3.8), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, paddingHorizontal: rw(6.2), marginBottom: rh(1.4) },
  gridScroll: { paddingHorizontal: rw(6.2), paddingBottom: rh(2) },
  grid: { flexDirection: 'row', gap: rw(1) },
  column: { gap: rw(1) },
  gifCell: { borderRadius: rw(3.1), overflow: 'hidden', backgroundColor: colors.surface_container },
  gifImg: { width: '100%', height: '100%' },
  loadMore: { alignItems: 'center', paddingVertical: rh(1.9) },
  loadMoreText: { ...typography['label-md'], color: colors.tertiary },
});
