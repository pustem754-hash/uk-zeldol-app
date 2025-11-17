import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface CameraScreenProps {
  navigation: any;
  route: {
    params?: {
      mode?: 'photo' | 'video';
      onMediaCaptured?: (media: { uri: string; type: 'photo' | 'video' }) => void;
    };
  };
}

export default function CameraScreen({ navigation, route }: CameraScreenProps) {
  const { mode = 'photo', onMediaCaptured } = route.params || {};

  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedMedia, setCapturedMedia] = useState<{ uri: string; type: 'photo' | 'video' } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Проверка разрешений
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={80} color="#999" />
        <Text style={styles.permissionText}>Необходим доступ к камере</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Разрешить доступ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Съёмка фото
  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      setCapturedMedia({ uri: photo.uri, type: 'photo' });
    } catch (error) {
      console.error('Ошибка съёмки фото:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  // Запись видео
  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60, // Максимум 60 секунд
      });

      if (video && video.uri) {
        setCapturedMedia({ uri: video.uri, type: 'video' });
      }
      setIsRecording(false);
    } catch (error) {
      console.error('Ошибка записи видео:', error);
      setIsRecording(false);
      Alert.alert('Ошибка', 'Не удалось записать видео');
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  // Переключение камеры
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Переключение вспышки
  const toggleFlash = () => {
    setFlash((current) => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  // Получить иконку вспышки
  const getFlashIcon = () => {
    if (flash === 'on') return 'flash';
    if (flash === 'auto') return 'flash-outline';
    return 'flash-off';
  };

  // Переснять
  const retake = () => {
    setCapturedMedia(null);
    setIsRecording(false);
  };

  // Использовать медиа
  const useMedia = () => {
    if (capturedMedia && onMediaCaptured) {
      onMediaCaptured(capturedMedia);
      navigation.goBack();
    }
  };

  // Отмена
  const cancel = () => {
    navigation.goBack();
  };

  // Если медиа захвачено - показываем превью
  if (capturedMedia) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          {capturedMedia.type === 'photo' ? (
            <Image source={{ uri: capturedMedia.uri }} style={styles.preview} resizeMode="contain" />
          ) : (
            <View style={styles.videoPreview}>
              <Ionicons name="videocam" size={80} color="#fff" />
              <Text style={styles.videoPreviewText}>Видео записано</Text>
            </View>
          )}

          {/* Кнопки управления превью */}
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.previewButton} onPress={retake}>
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.previewButtonText}>Переснять</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.previewButton, styles.useButton]} onPress={useMedia}>
              <Ionicons name="checkmark" size={24} color="#fff" />
              <Text style={styles.previewButtonText}>Готово</Text>
            </TouchableOpacity>
          </View>

          {/* Кнопка отмены */}
          <TouchableOpacity style={styles.cancelButton} onPress={cancel}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Камера
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        mode={mode === 'video' ? 'video' : 'picture'}
      >
        <SafeAreaView style={styles.cameraContent}>
          {/* Верхняя панель */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topButton} onPress={cancel}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
              <Ionicons name={getFlashIcon()} size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Нижняя панель */}
          <View style={styles.bottomBar}>
            {/* Переключение камеры */}
            <TouchableOpacity style={styles.sideButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={32} color="#fff" />
            </TouchableOpacity>

            {/* Кнопка съёмки */}
            <TouchableOpacity
              style={[
                styles.captureButton,
                mode === 'video' && styles.captureButtonVideo,
                isRecording && styles.captureButtonRecording,
              ]}
              onPress={mode === 'video' ? (isRecording ? stopRecording : startRecording) : takePhoto}
              disabled={isRecording && mode === 'photo'}
            >
              {isRecording && <View style={styles.recordingIndicator} />}
            </TouchableOpacity>

            {/* Пустой блок для баланса */}
            <View style={styles.sideButton} />
          </View>

          {/* Индикатор записи */}
          {isRecording && (
            <View style={styles.recordingBadge}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Запись...</Text>
            </View>
          )}
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  camera: {
    flex: 1,
  },
  cameraContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Верхняя панель
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Нижняя панель
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  sideButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Кнопка съёмки
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonVideo: {
    borderColor: '#FF3B30',
  },
  captureButtonRecording: {
    backgroundColor: '#FF3B30',
  },
  recordingIndicator: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  // Индикатор записи
  recordingBadge: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  recordingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Превью
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
  },
  videoPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  videoPreviewText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },

  // Кнопки превью
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  previewButton: {
    alignItems: 'center',
    padding: 16,
  },
  useButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 32,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
    fontWeight: '600',
  },
  cancelButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Разрешения
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

