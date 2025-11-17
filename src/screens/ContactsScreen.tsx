import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { MOCK_CONTACTS } from '../constants/contacts';
import { Contact } from '../types/contact';

export const ContactsScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState<'all' | 'экстренные' | 'управление' | 'обслуживание'>(
    'all'
  );

  const getFilteredContacts = () => {
    if (filter === 'all') return MOCK_CONTACTS;
    return MOCK_CONTACTS.filter((contact) => contact.category === filter);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Ошибка', 'Не удалось совершить звонок');
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Ошибка', 'Не удалось открыть почтовый клиент');
    });
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'экстренные':
        return '🚨 Экстренные службы';
      case 'управление':
        return '🏢 Управление УК';
      case 'обслуживание':
        return '🔧 Обслуживание';
      default:
        return '';
    }
  };

  const groupedContacts = () => {
    const filtered = getFilteredContacts();
    const groups: Record<string, Contact[]> = {};

    filtered.forEach((contact) => {
      if (!groups[contact.category]) {
        groups[contact.category] = [];
      }
      groups[contact.category].push(contact);
    });

    return groups;
  };

  return (
    <View style={styles.container}>
      <Header title="Контакты" showBack onBackPress={() => navigation.goBack()} />
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
            style={[styles.filterButton, filter === 'экстренные' && styles.filterButtonActive]}
            onPress={() => setFilter('экстренные')}
          >
            <Text
              style={[styles.filterText, filter === 'экстренные' && styles.filterTextActive]}
            >
              🚨 Экстренные
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'управление' && styles.filterButtonActive]}
            onPress={() => setFilter('управление')}
          >
            <Text
              style={[styles.filterText, filter === 'управление' && styles.filterTextActive]}
            >
              🏢 Управление
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'обслуживание' && styles.filterButtonActive]}
            onPress={() => setFilter('обслуживание')}
          >
            <Text
              style={[styles.filterText, filter === 'обслуживание' && styles.filterTextActive]}
            >
              🔧 Обслуживание
            </Text>
          </TouchableOpacity>
        </View>

        {/* Группированные контакты */}
        {Object.entries(groupedContacts()).map(([category, contacts]) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{getCategoryTitle(category)}</Text>
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <View style={styles.contactHeader}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRole}>{contact.role}</Text>
                    {contact.is24h && (
                      <View style={styles.hoursBadge}>
                        <Text style={styles.hoursText}>24/7</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.contactActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCall(contact.phone)}
                  >
                    <Text style={styles.actionIcon}>📞</Text>
                    <Text style={styles.actionText}>{contact.phone}</Text>
                  </TouchableOpacity>

                  {contact.email && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEmail(contact.email!)}
                    >
                      <Text style={styles.actionIcon}>📧</Text>
                      <Text style={styles.actionText}>Email</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {contact.address && (
                  <View style={styles.addressContainer}>
                    <Text style={styles.addressLabel}>📍 Адрес:</Text>
                    <Text style={styles.addressText}>{contact.address}</Text>
                  </View>
                )}
              </Card>
            ))}
          </View>
        ))}

        {/* Карта офиса УК */}
        <Card>
          <Text style={styles.mapTitle}>📍 Офис УК на карте</Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>🗺️</Text>
            <Text style={styles.mapLabel}>г. Зеленодольск, ул. Шустова, д. 4А</Text>
            <Text style={styles.mapNote}>Нажмите для открытия карты</Text>
          </View>
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
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  contactHeader: {
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginRight: 8,
  },
  contactRole: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  hoursBadge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  hoursText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  addressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mapNote: {
    fontSize: 12,
    color: '#999',
  },
});

