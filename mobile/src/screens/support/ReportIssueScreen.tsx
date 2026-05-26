import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Header, Input, Button } from '../../components/common';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ReportIssue'>;

export default function ReportIssueScreen({ navigation }: Props) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!subject || !description) { Alert.alert('Required', 'Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    Alert.alert('Report Submitted', 'Our team will review your issue within 24 hours.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title="Report Issue" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing[4] }}>
        <Input label="Subject" placeholder="Brief description of the issue" value={subject} onChangeText={setSubject} required />
        <Input label="Description" placeholder="Describe what happened in detail..." value={description} onChangeText={setDescription} multiline numberOfLines={5} style={{ minHeight: 120, textAlignVertical: 'top' }} required />
        <Button label="Submit Report" onPress={submit} loading={loading} size="lg" style={{ marginTop: Spacing[4] }} />
      </ScrollView>
    </View>
  );
}
