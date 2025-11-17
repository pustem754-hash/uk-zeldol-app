import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { MOCK_REQUESTS } from '../constants/mockData';

// Компонент бейджа статуса
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { bg: string; color: string; icon: string }> = {
    новая: { bg: '#E3F2FD', color: '#1976D2', icon: 'time-outline' },
    'в работе': { bg: '#FFF3E0', color: '#F57C00', icon: 'hourglass-outline' },
    выполнена: { bg: '#E8F5E9', color: '#388E3C', icon: 'checkmark-circle' },
  };

  const config = statusConfig[status] || statusConfig['новая'];

  return (
    <View style={[styles.statusBadgeContainer, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon as any} size={14} color={config.color} />
      <Text style={[styles.statusText, { color: config.color }]}>{status}</Text>
    </View>
  );
};

// Функция получения иконки типа заявки
const getRequestTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'ремонт':
      return 'construct-outline';
    case 'уборка':
      return 'broom-outline';
    default:
      return 'document-text-outline';
  }
};

export const RequestsScreen = ({ navigation }: any) => {
  const [requests] = useState(MOCK_REQUESTS);

  return (
    <View style={styles.container}>
      <Header title="Заявки" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <Button
          title="+ Создать заявку"
          onPress={() => navigation.navigate('CreateRequest')}
        />

        {requests.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>У вас пока нет заявок</Text>
          </Card>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.requestHeaderLeft}>
                  <Ionicons
                    name={getRequestTypeIcon(request.type) as any}
                    size={24}
                    color="#4CAF50"
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestType}>{request.type.toUpperCase()}</Text>
                    <Text style={styles.requestDate}>
                      {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={request.status} />
              </View>
              <Text style={styles.requestDescription}>{request.description}</Text>
              {request.response && (
                <View style={styles.response}>
                  <Text style={styles.responseLabel}>Ответ УК:</Text>
                  <Text style={styles.responseText}>{request.response}</Text>
                </View>
              )}
            </View>
          ))
        )}
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
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestInfo: {
    marginLeft: 12,
    flex: 1,
  },
  requestType: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
  },
  requestDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requestDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginTop: 8,
  },
  response: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  responseLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 6,
  },
  responseText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

