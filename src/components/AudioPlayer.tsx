import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface AudioPlayerProps {
  uri: string;
  duration?: number;
}

export default function AudioPlayer({ uri, duration = 0 }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          console.log('卸載音頻');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        console.log('載入音頻:', uri);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setCurrentPosition(status.positionMillis || 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setCurrentPosition(0);
            }
          }
        });
      }
    } catch (error) {
      console.error('播放音頻失敗:', error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton} onPress={playSound}>
        <Text style={styles.playButtonText}>
          {isPlaying ? '⏸️' : '▶️'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.timeInfo}>
        <Text style={styles.timeText}>
          {formatTime(currentPosition)} / {formatTime(duration * 1000)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8FBC8F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playButtonText: {
    fontSize: 24,
    color: 'white',
  },
  timeInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
});