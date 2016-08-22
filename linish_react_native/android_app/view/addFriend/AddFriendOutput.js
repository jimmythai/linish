import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

export default class AddFriendOutput extends Component {
  constructor(props) {
    super(props);
  }

  _renderUserId() {
    if(!this.props.isUserIdVisivle) {
      return (
        <Text></Text>
      );
    }

    return (
      <Text style={selfStyles.userId}>
        {this.props.userId}
      </Text>
    );
  }

  _renderErrorText() {
    if(!this.props.isErrorTextVisible) {
      return (
        <Text></Text>
      );
    }

    return (
      <Text style={selfStyles.errorText}>
        {this.props.errorText}
      </Text>
    );
  }

  _renderAddButton() {
    if(!this.props.isAddButtonVisible) {
      return (
        <Text></Text>
      );
    }

    return (
      <Text
        style={selfStyles.addButton}
        onPress={() => {
          this.props.onPress();
        }}
      >
        友だちを追加
      </Text>
    );
  }

  render() {
    return (
      <View style={selfStyles.outputContainer}>
        {this._renderUserId()}
        {this._renderErrorText()}
        {this._renderAddButton()}
      </View>
    );
  }
}

const selfStyles = StyleSheet.create({
  outputContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  userId: {
  },
  errorText: {
    marginTop: 10,
  },
  addButton: {
    marginTop: 30,
    color: '#0D94FC',
  },
});

AddFriendOutput.propTypes = {
  isAddButtonVisible: React.PropTypes.bool,
  isErrorTextVisible: React.PropTypes.bool,
  isUserIdVisivle: React.PropTypes.bool,
  userId: React.PropTypes.string,
  errorText: React.PropTypes.string,
  onPress: React.PropTypes.func,
};