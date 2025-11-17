import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';

interface Camera {
  id: string;
  name: string;
  location: string;
  streamUrl?: string;
  snapshotUrl: string;
  isOnline: boolean;
}

// ==========================================
// СПИСОК КАМЕР (36 камер: по 6 на каждый из 6 домов)
// ==========================================
const CAMERAS: Camera[] = [
  // ==========================================
  // ЖК МАЯК - ДОМ 1 (ул. Рогачёва, 25, корп. 1)
  // ==========================================
  {
    id: 'm1-1',
    name: 'Парадный вход',
    location: 'ЖК Маяк, корп. 1 - вход',
    streamUrl: 'https://example.com/camera-m1-1.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+1-1',
    isOnline: true,
  },
  {
    id: 'm1-2',
    name: 'Детская площадка',
    location: 'ЖК Маяк, корп. 1 - двор',
    streamUrl: 'https://example.com/camera-m1-2.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+1-2',
    isOnline: true,
  },
  {
    id: 'm1-3',
    name: 'Парковка',
    location: 'ЖК Маяк, корп. 1 - парковка',
    streamUrl: 'https://example.com/camera-m1-3.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+1-3',
    isOnline: true,
  },
  {
    id: 'm1-4',
    name: 'Задний двор',
    location: 'ЖК Маяк, корп. 1 - задний двор',
    streamUrl: 'https://example.com/camera-m1-4.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+1-4',
    isOnline: true,
  },
  {
    id: 'm1-5',
    name: 'Подъезд 1',
    location: 'ЖК Маяк, корп. 1 - подъезд 1',
    streamUrl: 'https://example.com/camera-m1-5.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+1-5',
    isOnline: true,
  },
  {
    id: 'm1-6',
    name: 'Периметр',
    location: 'ЖК Маяк, корп. 1 - периметр',
    streamUrl: 'https://example.com/camera-m1-6.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+1-6',
    isOnline: true,
  },

  // ==========================================
  // ЖК МАЯК - ДОМ 2 (ул. Рогачёва, 25, корп. 2)
  // ==========================================
  {
    id: 'm2-1',
    name: 'Парадный вход',
    location: 'ЖК Маяк, корп. 2 - вход',
    streamUrl: 'https://example.com/camera-m2-1.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+2-1',
    isOnline: true,
  },
  {
    id: 'm2-2',
    name: 'Детская площадка',
    location: 'ЖК Маяк, корп. 2 - двор',
    streamUrl: 'https://example.com/camera-m2-2.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+2-2',
    isOnline: true,
  },
  {
    id: 'm2-3',
    name: 'Парковка',
    location: 'ЖК Маяк, корп. 2 - парковка',
    streamUrl: 'https://example.com/camera-m2-3.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/999999/ffffff?text=Offline',
    isOnline: false,
  },
  {
    id: 'm2-4',
    name: 'Задний двор',
    location: 'ЖК Маяк, корп. 2 - задний двор',
    streamUrl: 'https://example.com/camera-m2-4.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+2-4',
    isOnline: true,
  },
  {
    id: 'm2-5',
    name: 'Подъезд 1',
    location: 'ЖК Маяк, корп. 2 - подъезд 1',
    streamUrl: 'https://example.com/camera-m2-5.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+2-5',
    isOnline: true,
  },
  {
    id: 'm2-6',
    name: 'Периметр',
    location: 'ЖК Маяк, корп. 2 - периметр',
    streamUrl: 'https://example.com/camera-m2-6.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Maiak+2-6',
    isOnline: true,
  },

  // ========================================================
  // ЖК ЗЕЛЁНАЯ ДОЛИНА - ДОМ 1 (ул. Шустова, 4А, корп. 1)
  // ========================================================
  {
    id: 'zd1-1',
    name: 'Парадный вход',
    location: 'ЖК Зелёная Долина, корп. 1 - вход',
    streamUrl: 'https://example.com/camera-zd1-1.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+1-1',
    isOnline: true,
  },
  {
    id: 'zd1-2',
    name: 'Детская площадка',
    location: 'ЖК Зелёная Долина, корп. 1 - двор',
    streamUrl: 'https://example.com/camera-zd1-2.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+1-2',
    isOnline: true,
  },
  {
    id: 'zd1-3',
    name: 'Парковка',
    location: 'ЖК Зелёная Долина, корп. 1 - парковка',
    streamUrl: 'https://example.com/camera-zd1-3.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+1-3',
    isOnline: true,
  },
  {
    id: 'zd1-4',
    name: 'Задний двор',
    location: 'ЖК Зелёная Долина, корп. 1 - задний двор',
    streamUrl: 'https://example.com/camera-zd1-4.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+1-4',
    isOnline: true,
  },
  {
    id: 'zd1-5',
    name: 'Подъезд 1',
    location: 'ЖК Зелёная Долина, корп. 1 - подъезд 1',
    streamUrl: 'https://example.com/camera-zd1-5.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+1-5',
    isOnline: true,
  },
  {
    id: 'zd1-6',
    name: 'Периметр',
    location: 'ЖК Зелёная Долина, корп. 1 - периметр',
    streamUrl: 'https://example.com/camera-zd1-6.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/999999/ffffff?text=Offline',
    isOnline: false,
  },

  // ========================================================
  // ЖК ЗЕЛЁНАЯ ДОЛИНА - ДОМ 2 (ул. Шустова, 4А, корп. 2)
  // ========================================================
  {
    id: 'zd2-1',
    name: 'Парадный вход',
    location: 'ЖК Зелёная Долина, корп. 2 - вход',
    streamUrl: 'https://example.com/camera-zd2-1.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+2-1',
    isOnline: true,
  },
  {
    id: 'zd2-2',
    name: 'Детская площадка',
    location: 'ЖК Зелёная Долина, корп. 2 - двор',
    streamUrl: 'https://example.com/camera-zd2-2.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+2-2',
    isOnline: true,
  },
  {
    id: 'zd2-3',
    name: 'Парковка',
    location: 'ЖК Зелёная Долина, корп. 2 - парковка',
    streamUrl: 'https://example.com/camera-zd2-3.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+2-3',
    isOnline: true,
  },
  {
    id: 'zd2-4',
    name: 'Задний двор',
    location: 'ЖК Зелёная Долина, корп. 2 - задний двор',
    streamUrl: 'https://example.com/camera-zd2-4.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+2-4',
    isOnline: true,
  },
  {
    id: 'zd2-5',
    name: 'Подъезд 1',
    location: 'ЖК Зелёная Долина, корп. 2 - подъезд 1',
    streamUrl: 'https://example.com/camera-zd2-5.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+2-5',
    isOnline: true,
  },
  {
    id: 'zd2-6',
    name: 'Периметр',
    location: 'ЖК Зелёная Долина, корп. 2 - периметр',
    streamUrl: 'https://example.com/camera-zd2-6.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+2-6',
    isOnline: true,
  },

  // ========================================================
  // ЖК ЗЕЛЁНАЯ ДОЛИНА - ДОМ 3 (ул. Шустова, 4А, корп. 3)
  // ========================================================
  {
    id: 'zd3-1',
    name: 'Парадный вход',
    location: 'ЖК Зелёная Долина, корп. 3 - вход',
    streamUrl: 'https://example.com/camera-zd3-1.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+3-1',
    isOnline: true,
  },
  {
    id: 'zd3-2',
    name: 'Детская площадка',
    location: 'ЖК Зелёная Долина, корп. 3 - двор',
    streamUrl: 'https://example.com/camera-zd3-2.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+3-2',
    isOnline: true,
  },
  {
    id: 'zd3-3',
    name: 'Парковка',
    location: 'ЖК Зелёная Долина, корп. 3 - парковка',
    streamUrl: 'https://example.com/camera-zd3-3.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+3-3',
    isOnline: true,
  },
  {
    id: 'zd3-4',
    name: 'Задний двор',
    location: 'ЖК Зелёная Долина, корп. 3 - задний двор',
    streamUrl: 'https://example.com/camera-zd3-4.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+3-4',
    isOnline: true,
  },
  {
    id: 'zd3-5',
    name: 'Подъезд 1',
    location: 'ЖК Зелёная Долина, корп. 3 - подъезд 1',
    streamUrl: 'https://example.com/camera-zd3-5.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/999999/ffffff?text=Offline',
    isOnline: false,
  },
  {
    id: 'zd3-6',
    name: 'Периметр',
    location: 'ЖК Зелёная Долина, корп. 3 - периметр',
    streamUrl: 'https://example.com/camera-zd3-6.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+3-6',
    isOnline: true,
  },

  // ========================================================
  // ЖК ЗЕЛЁНАЯ ДОЛИНА - ДОМ 4 (ул. Шустова, 4А, корп. 4)
  // ========================================================
  {
    id: 'zd4-1',
    name: 'Парадный вход',
    location: 'ЖК Зелёная Долина, корп. 4 - вход',
    streamUrl: 'https://example.com/camera-zd4-1.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+4-1',
    isOnline: true,
  },
  {
    id: 'zd4-2',
    name: 'Детская площадка',
    location: 'ЖК Зелёная Долина, корп. 4 - двор',
    streamUrl: 'https://example.com/camera-zd4-2.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+4-2',
    isOnline: true,
  },
  {
    id: 'zd4-3',
    name: 'Парковка',
    location: 'ЖК Зелёная Долина, корп. 4 - парковка',
    streamUrl: 'https://example.com/camera-zd4-3.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+4-3',
    isOnline: true,
  },
  {
    id: 'zd4-4',
    name: 'Задний двор',
    location: 'ЖК Зелёная Долина, корп. 4 - задний двор',
    streamUrl: 'https://example.com/camera-zd4-4.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+4-4',
    isOnline: true,
  },
  {
    id: 'zd4-5',
    name: 'Подъезд 1',
    location: 'ЖК Зелёная Долина, корп. 4 - подъезд 1',
    streamUrl: 'https://example.com/camera-zd4-5.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+4-5',
    isOnline: true,
  },
  {
    id: 'zd4-6',
    name: 'Периметр',
    location: 'ЖК Зелёная Долина, корп. 4 - периметр',
    streamUrl: 'https://example.com/camera-zd4-6.m3u8',
    snapshotUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=ZD+4-6',
    isOnline: true,
  },
];

