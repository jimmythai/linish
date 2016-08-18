import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import baseStyles from '../style/base';
import settingStyles from '../style/setting';
import Network from './Network';
import HeaderView from './HeaderView';
import BackHandler from './BackHandler';

export default class DeleteAccountView extends Component {
  constructor(props) {
    super(props);
    BackHandler.popToPrevious(props.navigator);
  }

  async onPressDeleteButton() {
    const res = await Network._fetch({
      path: '/accounts/delete',
      method: 'POST',
    });

    console.log(res)

    await this.props.navigator.resetTo({key: 'signup',});
  }

  onPressCancelButton() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View>
        <HeaderView
          title="退会"
        />
        <View style={selfStyles.wrapper}>
          <View style={[baseStyles.container, settingStyles.confirmationContainer]}>
            <Text style={settingStyles.confirmationText}>アカウントを削除しますか？</Text>
          </View>
          <View style={[baseStyles.container, settingStyles.buttonsContainer, selfStyles.buttonsContainer]}>
            <Text
              style={[baseStyles.button, baseStyles.buttonDanger, selfStyles.button, selfStyles.buttonTop]}
              onPress={() => this.onPressDeleteButton()}
            >
              退会する
            </Text>
            <Text
              style={[baseStyles.button, baseStyles.buttonNegative, selfStyles.button]}
              onPress={() => this.onPressCancelButton()}
            >
              キャンセル
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const selfStyles = StyleSheet.create({
  buttonsContainer: {
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  buttonTop: {
    marginTop: 0,
  },
  button: {
    marginTop: 6,
  },
});
