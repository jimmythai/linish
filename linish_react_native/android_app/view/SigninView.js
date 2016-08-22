import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

import {Actions} from 'react-native-router-flux';

import baseStyles from '../style/base';
import initialView from '../style/initialView';
import Validation from './Validation';
import Network from './Network';
import TextField from './TextField';

export default class SigninView extends Component {
  constructor(props) {
    super(props);
    console.log('hogegheo');
    // TODO: Make this a common component
    this.placeholderTextColor = '#7E7E7E';
    this.placeholderText = {
      userId: 'ユーザーID（半角英数25文字以内）',
      password: 'パスワード（半角英数8〜100文字）',
    }
    this.state = {
      userId: '',
      password: '',
    }
  }

  onPressSignupLink() {
    this.props.navigator.resetTo({key: 'signup',});
  }

  async onSubmit(userId, password) {
    const errors = Validation.validateForm({userId: userId, password: password});
    const isErrorsEmpty = errors.length === 0;

    if (isErrorsEmpty) {
      const res = await Network._fetch({
        path: '/accounts/signin',
        method: 'POST',
        body: {
          user_id: userId,
          password: password,
        }
      });

      if(await res.code === 400) {
        Alert.alert(
          'Login Failure',
          'ユーザーIDまたはパスワードが違います',
          [
            {text: 'OK', style: 'default'},
          ]
        );
      } else {
        (async() => {
          try {
            await AsyncStorage.setItem('access_token', res.access_token);
            await this.props.navigator.resetTo({key: 'maintabbar',});
            // this.props.navigator.push({index: 2,});
          } catch (err) {
            // Error saving data
          }
        })();
      }
    } else {
      Alert.alert(
        'Login Error',
        errors.join('\n'),
        [
          {text: 'OK', style: 'default'},
        ]
      );
    }
  }
  
  render() {
    return (
      <View style={[baseStyles.wrapper, initialView.wrapper]}>
          <View>
            <View
              style={initialView.textBoxArea}>
              <TextField
                hasFloating={true}
                placeholder={this.placeholderText.userId}
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(userId) => {this.setState({userId})}}
                onSubmitEditing={() => {this.setState({userId: ''})}}
                value={(this.state && this.state.userId) || ''}
              />
              <TextField
                hasFloating={true}
                placeholder={this.placeholderText.password}
                secureTextEntry={true}
                onChangeText={(password) => {this.setState({password})}}
                value={(this.state && this.state.password) || ''}
              />
            </View>
            <TouchableOpacity onPress={() => this.onSubmit(this.state.userId, this.state.password)}>
              <Text style={[baseStyles.button, baseStyles.buttonPrimary, initialView.formButton]}>
                ログイン
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={initialView.signupArea}>
            <Text
              style={initialView.signupDesc}>
              新規ではじめる
            </Text>
            <Text
              style={initialView.signupLink}
              onPress={() => this.onPressSignupLink()}>
              アカウント作成
            </Text>
          </View>
      </View>
    );
  }
}