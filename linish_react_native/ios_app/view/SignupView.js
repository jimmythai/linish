import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  Navigator,
  AsyncStorage,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import baseStyles from '../style/base';
import initialView from '../style/initialView';
import Validation from './Validation';
import Network from './Network';
import DismissKeyboard from './DismissKeyboard';

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
    Actions.signin();
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

      if(res.code === 400) {
        Alert.alert(
          'Duplicate account',
          '入力したユーザー名またはメールアドレスはすでに登録されています',
          [
            {text: 'OK', style: 'default'},
          ]
        );
      } else {
        try {
          await AsyncStorage.setItem('access_token', res.access_token);
          await Actions.tabbar();
          // await this.props.navigator.push({index: 2,});
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
      <TouchableWithoutFeedback
        onPress={DismissKeyboard.dismissKeyboard.bind(this, ['email', 'userId', 'password'])}
      >
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
                  ref='email'
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
                  ref='userId'
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
                  ref='password'
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
              <TouchableOpacity onPress={() => this.onSubmit(this.state.email, this.state.userId, this.state.password)}>
                <Text style={[baseStyles.button, baseStyles.buttonPrimary, initialView.formButton]}>
                  新規登録
                </Text>
              </TouchableOpacity>
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
      </TouchableWithoutFeedback>
    );
  }
}
