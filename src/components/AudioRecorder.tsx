import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface AudioRecorderProps {
  onRecordingComplete: (uri: string, duration: number) => void;
  onPlaybackComplete?: () => void;
}

export default function AudioRecorder({ onRecordingComplete, onPlaybackComplete }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      console.log('請求錄音權限...');
      const permission = await Audio.requestPermissionsAsync();
      
      if (permission.status !== 'granted') {
        Alert.alert('權限錯誤', '需要麥克風權限才能錄音');
        return;
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
      setRecordingTime(0);
      setHasRecording(false);

      // 開始計時
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 180) { // 3分鐘自動停止
            stopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);

      console.log('錄音已開始');
    } catch (err) {
      console.error('開始錄音失敗:', err);
      Alert.alert('錯誤', '無法開始錄音');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log('停止錄音...');
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log('錄音已保存到:', uri);
      
      if (uri) {
        setRecordingUri(uri);
        setHasRecording(true);
        onRecordingComplete(uri, recordingTime);
        Alert.alert('錄音完成', `錄音時長：${Math.floor(recordingTime / 60)}分${recordingTime % 60}秒`);
      }
      
      setRecording(null);
    } catch (error) {
      console.error('停止錄音失敗:', error);
      Alert.alert('錯誤', '停止錄音失敗');
    }
  };

  const playRecording = async () => {
    if (!recordingUri) {
      Alert.alert('錯誤', '沒有可播放的錄音');
      return;
    }

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      console.log('播放錄音:', recordingUri);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          onPlaybackComplete?.();
        }
      });

    } catch (error) {
      console.error('播放錄音失敗:', error);
      Alert.alert('錯誤', '播放錄音失敗');
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* 錄音狀態顯示 */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isRecording ? '🔴 錄音中' : hasRecording ? '✅ 錄音完成' : '⚪ 準備錄音'}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(recordingTime)}
        </Text>
      </View>

      {/* 錄音按鈕 */}
      <TouchableOpacity 
        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <View style={[styles.recordButtonInner, isRecording && styles.recordButtonInnerActive]}>
          <Text style={styles.recordButtonText}>
            {isRecording ? '停止錄音' : hasRecording ? '重新錄音' : '開始錄音'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 播放按鈕 */}
      {hasRecording && (
        <TouchableOpacity 
          style={styles.playButton}
          onPress={isPlaying ? stopPlayback : playRecording}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸ 停止播放' : '▶ 播放錄音'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8FBC8F',
  },
  recordButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButtonActive: {
    // 錄音中的樣式
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
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
}); 