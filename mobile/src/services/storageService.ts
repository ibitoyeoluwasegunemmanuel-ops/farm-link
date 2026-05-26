import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const storageService = {
  pickImage: async (allowsEditing = true, aspect: [number, number] = [1, 1]) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') throw new Error('Gallery permission required');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing,
      aspect,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) return null;
    return result.assets[0];
  },

  takePhoto: async (allowsEditing = true, aspect: [number, number] = [1, 1]) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') throw new Error('Camera permission required');

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing,
      aspect,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) return null;
    return result.assets[0];
  },

  uriToBase64: async (uri: string): Promise<string> => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  },
};
