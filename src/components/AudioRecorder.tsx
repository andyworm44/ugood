import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface AudioRecorderProps {
  onRecordingComplete?: (uri: string, duration: number) => void;
  maxDuration?: number;
}

export default function AudioRecorder({ onRecordingComplete, maxDuration = 150 }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, maxDuration]);

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('請求錄音權限...');
        const permission = await requestPermission();
        if (permission.status !== 'granted') {
          Alert.alert('權限錯誤', '需要麥克風權限才能錄音');
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('開始錄音...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (err) {
      console.error('錄音失敗:', err);
      Alert.alert('錄音失敗', '無法開始錄音，請稍後再試');
    }
  };

  const stopRecording = async () => {
    console.log('停止錄音...');
    setIsRecording(false);
    if (!recording) {
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      console.log('錄音完成，文件位置:', uri);
      
      if (uri && onRecordingComplete) {
        onRecordingComplete(uri, recordingDuration);
      }
      
      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error('停止錄音失敗:', error);
      Alert.alert('錄音失敗', '無法保存錄音，請重試');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeDisplay}>
        <Text style={styles.timeText}>
          {formatTime(recordingDuration)} / {formatTime(maxDuration)}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.recordButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <View style={[styles.recordButtonInner, isRecording && styles.recordButtonInnerActive]}>
          <Text style={styles.recordButtonText}>
            {isRecording ? '⏹️\n停止錄音' : '🎤\n開始錄音'}
          </Text>
        </View>
      </TouchableOpacity>
      
      {isRecording && (
        <Text style={styles.recordingStatus}>錄音中...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  timeDisplay: {
    marginBottom: 20,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8FBC8F',
  },
  recordButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8FBC8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInnerActive: {
    backgroundColor: '#FF6B6B',
  },
  recordButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  recordingStatus: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});