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
import MainNavigator from './android_app/view/MainNavigator';

AppRegistry.registerComponent('linish_react_native', () => MainNavigator);

