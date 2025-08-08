import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  console.log('🎯 UGood Step 1 - 基礎歡迎頁面');
  
  return (
    <View style={styles.container}>
      {/* 標題 */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>UGood?</Text>
        <Text style={styles.subtitle}>分享困擾，收穫溫暖</Text>
      </View>

      {/* 描述 */}
      <View style={styles.descriptionSection}>
        <Text style={styles.description}>
          在這裡，您可以匿名分享生活中的困擾，
        </Text>
        <Text style={styles.description}>
          並收到來自陌生朋友的溫暖祝福語音。
        </Text>
        <Text style={styles.description}>
          同時，您也可以為他人送上關懷與支持。
        </Text>
      </View>

      {/* 按鈕區域 */}
      <View style={styles.buttonSection}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => console.log('開始使用')}
        >
          <Text style={styles.primaryButtonText}>開始使用</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => console.log('已有帳號')}
        >
          <Text style={styles.secondaryButtonText}>已有帳號</Text>
        </TouchableOpacity>
      </View>

      {/* 底部提示 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>🔒 完全匿名 · 安全私密</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 30,
    paddingVertical: 60,
    justifyContent: 'space-between',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  descriptionSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  buttonSection: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
