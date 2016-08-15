/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  TouchableOpacity,
  Text,
  Icon,
} from 'react-native';

// const PATH_TO_VIEW = './ios_app/view';

import {Actions, Scene, Router} from 'react-native-router-flux';

// import InitialViewController from PATH_TO_VIEW + '/InitialViewController';

import Signin from './ios_app/view/SigninView';
import Signup from './ios_app/view/SignupView';
import MainTabBar from './ios_app/view/MainTabBarViewController';
import Friends from './ios_app/view/FriendsView';
import Chats from './ios_app/view/ChatsView';
import Setting from './ios_app/view/SettingView';
import AddFriend from './ios_app/view/AddFriendView';
import ChooseFriends from './ios_app/view/ChooseFriendsView';
import Room from './ios_app/view/RoomView';
import Signout from './ios_app/view/SignoutView';
import DeleteAccount from './ios_app/view/DeleteAccountView';

class Linish extends Component {

  render() {
    return <Router>
      <Scene key="root" navigationBarStyle={{backgroundColor: '#283147'}} titleStyle={{color: '#FFFFFF', fontWeight: 'bold'}} backButtonTextStyle={{color: '#FFFFFF'}} leftButtonIconStyle={{tintColor: '#FFFFFF'}}>
        <Scene key="signin" initial={true} title="ログイン" component={Signin} navigationBarStyle={{borderBottomWidth: 0,　borderBottomColor: 'transparent', backgroundColor: '#FFFFFF'}} titleStyle={{color: '#333333', fontWeight: 'bold'}} duration={0} type="reset" />
        <Scene key="signup" hideBackImage={true} title="新規登録" component={Signup} navigationBarStyle={{borderBottomWidth: 0,　borderBottomColor: 'transparent', backgroundColor: '#FFFFFF'}} titleStyle={{color: '#333333', fontWeight: 'bold'}} duration={0} type="reset" />
        <Scene key="tabbar" component={MainTabBar} type="reset">
          <Scene key="friendsTab" component={Friends}>
          </Scene>
          <Scene key="chatsTab" component={Chats}>
          </Scene>
          <Scene key="settingTab" component={Setting}>
          </Scene>
        </Scene>
        <Scene key="signout" component={Signout} title="ログアウト" />
        <Scene key="deleteAccount" component={DeleteAccount} title="退会" />
        <Scene key="addFriend" component={AddFriend} title="友だちを追加" />
        <Scene key="chooseFriends" component={ChooseFriends} title="友だちを選択" rightTitle="OK" rightButtonTextStyle={{color: 'transparent'}} onRight={() => {console.log('hoge')}} />
        <Scene key="room" component={Room} title="友だち" onBack={() => {Actions.pop()}}/>
      </Scene>
    </Router>;
  }
}

AppRegistry.registerComponent('linish_react_native', () => Linish);
