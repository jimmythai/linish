import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TabBarIOS,
  StyleSheet,
  TouchableHighlight,
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

  componentWillUpdate() {
    console.log('hoge')
  }

  _renderScene(route, navigator) {
    const self = this;
    console.log(route)
    console.log(this)
    return <ScrollableTabView
              tabBarBackgroundColor="#283147"
              tabBarUnderlineColor="#40AE10"
              tabBarActiveTextColor="#FFFFFF"
              tabBarInactiveTextColor="#FFFFFF"
              style={{marginTop: 56, elevation: 7,}}
              onChangeTab={(tab) => {
                console.log(this.navigator)

                switch (tab.ref.ref) {
                  case 'friends':
                    this.navigator.pop({key: 'maintabbar', tabname: 'friends', })
                    break;
                  case 'chats':
                    this.navigator.pop({key: 'maintabbar', tabname: 'chats', })
                    break;
                  case 'setting':
                    // navigator.jumpForward(0);
                    break;
                  default:
                    break;
                }
              }}
            >
        <FriendsView tabLabel="友だち" ref="friends" />
        <ChatsView tabLabel="トーク" ref="chats" />
        <SettingView tabLabel="設定" ref="setting" />
      </ScrollableTabView>;
  }

  _configureScene(route, navigator) {
    let animation;
    switch (route.parent) {
      case 'initialRoute':
        animation = Navigator.SceneConfigs.FloatFromBottomAndroid;
        break;
      case 'tabbarRoute':
        animation = Navigator.SceneConfigs.FloatFromBottomAndroid;
        break;
      default:
        break;
    }
    return Navigator.SceneConfigs.FloatFromBottomAndroid;
  }

  renderNavigatorTitle(route, navigator, index, navState) {
    let title;

    switch (route.tabname) {
      case 'friends':
        title = <Text style={[selfStyle.title, ]}>友だち</Text>
        break;
      case 'chats':
        title = <Text style={[selfStyle.title, ]}>トーク</Text>
        break;
      case 'setting':
        title = <Text style={[selfStyle.title, ]}>設定</Text>
        break;
      default:
        break;
    }

    return (null);
  }

  renderNavigatorLeftButton(route, navigator, index, navState) {
    let leftButton;

    switch (route.tabname) {
      case 'friends':
        leftButton = <Text style={selfStyle.leftButton}>友だち</Text>
        break;
      case 'chats':
        leftButton = <Text style={selfStyle.leftButton}>トーク</Text>
        break;
      case 'setting':
        leftButton = <Text style={selfStyle.leftButton}>設定</Text>
        break;
      default:
        break;
    }

    return (leftButton);
  }

  renderNavigatorRightButton(route, navigator, index, navState) {
    let rightButton;

    switch (route.tabname) {
      case 'friends':
        rightButton = <TouchableHighlight
                        onPress={() => navigator.push({key: 'addFriend', parent: 'friendsTab'})}>
                        <Text
                          style={selfStyle.rightButton}
                        >Ad</Text>
                      </TouchableHighlight>;
        break;
      case 'chats':
        rightButton = <TouchableHighlight
                        onPress={() => navigator.push({key: 'makeRoom', parent: 'settingTab'})}>
                        <Text
                          style={selfStyle.rightButton}
                        >Add</Text>
                      </TouchableHighlight>;
        break;
      default:
        break;
    }

    return (rightButton);
  }

  navigationBarStyle(route) {
    return [selfStyle.navigationBar, selfStyle.navigationBarWithTabbar]
  }

  render() {
    const routes = [
      {key: 'maintabbar', tabname: 'friends',},
      {key: 'maintabbar', tabname: 'chats',},
      {key: 'maintabbar', tabname: 'setting',},
    ];
    return (
      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={routes}
        renderScene={this._renderScene}
        navigator={this.props.navigator}
        navigationBar={
          <Navigator.NavigationBar
            ref='initialNav'
            routeMapper={{
              LeftButton: (route, navigator, index, navState) => this.renderNavigatorLeftButton(route, navigator, index, navState),
              RightButton: (route, navigator, index, navState) => this.renderNavigatorRightButton(route, navigator, index, navState),
              Title: (route, navigator, index, navState) => this.renderNavigatorTitle(route, navigator, index, navState),
            }}
            style={[selfStyle.navigationBar, selfStyle.navigationBarWithTabbar]}
          />
        }
        configureScene={this._configureScene} />
    )
  }
}


const selfStyle = StyleSheet.create({
  navigationBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#283147',
    elevation: 7,
  },
  navigationBarWithTabbar: {
    position: 'absolute',
    top: 0,
    elevation: 0,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'left',
  },
  leftButton: {
    color: '#FFFFFF',
    textAlign: 'left',
    marginVertical: 16,
    marginLeft: 10,
    fontSize: 17,
  },
  rightButton: {
    color: '#FFFFFF',
    marginVertical: 16,
    marginRight: 10,
    fontSize: 17,
  },
});
