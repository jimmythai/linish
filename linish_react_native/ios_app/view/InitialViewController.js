/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';

import SigninView from './SigninView';
import SignupView from './SignupView';
import MainTabBarViewController from './MainTabBarViewController';

export default class InitialViewController extends Component {
  _renderScene(route, navigator) {
    let view;
    switch (route.index) {
      case 0:
        view = <SigninView navigator={navigator} />
        break;
      case 1:
        view = <SignupView navigator={navigator} />
        break;
      case 2:
        view = <MainTabBarViewController navigator={navigator} />
        break;
    }
    return view;
  }

  // TODO: make this no animation
  // https://github.com/facebook/react-native/issues/1953
  _configureScene(route, navigator) {
    return Navigator.SceneConfigs.FadeAndroid;
  }

  render() {
    return (
      <Navigator
        initialRoute={{index: 0,}}
        renderScene={this._renderScene}
        configureScene={this._configureScene} />
    );
  }
}