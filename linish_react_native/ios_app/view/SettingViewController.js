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
          title: 'settingTab',
        }}
        titleTextColor='#FFFFFF'
        tintColor='#FFFFFF'
        barTintColor='#283147'
        style={{flex: 1}}
      />
    );
  }
}