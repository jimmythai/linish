import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Navigator,
  NavigatorIOS,
} from 'react-native';

import baseStyles from '../style/base';
import settingStyles from '../style/setting';
import Network from './Network';

import InitialViewController from './InitialViewController';

export default class SignoutView extends Component {
  constructor(props) {
    super(props)
  }

  async onPressSignoutButton() {
    const res = await Network._fetch({
      path: '/accounts/signout',
      method: 'POST',
    });

    
    // await this.props.navigator.resetTo({});
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