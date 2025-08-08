import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  console.log('🎯 App 開始渲染');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 UGood 測試成功！</Text>
      <Text style={styles.subText}>如果您看到這個訊息，表示應用正在正常運行</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
});
