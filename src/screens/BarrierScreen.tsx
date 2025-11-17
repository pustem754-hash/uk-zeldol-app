import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Animated,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components/Header';

interface BarrierLog {
  id: string;
  timestamp: string;
  action: 'opened' | 'closed';
  user: string;
}

export const BarrierScreen = ({ navigation }: any) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastOpened, setLastOpened] = useState<Date | null>(null);
  const [history, setHistory] = useState<BarrierLog[]>([]);
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadHistory();
  }, []);

  // Загрузка истории открытий
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('barrierHistory');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
  };

  // Сохранение в историю
  const saveToHistory = async (action: 'opened' | 'closed') => {
    const newLog: BarrierLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('ru-RU'),
      action,
      user: 'Иванов И.И.',
    };

    const newHistory = [newLog, ...history].slice(0, 10); // последние 10 записей
    setHistory(newHistory);

    try {
      await AsyncStorage.setItem('barrierHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Ошибка сохранения истории:', error);
    }
  };

  // Анимация открытия шлагбаума
  const animateBarrier = (open: boolean) => {
    Animated.timing(rotateAnim, {
      toValue: open ? 1 : 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Открытие шлагбаума
  const openBarrier = () => {
    Alert.alert(
      '🚗 Открыть шлагбаум?',
      'Шлагбаум откроется на 30 секунд.\n\nУбедитесь, что вы находитесь рядом с въездом.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Открыть',
          onPress: async () => {
            setIsOpening(true);
            animateBarrier(true);

            try {
              // TODO: Заменить на реальный API вызов к шлагбауму
              // const response = await fetch('https://your-api.com/api/barrier/open', {
              //   method: 'POST',
              //   headers: { 'Authorization': `Bearer ${token}` },
              // });

              // Симуляция API вызова
              await new Promise((resolve) => setTimeout(resolve, 2000));

              setIsOpen(true);
              setLastOpened(new Date());
              await saveToHistory('opened');

              Alert.alert(
                '✅ Успешно',
                'Шлагбаум открыт.\n\nОн закроется автоматически через 30 секунд.'
              );

              // Автозакрытие через 30 секунд
              setTimeout(() => {
                setIsOpen(false);
                animateBarrier(false);
                saveToHistory('closed');
              }, 30000);
            } catch (error) {
              Alert.alert(
                '❌ Ошибка',
                'Не удалось открыть шлагбаум.\n\nПопробуйте ещё раз или позвоните диспетчеру.'
              );
            } finally {
              setIsOpening(false);
            }
          },
        },
      ]
    );
  };

  // Анимация вращения шлагбаума
  const barricadeRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-85deg'],
  });

  // Звонок диспетчеру
  const callDispatcher = () => {
    Linking.openURL('tel:+79600720321');
  };

  return (
    <View style={styles.container}>
      <Header title="Шлагбаум" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        {/* HEADER INFO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Въезд на территорию ЖК</Text>
            <Text style={styles.subtitle}>Система управления шлагбаумом</Text>
          </View>
          <View style={[styles.statusBadge, isOpen && styles.statusBadgeOpen]}>
            <Text style={styles.statusBadgeText}>{isOpen ? 'Открыт' : 'Закрыт'}</Text>
          </View>
        </View>

        {/* ВИЗУАЛИЗАЦИЯ ШЛАГБАУМА */}
        <View style={styles.visualContainer}>
          <View style={styles.barrierBox}>
            {/* Столб */}
            <View style={styles.barrierPole} />

            {/* Шлагбаум (анимированный) */}
            <Animated.View
              style={[styles.barrierBar, { transform: [{ rotate: barricadeRotate }] }]}
            />

            {/* Машина */}
            <View style={styles.carContainer}>
              <Text style={styles.carEmoji}>🚗</Text>
            </View>
          </View>

          <Text style={styles.statusText}>
            {isOpen ? '✅ Шлагбаум поднят' : '❌ Шлагбаум опущен'}
          </Text>
        </View>

        {/* КНОПКА ОТКРЫТИЯ */}
        <TouchableOpacity
          style={[styles.openButton, (isOpening || isOpen) && styles.openButtonDisabled]}
          onPress={openBarrier}
          disabled={isOpening || isOpen}
          activeOpacity={0.8}
        >
          {isOpening ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : isOpen ? (
            <>
              <Ionicons name="checkmark-circle" size={32} color="#fff" />
              <Text style={styles.openButtonText}>Шлагбаум открыт</Text>
              <Text style={styles.openButtonSubtext}>Закроется автоматически</Text>
            </>
          ) : (
            <>
              <Ionicons name="key" size={32} color="#fff" />
              <Text style={styles.openButtonText}>Открыть шлагбаум</Text>
              <Text style={styles.openButtonSubtext}>Нажмите для въезда</Text>
            </>
          )}
        </TouchableOpacity>

        {lastOpened && (
          <Text style={styles.lastOpenedText}>
            Последнее открытие: {lastOpened.toLocaleString('ru-RU')}
          </Text>
        )}

        {/* ИНСТРУКЦИЯ */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#4CAF50" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>💡 Как это работает?</Text>
            <Text style={styles.infoText}>
              • Шлагбаум откроется на 30 секунд{'\n'}
              • Проезжайте сразу после открытия{'\n'}
              • Закроется автоматически{'\n'}
              • В случае проблем звоните:{'\n'}
              <Text style={styles.phoneLink}>📞 8 960 072 03 21</Text>
            </Text>
          </View>
        </View>

        {/* ИСТОРИЯ ОТКРЫТИЙ */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>📋 История открытий</Text>
          {history.length === 0 ? (
            <Text style={styles.emptyHistory}>История пуста</Text>
          ) : (
            history.map((log) => (
              <View key={log.id} style={styles.historyItem}>
                <Ionicons
                  name={log.action === 'opened' ? 'arrow-up-circle' : 'arrow-down-circle'}
                  size={24}
                  color={log.action === 'opened' ? '#4CAF50' : '#999'}
                />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyText}>
                    {log.action === 'opened' ? 'Открыт' : 'Закрыт'}
                  </Text>
                  <Text style={styles.historyTime}>{log.timestamp}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ */}
        <View style={styles.additionalSection}>
          <TouchableOpacity style={styles.additionalButton} onPress={callDispatcher}>
            <Ionicons name="call-outline" size={24} color="#4CAF50" />
            <Text style={styles.additionalButtonText}>Позвонить диспетчеру</Text>
          </TouchableOpacity>
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
  statusBadge: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusBadgeOpen: {
    backgroundColor: '#4CAF50',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // ВИЗУАЛИЗАЦИЯ
  visualContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  barrierBox: {
    width: 200,
    height: 150,
    position: 'relative',
  },
  barrierPole: {
    position: 'absolute',
    left: 20,
    bottom: 0,
    width: 12,
    height: 100,
    backgroundColor: '#666',
    borderRadius: 6,
  },
  barrierBar: {
    position: 'absolute',
    left: 26,
    bottom: 90,
    width: 150,
    height: 8,
    backgroundColor: '#f44336',
    borderRadius: 4,
    transformOrigin: 'left center',
  },
  carContainer: {
    position: 'absolute',
    right: 20,
    bottom: 0,
  },
  carEmoji: {
    fontSize: 48,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
  },

  // КНОПКА
  openButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  openButtonDisabled: {
    backgroundColor: '#999',
  },
  openButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  openButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  lastOpenedText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginTop: 12,
  },

  // ИНФО-БЛОК
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  phoneLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },

  // ИСТОРИЯ
  historySection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyHistory: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  // ДОПОЛНИТЕЛЬНО
  additionalSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  additionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  additionalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
