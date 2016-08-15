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

  
  componentWillReceiveProps(props) {
    console.log(props);
    console.log('componentWillReceivePropstab + mtbvc')
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps)
    console.log(nextState)
    console.log('componentWillUpdatetab + mtbvc')
  }

  render() {
    return (
      <TabBarIOS
        unselectedTintColor="#ABABAB"
        tintColor="#3C4353"
        barTintColor="#F7F7F7">
        <TabBarIOS.Item
          // icon={{uri: base64Icon, scale: 3}}
          // title="friendsTab"
          icon={require('../../images/Icon-Small-6.png')}
          selectedIcon={require('../../images/Icon-Small-7.png')}
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
          // title="chatsTab"
          icon={require('../../images/Icon-Small-3.png')}
          selectedIcon={require('../../images/Icon-Small-5.png')}
          selected={this.state.selectedTab === 'chatsTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'chatsTab',
              // notifCount: this.state.notifCount + 1,
            });
          }}>
          {<ChatsViewController />}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          // icon={require('./flux.png')}
          // selectedIcon={require('./relay.png')}
          renderAsOriginal
          // title="settingTab"
          icon={require('../../images/Icon-Small-29.png')}
          selectedIcon={require('../../images/Icon-Small-1.png')}
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