import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Mode = 'maintenance' | 'offline' | 'update';

const CONFIG = {
  maintenance: {
    icon: '\u{1F527}',
    iconColor: colors.secondary_container,
    tag: 'DOWN FOR MAINTENANCE',
    tagColor: colors.secondary_container,
    title: "We'll Be Right Back!",
    body: "Aethel is currently down for maintenance. We're working hard to get everything back up.",
    extra: '\u23F0 Estimated time: ~30 min',
    primaryLabel: '\u{1F504} Try Again',
    primaryStyle: 'ghost',
  },
  offline: {
    icon: '\u{1F4E1}',
    iconColor: colors.primary_container,
    tag: 'NO CONNECTION',
    tagColor: colors.primary_container,
    title: 'No Internet Connection',
    body: 'Check your connection and try again.',
    extra: null,
    primaryLabel: '\u{1F504} Retry',
    primaryStyle: 'primary',
  },
  update: {
    icon: '\u2B06\uFE0F',
    iconColor: colors.secondary_container,
    tag: 'UPDATE REQUIRED',
    tagColor: colors.secondary_container,
    title: 'New Version Available',
    body: 'Please update the app to continue using it.',
    extra: null,
    primaryLabel: 'Update Now',
    primaryStyle: 'primary',
  },
} as const;

interface Props {
  mode?: Mode;
  onRetry?: () => void;
  onUpdate?: () => void;
}

export default function ServerMaintenanceScreen({ mode = 'maintenance', onRetry, onUpdate }: Props) {
  const insets = useSafeAreaInsets();
  const cfg = CONFIG[mode];
  const ICON_SIZE = rw(20.5); // ~80px

  const handlePrimary = () => {
    if (mode === 'update') onUpdate?.();
    else onRetry?.();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2, ...Platform.select({ ios: { shadowColor: cfg.iconColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 30 }, android: { elevation: 8 } }) }]}>
          <Text style={styles.iconEmoji}>{cfg.icon}</Text>
        </View>

        {/* Tag */}
        <Text style={[styles.tag, { color: cfg.tagColor }]}>{cfg.tag}</Text>

        {/* Title */}
        <Text style={styles.title}>{cfg.title}</Text>

        {/* Body */}
        <Text style={styles.body}>{cfg.body}</Text>

        {/* Extra info */}
        {cfg.extra && <Text style={styles.extra}>{cfg.extra}</Text>}

        {/* Primary action */}
        <TouchableOpacity
          style={cfg.primaryStyle === 'primary' ? styles.primaryBtn : styles.ghostBtn}
          onPress={handlePrimary}
          activeOpacity={0.85}
        >
          <Text style={cfg.primaryStyle === 'primary' ? styles.primaryBtnText : styles.ghostBtnText}>
            {cfg.primaryLabel}
          </Text>
        </TouchableOpacity>

        {/* Social links (maintenance only) */}
        {mode === 'maintenance' && (
          <View style={styles.socialRow}>
            <Text style={styles.socialLabel}>Follow us for updates:</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity><Text style={styles.socialLink}>Twitter</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.socialLink}>Instagram</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: rw(6.2), alignItems: 'center', gap: rh(1.9), width: '100%' },
  iconCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center', marginBottom: rh(0.9) },
  iconEmoji: { fontSize: rf(4.7) },
  tag: { ...typography['label-sm'], textTransform: 'uppercase', letterSpacing: 1.5 },
  title: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center', letterSpacing: -0.3 },
  body: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center', maxWidth: rw(77) },
  extra: { ...typography['label-md'], color: colors.tertiary },
  primaryBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: rh(0.9), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  ghostBtn: { width: '100%', height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginTop: rh(0.9) },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
  socialRow: { alignItems: 'center', gap: rh(0.5), marginTop: rh(0.9) },
  socialLabel: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  socialLinks: { flexDirection: 'row', gap: rw(4.1) },
  socialLink: { ...typography['label-md'], color: colors.tertiary },
});
