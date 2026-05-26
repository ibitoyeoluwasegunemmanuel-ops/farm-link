import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Weather'>;

const HOURLY = [
  { hour: 'Now', icon: 'sunny', temp: 32 },
  { hour: '1PM', icon: 'partly-sunny', temp: 33 },
  { hour: '2PM', icon: 'cloud', temp: 31 },
  { hour: '3PM', icon: 'rainy', temp: 28 },
  { hour: '4PM', icon: 'rainy', temp: 26 },
  { hour: '5PM', icon: 'partly-sunny', temp: 27 },
  { hour: '6PM', icon: 'moon', temp: 25 },
];

const WEEKLY = [
  { day: 'Today', icon: 'sunny', high: 33, low: 24, rain: 10 },
  { day: 'Tue', icon: 'rainy', high: 28, low: 22, rain: 75 },
  { day: 'Wed', icon: 'thunderstorm', high: 26, low: 21, rain: 90 },
  { day: 'Thu', icon: 'partly-sunny', high: 30, low: 23, rain: 20 },
  { day: 'Fri', icon: 'sunny', high: 34, low: 25, rain: 5 },
  { day: 'Sat', icon: 'sunny', high: 35, low: 26, rain: 0 },
  { day: 'Sun', icon: 'partly-sunny', high: 31, low: 24, rain: 15 },
];

const FARM_TIPS = [
  { tip: 'Heavy rain expected Wed–Thu. Avoid pesticide application.', severity: 'warning', icon: 'warning-outline' },
  { tip: 'Good planting conditions this weekend (Sat–Sun). Soil moisture optimal.', severity: 'success', icon: 'checkmark-circle-outline' },
  { tip: 'High temperatures (33–35°C) on Fri–Sat. Ensure adequate irrigation.', severity: 'info', icon: 'information-circle-outline' },
];

export default function WeatherScreen({ navigation }: Props) {
  const getTipColor = (s: string) => s === 'warning' ? Colors.warning : s === 'success' ? Colors.success : Colors.info;

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#0D47A1', '#1565C0', '#1976D2']} style={styles.weatherHeader}>
        <Header title="Weather" showBack onBack={() => navigation.goBack()} dark titleCenter />
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
          <Text style={styles.location}>Ibadan, Oyo State</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainWeather}>
          <Ionicons name="sunny" size={80} color="#FFF176" />
          <Text style={styles.mainTemp}>32°C</Text>
          <Text style={styles.mainDesc}>Sunny with light breeze</Text>
          <Text style={styles.feelsLike}>Feels like 35°C</Text>
        </View>

        <View style={styles.weatherStats}>
          {[
            { icon: 'water-outline', label: 'Humidity', val: '68%' },
            { icon: 'speedometer-outline', label: 'Wind', val: '12 km/h' },
            { icon: 'umbrella-outline', label: 'Rain', val: '10%' },
          ].map((s, i) => (
            <View key={i} style={[styles.weatherStat, i !== 2 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name={s.icon as any} size={18} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing[4], paddingVertical: Spacing[2] }}>
            {HOURLY.map((h, i) => (
              <View key={i} style={[styles.hourly, i === 0 && styles.hourlyActive]}>
                <Text style={[styles.hourText, i === 0 && styles.hourTextActive]}>{h.hour}</Text>
                <Ionicons name={h.icon as any} size={22} color={i === 0 ? Colors.white : Colors.textSecondary} />
                <Text style={[styles.hourTemp, i === 0 && styles.hourTempActive]}>{h.temp}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>7-Day Forecast</Text>
          {WEEKLY.map((d, i) => (
            <View key={i} style={[styles.dayRow, i < WEEKLY.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.borderLight }]}>
              <Text style={styles.dayName}>{d.day}</Text>
              <Ionicons name={d.icon as any} size={22} color={Colors.textSecondary} style={{ width: 30 }} />
              <View style={styles.rainChance}>
                <Ionicons name="water" size={12} color="#2196F3" />
                <Text style={styles.rainPct}>{d.rain}%</Text>
              </View>
              <View style={styles.tempRange}>
                <Text style={styles.hiTemp}>{d.high}°</Text>
                <Text style={styles.loTemp}> / {d.low}°</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="leaf" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Farming Advisory</Text>
          </View>
          {FARM_TIPS.map((t, i) => (
            <View key={i} style={[styles.tipCard, { borderLeftColor: getTipColor(t.severity) }]}>
              <Ionicons name={t.icon as any} size={20} color={getTipColor(t.severity)} />
              <Text style={styles.tipText}>{t.tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Agricultural Conditions</Text>
          {[
            { label: 'Soil Moisture', value: 'Adequate (62%)', good: true },
            { label: 'UV Index', value: 'High (7)', good: false },
            { label: 'Evapotranspiration', value: '5.2 mm/day', good: true },
            { label: 'Growing Degree Days', value: '18 GDD today', good: true },
          ].map((c, i) => (
            <View key={i} style={styles.condRow}>
              <Text style={styles.condLabel}>{c.label}</Text>
              <Text style={[styles.condVal, { color: c.good ? Colors.success : Colors.warning }]}>{c.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  weatherHeader: { paddingBottom: Spacing[5] },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[1], marginTop: -Spacing[2] },
  location: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)' },
  mainWeather: { alignItems: 'center', paddingVertical: Spacing[4] },
  mainTemp: { fontFamily: FontFamily.bold, fontSize: 64, color: Colors.white, lineHeight: 72 },
  mainDesc: { fontFamily: FontFamily.medium, fontSize: FontSize.base, color: 'rgba(255,255,255,0.9)' },
  feelsLike: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: Spacing[1] },
  weatherStats: { flexDirection: 'row', marginHorizontal: Spacing[4], backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.lg, overflow: 'hidden' },
  weatherStat: { flex: 1, alignItems: 'center', paddingVertical: Spacing[3], gap: 4 },
  statVal: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.white },
  statLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)' },
  content: { padding: Spacing[4], gap: Spacing[3] },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  cardTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: Spacing[3] },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[3] },
  hourly: { alignItems: 'center', gap: Spacing[2], paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], borderRadius: Radius.lg },
  hourlyActive: { backgroundColor: Colors.primary },
  hourText: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  hourTextActive: { color: Colors.white },
  hourTemp: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  hourTempActive: { color: Colors.white },
  dayRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing[3] },
  dayName: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.textPrimary, width: 46 },
  rainChance: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 },
  rainPct: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: '#2196F3' },
  tempRange: { flexDirection: 'row', alignItems: 'center' },
  hiTemp: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm, color: Colors.textPrimary },
  loTemp: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textTertiary },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing[3], padding: Spacing[3], borderLeftWidth: 3, backgroundColor: Colors.background, borderRadius: Radius.sm, marginBottom: Spacing[2] },
  tipText: { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  condRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing[2], borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  condLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary },
  condVal: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
});
