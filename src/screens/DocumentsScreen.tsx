import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { MOCK_DOCUMENTS } from '../constants/documents';
import { Document } from '../types/document';

export const DocumentsScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState<'all' | 'договор' | 'акт' | 'протокол' | 'другое'>('all');

  const getFilteredDocuments = () => {
    if (filter === 'all') return MOCK_DOCUMENTS;
    return MOCK_DOCUMENTS.filter((doc) => doc.type === filter);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'договор':
        return '📄';
      case 'акт':
        return '✅';
      case 'протокол':
        return '📋';
      default:
        return '📁';
    }
  };

  const handleDownload = (document: Document) => {
    Alert.alert('Скачать документ', `Скачать "${document.title}"?`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Скачать',
        onPress: () => {
          Alert.alert('Успешно', 'Документ скачан в папку "Загрузки"');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Документы" showBack onBackPress={() => navigation.goBack()} />
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
            style={[styles.filterButton, filter === 'договор' && styles.filterButtonActive]}
            onPress={() => setFilter('договор')}
          >
            <Text style={[styles.filterText, filter === 'договор' && styles.filterTextActive]}>
              📄 Договоры
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'акт' && styles.filterButtonActive]}
            onPress={() => setFilter('акт')}
          >
            <Text style={[styles.filterText, filter === 'акт' && styles.filterTextActive]}>
              ✅ Акты
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'протокол' && styles.filterButtonActive]}
            onPress={() => setFilter('протокол')}
          >
            <Text
              style={[styles.filterText, filter === 'протокол' && styles.filterTextActive]}
            >
              📋 Протоколы
            </Text>
          </TouchableOpacity>
        </View>

        {/* Список документов */}
        {getFilteredDocuments().map((doc) => (
          <TouchableOpacity key={doc.id} onPress={() => handleDownload(doc)}>
            <Card>
              <View style={styles.documentHeader}>
                <View style={styles.documentIcon}>
                  <Text style={styles.iconText}>{getTypeIcon(doc.type)}</Text>
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{doc.title}</Text>
                  <View style={styles.documentMeta}>
                    <Text style={styles.documentType}>{doc.type}</Text>
                    <Text style={styles.documentSize}>• {doc.size}</Text>
                    <Text style={styles.documentDate}>
                      • {new Date(doc.createdAt).toLocaleDateString('ru-RU')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.downloadIcon}>⬇️</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {getFilteredDocuments().length === 0 && (
          <Card>
            <Text style={styles.emptyText}>Документов в этой категории пока нет</Text>
          </Card>
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
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  documentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  documentType: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  documentSize: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  downloadIcon: {
    fontSize: 24,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

