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

export default class TextField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <MKTextField
        {...this.props}
        ref="textField"
        isFocused={() => this._isFocused()}
        highlightColor='#40AE10'
        floatingLabelEnabled={this.props.hasFloating}
        floatingLabelFont={{
          fontSize: 15,
          fontWeight: '200',
          color: '#40AE10',
        }}
        style={[baseStyles.textBox, initialView.textBox]}
      />
    );
  }
}

TextField.propTypes = {
  hasFloating: React.PropTypes.bool,
}

TextField.defaultProps = {
  hasFloating: false,
}