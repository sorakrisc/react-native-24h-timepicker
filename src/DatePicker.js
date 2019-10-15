import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker, Text, TouchableOpacity, View } from 'react-native';
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
  'December'
];

class DatePicker extends Component {
  constructor (props) {
    super(props);
    const { selectedHour, selectedMinute } = props;
    this.state = { selectedHour, selectedMinute };
  }

  getYearItems = () => {
    const items = [];
    const { minYear, maxYear, yearInterval, yearUnit } = this.props;
    const interval = maxYear / yearInterval;
    for (let i = 1; i <= interval; i++) {
      const value = yearList[i - 1 * yearInterval];
      console.log('value', value);
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
    const { maxMonth, monthInterval, monthUnit } = this.props;
    const interval = maxMonth / monthInterval;
    for (let i = 1; i <= interval; i++) {
      const value = monthList[i - 1 * monthInterval];
      console.log('value', value);
      const item = (
          <Picker.Item key={value} value={value}
                       label={value + monthUnit}/>
      );
      items.push(item);
    }
    return items;
  };
  getDayItems = () => {
    const items = [];
    const { maxDay, dayInterval, dayUnit } = this.props;
    const interval = maxDay / dayInterval;
    for (let i = 1; i <= interval; i++) {
      const value = `${i * dayInterval}`;
      const item = (
          <Picker.Item key={value} value={value}
                       label={value + dayUnit}/>
      );
      items.push(item);
    }
    return items;
  };
  getHourItems = () => {
    const items = [];
    const { maxHour, hourInterval, hourUnit } = this.props;
    const interval = maxHour / hourInterval;
    for (let i = 0; i <= interval; i++) {
      const value = `${i * hourInterval}`;
      const new_value = value < 10 ? `0${value}` : `${value}`;
      const item = (
          <Picker.Item key={value} value={new_value}
                       label={new_value + hourUnit}/>
      );
      items.push(item);
    }
    return items;
  };

  getMinuteItems = () => {
    console.log('getMinuteItems');
    const items = [];
    const { maxMinute, minuteInterval, minuteUnit } = this.props;
    const interval = maxMinute / minuteInterval;
    for (let i = 0; i <= interval; i++) {
      const value = i * minuteInterval;
      const new_value = value < 10 ? `0${value}` : `${value}`;
      const item = (
          <Picker.Item
              key={value}
              value={new_value}
              label={new_value + minuteUnit}
          />
      );
      items.push(item);
    }
    if (this.props.extraMinuteItems) {
      const extra = this.props.extraMinuteItems(this.state.selectedHour,
          this.state.selectedMinute);
      if (extra) {
        extra.map(minuteItem => {
          items.push(minuteItem);
        });
      }
    }

    return items;
  };

  onValueChange = (selectedHour, selectedMinute) => {
    let items = [];
    this.setState({ selectedHour, selectedMinute });
  };

  onCancel = () => {
    if (typeof this.props.onCancel === 'function') {
      const { selectedHour, selectedMinute } = this.state;
      this.props.onCancel(selectedHour, selectedMinute);
    }
  };

  onConfirm = () => {
    if (typeof this.props.onConfirm === 'function') {
      const { selectedHour, selectedMinute } = this.state;
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
    const { textCancel, textConfirm, textTitle } = this.props;
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
              { color: 'black', fontWeight: '500' }]}>{textTitle}</Text>
          </View>}
          <TouchableOpacity onPress={this.onConfirm}
                            style={styles.buttonAction}>
            <Text style={styles.buttonText}>{textConfirm}</Text>
          </TouchableOpacity>
        </View>
    );
  };

  renderBody = () => {
    const { selectedDay, selectedMonth, sleectedYear } = this.state;

    return (
        <View style={styles.body}>
          <Picker
              selectedValue={selectedDay}
              style={styles.picker}
              itemStyle={this.props.itemStyle}
              onValueChange={itemValue =>
                  this.onValueChange(itemValue, selectedDay)
              }
          >
            {this.getDayItems()}
          </Picker>
          <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              itemStyle={this.props.itemStyle}
              onValueChange={itemValue =>
                  this.onValueChange(itemValue, selectedMonth)
              }
          >
            {this.getMonthItems()}
          </Picker>
          <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              itemStyle={this.props.itemStyle}
              onValueChange={itemValue =>
                  this.onValueChange(itemValue, selectedYear)
              }
          >
            {this.getYearItems()}
          </Picker>
        </View>
    );
  };

  render () {
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
  onConfirm: PropTypes.func
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
  textTitle: null
};

export default DatePicker;
