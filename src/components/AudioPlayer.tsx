import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface AudioPlayerProps {
  audioUri: string;
  duration?: number;
  title?: string;
  isSelfRecording?: boolean;
}

export default function AudioPlayer({ audioUri, duration = 0, title, isSelfRecording }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playAudio = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      console.log('播放音頻:', audioUri);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          setAudioDuration(status.durationMillis || duration * 1000);
          
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
          }
        }
      });

    } catch (error) {
      console.error('播放音頻失敗:', error);
      Alert.alert('錯誤', '播放音頻失敗');
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, isSelfRecording && styles.selfRecordingContainer]}>
      {title && (
        <Text style={[styles.title, isSelfRecording && styles.selfRecordingTitle]}>
          {title}
        </Text>
      )}
      
      {isSelfRecording && (
        <Text style={styles.selfRecordingNote}>
          這是你剛才錄製的祝福語音，現在可以聽聽效果！
        </Text>
      )}

      <View style={styles.playerContainer}>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={isPlaying ? stopAudio : playAudio}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(position)} / {formatTime(audioDuration)}
          </Text>
          {isPlaying && (
            <Text style={styles.playingText}>正在播放...</Text>
          )}
        </View>
      </View>

      {isSelfRecording && (
        <Text style={styles.testModeText}>
          🎤 測試模式：你可以聽到自己的真實錄音！
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8FBC8F',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  selfRecordingContainer: {
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  selfRecordingTitle: {
    color: 'white',
  },
  selfRecordingNote: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playButtonText: {
    fontSize: 24,
    color: '#8FBC8F',
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  playingText: {
    fontSize: 12,
    color: 'white',
    fontStyle: 'italic',
    marginTop: 5,
  },
  testModeText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
}); 