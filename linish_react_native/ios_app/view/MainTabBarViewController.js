import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TabBarIOS,
} from 'react-native';

import FriendsViewController from './FriendsViewController';
import ChatsViewController from './ChatsViewController';
import SettingViewController from './SettingViewController';

export default class MainTabBarViewController extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedTab: 'friendsTab',
      // notifCount: 0,
      // presses: 0,
    }
  }

  render() {
    return (
      <TabBarIOS
        unselectedTintColor="#ABABAB"
        tintColor="#3C4353"
        barTintColor="#F7F7F7">
        <TabBarIOS.Item
          // icon={{uri: base64Icon, scale: 3}}
          title="friendsTab"
          selected={this.state.selectedTab === 'friendsTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'friendsTab',
            });
          }}>
          {<FriendsViewController />}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          // systemIcon="history"
          // badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          title="chatsTab"
          selected={this.state.selectedTab === 'chatsTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'chatsTab',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          {<ChatsViewController />}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          // icon={require('./flux.png')}
          // selectedIcon={require('./relay.png')}
          renderAsOriginal
          title="settingTab"
          selected={this.state.selectedTab === 'settingTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'settingTab',
              // presses: this.state.presses + 1
            });
          }}>
          {<SettingViewController />}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}