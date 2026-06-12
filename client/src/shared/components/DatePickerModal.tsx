import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Theme } from '../theme';
import { Button } from './Button';
import { X } from 'lucide-react-native';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  title?: string;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = 'Seleccionar fecha',
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState({ hours: 18, minutes: 0 });

  const handleConfirm = () => {
    const date = new Date(selectedDate);
    date.setHours(selectedTime.hours, selectedTime.minutes, 0, 0);
    onConfirm(date);
    onClose();
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const renderPicker = (items: (string | number)[], selected: number, onSelect: (index: number) => void) => (
    <View style={styles.pickerContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.pickerItem,
            selected === index && styles.pickerItemSelected,
          ]}
          onPress={() => onSelect(index)}
        >
          <Text style={[
            styles.pickerItemText,
            selected === index && styles.pickerItemTextSelected,
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.pickersRow}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Día</Text>
              {renderPicker(days, selectedDate.getDate() - 1, (index) => {
                const newDate = new Date(selectedDate);
                newDate.setDate(days[index]);
                setSelectedDate(newDate);
              })}
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Mes</Text>
              {renderPicker(months, selectedDate.getMonth(), (index) => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(index);
                setSelectedDate(newDate);
              })}
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Año</Text>
              {renderPicker(years, years.indexOf(selectedDate.getFullYear()), (index) => {
                const newDate = new Date(selectedDate);
                newDate.setFullYear(years[index]);
                setSelectedDate(newDate);
              })}
            </View>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hora</Text>
              {renderPicker(hours, selectedTime.hours, (index) => {
                setSelectedTime(prev => ({ ...prev, hours: hours[index] }));
              })}
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Min</Text>
              {renderPicker(minutes, minutes.indexOf(selectedTime.minutes), (index) => {
                setSelectedTime(prev => ({ ...prev, minutes: minutes[index] }));
              })}
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Confirmar"
              onPress={handleConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  pickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontFamily: Theme.fonts.heading,
    fontSize: 12,
    color: Theme.colors.gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerContainer: {
    maxHeight: 200,
  },
  pickerItem: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: Theme.colors.primary,
  },
  pickerItemText: {
    fontFamily: Theme.fonts.body,
    fontSize: 14,
    color: Theme.colors.text,
  },
  pickerItemTextSelected: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.heading,
  },
  footer: {
    marginTop: 10,
  },
});