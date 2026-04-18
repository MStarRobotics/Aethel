import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Platform, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Props {
  onConfirm: () => void;
  onUnder18: () => void;
  onTerms: () => void;
  onPrivacy: () => void;
}

export default function AgeVerificationScreen({ onConfirm, onUnder18, onTerms, onPrivacy }: Props) {
  const insets = useSafeAreaInsets();
  const [under18, setUnder18] = useState(false);
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  if (under18) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
        <View style={styles.content}>
          <Animated.View style={[styles.logoWrapper, { opacity: 0.4 }]}>
            <Text style={styles.logoText}>Aethel</Text>
          </Animated.View>
          <Text style={styles.tag}>SORRY</Text>
          <Text style={styles.headline}>You Must Be 18+</Text>
          <Text style={styles.body}>Aethel is only available to users aged 18 and above. Come back when you're older!</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => {}} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Close App</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
      <View style={styles.content}>
        <Animated.View style={[styles.logoWrapper, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Text style={styles.logoText}>Aethel</Text>
        </Animated.View>

        <Text style={styles.tag}>BEFORE YOU CONTINUE</Text>
        <Text style={styles.headline}>Are You 18 or Older?</Text>
        <Text style={styles.body}>Aethel is for adults only. You must be 18 or older to create an account.</Text>

        <LinearGradient colors={['#FFB2B6', colors.primary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.yesGradient}>
          <TouchableOpacity style={styles.yesBtn} onPress={onConfirm} activeOpacity={0.85}>
            <Text style={styles.yesBtnText}>\u2705  Yes, I'm 18 or older</Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity style={styles.noBtn} onPress={() => setUnder18(true)} activeOpacity={0.8}>
          <Text style={styles.noBtnText}>\u274C  No, I'm under 18</Text>
        </TouchableOpacity>

        <Text style={styles.termsNote}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink} onPress={onTerms}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink} onPress={onPrivacy}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  content: { flex: 1, paddingHorizontal: rw(6.2), alignItems: 'center', justifyContent: 'center', gap: rh(1.9) },
  logoWrapper: {
    marginBottom: rh(1.4),
    ...Platform.select({
      ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 40 },
      android: { elevation: 10 },
    }),
  },
  logoText: { fontFamily: 'NotoSerif', fontSize: rf(5.3), color: colors.on_surface, letterSpacing: -0.9 },
  tag: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5 },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center' },
  body: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center', maxWidth: rw(77) },
  yesGradient: { width: '100%', borderRadius: 9999, ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 }, android: { elevation: 8 } }) },
  yesBtn: { height: rh(6.6), alignItems: 'center', justifyContent: 'center' },
  yesBtnText: { ...typography['title-md'], color: '#FFFFFF', letterSpacing: 1 },
  noBtn: { width: '100%', height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  noBtnText: { ...typography['label-lg'], color: colors.primary },
  termsNote: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center', maxWidth: rw(77) },
  termsLink: { color: colors.tertiary },
  primaryBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
