import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TabBarIOS,
} from 'react-native';

import {Actions, Scene, Router} from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';


import FriendsView from './FriendsView';
import ChatsView from './ChatsView';
import SettingView from './SettingView';

export default class MainTabBarViewController extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ScrollableTabView
        tabBarBackgroundColor="#283147"
        tabBarUnderlineColor="#40AE10"
        tabBarActiveTextColor="#FFFFFF"
        tabBarInactiveTextColor="#FFFFFF"
      >
        <FriendsView tabLabel="友だち" />
        <ChatsView tabLabel="トーク" />
        <SettingView tabLabel="設定" />
      </ScrollableTabView>
    )
  }
}
