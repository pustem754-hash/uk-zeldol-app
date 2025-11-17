import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { MOCK_STORAGES, getStoragesByApartment } from '../constants/storages';
import { Storage } from '../types/storage';
import { Storage as StorageUtil } from '../utils/storage';

export const StorageScreen = ({ navigation }: any) => {
  const [userStorages, setUserStorages] = useState<Storage[]>([]);
  const [allStorages, setAllStorages] = useState<Storage[]>(MOCK_STORAGES);
  const [filter, setFilter] = useState<'all' | 'my' | 'free'>('all');

  useEffect(() => {
    loadUserStorages();
  }, []);

  const loadUserStorages = async () => {
    const user = await StorageUtil.getUser();
    if (user?.storages && user.storages.length > 0) {
      const storages = user.storages
        .map((num) => MOCK_STORAGES.find((s) => s.number === num))
        .filter((s): s is Storage => s !== undefined);
      setUserStorages(storages);
    } else if (user?.apartment) {
      const storages = getStoragesByApartment(user.apartment);
      setUserStorages(storages);
    }
  };

  const getFilteredStorages = () => {
    switch (filter) {
      case 'my':
        return userStorages;
      case 'free':
        return allStorages.filter((s) => s.status === 'свободна');
      default:
        return allStorages;
    }
  };

  const handleOpenAccess = (storage: Storage) => {
    Alert.alert('Открыть доступ', `Открыть доступ к кладовой ${storage.number}?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Открыть',
        onPress: () => {
          Alert.alert('Успешно', `Доступ к кладовой ${storage.number} открыт на 30 минут`);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Мои кладовые" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        {/* Статистика */}
        <Card>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStorages.length}</Text>
              <Text style={styles.statLabel}>Мои кладовые</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {allStorages.filter((s) => s.status === 'свободна').length}
              </Text>
              <Text style={styles.statLabel}>Свободно</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{allStorages.length}</Text>
              <Text style={styles.statLabel}>Всего</Text>
            </View>
          </View>
        </Card>

        {/* Фильтры */}
        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'my' && styles.filterButtonActive]}
            onPress={() => setFilter('my')}
          >
            <Text style={[styles.filterText, filter === 'my' && styles.filterTextActive]}>
              Мои ({userStorages.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'free' && styles.filterButtonActive]}
            onPress={() => setFilter('free')}
          >
            <Text style={[styles.filterText, filter === 'free' && styles.filterTextActive]}>
              Свободные
            </Text>
          </TouchableOpacity>
        </View>

        {/* Список кладовых */}
        {getFilteredStorages().map((storage) => (
          <Card key={storage.id}>
            <View style={styles.storageHeader}>
              <View>
                <Text style={styles.storageNumber}>{storage.number}</Text>
                <Text style={styles.storageLocation}>{storage.location}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  storage.status === 'занята' ? styles.statusOccupied : styles.statusFree,
                ]}
              >
                <Text style={styles.statusText}>{storage.status.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.storageInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Площадь:</Text>
                <Text style={styles.infoValue}>{storage.area} м²</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Этаж:</Text>
                <Text style={styles.infoValue}>{storage.floor}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Корпус:</Text>
                <Text style={styles.infoValue}>{storage.building}</Text>
              </View>
              {storage.owner && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Владелец:</Text>
                  <Text style={styles.infoValue}>{storage.owner}</Text>
                </View>
              )}
              {storage.apartment && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Квартира:</Text>
                  <Text style={styles.infoValue}>№ {storage.apartment}</Text>
                </View>
              )}
            </View>

            {storage.status === 'занята' && userStorages.some((s) => s.id === storage.id) && (
              <Button
                title="🔓 Открыть доступ"
                onPress={() => handleOpenAccess(storage)}
                variant="primary"
              />
            )}
          </Card>
        ))}

        {/* Контакты УК */}
        <Card>
          <Text style={styles.contactTitle}>📞 Контакты УК</Text>
          <Text style={styles.contactText}>
            Для получения доступа к кладовой или аренды свободной кладовой обращайтесь в
            управляющую компанию:
          </Text>
          <Text style={styles.contactPhone}>8 960 072 03 21</Text>
        </Card>
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
    padding: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storageNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  storageLocation: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusOccupied: {
    backgroundColor: '#FFEBEE',
  },
  statusFree: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  storageInfo: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
});

