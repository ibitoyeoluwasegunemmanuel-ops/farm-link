import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Header, Input, Button, Avatar } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { storageService } from '../../services/storageService';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const user = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [farmName, setFarmName] = useState(user?.farmName || '');
  const [avatarUri, setAvatarUri] = useState(user?.avatarUri || '');
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    const asset = await storageService.pickImage(true, [1, 1]);
    if (asset) setAvatarUri(asset.uri);
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Required', 'Name is required.'); return; }
    setLoading(true);
    try {
      await updateUser({ name: name.trim(), email: email.trim(), bio, farmName, avatarUri });
      navigation.goBack();
    } finally { setLoading(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title="Edit Profile" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: Spacing[4], paddingBottom: 40 }}>
        <TouchableOpacity onPress={pickAvatar} style={{ alignItems: 'center', marginBottom: Spacing[6] }}>
          <Avatar uri={avatarUri} name={name} size="xl" />
          <Text style={{ fontFamily: FontFamily.medium, fontSize: FontSize.sm, color: Colors.primary, marginTop: Spacing[2] }}>Change Photo</Text>
        </TouchableOpacity>
        <Input label="Full Name" value={name} onChangeText={setName} required />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Farm/Business Name" value={farmName} onChangeText={setFarmName} />
        <Input label="Bio" value={bio} onChangeText={setBio} multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} />
        <Button label="Save Changes" onPress={handleSave} loading={loading} size="lg" style={{ marginTop: Spacing[4] }} />
      </ScrollView>
    </View>
  );
}
