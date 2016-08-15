import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  MKTextField,
} from 'react-native-material-kit';

import baseStyles from '../style/base';
import initialView from '../style/initialView';

export default class Components extends Component {
  constructor(props) {
    super(props);
  }

  static Textfield() {
    return MKTextField.textfieldWithFloatingLabel()
      .withHighlightColor('#40AE10')
      .withFloatingLabelFont({
          fontSize: 15,
          fontWeight: '200',
          color: '#40AE10',
      })
      .withStyle([baseStyles.textBox, initialView.textBox])
      .build();
  }
}
