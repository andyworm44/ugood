import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONT_SIZES } from '../utils/constants';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = '載入中...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  message: {
    marginTop: 16,
    fontSize: FONT_SIZES.MD,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
}); 