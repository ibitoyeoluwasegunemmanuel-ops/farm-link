import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletStackParamList } from './types';

import WalletScreen from '../screens/wallet/WalletScreen';
import AddMoneyScreen from '../screens/wallet/AddMoneyScreen';
import SendMoneyScreen from '../screens/wallet/SendMoneyScreen';
import ScanPayScreen from '../screens/wallet/ScanPayScreen';
import WithdrawScreen from '../screens/wallet/WithdrawScreen';
import TransactionHistoryScreen from '../screens/wallet/TransactionHistoryScreen';
import TransactionDetailScreen from '../screens/wallet/TransactionDetailScreen';

const Stack = createNativeStackNavigator<WalletStackParamList>();

export const WalletNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WalletHome" component={WalletScreen} />
    <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
    <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
    <Stack.Screen name="ScanPay" component={ScanPayScreen} options={{ presentation: 'fullScreenModal' }} />
    <Stack.Screen name="Withdraw" component={WithdrawScreen} />
    <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
    <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
  </Stack.Navigator>
);
