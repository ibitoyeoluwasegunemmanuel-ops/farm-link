import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button } from '../../components/common';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  gradient: [string, string, ...string[]];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'storefront',
    iconBg: '#1B5E20',
    title: 'Buy & Sell Fresh\nProduce Directly',
    subtitle: 'Connect directly with verified farmers across Nigeria. No middlemen, better prices, fresher produce.',
    gradient: ['#0D2318', '#1B5E20'],
  },
  {
    id: '2',
    icon: 'people',
    iconBg: '#2E7D32',
    title: 'Join the Farming\nCommunity',
    subtitle: 'Share knowledge, get tips from expert farmers, and grow your agricultural network on FarmTok.',
    gradient: ['#122E1A', '#2E7D32'],
  },
  {
    id: '3',
    icon: 'cube',
    iconBg: '#1565C0',
    title: 'Reliable Logistics\nfor Your Farm',
    subtitle: 'Book trucks for your harvest delivery. Real-time tracking, trusted drivers, and guaranteed delivery.',
    gradient: ['#0D1B2E', '#1565C0'],
  },
  {
    id: '4',
    icon: 'wallet',
    iconBg: '#6A1B9A',
    title: 'Secure Payments\nwith Escrow',
    subtitle: "Your money is protected until delivery is confirmed. FarmLink holds funds safely — you're always in control.",
    gradient: ['#1A0D2E', '#6A1B9A'],
  },
  {
    id: '5',
    icon: 'leaf',
    iconBg: '#E65100',
    title: 'AI-Powered\nFarming Assistant',
    subtitle: 'Get crop disease diagnosis, weather alerts, market price predictions, and personalized farming advice — 24/7.',
    gradient: ['#2E1000', '#E65100'],
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const skip = () => navigation.replace('Login');

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <LinearGradient colors={item.gradient} style={StyleSheet.absoluteFillObject} />

      {/* Decorative blob */}
      <View style={styles.blob} />

      {/* Icon */}
      <View style={[styles.iconCircleOuter]}>
        <View style={[styles.iconCircleInner, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon as any} size={52} color={Colors.white} />
        </View>
      </View>

      {/* Text */}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />

      {/* Bottom controls */}
      <View style={styles.bottomWrap}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity onPress={skip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goNext} style={styles.nextBtn}>
            <Text style={styles.nextText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.splashBg },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
    paddingBottom: 180,
  },
  blob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: height * 0.08,
  },
  iconCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[8],
  },
  iconCircleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  textWrap: { alignItems: 'center' },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Spacing[4],
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing[6],
    paddingBottom: 48,
    paddingTop: Spacing[6],
    backgroundColor: 'rgba(13,35,24,0.85)',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing[5],
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLight,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtn: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  skipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.5)',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: Radius.full,
    gap: Spacing[2],
  },
  nextText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
});
