// CustomAlert.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from "@expo/vector-icons";

const CustomAlert = ({ visible, onClose, type = 'success', title, message }) => {
  const alertStyles = {
    success: {
      icon: 'checkcircle',
      iconColor: '#4ADE80',
      bgColor: '#064E3B',
      borderColor: '#10B981',
      titleColor: '#D1FAE5',
    },
    error: {
      icon: 'closecircle',
      iconColor: '#F87171',
      bgColor: '#7F1D1D',
      borderColor: '#EF4444',
      titleColor: '#FEE2E2',
    },
    warning: {
      icon: 'warning',
      iconColor: '#FBBF24',
      bgColor: '#78350F',
      borderColor: '#F59E0B',
      titleColor: '#FEF3C7',
    },
    info: {
      icon: 'infocircle',
      iconColor: '#60A5FA',
      bgColor: '#1E3A8A',
      borderColor: '#3B82F6',
      titleColor: '#DBEAFE',
    },
  };

  const currentStyle = alertStyles[type];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.alertContainer,
          { backgroundColor: currentStyle.bgColor, borderColor: currentStyle.borderColor }
        ]}>
          <View style={styles.iconContainer}>
            <AntDesign
              name={currentStyle.icon}
              size={32}
              color={currentStyle.iconColor}
            />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={[styles.title, { color: currentStyle.titleColor }]}>
              {title}
            </Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentStyle.borderColor }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#E5E7EB', // Light gray text for message
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#1F2937', // Darker text for contrast on button
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;
