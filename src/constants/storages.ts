import { Storage } from '../types/storage';

// 33 кладовых для ЖК "Зелёная Долина"
export const MOCK_STORAGES: Storage[] = [
  { id: '1', number: 'К-1', apartment: '12', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '2', number: 'К-2', apartment: '15', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '3', number: 'К-3', apartment: '18', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '4', number: 'К-4', apartment: '21', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '5', number: 'К-5', apartment: '24', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '6', number: 'К-6', apartment: '27', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '7', number: 'К-7', apartment: '30', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '8', number: 'К-8', apartment: '33', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '9', number: 'К-9', apartment: '36', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '10', number: 'К-10', apartment: '39', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '11', number: 'К-11', apartment: '42', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '12', number: 'К-12', apartment: '45', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А', owner: 'Иванов Иван Иванович' },
  { id: '13', number: 'К-13', apartment: '48', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '14', number: 'К-14', apartment: '51', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '15', number: 'К-15', apartment: '54', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '16', number: 'К-16', apartment: '57', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '17', number: 'К-17', apartment: '60', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция А' },
  { id: '18', number: 'К-18', apartment: '63', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '19', number: 'К-19', apartment: '66', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '20', number: 'К-20', apartment: '69', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '21', number: 'К-21', apartment: '72', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '22', number: 'К-22', apartment: '75', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '23', number: 'К-23', apartment: '78', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '24', number: 'К-24', apartment: '81', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '25', number: 'К-25', apartment: '84', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '26', number: 'К-26', apartment: '87', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '27', number: 'К-27', apartment: '90', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '28', number: 'К-28', apartment: '93', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '29', number: 'К-29', apartment: '96', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '30', number: 'К-30', apartment: '99', area: 3.5, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция Б' },
  { id: '31', number: 'ПОМ.№4', apartment: '102', area: 4.2, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция В' },
  { id: '32', number: 'ПОМ.№5', apartment: '105', area: 4.2, floor: -1, building: '4А', status: 'занята', location: 'Подвал, секция В' },
  { id: '33', number: 'ПОМ.№6', apartment: '108', area: 4.2, floor: -1, building: '4А', status: 'свободна', location: 'Подвал, секция В' },
];

// Получить кладовые по номеру квартиры
export const getStoragesByApartment = (apartment: string): Storage[] => {
  return MOCK_STORAGES.filter((s) => s.apartment === apartment);
};

// Получить кладовую по номеру
export const getStorageByNumber = (number: string): Storage | undefined => {
  return MOCK_STORAGES.find((s) => s.number === number);
};