export const CamerasScreen = ({ navigation }: any) => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const cameras = CAMERAS;

  // ПОЛНОЭКРАННЫЙ ПРОСМОТР
  if (selectedCamera) {
    return (
      <View style={styles.fullscreenContainer}>
        {/* HEADER */}
        <View style={styles.fullscreenHeader}>
          <TouchableOpacity onPress={() => setSelectedCamera(null)}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.fullscreenHeaderInfo}>
            <Text style={styles.fullscreenTitle}>{selectedCamera.name}</Text>
            <Text style={styles.fullscreenSubtitle}>{selectedCamera.location}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: selectedCamera.isOnline ? '#4CAF50' : '#f44336' },
            ]}
          >
            <Text style={styles.statusText}>
              {selectedCamera.isOnline ? 'В сети' : 'Офлайн'}
            </Text>
          </View>
        </View>

        {/* ВИДЕО */}
        {selectedCamera.isOnline ? (
          <View style={styles.videoContainer}>
            <Image source={{ uri: selectedCamera.snapshotUrl }} style={styles.videoPlaceholder} />
            <Text style={styles.streamInfo}>🎥 Прямой эфир • Телеком Летай</Text>
          </View>
        ) : (
          <View style={styles.offlineContainer}>
            <Ionicons name="videocam-off" size={64} color="#666" />
            <Text style={styles.offlineText}>Камера недоступна</Text>
          </View>
        )}

        {/* УПРАВЛЕНИЕ */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => Alert.alert('Обновление', 'Изображение обновлено')}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.controlText}>Обновить</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => Alert.alert('Снимок', 'Скриншот сохранён')}
          >
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.controlText}>Снимок</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // СПИСОК КАМЕР
  return (
    <View style={styles.container}>
      <Header title="Видеонаблюдение" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        {/* HEADER INFO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Камеры Телеком Летай</Text>
            <Text style={styles.subtitle}>Система видеонаблюдения</Text>
          </View>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>
              {cameras.filter((c) => c.isOnline).length}/{cameras.length}
            </Text>
          </View>
        </View>

        {/* КАМЕРЫ */}
        {cameras.map((camera) => (
          <TouchableOpacity
            key={camera.id}
            style={styles.cameraCard}
            onPress={() => setSelectedCamera(camera)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: camera.snapshotUrl }} style={styles.snapshot} />

            {/* OVERLAY С КНОПКОЙ */}
            <View style={styles.overlay}>
              <View style={styles.playButton}>
                <Ionicons
                  name={camera.isOnline ? 'play-circle' : 'alert-circle'}
                  size={48}
                  color="#fff"
                />
              </View>
            </View>

            <View style={styles.cameraInfo}>
              <View style={styles.cameraHeader}>
                <Text style={styles.cameraName}>{camera.name}</Text>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: camera.isOnline ? '#4CAF50' : '#f44336' },
                  ]}
                />
              </View>

              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.locationText}>{camera.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* ИНФОРМАЦИЯ */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#4CAF50" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.infoTitle}>Архив записей</Text>
            <Text style={styles.infoText}>
              Записи за последние 30 дней доступны по запросу в офисе УК.
              {'\n'}Телефон: 8 960 072 03 21
            </Text>
          </View>
        </View>
      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  onlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  cameraCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  snapshot: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76,175,80,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraInfo: {
    padding: 16,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },

  // ПОЛНОЭКРАННЫЙ ПРОСМОТР
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
    gap: 16,
  },
  fullscreenHeaderInfo: {
    flex: 1,
  },
  fullscreenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullscreenSubtitle: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  streamInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  controlButton: {
    alignItems: 'center',
    gap: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 12,
  },
});
