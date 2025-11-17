import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendVerificationCode, verifyCode } from '../services/smsService';
import { isPhoneRegistered, getUserByPhone } from '../data/userBindings';

export const AuthScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sentCode, setSentCode] = useState(''); // Для демо-режима

  // Форматирование номера телефона
  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 1) return '+7';
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    if (cleaned.length <= 9)
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  };

  // Шаг 1: Отправка SMS
  const handleSendSMS = async () => {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 11) {
      Alert.alert('Ошибка', 'Введите корректный номер телефона');
      return;
    }

    // Проверка регистрации
    const phoneForCheck = `+${cleanPhone}`;
    if (!isPhoneRegistered(phoneForCheck)) {
      Alert.alert(
        '❌ Номер не найден',
        'Этот номер телефона не зарегистрирован в базе УК.\n\n' +
          'Для регистрации позвоните диспетчеру:',
        [
          {
            text: '📞 Позвонить',
            onPress: () => Linking.openURL('tel:+79600720321'),
          },
          { text: 'Отмена', style: 'cancel' },
        ]
      );
      return;
    }

    setLoading(true);
    const result = await sendVerificationCode(phoneForCheck);
    setLoading(false);

    if (result.status === 'OK') {
      setStep('code');
      setCountdown(60);
      setSentCode(result.code || ''); // Для демо-режима

      // Таймер обратного отсчёта
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Показать код в демо-режиме
      if (result.code) {
        Alert.alert(
          '📱 SMS отправлена (ДЕМО)',
          `Ваш код: ${result.code}\n\n` + `(В реальном приложении код придёт в SMS)`,
          [{ text: 'ОК' }]
        );
      }
    } else {
      Alert.alert('Ошибка', result.message || 'Не удалось отправить SMS');
    }
  };

  // Шаг 2: Проверка кода
  const handleVerifyCode = async () => {
    if (smsCode.length !== 4) {
      Alert.alert('Ошибка', 'Введите 4-значный код');
      return;
    }

    setLoading(true);
    const cleanPhone = `+${phone.replace(/\D/g, '')}`;
    const isValid = await verifyCode(cleanPhone, smsCode);
    setLoading(false);

    if (isValid) {
      // Сохранить авторизацию
      await AsyncStorage.setItem('userPhone', cleanPhone);
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // Проверить долги
      const checkDebtStatus = async (userPhone: string) => {
        const isDebtor = userPhone.endsWith('21');
        return {
          hasDebt: isDebtor,
          debtAmount: isDebtor ? 12450.5 : 0,
          debtMonths: isDebtor ? 2 : 0,
        };
      };

      const debtStatus = await checkDebtStatus(cleanPhone);
      await AsyncStorage.setItem('debtStatus', JSON.stringify(debtStatus));

      if (debtStatus.hasDebt) {
        Alert.alert(
          '⚠️ Задолженность',
          `У вас имеется задолженность:\n\n` +
            `Сумма: ${debtStatus.debtAmount.toFixed(2)} ₽\n` +
            `Просрочка: ${debtStatus.debtMonths} мес.\n\n` +
            `Пожалуйста, погасите задолженность в разделе "Оплата"`,
          [
            {
              text: 'Погасить сейчас',
              onPress: () => navigation.replace('MainTabs'),
            },
            {
              text: 'Позже',
              style: 'cancel',
              onPress: () => navigation.replace('MainTabs'),
            },
          ]
        );
      } else {
        navigation.replace('MainTabs');
      }
    } else {
      Alert.alert('Ошибка', 'Неверный код. Попробуйте ещё раз.');
      setSmsCode('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* ЛОГОТИП */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🏠</Text>
          </View>
          <Text style={styles.title}>УК Зелёная Долина</Text>
          <Text style={styles.subtitle}>Мобильное приложение для жильцов</Text>
        </View>

        {/* ФОРМА */}
        <View style={styles.formContainer}>
          {step === 'phone' ? (
            <>
              <Text style={styles.label}>Номер телефона</Text>
              <Text style={styles.description}>Введите номер, зарегистрированный в УК</Text>

              <TextInput
                style={styles.input}
                placeholder="+7 (___) ___-__-__"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => setPhone(formatPhone(text))}
                maxLength={18}
                autoFocus
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendSMS}
                disabled={loading || phone.length < 18}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Получить код</Text>
                )}
              </TouchableOpacity>

              <View style={styles.helpBox}>
                <Ionicons name="information-circle-outline" size={20} color="#4CAF50" />
                <Text style={styles.helpText}>
                  Если вашего номера нет в базе,{'\n'}позвоните диспетчеру:{' '}
                  <Text
                    style={styles.phoneLink}
                    onPress={() => Linking.openURL('tel:+79600720321')}
                  >
                    8 960 072 03 21
                  </Text>
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Код из SMS</Text>
              <Text style={styles.description}>
                Введите код, отправленный на номер:{'\n'}
                <Text style={styles.phoneHighlight}>{phone}</Text>
              </Text>

              <TextInput
                style={styles.codeInput}
                placeholder="____"
                keyboardType="number-pad"
                value={smsCode}
                onChangeText={setSmsCode}
                maxLength={4}
                autoFocus
                textAlign="center"
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyCode}
                disabled={loading || smsCode.length !== 4}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Войти</Text>
                )}
              </TouchableOpacity>

              {countdown > 0 ? (
                <Text style={styles.countdown}>Повторная отправка через {countdown} сек</Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setStep('phone');
                    setSmsCode('');
                  }}
                >
                  <Text style={styles.resendLink}>Отправить код повторно</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  setStep('phone');
                  setSmsCode('');
                }}
              >
                <Text style={styles.backLink}>← Изменить номер телефона</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  phoneHighlight: {
    fontWeight: '600',
    color: '#4CAF50',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  codeInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    fontSize: 32,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    letterSpacing: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  phoneLink: {
    color: '#4CAF50',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  countdown: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
  },
  resendLink: {
    textAlign: 'center',
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '600',
  },
  backLink: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
});
