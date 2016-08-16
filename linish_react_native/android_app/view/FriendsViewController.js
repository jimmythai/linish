import React, { Component } from 'react';
import {
  Navigator,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import FriendsView from './FriendsView';
import ChatsView from './View';

export default class FriendsViewController extends Component {
    constructor(props) {
        super(props);
        console.log(props)
    }

  _renderScene(route, navigator) {
    let view;
    switch (route.key) {
      case 'friends':
        view = <FriendsView navigator={navigator} />
        break;
      case 'chats':
        view = <ChatsView navigator={navigator} />
        break;
      case 'setting':
        view = <SettingView navigator={navigator} />
        break;
    }
    return view;
  }

  componentWillUpdate() {
    console.log(this.props)
    console.log('hoge')
  }

  // TODO: make this no animation
  // https://github.com/facebook/react-native/issues/1953
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

  renderNavigatorLeftButton(route, navigator, index, navState) {
    let leftButton;

    switch (route.key) {
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

    switch (route.key) {
      case 'friends':
        rightButton = <TouchableHighlight
                        onPress={() => navigator.push({key: 'addFriend', parent: 'friendsTab'})}>
                        <Text
                          style={selfStyle.rightButton}
                        >Add</Text>
                      </TouchableHighlight>;
        break;
      case 'chats':
        rightButton = <TouchableHighlight
                        onPress={() => navigator.push({key: 'makeRoom', parent: 'friendsTab'})}>
                        <Text
                          style={selfStyle.rightButton}
                        >make</Text>
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
    return (
      <Navigator
        initialRoute={{key: 'friends', parent: 'tabbarRoute',}}
        renderScene={this._renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) => this.renderNavigatorLeftButton(route, navigator, index, navState),
              RightButton: (route, navigator, index, navState) => this.renderNavigatorRightButton(route, navigator, index, navState),
              Title: (route, navigator, index, navState) => this.renderNavigatorTitle(route, navigator, index, navState),
            }}
            style={[selfStyle.navigationBar, selfStyle.navigationBarWithTabbar]}
          />
        }
        configureScene={this._configureScene} />
    );
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