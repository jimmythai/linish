import React, { Component } from 'react';
import { NavigatorIOS } from 'react-native';
import FriendsView from './FriendsView';

export default class FriendsViewController extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: FriendsView,
          title: 'friendsTab',
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