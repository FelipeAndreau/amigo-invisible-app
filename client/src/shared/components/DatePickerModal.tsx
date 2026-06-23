import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Theme } from '../theme';
import { Button } from './Button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';

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
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(18);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentMonth, currentYear]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentMonth, currentYear]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth + 1);
    setSelectedDate(newDate);
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
    setStep('time');
  };

  const handleConfirm = () => {
    const finalDate = new Date(selectedDate);
    finalDate.setHours(selectedHour, selectedMinute, 0, 0);
    onConfirm(finalDate);
    onClose();
    setStep('date');
  };

  const handleClose = () => {
    onClose();
    setStep('date');
  };

  const renderCalendar = () => {
    const days = [];
    const emptyDays = firstDayOfMonth;

    for (let i = 0; i < emptyDays; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate.getDate();
      const isToday = day === new Date().getDate() && 
                     currentMonth === new Date().getMonth() && 
                     currentYear === new Date().getFullYear();

      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.dayCell, isSelected && styles.dayCellSelected]}
          onPress={() => handleSelectDay(day)}
        >
          <Text style={[
            styles.dayText,
            isToday && styles.dayTextToday,
            isSelected && styles.dayTextSelected,
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const renderTimePicker = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    return (
      <View>
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Hora</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeRow}>
              {hours.map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.timeButton, selectedHour === h && styles.timeButtonSelected]}
                  onPress={() => setSelectedHour(h)}
                >
                  <Text style={[styles.timeButtonText, selectedHour === h && styles.timeButtonTextSelected]}>
                    {h.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Minutos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeRow}>
              {minutes.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.timeButton, selectedMinute === m && styles.timeButtonSelected]}
                  onPress={() => setSelectedMinute(m)}
                >
                  <Text style={[styles.timeButtonText, selectedMinute === m && styles.timeButtonTextSelected]}>
                    {m.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.selectedTimeDisplay}>
          <Text style={styles.selectedTimeText}>
            {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={24} color={Theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.placeholder} />
          </View>

          {step === 'date' ? (
            <View>
              <View style={styles.monthNavigator}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                  <ChevronLeft size={24} color={Theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.monthText}>
                  {monthNames[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                  <ChevronRight size={24} color={Theme.colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.dayNamesRow}>
                {dayNames.map(day => (
                  <Text key={day} style={styles.dayNameText}>{day}</Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {renderCalendar()}
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.stepHeader}>
                <TouchableOpacity onPress={() => setStep('date')} style={styles.backButton}>
                  <ChevronLeft size={20} color={Theme.colors.primary} />
                  <Text style={styles.backButtonText}>Volver al calendario</Text>
                </TouchableOpacity>
                <Text style={styles.selectedDateText}>
                  {selectedDate.getDate()} de {monthNames[currentMonth]}
                </Text>
              </View>

              {renderTimePicker()}

              <View style={styles.footer}>
                <Button
                  title="Confirmar fecha"
                  onPress={handleConfirm}
                />
              </View>
            </View>
          )}
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
    maxHeight: '85%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayNameText: {
    fontSize: 12,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.gray,
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayCellSelected: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.text,
  },
  dayTextToday: {
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.cta,
  },
  dayTextSelected: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.heading,
  },
  stepHeader: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.primary,
  },
  selectedDateText: {
    fontSize: 18,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.text,
    textAlign: 'center',
  },
  timeSection: {
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.gray,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeButtonSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  timeButtonText: {
    fontSize: 14,
    fontFamily: Theme.fonts.body,
    color: Theme.colors.text,
  },
  timeButtonTextSelected: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.heading,
  },
  selectedTimeDisplay: {
    alignItems: 'center',
    marginVertical: 20,
  },
  selectedTimeText: {
    fontSize: 32,
    fontFamily: Theme.fonts.heading,
    color: Theme.colors.primary,
  },
  footer: {
    marginTop: 20,
  },
});