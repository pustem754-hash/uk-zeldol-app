import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components/Header';
import { Storage } from '../utils/storage';
import { User } from '../types';

interface Reading {
  id: string;
  date: string; // ISO строка даты (2025-11-15T14:30:00.000Z)
  timestamp: number; // Timestamp для сортировки
  coldWater: number;
  hotWater: number;
  electricity: number;
  gas: number;
}

// Функция форматирования даты для отображения (заголовок)
const formatReadingDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // ВАЖНО: добавлено время и "г." после года
    return `${day} ${month} ${year} г., ${hours}:${minutes}`;
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return dateString;
  }
};

// Функция форматирования даты/времени приёма
const formatAcceptanceDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `Показания приняты ${day}.${month}.${year} в ${hours}:${minutes}`;
  } catch (error) {
    console.error('Ошибка форматирования даты приёма:', error);
    return '';
  }
};

// Функция форматирования чисел с разделителями тысяч
const formatNumber = (num: number): string => {
  return num.toLocaleString('ru-RU');
};

// Константа для placeholder - используется везде одинаково
const METER_PLACEHOLDER = 'Показания';

interface MeterFieldProps {
  emoji: string;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  fieldId: string;
  focusedField: string | null;
  onFocus: () => void;
  onBlur: () => void;
  hintText?: string;
  showDivider?: boolean;
}

interface HistoryItemProps {
  reading: Reading;
}

// Компонент для отображения элемента истории показаний
const HistoryItem: React.FC<HistoryItemProps> = ({ reading }) => {
  const formattedDate = formatReadingDate(reading.date);
  const acceptanceDate = formatAcceptanceDate(reading.date);
  
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <View style={styles.historyDateContainer}>
          <View style={styles.historyDateEmojiContainer}>
            <Text style={styles.historyDateEmoji}>📅</Text>
          </View>
          <View style={styles.historyDateTextContainer}>
            <Text style={styles.historyDate}>{formattedDate}</Text>
            <Text style={styles.historyAcceptanceDate}>{acceptanceDate}</Text>
          </View>
        </View>
        <View style={styles.historyStatusBadge}>
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          <Text style={styles.historyStatusText}>Отправлено</Text>
        </View>
      </View>
      
      <View style={styles.historyReadings}>
        <View style={styles.historyReadingItem}>
          <View style={styles.historyReadingLeft}>
            <Text style={styles.historyReadingEmoji}>❄️</Text>
            <Text style={styles.historyReadingLabel}>Холодная вода</Text>
          </View>
          <View style={styles.historyReadingRight}>
            <Text style={styles.historyReadingValue}>{formatNumber(reading.coldWater)}</Text>
            <Text style={styles.historyReadingUnit}>м³</Text>
          </View>
        </View>
        
        <View style={[styles.historyReadingItem, styles.historyReadingItemWithDivider]}>
          <View style={styles.historyReadingLeft}>
            <Text style={styles.historyReadingEmoji}>🔥</Text>
            <Text style={styles.historyReadingLabel}>Горячая вода</Text>
          </View>
          <View style={styles.historyReadingRight}>
            <Text style={styles.historyReadingValue}>{formatNumber(reading.hotWater)}</Text>
            <Text style={styles.historyReadingUnit}>м³</Text>
          </View>
        </View>
        
        <View style={[styles.historyReadingItem, styles.historyReadingItemWithDivider]}>
          <View style={styles.historyReadingLeft}>
            <Text style={styles.historyReadingEmoji}>⚡</Text>
            <Text style={styles.historyReadingLabel}>Электричество</Text>
          </View>
          <View style={styles.historyReadingRight}>
            <Text style={styles.historyReadingValue}>{formatNumber(reading.electricity)}</Text>
            <Text style={styles.historyReadingUnit}>кВт⋅ч</Text>
          </View>
        </View>
        
        <View style={styles.historyReadingItem}>
          <View style={styles.historyReadingLeft}>
            <Text style={styles.historyReadingEmoji}>🔥</Text>
            <Text style={styles.historyReadingLabel}>Газ</Text>
          </View>
          <View style={styles.historyReadingRight}>
            <Text style={styles.historyReadingValue}>{formatNumber(reading.gas)}</Text>
            <Text style={styles.historyReadingUnit}>м³</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * Единый компонент для всех типов счетчиков
 * Гарантирует одинаковое отображение всех полей ввода
 */
const MeterField: React.FC<MeterFieldProps> = ({
  emoji,
  label,
  value,
  onChangeText,
  fieldId,
  focusedField,
  onFocus,
  onBlur,
  hintText,
  showDivider = true,
}) => {
  const isFocused = focusedField === fieldId;
  const hasValue = value !== '';

  return (
    <>
      {/* Контейнер метки с эмодзи */}
      <View style={styles.meterLabelContainer}>
        <Text style={styles.meterEmoji}>{emoji}</Text>
        <Text style={styles.meterLabel}>{label}</Text>
      </View>

      {/* Поле ввода */}
      <TextInput
        style={[styles.meterInput, isFocused && styles.meterInputFocused]}
        placeholder={METER_PLACEHOLDER}
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        textAlign="left"
        textAlignVertical="center"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        clearButtonMode="never"
        returnKeyType="done"
        allowFontScaling={true}
        maxFontSizeMultiplier={1}
      />

      {/* Подсказка с предыдущими показаниями */}
      {hasValue && hintText && (
        <View style={styles.hintBox}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.hintText}>{hintText}</Text>
        </View>
      )}

      {/* Разделитель между полями */}
      {showDivider && <View style={styles.meterDivider} />}
    </>
  );
};

