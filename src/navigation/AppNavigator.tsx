import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { ReceiptScreen } from '../screens/ReceiptScreen';
import { MetersScreen } from '../screens/MetersScreen';
import { RequestsScreen } from '../screens/RequestsScreen';
import { CreateRequestScreen } from '../screens/CreateRequestScreen';
import { CamerasScreen } from '../screens/CamerasScreen';
import { BarrierScreen } from '../screens/BarrierScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { StorageScreen } from '../screens/StorageScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import CameraScreen from '../screens/CameraScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Главная',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="Receipt" component={ReceiptScreen} />
        <Stack.Screen name="Meters" component={MetersScreen} />
        <Stack.Screen name="Requests" component={RequestsScreen} />
        <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
        <Stack.Screen name="Cameras" component={CamerasScreen} />
        <Stack.Screen name="Barrier" component={BarrierScreen} />
        <Stack.Screen name="Storage" component={StorageScreen} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="Documents" component={DocumentsScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

