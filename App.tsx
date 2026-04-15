import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  NotoSerif_400Regular,
} from '@expo-google-fonts/noto-serif';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreenNative from 'expo-splash-screen';
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import OnboardingStep1Screen from './src/screens/OnboardingStep1Screen';
import OnboardingStep2Screen from './src/screens/OnboardingStep2Screen';
import OnboardingStep3Screen from './src/screens/OnboardingStep3Screen';
import OnboardingStep4Screen from './src/screens/OnboardingStep4Screen';
import OnboardingStep5Screen from './src/screens/OnboardingStep5Screen';
import OnboardingStep6Screen from './src/screens/OnboardingStep6Screen';
import HomeDiscoverScreen from './src/screens/HomeDiscoverScreen';
import SearchScreen from './src/screens/SearchScreen';
import QAScreen from './src/screens/QAScreen';
import FeedScreen from './src/screens/FeedScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import VisitorsScreen from './src/screens/VisitorsScreen';
import MyProfileScreen from './src/screens/MyProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ProfilePreviewScreen from './src/screens/ProfilePreviewScreen';
import ProspectProfileScreen from './src/screens/ProspectProfileScreen';
import MatchScreen from './src/screens/MatchScreen';
import LikesReceivedScreen from './src/screens/LikesReceivedScreen';
import MatchesListScreen from './src/screens/MatchesListScreen';
import { colors } from './src/theme/colors';

SplashScreenNative.preventAutoHideAsync();

