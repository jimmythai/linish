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

export default class SignoutView extends Component {
  constructor(props) {
    super(props)
  }

  async onPressSignoutButton() {
    const res = await Network._fetch({
      path: '/accounts/signout',
      method: 'POST',
    });

    await Actions.signin();
  }

  render() {
    return (
      <View style={[baseStyles.wrapper ,baseStyles.wrapperForNavigator, baseStyles.wrapperForTabBarNavigation]}>
        <View style={[baseStyles.container, settingStyles.confirmationContainer]}>
            <Text style={settingStyles.confirmationText}>ログアウトしますか？</Text>
        </View>
        <View style={[baseStyles.container, settingStyles.buttonsContainer, selfStyles.buttonsContainer]}>
          <Text
          style={[baseStyles.button, baseStyles.buttonPrimary]}
          onPress={() => this.onPressSignoutButton()}
          >ログアウト</Text>
        </View>
      </View>
    );
  }
}

const selfStyles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 60,
  },
});