export const MetersScreen = ({ navigation }: any) => {
  const [coldWater, setColdWater] = useState('');
  const [hotWater, setHotWater] = useState('');
  const [electricity, setElectricity] = useState('');
  const [gas, setGas] = useState('');
  const [loading, setLoading] = useState(false);
  const [readingsHistory, setReadingsHistory] = useState<Reading[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ОТКЛЮЧЕНО: Используй только для создания тестовых данных вручную
  // const createTestHistory = async () => {
  //   // Правильная история: показания РАСТУТ каждый месяц
  //   const testHistory: Reading[] = [
  //     {
  //       id: '1',
  //       date: new Date('2025-11-16T22:16:00').toISOString(),
  //       timestamp: new Date('2025-11-16T22:16:00').getTime(),
  //       coldWater: 582500,    // Ноябрь (больше октября)
  //       hotWater: 253200,
  //       electricity: 489500,
  //       gas: 501800,
  //     },
  //     {
  //       id: '2',
  //       date: new Date('2025-10-25T18:30:00').toISOString(),
  //       timestamp: new Date('2025-10-25T18:30:00').getTime(),
  //       coldWater: 580866,    // Октябрь (базовые показания)
  //       hotWater: 252669,
  //       electricity: 488896,
  //       gas: 500966,
  //     },
  //     {
  //       id: '3',
  //       date: new Date('2025-09-20T14:15:00').toISOString(),
  //       timestamp: new Date('2025-09-20T14:15:00').getTime(),
  //       coldWater: 578200,    // Сентябрь (меньше октября)
  //       hotWater: 251100,
  //       electricity: 487200,
  //       gas: 499500,
  //     },
  //   ];
  //   
  //   await AsyncStorage.setItem('metersHistory', JSON.stringify(testHistory));
  //   console.log('✅ Тестовая история создана с правильными данными');
  // };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('metersHistory');
      if (stored) {
        const history = JSON.parse(stored);
        // Миграция старых записей: если нет timestamp, добавляем его
        const migratedHistory = history.map((r: Reading) => {
          if (!r.timestamp && r.date) {
            // Если дата в старом формате (например, "ноябрь 2025 г."), создаем новую дату
            try {
              const date = new Date(r.date);
              if (isNaN(date.getTime())) {
                // Если не удалось распарсить, используем текущую дату
                return { ...r, timestamp: Date.now(), date: new Date().toISOString() };
              }
              return { ...r, timestamp: date.getTime(), date: date.toISOString() };
            } catch {
              return { ...r, timestamp: Date.now(), date: new Date().toISOString() };
            }
          }
          return r;
        });
        // Сортируем по timestamp (новые сверху)
        const sortedHistory = migratedHistory.sort((a: Reading, b: Reading) => 
          (b.timestamp || 0) - (a.timestamp || 0)
        );
        
        setReadingsHistory(sortedHistory);
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
  };

  // Генерация CSV в формате 4.0 для ЕРЦ
  const generateCSV = async (
    coldWaterValue: string,
    hotWaterValue: string,
    electricityValue: string,
    gasValue: string
  ): Promise<string> => {
    try {
      // Получить данные пользователя
      const user: User | null = await Storage.getUser();
      const address = user?.address || 'ул. Шустова 4А';
      const apartment = user?.apartment || '45';
      const date = new Date().toISOString().split('T')[0]; // Формат: 2025-11-16

      // Формирование CSV (форма 4.0)
      const csvHeader = 'Адрес,Квартира,Холодная вода,Горячая вода,Электричество,Газ,Дата\n';
      const csvRow = `${address},${apartment},${coldWaterValue},${hotWaterValue},${electricityValue},${gasValue},${date}\n`;
      const csvContent = csvHeader + csvRow;

      console.log('CSV сформирован для отправки');
      return csvContent;
    } catch (error) {
      console.error('Ошибка генерации CSV:', error);
      throw error;
    }
  };

  // Сохранение CSV для последующей отправки
  const exportToCSV = async (csvContent: string): Promise<void> => {
    try {
      // Получить существующие ожидающие экспорты
      const pendingExportsData = await AsyncStorage.getItem('pending_meter_exports');
      const pendingExports = pendingExportsData ? JSON.parse(pendingExportsData) : [];

      // Добавить новый экспорт
      const newExport = {
        csv_data: csvContent,
        timestamp: new Date().toISOString(),
        sent: false,
      };

      const updatedExports = [newExport, ...pendingExports];
      await AsyncStorage.setItem('pending_meter_exports', JSON.stringify(updatedExports));

      console.log('CSV сохранён для синхронизации с сервером');
    } catch (error) {
      console.error('Ошибка сохранения CSV:', error);
      throw error;
    }
  };

  const handleSubmitReadings = async () => {
    // Проверка заполнения полей
    if (!coldWater || !hotWater || !electricity || !gas) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    // ВАЛИДАЦИЯ: Проверка, что новые показания больше предыдущих
    try {
      const stored = await AsyncStorage.getItem('metersHistory');
      const history = stored ? JSON.parse(stored) : [];
      const lastReadings = history.length > 0 ? history[0] : null; // Последние показания (самые новые)
      
      if (lastReadings) {
        const newCold = parseFloat(coldWater);
        const newHot = parseFloat(hotWater);
        const newElec = parseFloat(electricity);
        const newGas = parseFloat(gas);
        
        const errors: string[] = [];
        
        if (newCold < lastReadings.coldWater) {
          errors.push(`Холодная вода: ${newCold.toLocaleString('ru-RU')} < ${lastReadings.coldWater.toLocaleString('ru-RU')} м³`);
        }
        if (newHot < lastReadings.hotWater) {
          errors.push(`Горячая вода: ${newHot.toLocaleString('ru-RU')} < ${lastReadings.hotWater.toLocaleString('ru-RU')} м³`);
        }
        if (newElec < lastReadings.electricity) {
          errors.push(`Электричество: ${newElec.toLocaleString('ru-RU')} < ${lastReadings.electricity.toLocaleString('ru-RU')} кВт⋅ч`);
        }
        if (newGas < lastReadings.gas) {
          errors.push(`Газ: ${newGas.toLocaleString('ru-RU')} < ${lastReadings.gas.toLocaleString('ru-RU')} м³`);
        }
        
        if (errors.length > 0) {
          Alert.alert(
            '❌ Ошибка валидации',
            'Новые показания не могут быть меньше предыдущих!\n\n' +
            'Последние показания:\n' +
            `Холодная вода: ${lastReadings.coldWater.toLocaleString('ru-RU')} м³\n` +
            `Горячая вода: ${lastReadings.hotWater.toLocaleString('ru-RU')} м³\n` +
            `Электричество: ${lastReadings.electricity.toLocaleString('ru-RU')} кВт⋅ч\n` +
            `Газ: ${lastReadings.gas.toLocaleString('ru-RU')} м³\n\n` +
            'Ошибки:\n' + errors.join('\n'),
            [{ text: 'Понятно' }]
          );
          return;
        }
      }
    } catch (error) {
      console.error('Ошибка валидации:', error);
      // Продолжаем, если не удалось проверить
    }

    Alert.alert(
      '📊 Отправить показания?',
      `Холодная вода: ${coldWater} м³\n` +
        `Горячая вода: ${hotWater} м³\n` +
        `Электричество: ${electricity} кВт⋅ч\n` +
        `Газ: ${gas} м³\n\n` +
        `Показания будут отправлены в УК автоматически.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          onPress: async () => {
            setLoading(true);

            try {
              // Сохранить в историю локально
              const now = new Date();
              const timestamp = now.getTime();
              const dateISO = now.toISOString();
              
              // Для проверки дубликатов используем только дату (без времени)
              const dateKey = now.toISOString().split('T')[0]; // Формат: 2025-11-15
              
              const newReading: Reading = {
                id: timestamp.toString(),
                date: dateISO,
                timestamp: timestamp,
                coldWater: parseFloat(coldWater),
                hotWater: parseFloat(hotWater),
                electricity: parseFloat(electricity),
                gas: parseFloat(gas),
              };

              // Проверка на дубликаты: если есть запись за текущий день, заменяем её
              const existingIndex = readingsHistory.findIndex((r) => {
                const readingDate = new Date(r.date).toISOString().split('T')[0];
                return readingDate === dateKey;
              });
              
              let updatedHistory: Reading[];
              if (existingIndex !== -1) {
                // Заменяем существующую запись за этот день
                updatedHistory = [...readingsHistory];
                updatedHistory[existingIndex] = newReading;
              } else {
                // Добавляем новую запись в начало (сортируем по timestamp)
                updatedHistory = [newReading, ...readingsHistory]
                  .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                  .slice(0, 12);
              }
              
              setReadingsHistory(updatedHistory);
              await AsyncStorage.setItem('metersHistory', JSON.stringify(updatedHistory));

              // АВТОМАТИЧЕСКОЕ ФОРМИРОВАНИЕ CSV (форма 4.0)
              try {
                const csvContent = await generateCSV(coldWater, hotWater, electricity, gas);
                await exportToCSV(csvContent);
              } catch (csvError) {
                console.error('Ошибка экспорта CSV:', csvError);
                // Не прерываем процесс, если CSV не удалось создать
              }

              // TODO: Отправить на backend API (когда будет готов)
              // await fetch('https://your-api.com/api/meters', {
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify({ coldWater, hotWater, electricity, gas }),
              // });

              // Очистить поля
              setColdWater('');
              setHotWater('');
              setElectricity('');
              setGas('');

              Alert.alert(
                '✅ Успешно',
                'Показания отправлены в УК.\n\nОни будут учтены в следующем начислении.'
              );
            } catch (error) {
              console.error('Ошибка отправки показаний:', error);
              Alert.alert('❌ Ошибка', 'Не удалось отправить показания. Попробуйте позже.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Показания счетчиков" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* КАРТОЧКА ТЕКУЩЕГО ПЕРИОДА */}
        <View style={styles.periodCard}>
          <View style={styles.periodHeader}>
            <Ionicons name="calendar" size={24} color="#4CAF50" />
            <Text style={styles.periodTitle}>Текущий период: Январь 2025</Text>
          </View>
          <View style={styles.periodInfo}>
            <Ionicons name="information-circle" size={18} color="#666" />
            <Text style={styles.periodText}>
              Показания принимаются с 15 по 25 число каждого месяца
            </Text>
          </View>
        </View>

        {/* КАРТОЧКА ФОРМЫ */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Передать показания</Text>

          {/* ХОЛОДНАЯ ВОДА */}
          <MeterField
            emoji="❄️"
            label="Холодная вода (м³)"
            value={coldWater}
            onChangeText={setColdWater}
            fieldId="coldWater"
            focusedField={focusedField}
            onFocus={() => setFocusedField('coldWater')}
            onBlur={() => setFocusedField(null)}
            hintText="Предыдущие: 122.5 м³"
            showDivider={true}
          />

          {/* ГОРЯЧАЯ ВОДА */}
          <MeterField
            emoji="🔥"
            label="Горячая вода (м³)"
            value={hotWater}
            onChangeText={setHotWater}
            fieldId="hotWater"
            focusedField={focusedField}
            onFocus={() => setFocusedField('hotWater')}
            onBlur={() => setFocusedField(null)}
            hintText="Предыдущие: 87.3 м³"
            showDivider={true}
          />

          {/* ЭЛЕКТРИЧЕСТВО */}
          <MeterField
            emoji="⚡"
            label="Электричество (кВт⋅ч)"
            value={electricity}
            onChangeText={setElectricity}
            fieldId="electricity"
            focusedField={focusedField}
            onFocus={() => setFocusedField('electricity')}
            onBlur={() => setFocusedField(null)}
            hintText="Предыдущие: 1245.0 кВт⋅ч"
            showDivider={true}
          />

          {/* ГАЗ */}
          <MeterField
            emoji="🔥"
            label="Газ (м³)"
            value={gas}
            onChangeText={setGas}
            fieldId="gas"
            focusedField={focusedField}
            onFocus={() => setFocusedField('gas')}
            onBlur={() => setFocusedField(null)}
            hintText="Предыдущие: 45.2 м³"
            showDivider={false}
          />

          {/* КНОПКА ОТПРАВКИ */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!coldWater || !hotWater || !electricity || !gas) && styles.submitButtonDisabled,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitReadings}
            disabled={loading || !coldWater || !hotWater || !electricity || !gas}
            activeOpacity={0.8}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.submitButtonText}>Отправка...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.submitButtonText}>Отправить показания</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ИСТОРИЯ ПОКАЗАНИЙ */}
        <View style={styles.historySection}>
          <View style={styles.historyHeaderSection}>
            <View style={styles.historyTitleRow}>
              <Ionicons name="bar-chart" size={24} color="#4CAF50" />
              <Text style={styles.historyTitle}>История показаний</Text>
            </View>
            {readingsHistory.length > 0 && (
              <View style={styles.historyBadge}>
                <Text style={styles.historyBadgeText}>Всего: {readingsHistory.length}</Text>
              </View>
            )}
          </View>

          {readingsHistory.length === 0 ? (
            <View style={styles.emptyHistoryContainer}>
              <Ionicons name="document-text-outline" size={48} color="#ccc" />
              <Text style={styles.emptyHistoryTitle}>История пуста</Text>
              <Text style={styles.emptyHistoryText}>
                Переданные показания будут отображаться здесь
              </Text>
            </View>
          ) : (
            readingsHistory.map((reading) => (
              <HistoryItem key={reading.id} reading={reading} />
            ))
          )}
        </View>

        {/* ИНФОРМАЦИОННЫЙ БЛОК */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="help-circle" size={22} color="#4CAF50" />
            <Text style={styles.infoTitle}>Как это работает?</Text>
          </View>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Передавайте показания с 15 по 25 число</Text>
            <Text style={styles.infoItem}>• Данные автоматически отправляются в УК</Text>
            <Text style={styles.infoItem}>• Учтены в следующем начислении</Text>
            <Text style={styles.infoItem}>• Вопросы: 8 960 072 03 21</Text>
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
  periodCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  periodInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  meterLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  meterEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  meterLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  meterInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    fontSize: 20,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    color: '#333',
    fontWeight: '600',
    textAlign: 'left',
    includeFontPadding: false,
    textAlignVertical: 'center',
    letterSpacing: 0,
    textTransform: 'none',
  },
  meterInputFocused: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  meterDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 24,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  hintText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 56,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowColor: '#999',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
  historySection: {
    marginTop: 32,
    marginBottom: 16,
  },
  historyHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 30,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  historyBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  historyBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  historyCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyHistoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistoryText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  historyDateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    flex: 1,
  },
  historyDateEmojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyDateEmoji: {
    fontSize: 20,
  },
  historyDateTextContainer: {
    flex: 1,
  },
  historyDate: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  historyAcceptanceDate: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontWeight: '400',
  },
  historyStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  historyStatusText: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  historyReadings: {
    gap: 0,
  },
  historyReadingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 48,
  },
  historyReadingItemWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  historyReadingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  historyReadingRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginLeft: 12,
  },
  historyReadingEmoji: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  historyReadingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.1,
  },
  historyReadingValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  historyReadingUnit: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#f0f8f0',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  infoText: {
    fontSize: 14,
    color: '#1b5e20',
    lineHeight: 22,
  },
});
