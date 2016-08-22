import React, { Component } from 'react';

import {
  Text,
} from 'react-native';

import {
  MKButton,
} from 'react-native-material-kit';

import baseStyles from '../style/base';

export default class ListItem extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const ColoredRaisedButton = MKButton.coloredButton()
      .withText('BUTTfafafafffffffON')
      .withOnPress(() => {
        console.log("Hi, it's a colored button!");
      })
      .build();

    return (
      <ColoredRaisedButton
        {...this.props}
      />
    );
  }
}

ListItem.propTypes = {
  rowData: React.PropTypes.string,
  _onPress: React.PropTypes.func,
};

ListItem.defaultProps = {
  rowData: '',
  onPress: null,
};