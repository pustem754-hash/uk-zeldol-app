import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Platform,
  Pressable,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Storage } from '../utils/storage';
import { User } from '../types';

interface AutoPayment {
  id: string;
  enabled: boolean;
  amount: number;
  dayOfMonth: number; // день месяца для списания (1-31)
  cardNumber: string; // последние 4 цифры карты
  nextPaymentDate: string;
}

interface DebtStatus {
  hasDebt: boolean;
  debtAmount: number;
  debtMonths: number;
}

export const PaymentsScreen = ({ navigation }: any) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [debtStatus, setDebtStatus] = useState<DebtStatus>({
    hasDebt: false,
    debtAmount: 0,
    debtMonths: 0,
  });
  const [autoPayment, setAutoPayment] = useState<AutoPayment>({
    id: '1',
    enabled: false,
    amount: 5420.5,
    dayOfMonth: 10,
    cardNumber: '4321',
    nextPaymentDate: '10.12.2025',
  });
  const [showCardModal, setShowCardModal] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);

  // Данные карт (можно заменить на реальные из API)
  const availableCards = [
    { id: '1', last4: '4321', bank: 'Сбербанк', type: 'Visa' },
    { id: '2', last4: '8765', bank: 'Тинькофф', type: 'Mastercard' },
    { id: '3', last4: '1234', bank: 'Альфа-Банк', type: 'Мир' },
  ];

  // Данные платежей
  const paymentHistory = [
    { id: 1, month: 'Январь 2025', status: 'confirmed', amount: 3500 },
    { id: 2, month: 'Декабрь 2024', status: 'pending', amount: 3500 },
    { id: 3, month: 'Ноябрь 2024', status: 'confirmed', amount: 3200 },
    { id: 4, month: 'Октябрь 2024', status: 'confirmed', amount: 3200 },
    { id: 5, month: 'Сентябрь 2024', status: 'confirmed', amount: 3000 },
  ];

  const displayedPayments = showAllPayments ? paymentHistory : paymentHistory.slice(0, 3);

  useEffect(() => {
    loadUser();
    loadDebtStatus();
  }, []);

  // Отладочные логи
  useEffect(() => {
    console.log('PaymentsScreen mounted');
    console.log('autoPayment.enabled:', autoPayment.enabled);
    console.log('screenshot:', screenshot);
  }, [autoPayment.enabled, screenshot]);

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

  const pickImage = async () => {
    console.log('🎯 pickImage вызвана');

    try {
      console.log('📱 Открываем галерею...');

      // СРАЗУ открываем галерею без лишних проверок
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      console.log('📸 Результат выбора:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setScreenshot(result.assets[0].uri);
        console.log('✅ Изображение выбрано:', result.assets[0].uri);
        Toast.show({
          type: 'success',
          text1: 'Изображение выбрано',
          position: 'bottom',
        });
      } else {
        console.log('❌ Пользователь отменил выбор');
      }
    } catch (error: any) {
      console.error('❌ Ошибка:', error);

      // Если ошибка связана с разрешениями - запрашиваем
      if (error.code === 'E_NO_PERMISSIONS' || error.message?.includes('permission')) {
        console.log('🔐 Запрашиваем разрешение...');
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted) {
          console.log('✅ Разрешение получено, повторяем попытку...');
          // Повторяем попытку
          pickImage();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Необходимо разрешение',
            text2: 'Разрешите доступ к галерее в настройках',
            position: 'bottom',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: error.message || 'Не удалось открыть галерею',
          position: 'bottom',
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Загрузите скриншот оплаты',
        position: 'bottom',
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Здесь будет API запрос для отправки изображения
      // await uploadReceipt(screenshot);

      // Симуляция отправки
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Toast.show({
        type: 'success',
        text1: 'Скриншот отправлен',
        text2: 'Платёж будет проверен в ближайшее время',
        position: 'bottom',
      });

      setScreenshot(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка отправки',
        text2: 'Попробуйте позже',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoPayment = (value: boolean) => {
    setAutoPayment({ ...autoPayment, enabled: value });

    if (value) {
      Toast.show({
        type: 'success',
        text1: 'Автоплатёж включён',
        text2: 'Настройте карту и дату списания',
        position: 'bottom',
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Автоплатёж отключён',
        position: 'bottom',
      });
    }
  };

  const selectCard = () => {
    console.log('selectCard pressed');
    setShowCardModal(true);
  };

  const handleCardSelect = (card: { id: string; last4: string; bank: string; type: string }) => {
    setAutoPayment({ ...autoPayment, cardNumber: card.last4 });
    setShowCardModal(false);
    Toast.show({
      type: 'success',
      text1: 'Карта выбрана',
      text2: `•••• ${card.last4} (${card.bank})`,
      position: 'bottom',
    });
  };

  // Функция получения конфигурации статуса
  const getStatusConfig = (status: string) => {
    if (status === 'confirmed') {
      return {
        icon: 'checkmark-circle',
        color: '#4CAF50',
        text: 'Подтверждено',
      };
    } else if (status === 'pending') {
      return {
        icon: 'time',
        color: '#FFA726',
        text: 'На проверке',
      };
    }
    return {
      icon: 'close-circle',
      color: '#D32F2F',
      text: 'Отклонено',
    };
  };

  // Функция копирования реквизитов в буфер обмена
  const copyToClipboard = async (label: string, value: string) => {
    try {
      await Clipboard.setStringAsync(value);
      Toast.show({
        type: 'success',
        text1: 'Скопировано',
        text2: `${label} ${value}`,
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Ошибка копирования:', error);
      Alert.alert('Ошибка', 'Не удалось скопировать в буфер обмена');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Платежи" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* КАРТОЧКА БАЛАНСА/ЗАДОЛЖЕННОСТИ */}
        {debtStatus.hasDebt ? (
          <View style={styles.debtCard}>
            <Text style={styles.debtLabel}>ЗАДОЛЖЕННОСТЬ</Text>
            
            <View style={styles.debtAmountRow}>
              <Ionicons name="alert-circle" size={24} color="#D32F2F" />
              <Text style={styles.debtAmount}>
                {debtStatus.debtAmount.toLocaleString('ru-RU', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })} ₽
              </Text>
            </View>
            
            <Text style={styles.overdueText}>Просрочка: {debtStatus.debtMonths} мес.</Text>
            
            <TouchableOpacity 
              style={styles.payNowButton}
              onPress={() => {
                // Навигация к оплате
                Alert.alert('Оплата', 'Переход к оплате задолженности');
              }}
            >
              <Ionicons name="card-outline" size={20} color="#FFF" />
              <Text style={styles.payNowText}>Погасить сейчас</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Баланс лицевого счета</Text>
            <Text style={styles.balanceAmount}>
              {(user?.balance || 0).toLocaleString('ru-RU')} ₽
            </Text>
            <Text style={styles.balanceSubtext}>
              {user?.balance && user.balance > 0
                ? 'У вас есть переплата'
                : 'Баланс в норме'}
            </Text>
          </View>
        )}

        {/* ТЕКУЩИЕ НАЧИСЛЕНИЯ */}
        <View style={styles.chargesCard}>
          {/* Заголовок с иконкой */}
          <View style={styles.chargesHeader}>
            <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
            <Text style={styles.chargesTitle}>Текущие начисления</Text>
          </View>
          
          {/* Период и сумма */}
          <View style={styles.chargesRow}>
            <View style={styles.periodRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.periodText}>Январь 2025</Text>
            </View>
            <Text style={styles.chargesAmount}>
              {7836.90.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} ₽
            </Text>
          </View>
          
          {/* Разделитель */}
          <View style={styles.divider} />
          
          {/* Срок оплаты */}
          <View style={styles.dueDateBadge}>
            <Ionicons name="calendar-sharp" size={16} color="#D32F2F" />
            <Text style={styles.dueDateLabel}>К оплате до:</Text>
            <Text style={styles.dueDateValue}>28.01.2025</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          {/* Заголовок с иконкой */}
          <View style={styles.detailsHeader}>
            <Ionicons name="business-outline" size={20} color="#4CAF50" />
            <Text style={styles.detailsTitle}>Реквизиты для оплаты</Text>
          </View>

          {/* Получатель (НЕ копируемый) */}
          <View style={styles.recipientRow}>
            <Text style={styles.detailLabel}>Получатель:</Text>
            <Text style={styles.recipientValue}>ООО «УК Зеленая Долина»</Text>
          </View>

          {/* Копируемые реквизиты */}
          {[
            { label: 'ИНН:', value: '1673002229' },
            { label: 'КПП:', value: '167301001' },
            { label: 'ОГРН:', value: '1221600054653' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.detailRowCopyable}
              onPress={() => copyToClipboard(item.label, item.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.detailLabel}>{item.label}</Text>
              <View style={styles.detailValueRow}>
                <Text style={styles.detailValue}>{item.value}</Text>
                <Ionicons name="copy-outline" size={18} color="#4CAF50" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.uploadCard}>
          {/* Заголовок с иконкой */}
          <View style={styles.uploadHeader}>
            <Ionicons name="camera-outline" size={20} color="#4CAF50" />
            <Text style={styles.uploadTitle}>Загрузить скриншот оплаты</Text>
          </View>

          {/* Описание */}
          <Text style={styles.uploadDescription}>
            Оплатите через приложение вашего банка и загрузите скриншот подтверждения
          </Text>

          {/* Кнопка выбора */}
          {!screenshot && (
            <TouchableOpacity
              style={[styles.selectButton, loading && styles.selectButtonDisabled]}
              onPress={() => {
                console.log('🔘 Кнопка "Выбрать скриншот" нажата');
                if (!loading) {
                  pickImage();
                } else {
                  console.log('⚠️ Кнопка заблокирована (loading=true)');
                }
              }}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={24} color={loading ? '#999' : '#4CAF50'} />
              <Text style={[styles.selectButtonText, loading && styles.selectButtonTextDisabled]}>
                {loading ? 'Загрузка...' : 'Выбрать скриншот'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Preview и отправка (только если выбрано изображение) */}
          {screenshot && (
            <View style={styles.previewContainer}>
              {/* Preview изображения */}
              <View style={styles.previewWrapper}>
                <Image source={{ uri: screenshot }} style={styles.previewImage} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setScreenshot(null)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close-circle" size={28} color="#D32F2F" />
                </TouchableOpacity>
              </View>

              {/* Кнопка отправки */}
              <TouchableOpacity
                style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="send-outline" size={20} color="#FFF" />
                    <Text style={styles.sendButtonText}>Отправить скриншот</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* СЕКЦИЯ АВТОПЛАТЕЖА */}
        <View style={styles.autopayCard}>
          {/* Заголовок с toggle */}
          <View style={styles.autopayHeader}>
            <View style={styles.autopayTitleRow}>
              <Ionicons name="card-outline" size={20} color="#4CAF50" />
              <Text style={styles.autopayTitle}>Автоплатеж</Text>
            </View>
            <Switch
              value={autoPayment.enabled}
              onValueChange={toggleAutoPayment}
              trackColor={{
                false: '#D0D0D0',
                true: '#81C784',
              }}
              thumbColor={
                Platform.OS === 'ios'
                  ? '#FFFFFF'
                  : autoPayment.enabled
                  ? '#4CAF50'
                  : '#F5F5F5'
              }
              ios_backgroundColor="#D0D0D0"
              style={Platform.OS === 'ios' ? styles.switchIOS : styles.switchAndroid}
            />
          </View>

          {/* Описание */}
          <Text style={styles.autopayDescription}>
            Автоматическое списание каждый месяц
          </Text>

          {/* Преимущества */}
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.benefitText}>Не забывайте оплачивать ЖКУ</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.benefitText}>Учтены в следующем начислении</Text>
            </View>
          </View>

          {/* Детали при включении */}
          {autoPayment.enabled && (
            <View style={styles.autopayDetails}>
              <View style={styles.detailsDivider} />
              <Text style={styles.detailsLabel}>Настройки автоплатежа</Text>

              {/* Выбор карты */}
              <Pressable
                style={({ pressed }) => [
                  styles.cardSelector,
                  pressed && styles.cardSelectorPressed,
                ]}
                onPress={selectCard}
              >
                <Ionicons name="card" size={20} color="#4CAF50" />
                <Text style={styles.cardSelectorText}>
                  {autoPayment.cardNumber ? `•••• ${autoPayment.cardNumber}` : 'Выберите карту'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>

              {/* Дата списания */}
              <View style={styles.daySelectorRow}>
                <Text style={styles.daySelectorLabel}>Дата списания:</Text>
                <Text style={styles.daySelectorValue}>{autoPayment.dayOfMonth} число</Text>
              </View>
            </View>
          )}
        </View>

        {/* Карточка истории платежей */}
        <View style={styles.historyCard}>
          {/* Заголовок с иконкой */}
          <View style={styles.historyHeader}>
            <Ionicons name="time-outline" size={20} color="#4CAF50" />
            <Text style={styles.historyTitle}>История платежей</Text>
          </View>

          {/* Список платежей */}
          {displayedPayments.map((payment, index) => {
            const statusConfig = getStatusConfig(payment.status);

            return (
              <React.Fragment key={payment.id}>
                <View style={styles.paymentRow}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentMonth}>{payment.month}</Text>
                    <View style={styles.statusRow}>
                      <Ionicons
                        name={statusConfig.icon as any}
                        size={18}
                        color={statusConfig.color}
                      />
                      <Text style={[styles.statusText, { color: statusConfig.color }]}>
                        {statusConfig.text}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.paymentAmount}>
                    {payment.amount.toLocaleString('ru-RU')} ₽
                  </Text>
                </View>

                {index < displayedPayments.length - 1 && (
                  <View style={styles.paymentDivider} />
                )}
              </React.Fragment>
            );
          })}

          {/* Кнопка "Показать все" */}
          {paymentHistory.length > 3 && (
            <Pressable
              style={styles.showAllButton}
              onPress={() => setShowAllPayments(!showAllPayments)}
            >
              <Text style={styles.showAllText}>
                {showAllPayments ? 'Скрыть' : 'Показать все'}
              </Text>
              <Ionicons
                name={showAllPayments ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#4CAF50"
              />
            </Pressable>
          )}
        </View>

        {/* Модальное окно выбора карты */}
        <Modal
          visible={showCardModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCardModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Заголовок модального окна */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Выберите карту</Text>
                <TouchableOpacity
                  onPress={() => setShowCardModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Разделитель */}
              <View style={styles.modalDivider} />

              {/* Список карт */}
              <ScrollView style={styles.cardsListContainer}>
                {availableCards.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    style={[
                      styles.cardItem,
                      autoPayment.cardNumber === card.last4 && styles.cardItemSelected,
                    ]}
                    onPress={() => handleCardSelect(card)}
                  >
                    <View style={styles.cardItemLeft}>
                      <Ionicons
                        name="card"
                        size={24}
                        color={autoPayment.cardNumber === card.last4 ? '#4CAF50' : '#666'}
                      />
                      <View style={styles.cardItemInfo}>
                        <Text style={styles.cardNumber}>•••• {card.last4}</Text>
                        <Text style={styles.cardBank}>{card.bank}</Text>
                      </View>
                    </View>

                    <View style={styles.cardItemRight}>
                      <Text style={styles.cardType}>{card.type}</Text>
                      {autoPayment.cardNumber === card.last4 && (
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Кнопка добавить карту */}
                <TouchableOpacity
                  style={styles.addCardButton}
                  onPress={() => {
                    setShowCardModal(false);
                    Toast.show({
                      type: 'info',
                      text1: 'Добавление карты',
                      text2: 'Функция в разработке',
                      position: 'bottom',
                    });
                  }}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
                  <Text style={styles.addCardText}>Добавить новую карту</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  requisite: {
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
  },
  uploadCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    height: 48,
    backgroundColor: '#FFF',
    gap: 8,
  },
  selectButtonDisabled: {
    borderColor: '#999',
    opacity: 0.6,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  selectButtonTextDisabled: {
    color: '#999',
  },
  previewContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  previewWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    height: 48,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  removeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  // Стили истории платежей
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  showAllText: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 4,
  },
  // Старые стили для совместимости
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyMonth: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  historyStatus: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  historyAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4CAF50',
  },
  autopayCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  autopayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  autopayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  autopayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  autopayDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  benefitsList: {
    marginTop: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  autopayDetails: {
    marginTop: 16,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  cardSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  cardSelectorPressed: {
    backgroundColor: '#E8E8E8',
    opacity: 0.8,
  },
  switchIOS: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  switchAndroid: {
    // Стандартный размер для Android
  },
  // Стили модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  cardsListContainer: {
    maxHeight: 400,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardItemSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  cardItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardItemInfo: {
    marginLeft: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  cardBank: {
    fontSize: 14,
    color: '#666',
  },
  cardItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  cardSelectorText: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
    fontWeight: '500',
  },
  daySelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
  },
  daySelectorLabel: {
    fontSize: 15,
    color: '#666',
  },
  daySelectorValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  autoPaymentSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  autoPaymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoPaymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  autoPaymentSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  autoPaymentDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  nextPaymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 12,
  },
  nextPaymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  autoPaymentDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    lineHeight: 20,
  },
  // КАРТОЧКА ЗАДОЛЖЕННОСТИ
  debtCard: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  debtLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D32F2F',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  debtAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  debtAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginLeft: 8,
  },
  overdueText: {
    fontSize: 14,
    color: '#C62828',
    marginTop: 4,
    marginBottom: 16,
  },
  payNowButton: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  payNowText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // КАРТОЧКА БАЛАНСА
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
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
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 13,
    color: '#666',
  },
  // НАЧИСЛЕНИЯ
  chargesCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chargesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chargesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  chargesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  chargesAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  dueDateLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  dueDateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D32F2F',
    marginLeft: 6,
  },
  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chargeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  chargeAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  chargeDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f44336',
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  recipientRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  recipientValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginTop: 4,
  },
  detailRowCopyable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailValue: {
    fontSize: 15,
    color: '#212121',
    marginRight: 8,
    fontWeight: '500',
  },
});

