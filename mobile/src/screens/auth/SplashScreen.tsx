import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: Props) {
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Logo pop-in
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Tagline fade-up
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Navigate after 2.8s
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.splashBg, '#122E1A', Colors.splashBg]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoLeaf}>
          <Ionicons name="leaf" size={48} color={Colors.white} />
        </View>
        <Text style={styles.logoText}>
          Farm<Text style={styles.logoAccent}>Link</Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={[
          styles.taglineWrap,
          { opacity: taglineOpacity, transform: [{ translateY: taglineY }] },
        ]}
      >
        <Text style={styles.tagline}>Africa's Agriculture Operating System</Text>
      </Animated.View>

      {/* Bottom dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(76,175,80,0.08)',
  },
  circleTopLeft: {
    width: 260,
    height: 260,
    top: -80,
    left: -80,
  },
  circleBottomRight: {
    width: 300,
    height: 300,
    bottom: -100,
    right: -100,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 16,
  },
  logoLeaf: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryLight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: 40,
    color: Colors.white,
    letterSpacing: -1,
  },
  logoAccent: {
    color: Colors.primaryLight,
  },
  taglineWrap: {
    position: 'absolute',
    bottom: height * 0.2,
  },
  tagline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 52,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: Colors.primaryLight,
    width: 20,
  },
});
