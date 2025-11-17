import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
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
});

