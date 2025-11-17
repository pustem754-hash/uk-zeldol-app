import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Storage } from '../utils/storage';
import { User } from '../types';
import { getUserProperties } from '../data/userBindings';

export const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPhone, setUserPhone] = useState<string>('');
  const [userProperties, setUserProperties] = useState<any>(null);

  useEffect(() => {
    loadUser();
    loadUserData();
  }, []);

  const loadUser = async () => {
    const userData = await Storage.getUser();
    setUser(userData);
  };

  const loadUserData = async () => {
    try {
      const phone = await AsyncStorage.getItem('userPhone');
      if (phone) {
        setUserPhone(phone);
        const properties = getUserProperties(phone);
        setUserProperties(properties);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await Storage.removeUser();
          navigation.replace('Auth');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Информация о квартире</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Квартира:</Text>
          <Text style={styles.value}>№ {user?.apartment}</Text>
        </View>
        {user?.storage && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Кладовая:</Text>
            <Text style={styles.value}>{user.storage}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Адрес:</Text>
          <Text style={styles.value}>{user?.address}</Text>
        </View>
      </Card>

      {/* МОИ ПОМЕЩЕНИЯ */}
      {userProperties && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Мои помещения</Text>

          {/* КВАРТИРЫ */}
          <View style={styles.propertyGroup}>
            <View style={styles.propertyHeader}>
              <Ionicons name="home" size={24} color="#4CAF50" />
              <Text style={styles.propertyType}>Квартиры</Text>
            </View>
            {userProperties.apartments.map((apt: any, index: number) => (
              <View key={index} style={styles.propertyItem}>
                <View style={styles.propertyLeft}>
                  <Text style={styles.propertyNumber}>Квартира № {apt.number}</Text>
                  <Text style={styles.accountNumber}>Л/с: {apt.accountNumber}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            ))}
          </View>

          {/* КЛАДОВЫЕ */}
          {userProperties.storages.length > 0 && (
            <View style={styles.propertyGroup}>
              <View style={styles.propertyHeader}>
                <Ionicons name="cube" size={24} color="#4CAF50" />
                <Text style={styles.propertyType}>Кладовые</Text>
              </View>
              {userProperties.storages.map((storage: string, index: number) => (
                <View key={index} style={styles.propertyItem}>
                  <View style={styles.propertyLeft}>
                    <Text style={styles.propertyNumber}>{storage}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              ))}
            </View>
          )}

          {/* СТАТИСТИКА */}
          <View style={styles.summaryBox}>
            <Ionicons name="information-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.summaryText}>
              Всего лицевых счетов: {userProperties.totalAccounts}
            </Text>
          </View>
        </View>
      )}

      <Card>
        <Text style={styles.sectionTitle}>Управляющая компания</Text>
        <Text style={styles.companyName}>ООО «УК Зеленая Долина»</Text>
        <Text style={styles.companyInfo}>
          📍 г. Зеленодольск, ул. Шустова, д. 4А, пом. 15{'\n'}
          📞 8 960 072 03 21{'\n'}
          📧 uk-zeldol@yandex.ru{'\n\n'}
          ИНН: 1673002229{'\n'}
          КПП: 167301001{'\n'}
          ОГРН: 1221600054653
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>О приложении</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Версия:</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Платформа:</Text>
          <Text style={styles.value}>React Native</Text>
        </View>
      </Card>

      <Button title="Выйти из аккаунта" onPress={handleLogout} variant="secondary" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  phone: {
    fontSize: 15,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 12,
  },
  companyInfo: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    marginTop: 24,
  },
  propertyGroup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  propertyType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  propertyLeft: {
    flex: 1,
  },
  propertyNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 13,
    color: '#666',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    gap: 12,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
});

