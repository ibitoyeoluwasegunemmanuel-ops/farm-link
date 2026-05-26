import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Header, EmptyState } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Tickets'>;

export default function TicketsScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title="My Tickets" showBack onBack={() => navigation.goBack()} />
      <EmptyState icon="ticket-outline" title="No Support Tickets" description="You haven't filed any support tickets yet." actionLabel="Report an Issue" onAction={() => navigation.navigate('ReportIssue')} />
    </View>
  );
}
