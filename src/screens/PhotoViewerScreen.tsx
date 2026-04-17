import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  StatusBar, Animated, Dimensions, Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Props {
  photos: string[];
  initialIndex?: number;
  ownerName?: string;
  onClose: () => void;
}

export default function PhotoViewerScreen({ photos, initialIndex = 0, ownerName = 'Sarah', onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showOverlay = () => {
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    Animated.timing(overlayOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setOverlayVisible(true);
    autoHideTimer.current = setTimeout(hideOverlay, 3000);
  };

  const hideOverlay = () => {
    Animated.timing(overlayOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setOverlayVisible(false));
  };

  const toggleOverlay = () => overlayVisible ? hideOverlay() : showOverlay();

  useEffect(() => {
    showOverlay();
    return () => { if (autoHideTimer.current) clearTimeout(autoHideTimer.current); };
  }, []);

  const handleShare = async () => {
    try { await Share.share({ url: photos[currentIndex] }); } catch {}
  };

  const goNext = () => { if (currentIndex < photos.length - 1) setCurrentIndex(i => i + 1); };
  const goPrev = () => { if (currentIndex > 0) setCurrentIndex(i => i - 1); };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

      {/* Photo */}
      <TouchableOpacity style={styles.photoArea} onPress={toggleOverlay} activeOpacity={1}>
        <Image source={{ uri: photos[currentIndex] }} style={styles.photo} resizeMode="contain" />
        {/* Swipe zones */}
        <TouchableOpacity style={styles.prevZone} onPress={goPrev} activeOpacity={1} />
        <TouchableOpacity style={styles.nextZone} onPress={goNext} activeOpacity={1} />
      </TouchableOpacity>

      {/* Header overlay */}
      <Animated.View style={[styles.headerOverlay, { opacity: overlayOpacity, paddingTop: insets.top }]} pointerEvents={overlayVisible ? 'auto' : 'none'}>
        <TouchableOpacity style={styles.overlayBtn} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.overlayBtnText}>\u2715</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.overlayBtn} onPress={handleShare} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.overlayBtnText}>\u2197\uFE0F</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Footer overlay */}
      <Animated.View style={[styles.footerOverlay, { opacity: overlayOpacity, paddingBottom: insets.bottom + rh(2) }]} pointerEvents="none">
        <View style={styles.dotsRow}>
          {photos.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>
        <Text style={styles.caption}>{ownerName}'s Photo {currentIndex + 1} of {photos.length}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  photoArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photo: { width: SCREEN_W, height: SCREEN_H },
  prevZone: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%' },
  nextZone: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%' },
  headerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, height: rh(9.5),
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: rw(4.1), paddingBottom: rh(1.2),
    background: 'linear-gradient(#000 60%, transparent)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayBtn: { width: rw(11.3), height: rw(11.3), alignItems: 'center', justifyContent: 'center' },
  overlayBtnText: { fontSize: rf(2.4), color: '#FFFFFF' },
  footerOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: rh(9.5),
    alignItems: 'center', justifyContent: 'flex-end', gap: rh(0.7),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dotsRow: { flexDirection: 'row', gap: rw(1.5) },
  dot: { width: rw(1.8), height: rw(1.8), borderRadius: rw(0.9), backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: colors.secondary_container, width: rw(2.3), height: rw(2.3), borderRadius: rw(1.2) },
  caption: { ...typography['label-sm'], color: 'rgba(255,255,255,0.7)' },
});
