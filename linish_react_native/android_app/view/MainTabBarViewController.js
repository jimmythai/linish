import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TabBarIOS,
} from 'react-native';

import {Actions, Scene, Router} from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';


import FriendsViewController from './FriendsView';
import ChatsViewController from './ChatsView';
import SettingViewController from './SettingView';

export default class MainTabBarViewController extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ScrollableTabView
        tabBarUnderlineColor="#40AE10"
        tabBarActiveTextColor="#40AE10"
      >
        <FriendsViewController tabLabel="友だち" />
        <FriendsViewController tabLabel="トーク" />
        <FriendsViewController tabLabel="設定" />
      </ScrollableTabView>
    )
  }
}
