import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogisticsStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, Input, Button, TruckCard } from '../../components/common';
import { formatCurrency } from '../../constants/theme';

type Props = NativeStackScreenProps<LogisticsStackParamList, 'BookTruck'>;

type Step = 'route' | 'vehicle' | 'load' | 'review';
const STEPS: Step[] = ['route', 'vehicle', 'load', 'review'];
const STEP_LABELS = ['Route', 'Vehicle', 'Load', 'Review'];

const TRUCKS = [
  { id: 't1', driverName: 'Ibrahim Musa', vehicleType: 'pickup', plateNumber: 'AGL-234-XY', capacity: 1, capacityUnit: 'ton', rating: 4.9, totalTrips: 212, distanceKm: 2.1, estimatedPrice: 15000 },
  { id: 't2', driverName: 'Chuka Obi', vehicleType: 'truck_3t', plateNumber: 'LSD-567-KA', capacity: 3, capacityUnit: 'tons', rating: 4.7, totalTrips: 148, distanceKm: 3.4, estimatedPrice: 35000 },
  { id: 't3', driverName: 'Musa Aliyu', vehicleType: 'truck_10t', plateNumber: 'KN-890-AB', capacity: 10, capacityUnit: 'tons', rating: 4.6, totalTrips: 89, distanceKm: 5.2, estimatedPrice: 75000 },
];

