import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Picker, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import styles from './styles';

const monthList = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
// const monthsWith31Days = ['1', '3', '5', '7', '8', '10', '12'];
// const monthsWith30Days = ['4', '6', '9', '11'];

class DatePicker extends Component {
  constructor(props) {
    super(props);
    const {selectedHour, selectedMinute, selectedDay, selectedMonth, selectedYear} = props;
    this.state = {
      selectedHour,
      selectedMinute,
      selectedDay,
      selectedMonth,
      selectedYear,
    };
  }

  selectedMonthHaveDay = (day) => {
    //every month have at least 28 days
    if (day <= 28) {
      return true;
    } else {
      //handle case for day 28,29,30,31
      const {selectedMonth, selectedYear} = this.state;
      return this.isValid(day, parseInt(selectedMonth), parseInt(selectedYear));
    }
  };
  daysInMonth = (m, y) => { // m is 0 indexed: 0-11
    switch (m) {
      case 1 :
        return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
      case 8 :
      case 3 :
      case 5 :
      case 10 :
        return 30;
      default :
        return 31;
    }
  };

  isValid = (d, m, y) => {
    return m >= 0 && m < 12 && d > 0 && d <= this.daysInMonth(m, y);
  };
  getYearItems = () => {
    const items = [];
    const {minYear, maxYear, yearInterval, yearUnit} = this.props;
    const interval = maxYear / yearInterval;
    for (let i = 1; i <= interval; i++) {
      const value = `${i * yearInterval}`;
      const item = (
          <Picker.Item key={value} value={value}
                       label={value + yearUnit}/>
      );
      items.push(item);
    }
    return items;
  };
  getMonthItems = () => {
    const items = [];
    const {maxMonth, monthInterval, monthUnit} = this.props;
    const interval = maxMonth / monthInterval;
    for (let i = 0; i < interval; i++) {
      const value = i * monthInterval;
      const label = monthList[value];
      const item = (
          <Picker.Item key={label} value={i.toString()}
                       label={label + monthUnit}/>
      );
      items.push(item);
    }
    return items;
  };
  getDayItems = () => {
    const items = [];
    const {maxDay, dayInterval, dayUnit} = this.props;
    const interval = maxDay / dayInterval;
    for (let i = 1; i <= interval; i++) {
      if (this.selectedMonthHaveDay(i)) {
        const value = `${i * dayInterval}`;
        const item = (
            <Picker.Item key={value} value={value}
                         label={value + dayUnit}/>
        );
        items.push(item);
      }
    }
    return items;
  };

  onValueChange = (selectedDay, selectedMonth, selectedYear) => {
    let items = [];
    this.setState({selectedDay, selectedMonth, selectedYear});
  };

  onCancel = () => {
    if (typeof this.props.onCancel === 'function') {
      const {selectedHour, selectedMinute} = this.state;
      this.props.onCancel(selectedHour, selectedMinute);
    }
  };

  onConfirm = () => {
    if (typeof this.props.onConfirm === 'function') {
      const {selectedHour, selectedMinute} = this.state;
      this.props.onConfirm(selectedHour, selectedMinute);
    }
  };

  close = () => {
    this.RBSheet.close();
  };

  open = () => {
    this.RBSheet.open();
  };

  renderHeader = () => {
    const {textCancel, textConfirm, textTitle} = this.props;
    return (
        <View style={styles.header}>
          <TouchableOpacity onPress={this.onCancel} style={styles.buttonAction}>
            <Text style={[styles.buttonText]}>
              {textCancel}
            </Text>
          </TouchableOpacity>
          {textTitle &&
          <View style={styles.buttonAction}>
            <Text style={[
              styles.buttonText,
              {color: 'black', fontWeight: '500'}]}>{textTitle}</Text>
          </View>}
          <TouchableOpacity onPress={this.onConfirm}
                            style={styles.buttonAction}>
            <Text style={styles.buttonText}>{textConfirm}</Text>
          </TouchableOpacity>
        </View>
    );
  };

  renderBody = () => {
    const {selectedDay, selectedMonth, selectedYear} = this.state;

    return (
        <View style={styles.body}>
          <Picker
              selectedValue={selectedDay}
              style={styles.picker}
              itemStyle={this.props.itemStyle}
              onValueChange={itemValue =>
                  this.onValueChange(itemValue, selectedMonth, selectedYear)
              }
          >
            {this.getDayItems()}
          </Picker>
          <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              itemStyle={this.props.itemStyle}
              onValueChange={itemValue =>
                  this.onValueChange(selectedDay, itemValue, selectedYear)
              }
          >
            {this.getMonthItems()}
          </Picker>
          <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              itemStyle={this.props.itemStyle}
              onValueChange={itemValue =>
                  this.onValueChange(selectedDay, selectedMonth, itemValue)
              }
          >
            {this.getYearItems()}
          </Picker>
        </View>
    );
  };

  render() {
    return (
        <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
        >
          {this.renderHeader()}
          {this.renderBody()}
        </RBSheet>
    );
  }
}

DatePicker.propTypes = {
  minYear: PropTypes.number,
  maxDay: PropTypes.number,
  maxHour: PropTypes.number,
  maxMonth: PropTypes.number,
  maxMinute: PropTypes.number,
  maxYear: PropTypes.number,
  hourInterval: PropTypes.number,
  minuteInterval: PropTypes.number,
  dayInterval: PropTypes.number,
  monthInterval: PropTypes.number,
  hourUnit: PropTypes.string,
  minuteUnit: PropTypes.string,
  dayUnit: PropTypes.string,
  monthUnit: PropTypes.string,
  selectedHour: PropTypes.string,
  selectedMinute: PropTypes.string,
  selectedDay: PropTypes.string,
  selectedYear: PropTypes.string,
  itemStyle: PropTypes.object,
  textCancel: PropTypes.string,
  textConfirm: PropTypes.string,
  textTitle: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

DatePicker.defaultProps = {
  minYear: 1,
  maxDay: 31,
  maxHour: 23,
  maxMinute: 59,
  maxMonth: 12,
  maxYear: 9999,
  monthList: monthList,
  hourInterval: 1,
  minuteInterval: 1,
  monthInterval: 1,
  yearInterval: 1,
  dayInterval: 1,
  hourUnit: '',
  minuteUnit: '',
  dayUnit: '',
  monthUnit: '',
  yearUnit: '',
  selectedHour: '0',
  selectedMinute: '00',
  selectedDay: '1',
  selectedMonth: '1',
  selectedYear: '2000',
  itemStyle: {},
  textCancel: 'Cancel',
  textConfirm: ' Done ',
  textTitle: null,
};

export default DatePicker;
