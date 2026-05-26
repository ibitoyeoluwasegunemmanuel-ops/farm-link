import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogisticsStackParamList } from './types';

import LogisticsScreen from '../screens/logistics/LogisticsScreen';
import BookTruckScreen from '../screens/logistics/BookTruckScreen';
import BookingConfirmedScreen from '../screens/logistics/BookingConfirmedScreen';
import LiveTrackingScreen from '../screens/logistics/LiveTrackingScreen';
import DeliveryCompletedScreen from '../screens/logistics/DeliveryCompletedScreen';
import DeliveryDetailScreen from '../screens/logistics/DeliveryDetailScreen';

const Stack = createNativeStackNavigator<LogisticsStackParamList>();

export const LogisticsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LogisticsHome" component={LogisticsScreen} />
    <Stack.Screen name="BookTruck" component={BookTruckScreen} />
    <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} options={{ presentation: 'fullScreenModal' }} />
    <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} options={{ presentation: 'fullScreenModal' }} />
    <Stack.Screen name="DeliveryCompleted" component={DeliveryCompletedScreen} options={{ presentation: 'fullScreenModal' }} />
    <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
  </Stack.Navigator>
);
