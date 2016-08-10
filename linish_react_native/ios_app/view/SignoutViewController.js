/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Navigator,
  NavigatorIOS,
} from 'react-native';

import SignoutView from './SignoutView';
import Index from '../../index.ios';

export default class SignoutViewController extends Component {
  _renderScene(route, navigator) {
    let view;
    switch (route.index) {
      case 0:
        view = <SignoutView navigator={navigator} />
        break;
      case 1:
        view = <Index navigator={navigator} />
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