import React, { Component } from 'react';
import { NavigatorIOS } from 'react-native';
import ChatsView from './ChatsView';

export default class ChatsViewController extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: ChatsView,
          title: 'chatsTab',
          rightButtonTitle: 'Add',
        }}
        titleTextColor='#FFFFFF'
        tintColor='#FFFFFF'
        barTintColor='#283147'
        style={{flex: 1}}
      />
    );
  }
}