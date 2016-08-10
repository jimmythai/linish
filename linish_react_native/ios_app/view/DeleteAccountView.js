import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  NavigatorIOS,
} from 'react-native';

import baseStyles from '../style/base';
import settingStyles from '../style/setting';
import SignupView from './SignupView';
import Network from './Network';

export default class DeleteAccountView extends Component {
  constructor(props) {
    super(props)
  }

  async onPressDeleteButton() {
    const res = await Network._fetch({
      path: '/accounts/delete',
      method: 'POST',
    });

    await this.props.navigator.push({
      component: SignupView,
      navigationBarHidden: true,
    });
  }

  onPressCancelButton() {
    this.props.navigator.pop(0);
  }

  render() {
    return (
      <View style={[baseStyles.wrapper ,baseStyles.wrapperForNavigator, baseStyles.wrapperForTabBarNavigation]}>
        <View style={[baseStyles.container, settingStyles.confirmationContainer]}>
            <Text style={settingStyles.confirmationText}>アカウントを削除しますか？</Text>
        </View>
        <View style={[baseStyles.container, settingStyles.buttonsContainer, selfStyles.buttonsContainer]}>
            <Text
            style={[baseStyles.button, baseStyles.buttonDanger, selfStyles.button, selfStyles.buttonTop]}
            onPress={() => this.onPressDeleteButton()}
            >退会する</Text>
            <Text
            style={[baseStyles.button, baseStyles.buttonNegative, selfStyles.button]}
            onPress={() => this.onPressCancelButton()}
            >キャンセル</Text>
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