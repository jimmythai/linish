import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TabBarIOS,
  StyleSheet,
  TouchableHighlight,
  StatusBar,
} from 'react-native';

import {Actions, Scene, Router} from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';


import FriendsView from './FriendsView';
import ChatsView from './ChatsView';
import SettingView from './SettingView';

export default class MainTabBarViewController extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '友だち',
      leftButton: 'Add',
      tabname: 'friends',
    }
  }

  componentWillUpdate() {
    
  }

  _onPress() {
    switch (this.state.tabname) {
      case 'friends':
        this.props.navigator.push({key: 'addFriend',});
        break;
      case 'chats':
        this.props.navigator.push({key: 'chooseFriends',});
        break;
      case 'setting':
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <View
        style={{flex: 1,}}
      >
        <StatusBar
          backgroundColor="#283147"
        />
        <View style={selfStyles.navigationBar}>
          <Text style={selfStyles.navigationBarTitle}>{this.state.title}</Text>
          <Text
            style={selfStyles.navigationBarLeftButton}
            onPress={()=> this._onPress()}
          >{this.state.leftButton}</Text>
        </View>
        <ScrollableTabView
          tabBarBackgroundColor="#283147"
          tabBarUnderlineColor="#40AE10"
          tabBarActiveTextColor="#FFFFFF"
          tabBarInactiveTextColor="#FFFFFF"
          onChangeTab={(tab)=>{
            switch (tab.ref.ref) {
              case 'friends':
                this.setState({
                  title: '友だち',
                  leftButton: 'Add',
                  tabname: 'friends',
                });
                break;
              case 'chats':
                this.setState({
                  title: 'トーク',
                  leftButton: 'Add',
                  tabname: 'chats',
                });
                break;
              case 'setting':
                this.setState({
                  title: '設定',
                  leftButton: null,
                  tabname: 'setting',
                });
                break;
              default:
                break;
            }
          }}
          style={{
            flex: 1,
            
          }}
        >
          <FriendsView tabLabel="友だち" ref="friends" navigator={this.props.navigator} />
          <ChatsView tabLabel="トーク" ref="chats" navigator={this.props.navigator} />
          <SettingView tabLabel="設定" ref="setting" navigator={this.props.navigator} />
        </ScrollableTabView>
      </View>
    )
  }
}

const selfStyles = StyleSheet.create({
  navigationBar: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 59,
    backgroundColor: '#283147',
  },
  navigationBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  navigationBarLeftButton: {
    color: '#FFFFFF',
  },
});
