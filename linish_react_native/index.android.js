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

import {Actions, Scene, Router} from 'react-native-router-flux';

import Signin from './android_app/view/SigninView';
import Signup from './android_app/view/SignupView';
import MainTabBar from './android_app/view/MainTabBarViewController';
import Friends from './android_app/view/FriendsView';
import Chats from './android_app/view/ChatsView';
import Setting from './android_app/view/SettingView';
import Signout from './android_app/view/SignoutView';
import DeleteAccount from './android_app/view/DeleteAccountView';
// import AddFriend from './android_app/view/AddFriendView';
// import ChooseFriends from './android_app/view/ChooseFriendsView';
// import Room from './android_app/view/RoomView';
// import Signout from './android_app/view/SignoutView';
// import DeleteAccount from './android_app/view/DeleteAccountView';

// class Linish extends Component {

//   render() {
//     return <Router>
//       <Scene key="root" navigationBarStyle={{backgroundColor: '#283147'}} titleStyle={{color: '#FFFFFF', fontWeight: 'bold', textAlign: 'left', paddingLeft: 15}} backButtonTextStyle={{color: '#FFFFFF'}} leftButtonIconStyle={{tintColor: '#FFFFFF'}}>
//         <Scene key="signin" initial={true} title="ログイン" component={Signin} duration={0} type="reset" />
//         <Scene key="signup" hideBackImage={true} title="新規登録" component={Signup} duration={0} type="reset" />
//         <Scene key="tabbar" component={MainTabBar} type="reset">
//           <Scene key="friendsTab" component={Friends}>
//           </Scene>
//           <Scene key="chatsTab" component={Chats}>
//           </Scene>
//           <Scene key="settingTab" component={Setting}>
//           </Scene>
//         </Scene>
//         <Scene key="signout" component={Signout} title="ログアウト" />
//         <Scene key="deleteAccount" component={DeleteAccount} title="退会" />
//       </Scene>
//     </Router>;
//   }
// }

AppRegistry.registerComponent('linish_react_native', () => Linish);

