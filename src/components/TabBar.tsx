import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export type TabName = 'qa' | 'search' | 'feed' | 'messages' | 'profile';

interface Tab {
  id: TabName;
  label: string;
  icon: string;
  activeIcon: string;
}

const TABS: Tab[] = [
  { id: 'qa',       label: 'Q&A',      icon: '❓', activeIcon: '❓' },
  { id: 'search',   label: 'Search',   icon: '🔍', activeIcon: '🔍' },
  { id: 'feed',     label: 'Feed',     icon: '🧭', activeIcon: '🧭' },
  { id: 'messages', label: 'Messages', icon: '💬', activeIcon: '💬' },
  { id: 'profile',  label: 'Profile',  icon: '👤', activeIcon: '👤' },
];

interface Props {
  active: TabName;
  onPress: (tab: TabName) => void;
}

export default function TabBar({ active, onPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + rh(0.9) },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onPress(tab.id)}
            activeOpacity={0.7}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {isActive ? tab.activeIcon : tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      {/* Home indicator bar */}
      <View style={styles.homeIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: rh(1.4),
    backgroundColor: 'rgba(61, 46, 82, 0.60)',  // surface_variant @ 60%
    borderTopLeftRadius: rw(8.2),
    borderTopRightRadius: rw(8.2),
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 16 },
    }),
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rh(0.7),
    gap: rh(0.4),
  },

  icon: {
    fontSize: rf(2.6),
    opacity: 0.5,
  },

  iconActive: {
    opacity: 1,
  },

  label: {
    ...typography['label-sm'],
    color: `${colors.on_surface}80`,
    fontSize: rf(1.1),
    letterSpacing: 0.5,
  },

  labelActive: {
    color: colors.secondary_container,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  homeIndicator: {
    position: 'absolute',
    bottom: rh(0.5),
    alignSelf: 'center',
    width: rw(8.2),
    height: 4,
    borderRadius: 9999,
    backgroundColor: `${colors.on_surface}1A`,
  },
});
