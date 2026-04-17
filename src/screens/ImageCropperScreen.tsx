import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  StatusBar, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type AspectRatio = '1:1' | '4:5' | '16:9';

const RATIOS: { id: AspectRatio; icon: string; label: string }[] = [
  { id: '1:1',  icon: '\u25FB\uFE0F', label: '1:1' },
  { id: '4:5',  icon: '\u{1F4F1}',    label: '4:5' },
  { id: '16:9', icon: '\u{1F5A5}\uFE0F', label: '16:9' },
];

interface Props {
  photoUri?: string;
  onCancel: () => void;
  onUse: (uri: string) => void;
}

export default function ImageCropperScreen({ photoUri, onCancel, onUse }: Props) {
  const insets = useSafeAreaInsets();
  const [ratio, setRatio] = useState<AspectRatio>('1:1');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const PHOTO_AREA_H = rh(55);
  const CROP_W = rw(80);
  const CROP_H = ratio === '1:1' ? CROP_W : ratio === '4:5' ? CROP_W * 1.25 : CROP_W * 0.5625;

  const handleRotateLeft  = () => setRotation(r => r - 90);
  const handleRotateRight = () => setRotation(r => r + 90);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Photo</Text>
        <TouchableOpacity onPress={() => onUse(photoUri ?? '')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.nextText}>Next \u2192</Text>
        </TouchableOpacity>
      </View>

      {/* Photo area */}
      <View style={[styles.photoArea, { height: PHOTO_AREA_H }]}>
        {/* Dark overlay outside crop */}
        <View style={StyleSheet.absoluteFill} />
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={[styles.photo, { transform: [{ rotate: `${rotation}deg` }, { scaleX: flipH ? -1 : 1 }, { scaleY: flipV ? -1 : 1 }] }]}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>\u{1F4F7}</Text>
          </View>
        )}

        {/* Crop box overlay */}
        <View style={[styles.cropBox, { width: CROP_W, height: Math.min(CROP_H, PHOTO_AREA_H * 0.9) }]}>
          {/* Grid lines */}
          <View style={[styles.gridH, { top: '33%' }]} />
          <View style={[styles.gridH, { top: '66%' }]} />
          <View style={[styles.gridV, { left: '33%' }]} />
          <View style={[styles.gridV, { left: '66%' }]} />
          {/* Corner handles */}
          {[{ top: -2, left: -2 }, { top: -2, right: -2 }, { bottom: -2, left: -2 }, { bottom: -2, right: -2 }].map((pos, i) => (
            <View key={i} style={[styles.cornerHandle, pos]} />
          ))}
        </View>
      </View>

      <Text style={styles.hint}>Pinch to zoom \u00B7 Drag to move</Text>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Aspect ratio */}
        <Text style={styles.sectionLabel}>ASPECT RATIO</Text>
        <View style={styles.ratioRow}>
          {RATIOS.map(r => (
            <TouchableOpacity
              key={r.id}
              style={[styles.ratioChip, ratio === r.id && styles.ratioChipActive]}
              onPress={() => setRatio(r.id)}
              activeOpacity={0.75}
            >
              <Text style={[styles.ratioChipText, ratio === r.id && styles.ratioChipTextActive]}>
                {r.icon} {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transform buttons */}
        <View style={styles.transformRow}>
          <TouchableOpacity style={styles.transformBtn} onPress={handleRotateLeft}>
            <Text style={styles.transformBtnText}>\u21BA Rotate L</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.transformBtn} onPress={handleRotateRight}>
            <Text style={styles.transformBtnText}>\u21BB Rotate R</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.transformBtn} onPress={() => setFlipH(v => !v)}>
            <Text style={styles.transformBtnText}>\u2194\uFE0F Flip H</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.transformBtn} onPress={() => setFlipV(v => !v)}>
            <Text style={styles.transformBtnText}>\u2195\uFE0F Flip V</Text>
          </TouchableOpacity>
        </View>

        {/* Use button */}
        <TouchableOpacity style={[styles.useBtn, { marginBottom: insets.bottom + rh(1) }]} onPress={() => onUse(photoUri ?? '')} activeOpacity={0.85}>
          <Text style={styles.useBtnText}>\u2713  Use This Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  cancelText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-md'], color: colors.on_surface },
  nextText: { ...typography['label-lg'], color: colors.secondary_container },
  photoArea: { width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', position: 'relative' },
  photo: { position: 'absolute', width: '100%', height: '100%' },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
  photoPlaceholderText: { fontSize: rf(5.6), opacity: 0.3 },
  cropBox: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)', position: 'relative', overflow: 'hidden' },
  gridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  gridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  cornerHandle: { position: 'absolute', width: rw(5.1), height: rw(5.1), borderColor: colors.secondary_container, borderWidth: 3 },
  hint: { ...typography['label-sm'], color: 'rgba(255,255,255,0.5)', textAlign: 'center', paddingVertical: rh(1.2) },
  controls: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: rw(6.2), paddingTop: rh(1.9) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  ratioRow: { flexDirection: 'row', gap: rw(2.1), marginBottom: rh(1.9) },
  ratioChip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  ratioChipActive: { backgroundColor: colors.secondary_container },
  ratioChipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  ratioChipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  transformRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1), marginBottom: rh(1.9) },
  transformBtn: { paddingHorizontal: rw(3.1), paddingVertical: rh(0.9) },
  transformBtnText: { ...typography['label-md'], color: colors.tertiary },
  useBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  useBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
