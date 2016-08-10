import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  Navigator,
  AsyncStorage,
} from 'react-native';

import baseStyles from '../style/base';
import initialView from '../style/initialView';
import Validation from './Validation';
import Network from './Network';

export default class SigninView extends Component {
  constructor(props) {
    super(props);
    // TODO: Make this a common component
    this.placeholderTextColor = '#CACACF';
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
    this.props.navigator.push({index: 1,});
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

      const status = await res.status;
      if(status && status === 400) {
        Alert.alert(
          'Login Failure',
          'ユーザーIDまたはパスワードが違います',
          [
            {text: 'OK', style: 'default'},
          ]
        );
      } else {
        try {
          const json = await res.json();
          await AsyncStorage.setItem('access_token', json.access_token);
          await this.props.navigator.push({index: 2,});
        } catch (err) {
          // Error saving data
        }
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
            <Text
              style={[baseStyles.font, initialView.pageTitle]}>
              ログイン
            </Text>
            <View
              style={initialView.textBoxArea}>
              <TextInput
                style={[baseStyles.textBox, initialView.textBox, initialView.textBoxTop]}
                // TODO: set up validation and behabier
                placeholder={this.placeholderText.userId}
                placeholderTextColor={ this.placeholderTextColor }
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(userId) => {this.setState({userId})}}
                value={(this.state && this.state.userId) || ''}
              />
              <TextInput
                style={[baseStyles.textBox, initialView.textBox]}
                // TODO: set up validation and behabier
                placeholder={this.placeholderText.password}
                placeholderTextColor={ this.placeholderTextColor }
                autoCapitalize='none'
                secureTextEntry={true}
                onChangeText={(password) => {this.setState({password})}}
                value={(this.state && this.state.password) || ''}
              />
            </View>
            <Text
              style={[baseStyles.button, baseStyles.buttonPrimary, initialView.formButton]}
              onPress={() => this.onSubmit(this.state.userId, this.state.password)}
              >
              ログイン
            </Text>
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