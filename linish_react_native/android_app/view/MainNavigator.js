import React, { Component } from 'react';
import {
  Navigator,
  Text,
  StyleSheet,
  StatusBar,
  View,
} from 'react-native';

import SigninView from './SigninView';
import SignupView from './SignupView';
import SignoutView from './SignoutView';
import ChooseFriendsView from './ChooseFriendsView';
import AddFriend from './addFriend/AddFriend';
import Room from './room/Room';
import DeleteAccountView from './DeleteAccountView';
import MainTabBar from './MainTabBarViewController';

export default class MainNavigator extends Component {
    constructor(props) {
        super(props);
    }

  _renderScene(route, navigator) {
    let pageView;
    switch (route.key) {
      case 'signin':
        pageView = <SigninView navigator={navigator} />
        break;
      case 'signup':
        pageView = <SignupView navigator={navigator} />
        break;
      case 'maintabbar':
        pageView = <MainTabBar navigator={navigator} />
        break;
      case 'signout':
        pageView = <SignoutView navigator={navigator} />
        break;
      case 'deleteAccount':
        pageView = <DeleteAccountView navigator={navigator} />
        break;
      case 'room':
        pageView = <Room navigator={navigator} />
        break;
      case 'chooseFriends':
        pageView = <ChooseFriendsView navigator={navigator} />
        break;
      case 'addFriend':
        pageView = <AddFriend navigator={navigator} />
        break;
      default:
        break;
    }

    let view = <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                 <StatusBar
                   backgroundColor="#283147"
                 />
                 {pageView}
               </View>;

    return view;
  }

  // TODO: make this no animation
  // https://github.com/facebook/react-native/issues/1953
  _configureScene(route, navigator) {
    // let animation;
    // switch (route.parent) {
    //   case 'initialRoute':
    //     animation = Navigator.SceneConfigs.FloatFromBottomAndroid;
    //     break;
    //   case 'tabbarRoute':
    //     animation = Navigator.SceneConfigs.FloatFromBottomAndroid;
    //     break;
    //   default:
    //     break;
    // }
    return Navigator.SceneConfigs.FloatFromBottomAndroid;
  }

  renderNavigatorTitle(route, navigator, index, navState) {
    let title;

    switch (route.key) {
      case 'signin':
        title = <Text style={[selfStyle.title, ]}>ログイン</Text>
        break;
      case 'signup':
        title = <Text style={[selfStyle.title, ]}>新規登録</Text>
        break;
      case 'maintabbar':
        title = <Text style={[selfStyle.title, ]}>友だち</Text>
        break;
      case 'signout':
        title = <Text style={[selfStyle.title, ]}>ログアウト</Text>
        break;
      case 'deleteAccount':
        view = <Text style={[selfStyle.title, ]}>退会</Text>
        break;
      case 'room':
        // TODO: pass title dinamically
        view = <Text style={[selfStyle.title, ]}>トーク</Text>
        break;
      case 'chooseFriends':
        view = <Text style={[selfStyle.title, ]}>友だちを選択</Text>
        break;
      case 'addFriend':
        view = <Text style={[selfStyle.title, ]}>ID検索</Text>
        break;
      default:
        break;
    }

    return (null);
  }

  renderNavigatorLeftButton(route, navigator, index, navState) {
    let leftButton;

    switch (route.key) {
      case 'signin':
        leftButton = <Text style={selfStyle.leftButton}>ログイン</Text>
        break;
      case 'signup':
        leftButton = <Text style={selfStyle.leftButton}>新規登録</Text>
        break;
      case 'maintabbar':
        leftButton = <Text style={selfStyle.leftButton}>友だち</Text>
        break;
      case 'signout':
        leftButton = <Text style={selfStyle.leftButton}>ログアウト</Text>
        break;
      case 'deleteAccount':
        leftButton = <Text style={selfStyle.leftButton}>退会</Text>
        break;
      case 'room':
        // TODO: pass title dinamically
        view = <Text style={[selfStyle.leftButton, ]}>トーク</Text>
        break;
      case 'chooseFriends':
        view = <Text style={[selfStyle.leftButton, ]}>友だちを選択</Text>
        break;
      case 'addFriend':
        view = <Text style={[selfStyle.leftButton, ]}>ID検索</Text>
        break;
      default:
        break;
    }
    return (leftButton);
  }

  renderNavigatorRightButton(route, navigator, index, navState) {
    let rightButton;

    switch (route.key) {
      case 'signin':
        rightButton = null;
        break;
      case 'signup':
        rightButton = null;
        break;
      case 'maintabbar':
        rightButton = null;
        break;
      case 'signout':
        rightButton = null;
        break;
      case 'deleteAccount':
        leftButton = null;
        break;
      case 'room':
        leftButton = null;
        break;
      case 'chooseFriends':
        leftButton = null;
        break;
      case 'addFriend':
        leftButton = null;
        break;
      default:
        break;
    }
    return (rightButton);
  }

  navigationBarStyle(route) {
    if(route.key === 'maintabbar') {
      return selfStyle.navigationBar
    } else {
      return [selfStyle.navigationBar, selfStyle.navigationBarWithTabbar]
    }
  }

  render() {
    return (
        <Navigator
          initialRoute={{key: 'signin', parent: 'initialRoute',}}
          renderScene={this._renderScene}
          navigationBar={
            <NavigationBar
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

class NavigationBar extends Navigator.NavigationBar {
  constructor(props) {
    super(props)
  }
  render() {
    var routes = this.props.navState.routeStack;

    if (routes[0].key === 'maintabbar') {
      return null;
    }

    return super.render();
  }
}