export default function BookTruckScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>('route');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  const [cargo, setCargo] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const stepIdx = STEPS.indexOf(step);

  const goNext = () => {
    if (step === 'route' && (!pickup.trim() || !destination.trim())) {
      Alert.alert('Required', 'Please enter pickup and destination locations.');
      return;
    }
    if (step === 'vehicle' && !selectedTruck) {
      Alert.alert('Required', 'Please select a vehicle.');
      return;
    }
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
    else navigation.goBack();
  };

  const handleBook = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      navigation.replace('BookingConfirmed', { bookingId: `BK${Date.now()}` });
    } finally {
      setLoading(false);
    }
  };

  const truck = TRUCKS.find(t => t.id === selectedTruck);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Book a Truck" showBack onBack={goBack} dark />

      {/* Progress */}
      <View style={styles.progress}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, i <= stepIdx && styles.progressDotActive]}>
                {i < stepIdx ? (
                  <Ionicons name="checkmark" size={12} color={Colors.white} />
                ) : (
                  <Text style={styles.progressNum}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.progressLabel, i === stepIdx && styles.progressLabelActive]}>
                {STEP_LABELS[i]}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.progressLine, i < stepIdx && styles.progressLineActive]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Step: Route */}
        {step === 'route' && (
          <View>
            <Text style={styles.stepTitle}>Where are you moving from and to?</Text>
            <View style={styles.routeCard}>
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: Colors.primary }]} />
                <Input
                  placeholder="Pickup location (e.g. Ikeja, Lagos)"
                  value={pickup}
                  onChangeText={setPickup}
                  containerStyle={styles.locationInput}
                />
              </View>
              <View style={styles.routeDivider} />
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: Colors.error }]} />
                <Input
                  placeholder="Destination (e.g. Abuja)"
                  value={destination}
                  onChangeText={setDestination}
                  containerStyle={styles.locationInput}
                />
              </View>
            </View>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={48} color={Colors.border} />
              <Text style={styles.mapPlaceholderText}>Map view — route preview</Text>
            </View>
          </View>
        )}

        {/* Step: Vehicle */}
        {step === 'vehicle' && (
          <View>
            <Text style={styles.stepTitle}>Select a vehicle</Text>
            <Text style={styles.stepSub}>{TRUCKS.length} trucks available near {pickup}</Text>
            {TRUCKS.map((t) => (
              <TruckCard
                key={t.id}
                {...t}
                isSelected={selectedTruck === t.id}
                onSelect={() => setSelectedTruck(t.id)}
              />
            ))}
          </View>
        )}

        {/* Step: Load */}
        {step === 'load' && (
          <View>
            <Text style={styles.stepTitle}>What are you transporting?</Text>
            <Input label="Cargo Description" placeholder="e.g. 200 bags of maize" value={cargo} onChangeText={setCargo} required />
            <Input label="Estimated Weight (kg)" placeholder="e.g. 20000" value={weight} onChangeText={setWeight} keyboardType="number-pad" />
            <View style={styles.tipCard}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
              <Text style={styles.tipText}>Accurate weight helps the driver plan the trip safely and ensures proper pricing.</Text>
            </View>
          </View>
        )}

        {/* Step: Review */}
        {step === 'review' && truck && (
          <View>
            <Text style={styles.stepTitle}>Review your booking</Text>
            <View style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                <View>
                  <Text style={styles.reviewLabel}>Route</Text>
                  <Text style={styles.reviewVal}>{pickup} → {destination}</Text>
                </View>
              </View>
              <View style={styles.reviewDivider} />
              <View style={styles.reviewRow}>
                <Ionicons name="cube-outline" size={16} color={Colors.textSecondary} />
                <View>
                  <Text style={styles.reviewLabel}>Vehicle</Text>
                  <Text style={styles.reviewVal}>{truck.vehicleType} · {truck.plateNumber}</Text>
                  <Text style={styles.reviewSub}>Driver: {truck.driverName}</Text>
                </View>
              </View>
              <View style={styles.reviewDivider} />
              <View style={styles.reviewRow}>
                <Ionicons name="leaf-outline" size={16} color={Colors.textSecondary} />
                <View>
                  <Text style={styles.reviewLabel}>Cargo</Text>
                  <Text style={styles.reviewVal}>{cargo || 'Not specified'}</Text>
                </View>
              </View>
              <View style={styles.reviewDivider} />
              <View style={styles.reviewRow}>
                <Ionicons name="cash-outline" size={16} color={Colors.primary} />
                <View>
                  <Text style={styles.reviewLabel}>Estimated Cost</Text>
                  <Text style={[styles.reviewVal, { color: Colors.primary, fontSize: FontSize.xl }]}>
                    {formatCurrency(truck.estimatedPrice || 0)}
                  </Text>
                  <Text style={styles.reviewSub}>Held in escrow until delivery</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          label={step === 'review' ? 'Confirm Booking' : 'Continue'}
          onPress={step === 'review' ? handleBook : goNext}
          loading={loading}
          size="lg"
          variant={step === 'review' ? 'gradient' : 'primary'}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  progress: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], paddingVertical: Spacing[4], backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  progressStep: { alignItems: 'center', gap: 4 },
  progressDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  progressDotActive: { backgroundColor: Colors.primary },
  progressNum: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.white },
  progressLabel: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textTertiary },
  progressLabelActive: { fontFamily: FontFamily.semiBold, color: Colors.primary },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginBottom: 16 },
  progressLineActive: { backgroundColor: Colors.primary },
  content: { padding: Spacing[4], paddingBottom: 100 },
  stepTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary, marginBottom: Spacing[2] },
  stepSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing[4] },
  routeCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight, marginBottom: Spacing[4] },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  routeDot: { width: 12, height: 12, borderRadius: 6 },
  locationInput: { flex: 1, marginBottom: 0 },
  routeDivider: { height: 20, width: 1, backgroundColor: Colors.border, marginLeft: 6, marginVertical: 4 },
  mapPlaceholder: { height: 200, backgroundColor: Colors.inputBg, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing[2] },
  mapPlaceholderText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textTertiary },
  tipCard: { flexDirection: 'row', gap: Spacing[2], alignItems: 'flex-start', backgroundColor: Colors.primaryTint, borderRadius: Radius.md, padding: Spacing[4] },
  tipText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: Colors.textPrimary, flex: 1, lineHeight: 20 },
  reviewCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], borderWidth: 1, borderColor: Colors.borderLight },
  reviewRow: { flexDirection: 'row', gap: Spacing[3], alignItems: 'flex-start', paddingVertical: Spacing[3] },
  reviewDivider: { height: 1, backgroundColor: Colors.borderLight },
  reviewLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  reviewVal: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, color: Colors.textPrimary, marginTop: 2 },
  reviewSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing[4], paddingBottom: Spacing[6], backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight },
});
