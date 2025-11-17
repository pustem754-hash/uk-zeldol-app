import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { MOCK_NEWS } from '../constants/news';
import { News } from '../types/news';

export const NewsScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState<'all' | 'новости' | 'объявления' | 'мероприятия'>('all');

  const getFilteredNews = () => {
    if (filter === 'all') return MOCK_NEWS;
    return MOCK_NEWS.filter((news) => news.category === filter);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'новости':
        return '📰';
      case 'объявления':
        return '📢';
      case 'мероприятия':
        return '🎉';
      default:
        return '📄';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Новости и объявления" showBack onBackPress={() => navigation.goBack()} />
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
            style={[styles.filterButton, filter === 'новости' && styles.filterButtonActive]}
            onPress={() => setFilter('новости')}
          >
            <Text
              style={[styles.filterText, filter === 'новости' && styles.filterTextActive]}
            >
              📰 Новости
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'объявления' && styles.filterButtonActive]}
            onPress={() => setFilter('объявления')}
          >
            <Text
              style={[styles.filterText, filter === 'объявления' && styles.filterTextActive]}
            >
              📢 Объявления
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'мероприятия' && styles.filterButtonActive]}
            onPress={() => setFilter('мероприятия')}
          >
            <Text
              style={[styles.filterText, filter === 'мероприятия' && styles.filterTextActive]}
            >
              🎉 Мероприятия
            </Text>
          </TouchableOpacity>
        </View>

        {/* Список новостей */}
        {getFilteredNews().map((news) => (
          <Card key={news.id}>
            <View style={styles.newsHeader}>
              <View style={styles.newsTitleRow}>
                <Text style={styles.newsCategory}>{getCategoryIcon(news.category)}</Text>
                <Text style={styles.newsTitle}>{news.title}</Text>
              </View>
              {news.isImportant && (
                <View style={styles.importantBadge}>
                  <Text style={styles.importantText}>⚠️ ВАЖНО</Text>
                </View>
              )}
            </View>
            <Text style={styles.newsContent}>{news.content}</Text>
            <Text style={styles.newsDate}>
              {new Date(news.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </Card>
        ))}

        {getFilteredNews().length === 0 && (
          <Card>
            <Text style={styles.emptyText}>Новостей в этой категории пока нет</Text>
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
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  newsTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsCategory: {
    fontSize: 20,
    marginRight: 8,
  },
  newsTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  importantBadge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  importantText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  newsContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

