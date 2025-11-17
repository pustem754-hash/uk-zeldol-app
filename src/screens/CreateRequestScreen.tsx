import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { Audio, Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as Localization from 'expo-localization';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Header } from '../components/Header';

// Компонент для воспроизведения аудио через Audio.Sound
const AudioPlayer = ({
  uri,
  onError,
  onSoundRef,
}: {
  uri: string;
  onError: (error: any) => void;
  onSoundRef?: (ref: Audio.Sound | null) => void;
}) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const isSeekingRef = useRef(false);
  const [wasPlayingBeforeSeeking, setWasPlayingBeforeSeeking] = useState(false);

  useEffect(() => {
    let sound: Audio.Sound | null = null;
    let statusUpdateInterval: NodeJS.Timeout | null = null;

    const loadSound = async () => {
      try {
        // Очистка предыдущего звука
        if (soundRef.current) {
          try {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
          } catch (e) {
            console.log('Очистка предыдущего звука:', e);
          }
          soundRef.current = null;
        }

        setIsLoading(true);
        // НЕ сбрасываем isPlaying в false, так как будем автоматически воспроизводить
        setPosition(0);
        setDuration(null);

        // Настройка аудио режима перед загрузкой
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        console.log('🎵 Загрузка аудио:', uri);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          {
            shouldPlay: true, // Воспроизводить автоматически при открытии
            isMuted: false,
            volume: 1.0,
          },
          (status) => {
            if (status.isLoaded) {
              // Если должно воспроизводиться (shouldPlay), устанавливаем isPlaying в true
              const shouldBePlaying = status.shouldPlay || status.isPlaying;
              setIsPlaying(shouldBePlaying);
              setDuration(status.durationMillis || null);
              setPosition(status.positionMillis || 0);
              setIsLoading(false);
              console.log('🎵 Статус аудио:', { isPlaying: status.isPlaying, shouldPlay: status.shouldPlay });

              if (status.didJustFinish) {
                setIsPlaying(false);
                // НЕ сбрасываем позицию в 0, чтобы можно было перетащить назад
              }

              if (status.isMuted) {
                console.warn('⚠️ Аудио воспроизводится БЕЗ ЗВУКА (isMuted=true)');
                // Исправляем если звук выключен
                if (sound) {
                  sound.setStatusAsync({ isMuted: false, volume: 1.0 }).catch(console.error);
                }
              }
              if (status.volume !== undefined && status.volume < 1.0) {
                console.warn(`⚠️ Громкость аудио: ${status.volume} (должна быть 1.0)`);
                // Исправляем если громкость низкая
                if (sound) {
                  sound.setStatusAsync({ volume: 1.0, isMuted: false }).catch(console.error);
                }
              }
            } else if (status.error) {
              console.error('❌ Ошибка статуса аудио:', status.error);
              setIsLoading(false);
            }
          }
        );

        sound = newSound;
        soundRef.current = sound;
        if (onSoundRef) {
          onSoundRef(sound);
        }

        // Убеждаемся что воспроизведение началось
        try {
          // Небольшая задержка для того чтобы звук успел загрузиться
          await new Promise(resolve => setTimeout(resolve, 100));
          const initialStatus = await sound.getStatusAsync();
          
          if (initialStatus.isLoaded) {
            console.log('🎵 Начальный статус:', { 
              isLoaded: true, 
              isPlaying: initialStatus.isPlaying,
              shouldPlay: initialStatus.shouldPlay 
            });
            
            if (!initialStatus.isPlaying) {
              console.log('▶️ Запускаем воспроизведение...');
              await sound.playAsync();
              setIsPlaying(true);
            } else {
              setIsPlaying(true);
              console.log('✅ Аудио уже воспроизводится');
            }
          } else {
            console.log('⚠️ Аудио ещё не загружено, статус:', initialStatus);
          }
        } catch (e) {
          console.error('Ошибка запуска воспроизведения:', e);
          // Пытаемся запустить вручную
          try {
            await sound.playAsync();
            setIsPlaying(true);
          } catch (e2) {
            console.error('Ошибка повторного запуска:', e2);
          }
        }

        // Запускаем обновление статуса (только если не перетаскиваем)
        statusUpdateInterval = setInterval(async () => {
          if (sound && !isSeekingRef.current) {
            try {
              const status = await sound.getStatusAsync();
              if (status.isLoaded) {
                setIsPlaying(status.isPlaying || false);
                // Обновляем позицию, но не сбрасываем в 0 при окончании
                // Это позволяет перетаскивать назад даже после окончания
                if (status.positionMillis !== undefined) {
                  setPosition(status.positionMillis);
                }
                if (status.didJustFinish) {
                  setIsPlaying(false);
                  // НЕ сбрасываем позицию в 0, чтобы можно было перетащить назад
                }
              }
            } catch (e) {
              console.error('Ошибка обновления статуса:', e);
            }
          }
        }, 100);

        console.log('✅ Аудио загружено и воспроизводится');
      } catch (error) {
        console.error('❌ Ошибка загрузки аудио:', error);
        setIsLoading(false);
        onError(error);
      }
    };

    if (uri) {
      loadSound();
    }

    return () => {
      if (statusUpdateInterval) {
        clearInterval(statusUpdateInterval);
      }
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
      if (onSoundRef) {
        onSoundRef(null);
      }
    };
  }, [uri]); // Убрали onError и onSoundRef из зависимостей

  const togglePlayPause = async () => {
    if (!soundRef.current) {
      console.warn('⚠️ Звук не загружен');
      return;
    }

    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) {
        console.warn('⚠️ Звук не загружен, статус:', status);
        return;
      }

      if (status.isPlaying) {
        console.log('⏸️ Пауза');
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        console.log('▶️ Воспроизведение');
        // Убеждаемся что звук включен
        await soundRef.current.setStatusAsync({
          isMuted: false,
          volume: 1.0,
        });
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('❌ Ошибка переключения воспроизведения:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка воспроизведения',
        text2: 'Попробуйте ещё раз',
        position: 'bottom',
      });
    }
  };

  const formatTime = (millis: number | null) => {
    if (millis === null) return '0:00';
    const seconds = Math.floor(millis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Начало перетаскивания
  const handleSlidingStart = async () => {
    isSeekingRef.current = true;
    setIsSeeking(true);
    
    // Запоминаем, играло ли аудио
    setWasPlayingBeforeSeeking(isPlaying);
    
    // Если аудио играло - ОСТАНАВЛИВАЕМ
    if (isPlaying && soundRef.current) {
      try {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        console.log('🎵 Аудио приостановлено для перетаскивания');
      } catch (error) {
        console.error('Ошибка паузы при начале перетаскивания:', error);
      }
    }
  };

  // Перетаскивание
  const handleValueChange = (value: number) => {
    setSeekPosition(value);
    setPosition(value);
  };

  // Завершение перетаскивания
  const handleSlidingComplete = async (value: number) => {
    if (!soundRef.current) {
      isSeekingRef.current = false;
      setIsSeeking(false);
      setWasPlayingBeforeSeeking(false);
      return;
    }

    try {
      // Устанавливаем новую позицию
      await soundRef.current.setPositionAsync(value);
      setPosition(value);
      console.log('🎵 Позиция установлена:', Math.floor(value / 1000), 'сек');
      
      // Если аудио играло ДО перетаскивания - ВОЗОБНОВЛЯЕМ
      if (wasPlayingBeforeSeeking) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        console.log('🎵 Воспроизведение возобновлено');
      } else {
        // Если не играло - оставляем на паузе
        setIsPlaying(false);
        console.log('⏸️ Аудио остаётся на паузе');
      }
    } catch (error) {
      console.error('Ошибка установки позиции:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Не удалось переместить позицию',
        position: 'bottom',
      });
    } finally {
      // Снимаем блокировку
      isSeekingRef.current = false;
      setIsSeeking(false);
      setWasPlayingBeforeSeeking(false);
    }
  };

  // Перемотка назад на 10 секунд
  const skipBackward = async () => {
    if (!soundRef.current) return;

    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;

      const newPosition = Math.max(0, position - 10000); // 10 секунд назад
      await soundRef.current.setPositionAsync(newPosition);
      setPosition(newPosition);
      console.log('⏪ Перемотка назад на 10 секунд');
    } catch (error) {
      console.error('Ошибка перемотки назад:', error);
    }
  };

  // Перемотка вперед на 10 секунд
  const skipForward = async () => {
    if (!soundRef.current || !duration) return;

    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;

      const newPosition = Math.min(duration, position + 10000); // 10 секунд вперед
      await soundRef.current.setPositionAsync(newPosition);
      setPosition(newPosition);
      console.log('⏩ Перемотка вперед на 10 секунд');
    } catch (error) {
      console.error('Ошибка перемотки вперед:', error);
    }
  };

  return (
    <View style={styles.audioPlayerContainer}>
      {/* Прогресс-бар */}
      <View style={styles.audioProgress}>
        <Text style={styles.audioTime}>
          {formatTime(isSeeking ? seekPosition : position)}
        </Text>
        <Slider
          style={styles.audioSlider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={isSeeking ? seekPosition : position}
          onValueChange={handleValueChange}
          onSlidingStart={handleSlidingStart}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#4CAF50"
          step={100}
          disabled={isLoading || !duration}
        />
        <Text style={styles.audioTime}>
          {formatTime(duration)}
        </Text>
      </View>

      {/* Управление воспроизведением */}
      <View style={styles.audioControls}>
        {/* Перемотка назад */}
        <TouchableOpacity 
          style={styles.audioControlButton}
          onPress={skipBackward}
          disabled={isLoading || !duration}
        >
          <Ionicons name="play-back" size={32} color={isLoading || !duration ? "#ccc" : "#4CAF50"} />
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity 
          style={styles.audioPlayButton}
          onPress={togglePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color="#fff" 
            />
          )}
        </TouchableOpacity>

        {/* Перемотка вперед */}
        <TouchableOpacity 
          style={styles.audioControlButton}
          onPress={skipForward}
          disabled={isLoading || !duration}
        >
          <Ionicons name="play-forward" size={32} color={isLoading || !duration ? "#ccc" : "#4CAF50"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const CreateRequestScreen = ({ navigation }: any) => {
  const [type, setType] = useState<'ремонт' | 'уборка' | 'другое'>('ремонт');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [audioRecording, setAudioRecording] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [currentVideoUri, setCurrentVideoUri] = useState<string | null>(null);
  const [currentAudioUri, setCurrentAudioUri] = useState<string | null>(null);
  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(null);
  const videoRef = useRef<Video>(null);
  const audioSoundRef = useRef<Audio.Sound | null>(null);

  // Инициализация аудио режима и локализации
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Проверка и установка локали
        const locales = Localization.getLocales();
        const locale = locales[0];
        console.log('🌍 Текущая локаль устройства:', locale?.languageCode, locale?.regionCode);
        console.log('🌍 Все локали:', locales.map(l => `${l.languageCode}_${l.regionCode}`).join(', '));
        
        // Убеждаемся что используется русская локаль
        if (locale?.languageCode !== 'ru') {
          console.warn('⚠️ Устройство не на русском языке. Системные диалоги будут на языке устройства.');
          console.warn('⚠️ Для русских диалогов установите русский язык в настройках устройства.');
        } else {
          console.log('✅ Устройство на русском языке. Системные диалоги будут на русском.');
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        console.log('✅ Аудио режим настроен');
      } catch (error) {
        console.error('❌ Ошибка настройки аудио:', error);
      }
    };

    setupAudio();

    // Очистка при размонтировании
    return () => {
      if (audioSoundRef.current) {
        audioSoundRef.current.unloadAsync().catch(console.error);
      }
    };
  }, []);

  const pickImages = async () => {
    console.log('✅ Функция pickImages() вызвана успешно');
    console.log('🖼️ Открываем галерею...');

    try {
      // Открываем галерею сразу
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 3,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      });

      console.log('📸 Результат:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const totalImages = photos.length + result.assets.length;

        if (totalImages > 3) {
          Toast.show({
            type: 'error',
            text1: 'Превышен лимит',
            text2: 'Можно загрузить максимум 3 фото',
            position: 'bottom',
          });
          const remainingSlots = 3 - photos.length;
          const newPhotos = result.assets.slice(0, remainingSlots).map((a) => a.uri);
          setPhotos([...photos, ...newPhotos]);
          return;
        }

        const newPhotos = result.assets.map((a) => a.uri);
        setPhotos([...photos, ...newPhotos]);

        Toast.show({
          type: 'success',
          text1: 'Фото выбраны',
          text2: `Добавлено: ${result.assets.length}`,
          position: 'bottom',
        });
      }
    } catch (error: any) {
      console.error('❌ Ошибка галереи:', error);

      if (error.code === 'E_NO_PERMISSIONS' || error.message?.includes('permission')) {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted) {
          pickImages();
        } else {
          Alert.alert(
            'Нет доступа к галерее',
            'Для выбора фото необходимо разрешить доступ к галерее. Открыть настройки?',
            [
              {
                text: 'Отмена',
                style: 'cancel',
              },
              {
                text: 'Открыть настройки',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: error.message || 'Не удалось открыть галерею',
          position: 'bottom',
        });
      }
    }
  };

  const takePhoto = async () => {
    try {
      if (photos.length >= 3) {
        Toast.show({
          type: 'info',
          text1: 'Максимум 3 фото',
          text2: 'Вы можете прикрепить не более 3 фото',
          position: 'bottom',
        });
        return;
      }

      navigation.navigate('Camera', {
        mode: 'photo',
        onMediaCaptured: (media: { uri: string; type: 'photo' | 'video' }) => {
          if (photos.length >= 3) {
            Toast.show({
              type: 'error',
              text1: 'Максимум 3 фото',
              text2: 'Удалите одно из существующих фото',
              position: 'bottom',
            });
            return;
          }
          // Открываем модальное окно просмотра фото после съёмки
          setCurrentPhotoUri(media.uri);
          setPhotoViewerVisible(true);
        },
      });
    } catch (error: any) {
      console.error('Ошибка открытия камеры:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка камеры',
        text2: error.message,
        position: 'bottom',
      });
    }
  };


  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);

    Toast.show({
      type: 'info',
      text1: 'Файл удалён',
      position: 'bottom',
    });
  };

  const pickVideo = async () => {
    try {
      console.log('🎥 Открываем выбор видео...');

      // Проверяем лимит
      if (videos.length >= 2) {
        Toast.show({
          type: 'info',
          text1: 'Максимум 2 видео',
          text2: 'Вы можете прикрепить не более 2 видео',
          position: 'bottom',
        });
        return;
      }

      // Проверяем разрешение
      const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      let finalStatus = currentStatus;

      if (currentStatus !== 'granted') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Нет доступа к галерее',
          'Для выбора видео необходимо разрешить доступ к галерее. Открыть настройки?',
          [
            {
              text: 'Отмена',
              style: 'cancel',
            },
            {
              text: 'Открыть настройки',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.8,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      });

      console.log('Результат выбора видео:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setVideos([...videos, result.assets[0].uri]);
        Toast.show({
          type: 'success',
          text1: 'Видео добавлено',
          position: 'bottom',
        });
      }
    } catch (error: any) {
      console.error('❌ Ошибка выбора видео:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: error.message || 'Не удалось выбрать видео',
        position: 'bottom',
      });
    }
  };

  const takeVideo = async () => {
    try {
      // Проверяем лимит
      if (videos.length >= 2) {
        Toast.show({
          type: 'info',
          text1: 'Максимум 2 видео',
          text2: 'Вы можете прикрепить не более 2 видео',
          position: 'bottom',
        });
        return;
      }

      navigation.navigate('Camera', {
        mode: 'video',
        onMediaCaptured: (media: { uri: string; type: 'photo' | 'video' }) => {
          if (videos.length >= 2) {
            Toast.show({
              type: 'error',
              text1: 'Максимум 2 видео',
              text2: 'Удалите одно из существующих видео',
              position: 'bottom',
            });
            return;
          }
          setVideos([...videos, media.uri]);
          Toast.show({
            type: 'success',
            text1: 'Видео добавлено',
            position: 'bottom',
            visibilityTime: 2000,
          });
        },
      });
    } catch (error: any) {
      console.error('Ошибка открытия камеры:', error);
      Toast.show({
        type: 'error',
        text1: 'Ошибка камеры',
        text2: error.message,
        position: 'bottom',
      });
    }
  };

  const startRecording = async () => {
    try {
      console.log('🎤 Начинаем запись...');

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Нет доступа к микрофону',
          'Для записи аудио необходимо разрешить доступ к микрофону. Открыть настройки?',
          [
            {
              text: 'Отмена',
              style: 'cancel',
            },
            {
              text: 'Открыть настройки',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);

      Toast.show({
        type: 'info',
        text1: 'Идёт запись...',
        text2: 'Нажмите "Стоп" для завершения',
        position: 'bottom',
      });
    } catch (err: any) {
      console.error('Ошибка начала записи:', err);
      Toast.show({
        type: 'error',
        text1: 'Ошибка записи',
        text2: err.message || 'Не удалось начать запись',
        position: 'bottom',
      });
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log('⏹️ Останавливаем запись...');
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioRecording(uri || undefined);
      setRecording(undefined);

      Toast.show({
        type: 'success',
        text1: 'Аудиозапись сохранена',
        position: 'bottom',
      });
    } catch (err: any) {
      console.error('Ошибка остановки записи:', err);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: err.message || 'Не удалось сохранить запись',
        position: 'bottom',
      });
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Опишите проблему',
        position: 'bottom',
      });
      return;
    }

    setLoading(true);

    // Имитация создания заявки
    // В реальном приложении здесь будет отправка данных на сервер
    const newRequest = {
      type,
      description,
      photos: photos, // Включаем фотографии в данные заявки
      videos: videos, // Включаем видео в данные заявки
      audioRecording: audioRecording, // Включаем аудиозапись в данные заявки
    };

    setTimeout(() => {
      setLoading(false);
      const attachmentsInfo = [];
      if (photos.length > 0) attachmentsInfo.push(`${photos.length} фото`);
      if (videos.length > 0) attachmentsInfo.push(`${videos.length} видео`);
      if (audioRecording) attachmentsInfo.push('аудиозапись');
      const attachmentsText = attachmentsInfo.length > 0 ? ` с ${attachmentsInfo.join(', ')}` : '';

      Alert.alert(
        'Успешно',
        `Заявка создана${attachmentsText}. Мы свяжемся с вами в ближайшее время.`,
        [
          {
            text: 'ОК',
            onPress: () => {
              // Очищаем форму
              setDescription('');
              setPhotos([]);
              setVideos([]);
              setAudioRecording(undefined);
              setRecording(undefined);
              setIsRecording(false);
              navigation.goBack();
            },
          },
        ]
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Header title="Новая заявка" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <Card>
          <Text style={styles.title}>Тип заявки</Text>
          <View style={styles.typeButtons}>
            {['ремонт', 'уборка', 'другое'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeButton, type === t && styles.typeButtonActive]}
                onPress={() => setType(t as any)}
              >
                <Text
                  style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Input
            label="Описание проблемы"
            placeholder="Опишите подробно..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        </Card>

        <Card>
          <View style={styles.mediaSection}>
            <Text style={styles.sectionLabel}>Прикрепить медиа</Text>
            <Text style={styles.description}>
              Можно загрузить до 3 фотографий, до 2 видео и 1 аудиозапись
            </Text>

            <View style={styles.mediaButtons}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={pickImages}
              >
                <Ionicons name="images-outline" size={24} color="#4CAF50" />
                <Text style={styles.mediaButtonText}>Из галереи</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={takePhoto}
              >
                <Ionicons name="camera-outline" size={24} color="#4CAF50" />
                <Text style={styles.mediaButtonText}>Сделать фото</Text>
              </TouchableOpacity>
            </View>

            {/* Остальные кнопки медиа */}
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton} onPress={pickVideo}>
                <Ionicons name="film-outline" size={24} color="#4CAF50" />
                <Text style={styles.mediaButtonText}>Из галереи</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton} onPress={takeVideo}>
                <Ionicons name="videocam-outline" size={24} color="#4CAF50" />
                <Text style={styles.mediaButtonText}>Снять видео</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.mediaButton, isRecording && styles.recordingButton]}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Ionicons
                  name={isRecording ? 'stop-circle' : 'mic-outline'}
                  size={24}
                  color={isRecording ? '#f44336' : '#4CAF50'}
                />
                <Text
                  style={[
                    styles.mediaButtonText,
                    isRecording && styles.recordingButtonText,
                  ]}
                >
                  {isRecording ? 'Стоп' : 'Аудио'}
                </Text>
              </TouchableOpacity>
            </View>

            {photos.length > 0 && (
              <ScrollView horizontal style={styles.photosPreview} showsHorizontalScrollIndicator={false}>
                {photos.map((uri, index) => (
                  <View key={index} style={styles.photoItem}>
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentPhotoUri(uri);
                        setPhotoViewerVisible(true);
                      }}
                    >
                      <Image source={{ uri }} style={styles.photoThumbnail} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {videos.length > 0 && (
              <View style={styles.videosSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="videocam" size={20} color="#4CAF50" />
                  <Text style={styles.attachedLabel}>
                    Прикреплено видео: {videos.length}
                  </Text>
                </View>
                {videos.map((uri, index) => (
                  <View key={`video-${index}`} style={styles.videoItem}>
                    <TouchableOpacity
                      style={styles.attachedPreview}
                      onPress={() => {
                        console.log('🎬 Открытие видео:', uri);
                        setCurrentVideoUri(uri);
                        setVideoPlayerVisible(true);
                      }}
                    >
                      <Ionicons name="videocam" size={24} color="#4CAF50" />
                      <View style={styles.videoInfo}>
                        <Text style={styles.videoName}>Видео {index + 1}</Text>
                        <Text style={styles.videoSize}>Готово к отправке</Text>
                      </View>
                      <Ionicons
                        name="play-circle-outline"
                        size={20}
                        color="#666"
                        style={{ marginLeft: 'auto' }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => {
                        const newVideos = videos.filter((_, i) => i !== index);
                        setVideos(newVideos);
                        Toast.show({
                          type: 'info',
                          text1: 'Видео удалено',
                          position: 'bottom',
                        });
                      }}
                    >
                      <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {audioRecording && (
              <View style={styles.audioSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="musical-notes" size={20} color="#4CAF50" />
                  <Text style={styles.attachedLabel}>Аудиозапись добавлена</Text>
                </View>
                <View style={styles.audioItem}>
                  <TouchableOpacity
                    style={styles.attachedPreview}
                    onPress={() => {
                      console.log('🎵 Открытие аудио:', audioRecording);
                      console.log('🎵 Тип audioRecording:', typeof audioRecording);
                      if (!audioRecording) {
                        console.error('❌ audioRecording пустой!');
                        Toast.show({
                          type: 'error',
                          text1: 'Ошибка',
                          text2: 'Аудиозапись не найдена',
                          position: 'bottom',
                        });
                        return;
                      }
                      setCurrentAudioUri(audioRecording);
                      setAudioPlayerVisible(true);
                      console.log('✅ Модальное окно аудио открыто');
                    }}
                  >
                    <Ionicons name="musical-notes" size={24} color="#4CAF50" />
                    <View style={styles.audioInfo}>
                      <Text style={styles.audioName}>Голосовое сообщение</Text>
                      <Text style={styles.audioSize}>Готово к отправке</Text>
                    </View>
                    <Ionicons
                      name="play-circle-outline"
                      size={20}
                      color="#666"
                      style={{ marginLeft: 'auto' }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      setAudioRecording(undefined);
                      Toast.show({
                        type: 'info',
                        text1: 'Аудиозапись удалена',
                        position: 'bottom',
                      });
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Card>

        <Button title="Отправить заявку" onPress={handleSubmit} loading={loading} />
      </ScrollView>

      {/* Модальное окно видео плеера */}
      <Modal
        visible={videoPlayerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={async () => {
          if (videoRef.current) {
            try {
              await videoRef.current.stopAsync();
              await videoRef.current.unloadAsync();
            } catch (error) {
              console.error('Ошибка остановки видео:', error);
            }
          }
          setVideoPlayerVisible(false);
          setCurrentVideoUri(null);
        }}
      >
        <View style={styles.playerModalOverlay}>
          <View style={styles.playerModalContent}>
            <TouchableOpacity
              style={styles.playerCloseButton}
              onPress={async () => {
                if (videoRef.current) {
                  try {
                    await videoRef.current.stopAsync();
                    await videoRef.current.unloadAsync();
                  } catch (error) {
                    console.error('Ошибка остановки видео:', error);
                  }
                }
                setVideoPlayerVisible(false);
                setCurrentVideoUri(null);
              }}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {currentVideoUri && (
              <Video
                ref={videoRef}
                source={{ uri: currentVideoUri }}
                style={styles.videoPlayer}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                shouldPlay={true}
                isMuted={false}
                volume={1.0}
                onLoadStart={async () => {
                  console.log('🎬 Видео начинает загружаться');
                  // Убеждаемся что аудио режим настроен перед воспроизведением
                  try {
                    await Audio.setAudioModeAsync({
                      allowsRecordingIOS: false,
                      playsInSilentModeIOS: true,
                      staysActiveInBackground: false,
                      shouldDuckAndroid: true,
                    });
                    console.log('✅ Аудио режим настроен для видео');
                  } catch (error) {
                    console.error('Ошибка настройки аудио для видео:', error);
                  }
                }}
                onLoad={async () => {
                  console.log('✅ Видео загружено');
                  if (videoRef.current) {
                    try {
                      // Сначала останавливаем, чтобы сбросить состояние
                      await videoRef.current.pauseAsync();
                      // Устанавливаем правильные параметры звука
                      await videoRef.current.setStatusAsync({
                        shouldPlay: true,
                        isMuted: false,
                        volume: 1.0,
                        progressUpdateIntervalMillis: 1000,
                      });
                      // Принудительно запускаем воспроизведение
                      await videoRef.current.playAsync();
                      console.log('✅ Видео настроено на воспроизведение со звуком (volume=1.0, isMuted=false)');
                    } catch (error) {
                      console.error('Ошибка настройки видео:', error);
                    }
                  }
                }}
                onPlaybackStatusUpdate={async (status) => {
                  if (status.isLoaded && videoRef.current) {
                    // Постоянно проверяем и исправляем звук
                    if (status.isMuted) {
                      console.warn('⚠️ Видео воспроизводится БЕЗ ЗВУКА (isMuted=true) - исправляем...');
                      try {
                        await videoRef.current.setStatusAsync({
                          isMuted: false,
                          volume: 1.0,
                        });
                      } catch (error) {
                        console.error('Ошибка исправления звука:', error);
                      }
                    }
                    if (status.volume !== undefined && status.volume < 1.0) {
                      console.warn(`⚠️ Громкость видео: ${status.volume} (должна быть 1.0) - исправляем...`);
                      try {
                        await videoRef.current.setStatusAsync({
                          volume: 1.0,
                          isMuted: false,
                        });
                      } catch (error) {
                        console.error('Ошибка исправления громкости:', error);
                      }
                    }
                  }
                }}
                onError={(error) => {
                  console.error('❌ Ошибка видео:', error);
                  Toast.show({
                    type: 'error',
                    text1: 'Ошибка воспроизведения видео',
                    position: 'bottom',
                  });
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Модальное окно просмотра фото */}
      <Modal
        visible={photoViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setPhotoViewerVisible(false);
          setCurrentPhotoUri(null);
        }}
      >
        <View style={styles.playerModalOverlay}>
          <View style={styles.photoViewerContent}>
            {currentPhotoUri && (
              <Image
                source={{ uri: currentPhotoUri }}
                style={styles.photoViewerImage}
                resizeMode="contain"
              />
            )}
            
            <TouchableOpacity
              style={styles.playerCloseButton}
              onPress={() => {
                setPhotoViewerVisible(false);
                setCurrentPhotoUri(null);
              }}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            <View style={styles.photoViewerActions}>
              <TouchableOpacity
                style={styles.photoViewerButton}
                onPress={() => {
                  setPhotoViewerVisible(false);
                  setCurrentPhotoUri(null);
                }}
              >
                <Ionicons name="close-circle" size={24} color="#fff" />
                <Text style={styles.photoViewerButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoViewerButton, styles.photoViewerButtonPrimary]}
                onPress={() => {
                  if (currentPhotoUri && !photos.includes(currentPhotoUri)) {
                    if (photos.length >= 3) {
                      Toast.show({
                        type: 'error',
                        text1: 'Максимум 3 фото',
                        text2: 'Удалите одно из существующих фото',
                        position: 'bottom',
                      });
                      return;
                    }
                    setPhotos([...photos, currentPhotoUri]);
                    Toast.show({
                      type: 'success',
                      text1: 'Фото добавлено',
                      position: 'bottom',
                      visibilityTime: 2000,
                    });
                  }
                  setPhotoViewerVisible(false);
                  setCurrentPhotoUri(null);
                }}
              >
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.photoViewerButtonText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно аудио плеера */}
      <Modal
        visible={audioPlayerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={async () => {
          if (audioSoundRef.current) {
            try {
              await audioSoundRef.current.stopAsync();
              await audioSoundRef.current.unloadAsync();
            } catch (error) {
              console.error('Ошибка остановки аудио:', error);
            }
          }
          setAudioPlayerVisible(false);
          setCurrentAudioUri(null);
        }}
      >
        <View style={styles.playerModalOverlay}>
          <View style={styles.audioPlayerContent}>
            <View style={styles.audioPlayerHeader}>
              <Ionicons name="musical-notes" size={40} color="#4CAF50" />
              <Text style={styles.audioPlayerTitle}>Голосовое сообщение</Text>
            </View>

            {currentAudioUri && (
              <AudioPlayer
                uri={currentAudioUri}
                onSoundRef={(ref) => {
                  audioSoundRef.current = ref;
                }}
                onError={(error) => {
                  console.error('❌ Ошибка аудио:', error);
                  Toast.show({
                    type: 'error',
                    text1: 'Ошибка воспроизведения аудио',
                    position: 'bottom',
                  });
                }}
              />
            )}

            <TouchableOpacity
              style={styles.audioCloseButton}
              onPress={async () => {
                if (audioSoundRef.current) {
                  try {
                    await audioSoundRef.current.stopAsync();
                    await audioSoundRef.current.unloadAsync();
                  } catch (error) {
                    console.error('Ошибка остановки аудио:', error);
                  }
                }
                setAudioPlayerVisible(false);
                setCurrentAudioUri(null);
              }}
            >
              <Text style={styles.audioCloseButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#4CAF50',
  },
  mediaSection: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  mediaButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  photosPreview: {
    marginTop: 12,
  },
  photoItem: {
    marginRight: 12,
    position: 'relative',
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  videosSection: {
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  attachedLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  attachedPreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 8,
  },
  videoName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 2,
  },
  videoSize: {
    fontSize: 12,
    color: '#666',
  },
  audioInfo: {
    flex: 1,
    marginLeft: 8,
  },
  audioSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  recordingButton: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  recordingButtonText: {
    color: '#f44336',
  },
  audioSection: {
    marginTop: 12,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  audioName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  playerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerModalContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  playerCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  audioPlayerContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  audioPlayerHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  audioPlayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  audioPlayer: {
    width: '100%',
    height: 100,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  audioPlayerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  audioProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  audioTime: {
    fontSize: 12,
    color: '#666',
    width: 45,
    textAlign: 'center',
  },
  audioSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  audioControlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlayButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  audioProgressIndicator: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
    marginLeft: -8, // Центрируем относительно позиции
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  audioTimeText: {
    fontSize: 12,
    color: '#666',
    minWidth: 40,
    textAlign: 'center',
  },
  audioCloseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  audioCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  photoViewerContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  photoViewerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  photoViewerActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  photoViewerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  photoViewerButtonPrimary: {
    backgroundColor: '#4CAF50',
  },
  photoViewerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

