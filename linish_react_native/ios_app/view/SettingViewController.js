import React, { Component } from 'react';
import { NavigatorIOS } from 'react-native';
import SettingView from './SettingView';

export default class SettingViewController extends Component {
  render() {
    return (
      <NavigatorIOS
        ref='nav'
        initialRoute={{
          component: SettingView,
          title: '設定',
          barTintColor: '#283147',
          titleTextColor: '#FFFFFF',
          tintColor: '#FFFFFF',
          translucent: false,
        }}
        style={{flex: 1}}
      />
    );
  }
}