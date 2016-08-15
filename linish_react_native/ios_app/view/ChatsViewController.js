import React, { Component } from 'react';
import {
  NavigatorIOS,
} from 'react-native';
import ChatsView from './ChatsView';

import {Actions} from 'react-native-router-flux';

export default class ChatsViewController extends Component {

  handleNavigationRequest() {
    Actions.chooseFriends();
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: ChatsView,
          title: 'トーク',
          rightButtonTitle: 'Add',
          onRightButtonPress: () => this.handleNavigationRequest(),
          barTintColor: '#283147',
          titleTextColor: '#FFFFFF',
          tintColor: '#FFFFFF',
          translucent: false,
        }}
        titleTextColor='#FFFFFF'
        tintColor='#FFFFFF'
        barTintColor='#283147'
        style={{flex: 1}}
      />
    );
  }
}