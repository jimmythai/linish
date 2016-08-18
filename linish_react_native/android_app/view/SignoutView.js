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
import BackHandler from './BackHandler';
import HeaderView from './HeaderView';

export default class SignoutView extends Component {
  constructor(props) {
    super(props)
    BackHandler.popToPrevious(props.navigator);
  }

  async onPressSignoutButton() {
    const res = await Network._fetch({
      path: '/accounts/signout',
      method: 'POST',
    });

    await this.props.navigator.resetTo({key: 'signin',});
  }

  render() {
    return (
      <View>
        <HeaderView
          title="ログアウト"
        />
        <View style={[baseStyles.wrapper ,baseStyles.wrapperForNavigator,]}>
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
      </View>
    );
  }
}

const selfStyles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 60,
  },
});