type Screen =
  | 'splash' | 'welcome' | 'signup' | 'login' | 'verify-email' | 'forgot-password'
  | 'onboarding-1' | 'onboarding-2' | 'onboarding-3' | 'onboarding-4' | 'onboarding-5' | 'onboarding-6'
  | 'home' | 'search' | 'qa' | 'feed' | 'messages' | 'visitors' | 'profile' | 'edit-profile'
  | 'profile-preview' | 'prospect-profile' | 'match' | 'likes-received' | 'matches-list';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [signupEmail, setSignupEmail] = useState('');

  const [fontsLoaded] = useFonts({
    NotoSerif: NotoSerif_400Regular,
    PlusJakartaSans: PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreenNative.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.surface_container_lowest }} />;
  }

  return (
    <SafeAreaProvider>
      <View
        style={{ flex: 1, backgroundColor: colors.surface_container_lowest }}
        onLayout={onLayoutRootView}
      >
        {screen === 'splash' && (
          <SplashScreen onFinish={() => setScreen('welcome')} />
        )}
        {screen === 'welcome' && (
          <WelcomeScreen
            onCreateAccount={() => setScreen('signup')}
            onLogin={() => setScreen('login')}
            onGoogleLogin={() => console.log('→ Google OAuth')}
            onAppleLogin={() => console.log('→ Apple OAuth')}
            onSkip={() => setScreen('login')}
            onTerms={() => console.log('→ Terms webview')}
            onPrivacy={() => console.log('→ Privacy webview')}
          />
        )}
        {screen === 'signup' && (
          <SignUpScreen
            onBack={() => setScreen('welcome')}
            onCreateAccount={(data) => {
              setSignupEmail(data.email);
              setScreen('verify-email');
            }}
            onGoogleLogin={() => console.log('→ Google OAuth')}
            onAppleLogin={() => console.log('→ Apple OAuth')}
            onLogin={() => setScreen('login')}
            onTerms={() => console.log('→ Terms webview')}
            onPrivacy={() => console.log('→ Privacy webview')}
          />
        )}
        {screen === 'login' && (
          <LoginScreen
            onBack={() => setScreen('welcome')}
            onLogin={(data) => console.log('→ Login', data)}
            onForgotPassword={() => setScreen('forgot-password')}
            onGoogleLogin={() => console.log('→ Google OAuth')}
            onAppleLogin={() => console.log('→ Apple OAuth')}
            onSignUp={() => setScreen('signup')}
          />
        )}
        {screen === 'forgot-password' && (
          <ForgotPasswordScreen
            onBack={() => setScreen('login')}
            onBackToLogin={() => setScreen('login')}
            onSendReset={async (email) => console.log('→ Reset link sent to', email)}
            onResend={async (email) => console.log('→ Resend reset link to', email)}
          />
        )}
        {screen === 'verify-email' && (
          <EmailVerificationScreen
            email={signupEmail}
            onBack={() => setScreen('signup')}
            onVerified={() => setScreen('onboarding-1')}
            onResend={async () => console.log('→ Resend OTP')}
            onChangeEmail={() => setScreen('signup')}
          />
        )}
        {screen === 'onboarding-1' && (
          <OnboardingStep1Screen
            onBack={() => setScreen('verify-email')}
            onContinue={(data) => {
              console.log('→ Onboarding step 1', data);
              setScreen('onboarding-2');
            }}
          />
        )}
        {screen === 'onboarding-2' && (
          <OnboardingStep2Screen
            onBack={() => setScreen('onboarding-1')}
            onContinue={(data) => {
              console.log('→ Onboarding step 2', data);
              setScreen('onboarding-3');
            }}
            onSkip={() => setScreen('onboarding-3')}
            onPhotoGuide={() => console.log('→ Photo guide')}
          />
        )}
        {screen === 'onboarding-3' && (
          <OnboardingStep3Screen
            onBack={() => setScreen('onboarding-2')}
            onContinue={(data) => {
              console.log('→ Onboarding step 3', data);
              setScreen('onboarding-4');
            }}
            onSkip={() => setScreen('onboarding-4')}
          />
        )}
        {screen === 'onboarding-4' && (
          <OnboardingStep4Screen
            onBack={() => setScreen('onboarding-3')}
            onContinue={(data) => {
              console.log('→ Onboarding step 4', data);
              setScreen('onboarding-5');
            }}
          />
        )}
        {screen === 'onboarding-5' && (
          <OnboardingStep5Screen
            onBack={() => setScreen('onboarding-4')}
            onContinue={(data) => {
              console.log('→ Onboarding step 5', data);
              setScreen('onboarding-6');
            }}
          />
        )}
        {screen === 'onboarding-6' && (
          <OnboardingStep6Screen
            onBack={() => setScreen('onboarding-5')}
            onFinish={(data) => {
              console.log('→ Onboarding complete', data);
              setScreen('home');
            }}
          />
        )}
        {screen === 'home' && (
          <HomeDiscoverScreen
            onNotifications={() => console.log('→ Notifications')}
            onSettings={() => console.log('→ Settings')}
            onCardTap={(p) => console.log('→ Profile', p.id)}
            onSendMessage={(p) => console.log('→ Message', p.id)}
            onAdjustPreferences={() => setScreen('onboarding-5')}
            onTabPress={(tab) => {
              if (tab === 'search') setScreen('search');
              if (tab === 'qa') setScreen('qa');
              if (tab === 'feed') setScreen('feed');
              if (tab === 'messages') setScreen('messages');
              if (tab === 'profile') setScreen('profile');
            }}
            activeTab="feed"
          />
        )}
        {screen === 'search' && (
          <SearchScreen
            onProfileTap={(id) => console.log('→ Profile', id)}
            onLike={(id) => console.log('→ Like', id)}
            onTabPress={(tab) => {
              if (tab === 'feed') setScreen('home');
              if (tab === 'qa') setScreen('qa');
              if (tab === 'feed') setScreen('feed');
            }}
            activeTab="search"
          />
        )}
        {screen === 'qa' && (
          <QAScreen
            onSettings={() => console.log('→ Q&A settings')}
            onTabPress={(tab) => {
              if (tab === 'feed') setScreen('home');
              if (tab === 'search') setScreen('search');
              if (tab === 'feed') setScreen('feed');
            }}
            activeTab="qa"
          />
        )}
        {screen === 'feed' && (
          <FeedScreen
            onSendMessage={(id) => console.log('→ Message', id)}
            onViewProfile={(id) => console.log('→ Profile', id)}
            onLike={(id) => console.log('→ Like', id)}
            onNotifications={() => console.log('→ Notifications')}
            onTabPress={(tab) => {
              if (tab === 'feed') setScreen('home');
              if (tab === 'search') setScreen('search');
              if (tab === 'qa') setScreen('qa');
              if (tab === 'messages') setScreen('messages');
              if (tab === 'profile') setScreen('profile');
            }}
            activeTab="feed"
          />
        )}
        {screen === 'messages' && (
          <MessagesScreen
            onConversation={(id) => console.log('→ Conversation', id)}
            onSearch={() => console.log('→ Search messages')}
            onCompose={() => console.log('→ New message')}
            onTabPress={(tab) => {
              if (tab === 'feed') setScreen('home');
              if (tab === 'search') setScreen('search');
              if (tab === 'qa') setScreen('qa');
              if (tab === 'profile') setScreen('profile');
            }}
            activeTab="messages"
          />
        )}
        {screen === 'visitors' && (
          <VisitorsScreen
            onViewProfile={(id) => console.log('→ Profile', id)}
            onLike={(id) => console.log('→ Like', id)}
            onMessage={(id) => console.log('→ Message', id)}
            onUnlock={() => console.log('→ Premium')}
            onNotifications={() => console.log('→ Notifications')}
            onTabPress={(tab) => {
              if (tab === 'feed') setScreen('home');
              if (tab === 'search') setScreen('search');
              if (tab === 'qa') setScreen('qa');
              if (tab === 'messages') setScreen('messages');
            }}
            activeTab="profile"
          />
        )}
        {screen === 'profile' && (
          <MyProfileScreen
            onEdit={() => setScreen('edit-profile')}
            onSettings={() => console.log('→ Settings')}
            onPreview={() => setScreen('profile-preview')}
            onShare={() => console.log('→ Share profile')}
            onEditSection={(_s) => setScreen('edit-profile')}
            onTabPress={(tab) => {
              if (tab === 'feed') setScreen('home');
              if (tab === 'search') setScreen('search');
              if (tab === 'qa') setScreen('qa');
              if (tab === 'messages') setScreen('messages');
            }}
            activeTab="profile"
          />
        )}
        {screen === 'edit-profile' && (
          <EditProfileScreen
            onBack={() => setScreen('profile')}
            onSave={(data) => {
              console.log('→ Profile saved', data);
              setScreen('profile');
            }}
          />
        )}
        {screen === 'profile-preview' && (
          <ProfilePreviewScreen
            onBack={() => setScreen('profile')}
            onEdit={() => setScreen('edit-profile')}
          />
        )}
        {screen === 'prospect-profile' && (
          <ProspectProfileScreen
            onBack={() => setScreen('home')}
            onSkip={() => setScreen('home')}
            onLike={() => setScreen('match')}
            onMessage={() => console.log('→ Conversation')}
          />
        )}
        {screen === 'match' && (
          <MatchScreen
            visible={screen === 'match'}
            matchName="Sarah"
            matchPhoto="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
            myPhoto="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
            compatibility={92}
            onSendMessage={() => { setScreen('messages'); }}
            onViewProfile={() => setScreen('prospect-profile')}
            onKeepDiscovering={() => setScreen('home')}
          />
        )}
        {screen === 'likes-received' && (
          <LikesReceivedScreen
            onBack={() => setScreen('profile')}
            onProfile={(_id) => setScreen('prospect-profile')}
            onLike={(id) => console.log('→ Like', id)}
            onUnlock={() => console.log('→ Premium')}
          />
        )}
        {screen === 'matches-list' && (
          <MatchesListScreen
            onBack={() => setScreen('messages')}
            onProfile={(_id) => setScreen('prospect-profile')}
            onMessage={(id) => console.log('→ Conversation', id)}
            onSearch={() => setScreen('search')}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}
