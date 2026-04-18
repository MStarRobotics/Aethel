import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Platform, StatusBar, Share, Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Props {
  url: string;
  title: string;
  onBack: () => void;
}

export default function WebViewScreen({ url, title, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, { toValue: 0.8, duration: 1500, useNativeDriver: false }).start();
  };

  const handleLoadEnd = () => {
    Animated.timing(progressAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start(() => {
      setLoading(false);
    });
  };

  const handleError = () => { setLoading(false); setError(true); };

  const handleShare = async () => {
    try { await Share.share({ url, message: url }); } catch {}
  };

  const ICON_SIZE = rw(16.4);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.headerBtnText}>\u2190</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleShare} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.headerBtnText}>\u2197\uFE0F</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <Animated.View style={[styles.progressBar, {
        width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        opacity: loading ? 1 : 0,
      }]} />

      {error ? (
        <View style={styles.errorState}>
          <View style={[styles.errorIcon, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
            <Text style={styles.errorEmoji}>\u{1F4E1}</Text>
          </View>
          <Text style={styles.errorTag}>COULDN'T LOAD PAGE</Text>
          <Text style={styles.errorTitle}>Check Your Connection</Text>
          <Text style={styles.errorBody}>This page couldn't be loaded. Check your internet connection and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => { setError(false); setLoading(true); }} activeOpacity={0.85}>
            <Text style={styles.retryBtnText}>\u{1F504}  Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(url)}>
            <Text style={styles.openBrowserLink}>Open in Browser</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          injectedJavaScript={`
            document.body.style.backgroundColor = '#1A0B2E';
            document.body.style.color = '#EDDCFF';
            document.body.style.fontFamily = 'sans-serif';
            var links = document.querySelectorAll('a');
            links.forEach(function(l) { l.style.color = '#F8C8DC'; });
          `}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(4.1), height: rh(6.6) },
  headerBtn: { width: rw(11.3), height: rw(11.3), alignItems: 'center', justifyContent: 'center' },
  headerBtnText: { fontSize: rf(2.1), color: colors.tertiary },
  headerTitle: { ...typography['title-md'], color: colors.on_surface, flex: 1, textAlign: 'center' },
  progressBar: { height: 2, backgroundColor: colors.secondary_container, position: 'absolute', top: rh(6.6), left: 0 },
  webview: { flex: 1, backgroundColor: colors.surface },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2), gap: rh(1.4) },
  errorIcon: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 20 }, android: { elevation: 4 } }) },
  errorEmoji: { fontSize: rf(3.3) },
  errorTag: { ...typography['label-sm'], color: colors.primary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  errorTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, textAlign: 'center' },
  errorBody: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center' },
  retryBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  retryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  openBrowserLink: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
});
