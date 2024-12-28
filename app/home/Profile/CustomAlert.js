import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from "@expo/vector-icons";

const CustomAlert = ({ visible, onClose, type = 'success', title, message }) => {
  const alertStyles = {
    success: {
      icon: 'checkcircle',
      iconColor: '#4ADE80',
      bgColor: '#0F172A',  // Darker background
      borderColor: '#10B981',
      titleColor: '#D1FAE5',
    },
    error: {
      icon: 'closecircle',
      iconColor: '#F87171',
      bgColor: '#0F172A',  // Darker background
      borderColor: '#EF4444',
      titleColor: '#FEE2E2',
    },
    warning: {
      icon: 'warning',
      iconColor: '#FBBF24',
      bgColor: '#0F172A',  // Darker background
      borderColor: '#F59E0B',
      titleColor: '#FEF3C7',
    },
    info: {
      icon: 'infocircle',
      iconColor: '#60A5FA',
      bgColor: '#0F172A',  // Darker background
      borderColor: '#3B82F6',
      titleColor: '#DBEAFE',
    },
  };

  const currentStyle = alertStyles[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.alertContainer,
          {
            backgroundColor: currentStyle.bgColor,
            borderColor: currentStyle.borderColor,
          }
        ]}>
          <View style={styles.iconContainer}>
            <AntDesign
              name={currentStyle.icon}
              size={48}
              color={currentStyle.iconColor}
            />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={[
              styles.title,
              { color: currentStyle.titleColor }
            ]}>
              {title}
            </Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: currentStyle.borderColor }
            ]}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 2,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#94A3B8', // Slate-300 for better readability
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#0F172A', // Dark text for contrast on colored buttons
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;