import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';

type Props = NativeStackScreenProps<HomeStackParamList, 'Stories'>;

export default function StoriesScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={28} color={Colors.white} />
      </TouchableOpacity>
      <Text style={styles.text}>Stories</Text>
      <Text style={styles.sub}>Coming soon — full stories viewer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  closeBtn: { position: 'absolute', top: 56, right: 20 },
  text: { fontFamily: FontFamily.bold, fontSize: FontSize['2xl'], color: Colors.white },
  sub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 8 },
});
