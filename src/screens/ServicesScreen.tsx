import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { MOCK_SERVICES } from '../constants/services';
import { Service } from '../types/service';

export const ServicesScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState<'all' | 'ремонт' | 'уборка' | 'доставка'>('all');

  const getFilteredServices = () => {
    if (filter === 'all') return MOCK_SERVICES;
    return MOCK_SERVICES.filter((service) => service.category === filter);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ремонт':
        return '🔧';
      case 'уборка':
        return '🧹';
      case 'доставка':
        return '🚚';
      default:
        return '📦';
    }
  };

  const handleOrder = (service: Service) => {
    Alert.alert('Заказать услугу', `Заказать "${service.name}"?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Заказать',
        onPress: () => {
          Alert.alert(
            'Успешно',
            `Заявка на услугу "${service.name}" создана. Мы свяжемся с вами в ближайшее время.`,
            [
              {
                text: 'ОК',
                onPress: () => navigation.navigate('CreateRequest'),
              },
            ]
          );
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Дополнительные услуги" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
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
            style={[styles.filterButton, filter === 'ремонт' && styles.filterButtonActive]}
            onPress={() => setFilter('ремонт')}
          >
            <Text style={[styles.filterText, filter === 'ремонт' && styles.filterTextActive]}>
              🔧 Ремонт
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'уборка' && styles.filterButtonActive]}
            onPress={() => setFilter('уборка')}
          >
            <Text style={[styles.filterText, filter === 'уборка' && styles.filterTextActive]}>
              🧹 Уборка
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'доставка' && styles.filterButtonActive]}
            onPress={() => setFilter('доставка')}
          >
            <Text style={[styles.filterText, filter === 'доставка' && styles.filterTextActive]}>
              🚚 Доставка
            </Text>
          </TouchableOpacity>
        </View>

        {/* Список услуг */}
        {getFilteredServices().map((service) => (
          <Card key={service.id}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIcon}>
                <Text style={styles.iconText}>{getCategoryIcon(service.category)}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.servicePrice}>
                  <Text style={styles.priceValue}>{service.price} ₽</Text>
                  <Text style={styles.priceUnit}> / {service.unit}</Text>
                </View>
                {service.duration && (
                  <Text style={styles.serviceDuration}>⏱️ {service.duration}</Text>
                )}
              </View>
            </View>
            <Button
              title="Заказать"
              onPress={() => handleOrder(service)}
              variant="primary"
            />
          </Card>
        ))}

        {/* Форма произвольной заявки */}
        <Card>
          <Text style={styles.customTitle}>Нужна другая услуга?</Text>
          <Text style={styles.customDescription}>
            Опишите, какая услуга вам нужна, и мы свяжемся с вами для уточнения деталей.
          </Text>
          <Button
            title="Создать произвольную заявку"
            onPress={() => navigation.navigate('CreateRequest')}
            variant="secondary"
          />
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
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  serviceHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 28,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  servicePrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
  },
  serviceDuration: {
    fontSize: 12,
    color: '#999',
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  customDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
});

