import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { Storage } from '../utils/storage';
import { User } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_NEWS } from '../constants/news';
import { MOCK_REQUESTS } from '../constants/mockData';

interface DebtStatus {
  hasDebt: boolean;
  debtAmount: number;
  debtMonths: number;
}

export const HomeScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [debtStatus, setDebtStatus] = useState<DebtStatus>({
    hasDebt: false,
    debtAmount: 0,
    debtMonths: 0,
  });

  useEffect(() => {
    loadUser();
    loadDebtStatus();
  }, []);

  const loadUser = async () => {
    const userData = await Storage.getUser();
    setUser(userData);
  };

  const loadDebtStatus = async () => {
    try {
      const debtData = await AsyncStorage.getItem('debtStatus');
      if (debtData) {
        setDebtStatus(JSON.parse(debtData));
      }
    } catch (error) {
      console.error('Ошибка загрузки статуса долга:', error);
    }
  };

  const activeRequests = MOCK_REQUESTS.filter((r) => r.status !== 'выполнена').length;
  const importantNews = MOCK_NEWS.filter((n) => n.isImportant).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>🏘️</Text>
          <Text style={styles.headerTitle}>УК Зелёная Долина</Text>
        </View>
        <TouchableOpacity style={styles.notificationBadge}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          {importantNews > 0 && (
            <View style={styles.badgeDot}>
              <Text style={styles.badgeDotText}>{importantNews}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Баннер задолженности */}
      {debtStatus.hasDebt && (
        <View style={styles.debtBanner}>
          <Ionicons name="warning" size={32} color="#f44336" />
          <View style={styles.debtContent}>
            <Text style={styles.debtTitle}>Задолженность</Text>
            <Text style={styles.debtAmount}>{debtStatus.debtAmount.toFixed(2)} ₽</Text>
            <Text style={styles.debtMonths}>Просрочка: {debtStatus.debtMonths} мес.</Text>
          </View>
          <TouchableOpacity
            style={styles.debtButton}
            onPress={() => navigation.navigate('Payments')}
          >
            <Text style={styles.debtButtonText}>Оплатить</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Карточка баланса */}
      {!debtStatus.hasDebt && (
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Баланс лицевого счета</Text>
          <Text style={styles.balanceAmount}>
            {(user?.balance || 0).toLocaleString('ru-RU')} ₽
          </Text>
        </View>
      )}

      {/* Карточка пользователя */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0).toUpperCase() || '👤'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userAddress}>{user?.address}</Text>
          {user?.storages && user.storages.length > 0 && (
            <Text style={styles.userStorage}>
              Кладовые: {user.storages.join(', ')}
            </Text>
          )}
        </View>
      </View>

      {/* ВСЕ РАЗДЕЛЫ */}
      <View style={styles.sectionsContainer}>
        <Text style={styles.sectionTitle}>Все разделы</Text>

        <View style={styles.grid}>
          {/* ПЕРВЫЙ РЯД */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Meters')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="speedometer-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Показания счётчиков</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Payments')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="card-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Платежи</Text>
          </TouchableOpacity>

          {/* ВТОРОЙ РЯД */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Requests')}
          >
            <View style={[styles.iconContainer, activeRequests > 0 && styles.iconContainerWithBadge]}>
              <Ionicons name="construct-outline" size={32} color="#4CAF50" />
              {activeRequests > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeRequests}</Text>
                </View>
              )}
            </View>
            <Text style={styles.menuTitle}>Заявки</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Storage')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="cube-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Кладовые</Text>
          </TouchableOpacity>

          {/* ТРЕТИЙ РЯД */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Cameras')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="videocam-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Видеонаблюдение</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Barrier')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="remove-circle-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Шлагбаум</Text>
          </TouchableOpacity>

          {/* ЧЕТВЁРТЫЙ РЯД */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('News')}
          >
            <View style={[styles.iconContainer, importantNews > 0 && styles.iconContainerWithBadge]}>
              <Ionicons name="newspaper-outline" size={32} color="#4CAF50" />
              {importantNews > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{importantNews}</Text>
                </View>
              )}
            </View>
            <Text style={styles.menuTitle}>Новости</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Documents')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="document-text-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Документы</Text>
          </TouchableOpacity>

          {/* ПЯТЫЙ РЯД */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Contacts')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Контакты</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Services')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="hammer-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Услуги</Text>
          </TouchableOpacity>

          {/* ШЕСТОЙ РЯД */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Receipt')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="receipt-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Моя квитанция</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.menuTitle}>Профиль</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationBadge: {
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDotText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // БАННЕР ЗАДОЛЖЕННОСТИ
  debtBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#f44336',
    elevation: 3,
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  debtContent: {
    flex: 1,
    marginLeft: 16,
  },
  debtTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  debtAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 4,
  },
  debtMonths: {
    fontSize: 13,
    color: '#666',
  },
  debtButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  debtButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // КАРТОЧКА БАЛАНСА
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },

  // КАРТОЧКА ПОЛЬЗОВАТЕЛЯ
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  userStorage: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },

  // СЕКЦИЯ РАЗДЕЛОВ
  sectionsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    paddingLeft: 4,
  },

  // СЕТКА КНОПОК
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // КАРТОЧКА МЕНЮ (ЕДИНООБРАЗНАЯ)
  menuCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  iconContainerWithBadge: {
    // базовый стиль уже в iconContainer
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
  },
});
