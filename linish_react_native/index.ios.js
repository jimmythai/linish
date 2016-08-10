/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

const PATH_TO_VIEW = './ios_app/view';

import {Scene, Router} from 'react-native-router-flux';

// import InitialViewController from PATH_TO_VIEW + '/InitialViewController';

import Signout from PATH_TO_VIEW + '/SignoutView';
import Signin from PATH_TO_VIEW + '/SigninView';
import Friends from PATH_TO_VIEW + '/FriendsView';
import Chats from PATH_TO_VIEW + '/ChatsView';
import Setting from PATH_TO_VIEW + '/SettingView';

class App extends Component {
  render() {
    return <Router>
      <Scene key="root">
        <Scene key="signin" component={Signin} />
        <Scene key="signout" component={Signout} />
        <Scene key="friends" component={Friends} />
      </Scene>
    </Router>;
  }
}


AppRegistry.registerComponent('linish_react_native', () => InitialViewController);
