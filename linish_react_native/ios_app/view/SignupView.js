import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  Navigator
} from 'react-native';

import baseStyles from '../style/base';
import initialView from '../style/initialView';
import Validation from './Validation';
import Network from './Network';

export default class SignupView extends Component {
  constructor(props) {
    super(props)
    // TODO: Make this a common component
    this.placeholderTextColor = '#CACACF';
    this.placeholderText = {
      email: 'メールアドレス',
      userId: 'ユーザーID（半角英数25文字以内）',
      password: 'パスワード（半角英数8〜100文字）',
    }
    this.state = {
      email: '',
      userId: '',
      password: '',
    }
  }
  
  onPressSigninLink() {
    this.props.navigator.pop();
  }
  
  async onSubmit(email, userId, password) {
    const errors = Validation.validateForm({email: email, userId: userId, password: password});
    const isErrorsEmpty = errors.length === 0; 

    if (isErrorsEmpty) {
      const res = await Network._fetch({
        path: '/accounts/signup',
        method: 'POST',
        body: {
          email: email,
          user_id: userId,
          password: password,
        }
      });

      const status = await res.status;
      if(status && status === 400) {
        Alert.alert(
          'Duplicate account',
          '入力したユーザー名またはメールアドレスはすでに登録されています',
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
        'Signup Error',
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
              新規登録
            </Text>
            <View
              style={initialView.textBoxArea}
              >
              <TextInput
                style={[baseStyles.textBox, initialView.textBox, initialView.textBoxTop]}
                // TODO: set up validation and behabier
                placeholder={this.placeholderText.email}
                placeholderTextColor={ this.placeholderTextColor }
                autoCapitalize='none'
                keyboardType='email-address'
                autoCorrect={false}
                onChangeText={(email) => {this.setState({email})}}
                onSubmitEditing={() => {this.setState({email: ''})}}
                value={(this.state && this.state.email) || ''}
              />
              <TextInput
                style={[baseStyles.textBox, initialView.textBox]}
                // TODO: set up validation and behabier
                placeholder={this.placeholderText.userId}
                placeholderTextColor={ this.placeholderTextColor }
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(userId) => {this.setState({userId})}}
                onSubmitEditing={() => {this.setState({userId: ''})}}
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
                onSubmitEditing={() => {this.setState({password: ''})}}
                value={(this.state && this.state.password) || ''}
              />
            </View>
            <Text
              style={[baseStyles.button, baseStyles.buttonPrimary, initialView.formButton]}
              onPress={() => {
                this.onSubmit(this.state.email, this.state.userId, this.state.password);
              }}>
              ログイン
            </Text>
          </View>
          <View
            style={initialView.signupArea}>
            <Text
              style={initialView.signupDesc}>
              アカウントをお持ちの方
            </Text>
            <Text
              style={initialView.signupLink}
              onPress={() => this.onPressSigninLink()}>
              ログイン
            </Text>
          </View>
      </View>
    );
  }
}
