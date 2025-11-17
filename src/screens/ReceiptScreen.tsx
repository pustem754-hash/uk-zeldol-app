import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { MOCK_RECEIPT } from '../constants/mockData';
import { Receipt, UtilityService } from '../types';
import { Storage } from '../utils/storage';

export const ReceiptScreen = ({ navigation }: any) => {
  const [receipt, setReceipt] = useState<Receipt>(MOCK_RECEIPT);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userData = await Storage.getUser();
    setUser(userData);
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const formatDate = (dateStr: string) => {
    return dateStr;
  };

  const getServicesByCategory = (category: string) => {
    return receipt.services.filter((s) => s.category === category);
  };

  const renderServiceRow = (service: UtilityService) => {
    return (
      <View key={service.id} style={[styles.serviceRow, service.isSubService && styles.subServiceRow]}>
        <View style={styles.serviceNameCol}>
          <Text style={[styles.serviceName, service.isSubService && styles.subServiceName]}>
            {service.name}
          </Text>
          {!service.isSubService && (
            <Text style={styles.serviceTariff}>
              {formatAmount(service.tariff)} ₽ / {service.unit}
            </Text>
          )}
        </View>
        <Text style={styles.serviceVolume}>{service.volume} {service.unit}</Text>
        <Text style={styles.serviceAmount}>{formatAmount(service.amount)} ₽</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Квитанция ЖКХ" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Шапка квитанции */}
        <View style={[styles.card, styles.headerCard]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.deliveryLabel}>Адрес доставки:</Text>
              <Text style={styles.deliveryAddress}>{receipt.deliveryAddress}</Text>
              <Text style={styles.billLabel}>Квитанция за {receipt.month}</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.accountLabel}>Лицевой счёт №</Text>
              <Text style={styles.accountNumber}>{receipt.accountNumber}</Text>
            </View>
          </View>
          <View style={styles.deadlines}>
            <Text style={styles.deadlineText}>
              Передать показания до: <Text style={styles.deadlineDate}>{receipt.meterReadingsDeadline}</Text>
            </Text>
            <Text style={styles.deadlineText}>
              Оплатить до: <Text style={styles.deadlineDate}>{receipt.paymentDeadline}</Text>
            </Text>
          </View>
        </View>

        {/* Информация о плательщике */}
        <View style={[styles.card, styles.infoCard]}>
          <Text style={styles.ownerName}>{user?.fullName || 'Сидоров Пётр Николаевич'}</Text>
          <Text style={styles.propertyAddress}>
            {user?.address || 'г. Зеленодольск, ул. Шустова, д. 4А, кв. 87'}
          </Text>
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyInfoText}>Площадь: {receipt.propertyArea} м²</Text>
            <Text style={styles.propertyInfoText}>Жильцов: {receipt.residentsCount}</Text>
          </View>
          <View style={styles.managementCompany}>
            <Text style={styles.mcLabel}>Управляющая организация:</Text>
            <Text style={styles.mcName}>{receipt.managementCompany.name}</Text>
            <Text style={styles.mcAddress}>{receipt.managementCompany.address}</Text>
            <Text style={styles.mcPhone}>📞 {receipt.managementCompany.phone}</Text>
          </View>
        </View>

        {/* QR код (заглушка) */}
        <View style={[styles.card, styles.qrCard]}>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrText}>QR</Text>
            <Text style={styles.qrLabel}>Код для оплаты</Text>
          </View>
        </View>

        {/* Коммунальные услуги */}
        <View style={[styles.card, styles.servicesCard]}>
          <Text style={styles.sectionTitle}>Коммунальные услуги</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colService]}>Услуга</Text>
            <Text style={[styles.tableHeaderCell, styles.colVolume]}>Объём</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Сумма</Text>
          </View>
          {getServicesByCategory('коммунальные').map(renderServiceRow)}
          <View style={styles.categoryTotal}>
            <Text style={styles.categoryTotalLabel}>Итого по коммунальным услугам:</Text>
            <Text style={styles.categoryTotalAmount}>{formatAmount(receipt.communalServicesTotal)} ₽</Text>
          </View>
        </View>

        {/* Содержание помещения */}
        <View style={[styles.card, styles.servicesCard]}>
          <Text style={styles.sectionTitle}>Содержание жилого помещения</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colService]}>Услуга</Text>
            <Text style={[styles.tableHeaderCell, styles.colVolume]}>Объём</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Сумма</Text>
          </View>
          {getServicesByCategory('содержание').map(renderServiceRow)}
          <View style={styles.categoryTotal}>
            <Text style={styles.categoryTotalLabel}>Итого за содержание помещения:</Text>
            <Text style={styles.categoryTotalAmount}>{formatAmount(receipt.housingMaintenanceTotal)} ₽</Text>
          </View>
        </View>

        {/* Домофон */}
        {getServicesByCategory('домофон').length > 0 && (
          <View style={[styles.card, styles.servicesCard]}>
            <View style={styles.singleServiceRow}>
              <Text style={styles.serviceName}>{getServicesByCategory('домофон')[0].name}</Text>
              <Text style={styles.serviceAmount}>{formatAmount(receipt.intercomAmount)} ₽</Text>
            </View>
          </View>
        )}

        {/* Капитальный ремонт */}
        {getServicesByCategory('капремонт').length > 0 && (
          <View style={[styles.card, styles.servicesCard]}>
            <View style={styles.singleServiceRow}>
              <Text style={styles.serviceName}>{getServicesByCategory('капремонт')[0].name}</Text>
              <Text style={styles.serviceAmount}>{formatAmount(receipt.capitalRepairAmount)} ₽</Text>
            </View>
          </View>
        )}

        {/* Показания счётчиков */}
        <View style={[styles.card, styles.metersCard]}>
          <Text style={styles.sectionTitle}>Показания индивидуальных приборов учёта</Text>
          {receipt.meterReadings.map((meter) => (
            <View key={meter.id} style={styles.meterRow}>
              <View style={styles.meterInfo}>
                <Text style={styles.meterType}>{meter.type}</Text>
                <Text style={styles.meterSerial}>№ {meter.serialNumber}</Text>
                <Text style={styles.meterVerification}>
                  Поверка: {formatDate(meter.lastVerificationDate)}
                </Text>
              </View>
              <View style={styles.meterReadings}>
                <View style={styles.readingRow}>
                  <Text style={styles.readingLabel}>Предыдущие:</Text>
                  <Text style={styles.readingValue}>
                    {meter.previousReading} ({formatDate(meter.previousReadingDate)})
                  </Text>
                </View>
                <View style={styles.readingRow}>
                  <Text style={styles.readingLabel}>Текущие:</Text>
                  <Text style={[styles.readingValue, styles.currentReading]}>
                    {meter.currentReading} ({formatDate(meter.currentReadingDate)})
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Льготы */}
        {receipt.benefits.length > 0 && receipt.benefits.some((b) => b.amount > 0) && (
          <View style={[styles.card, styles.benefitsCard]}>
            <Text style={styles.sectionTitle}>Льготы</Text>
            {receipt.benefits.map((benefit, index) => (
              benefit.amount > 0 && (
                <View key={index} style={styles.benefitRow}>
                  <Text style={styles.benefitType}>{benefit.type}:</Text>
                  <Text style={styles.benefitAmount}>-{formatAmount(benefit.amount)} ₽</Text>
                </View>
              )
            ))}
            <View style={styles.benefitTotal}>
              <Text style={styles.benefitTotalLabel}>Всего льгот:</Text>
              <Text style={styles.benefitTotalAmount}>
                -{formatAmount(receipt.benefits.reduce((sum, b) => sum + b.amount, 0))} ₽
              </Text>
            </View>
          </View>
        )}

        {/* Итого */}
        <View style={[styles.card, styles.totalCard]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>ВСЕГО К ОПЛАТЕ:</Text>
            <Text style={styles.totalAmount}>{formatAmount(receipt.totalAmount)} ₽</Text>
          </View>
          {receipt.debt > 0 && (
            <View style={styles.debtRow}>
              <Text style={styles.debtLabel}>⚠️ Задолженность:</Text>
              <Text style={styles.debtAmount}>{formatAmount(receipt.debt)} ₽</Text>
            </View>
          )}
        </View>

        {/* Реквизиты */}
        <View style={[styles.card, styles.paymentCard]}>
          <Text style={styles.sectionTitle}>Реквизиты для оплаты</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Получатель:</Text>
            <Text style={styles.paymentValue}>{receipt.managementCompany.name}</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>ИНН:</Text>
            <Text style={styles.paymentValue}>1673002229</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>КПП:</Text>
            <Text style={styles.paymentValue}>167301001</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Адрес:</Text>
            <Text style={styles.paymentValue}>{receipt.managementCompany.address}</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Телефон:</Text>
            <Text style={styles.paymentValue}>{receipt.managementCompany.phone}</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Лицевой счёт:</Text>
            <Text style={styles.paymentValue}>{receipt.accountNumber}</Text>
          </View>
          <Text style={styles.paymentNote}>
            💳 Оплатите через приложение банка или раздел "Платежи"
          </Text>
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
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  deliveryLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  accountLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  deadlines: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deadlineText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  deadlineDate: {
    fontWeight: '600',
    color: '#f44336',
  },
  infoCard: {
    backgroundColor: '#fff',
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  propertyInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  propertyInfoText: {
    fontSize: 13,
    color: '#666',
  },
  managementCompany: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  mcLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  mcName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mcAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  mcPhone: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  qrCard: {
    alignItems: 'center',
    padding: 20,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 48,
    color: '#999',
  },
  qrLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  servicesCard: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  colService: {
    flex: 3,
  },
  colVolume: {
    flex: 1.5,
    textAlign: 'center',
  },
  colAmount: {
    flex: 1.5,
    textAlign: 'right',
  },
  serviceRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subServiceRow: {
    paddingLeft: 20,
    backgroundColor: '#fafafa',
  },
  serviceNameCol: {
    flex: 3,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subServiceName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
  },
  serviceTariff: {
    fontSize: 11,
    color: '#999',
  },
  serviceVolume: {
    flex: 1.5,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  serviceAmount: {
    flex: 1.5,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  categoryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
  },
  categoryTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  categoryTotalAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  singleServiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metersCard: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  meterRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  meterInfo: {
    flex: 1,
    marginRight: 12,
  },
  meterType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  meterSerial: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  meterVerification: {
    fontSize: 11,
    color: '#999',
  },
  meterReadings: {
    flex: 1,
  },
  readingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  readingLabel: {
    fontSize: 12,
    color: '#666',
  },
  readingValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  currentReading: {
    color: '#4CAF50',
  },
  benefitsCard: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  benefitType: {
    fontSize: 13,
    color: '#666',
  },
  benefitAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  benefitTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  benefitTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  benefitTotalAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  totalCard: {
    backgroundColor: '#E8F5E9',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  debtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  debtLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f44336',
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f44336',
  },
  paymentCard: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 20,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  paymentLabel: {
    fontSize: 13,
    color: '#666',
  },
  paymentValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  paymentNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
