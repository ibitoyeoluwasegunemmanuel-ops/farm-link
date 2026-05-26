import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MarketplaceStackParamList } from './types';

import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import CategoryScreen from '../screens/marketplace/CategoryScreen';
import ProductDetailScreen from '../screens/marketplace/ProductDetailScreen';
import CartScreen from '../screens/marketplace/CartScreen';
import CheckoutScreen from '../screens/marketplace/CheckoutScreen';
import OrderSuccessScreen from '../screens/marketplace/OrderSuccessScreen';
import OrderDetailScreen from '../screens/marketplace/OrderDetailScreen';
import OrdersScreen from '../screens/marketplace/OrdersScreen';
import SearchScreen from '../screens/marketplace/SearchScreen';

const Stack = createNativeStackNavigator<MarketplaceStackParamList>();

export const MarketplaceNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MarketplaceHome" component={MarketplaceScreen} />
    <Stack.Screen name="Category" component={CategoryScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ presentation: 'fullScreenModal' }} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    <Stack.Screen name="Orders" component={OrdersScreen} />
    <Stack.Screen name="Search" component={SearchScreen} options={{ presentation: 'modal' }} />
  </Stack.Navigator>
);
