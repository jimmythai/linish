import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  Navigator,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import baseStyles from '../style/base';
import initialView from '../style/initialView';
import Validation from './Validation';
import Network from './Network';
import TextField from './TextField';

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
    this.props.navigator.resetTo({key: 'signin',});
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

      if(await res.code === 400) {
        Alert.alert(
          'Duplicate account',
          '入力したユーザー名またはメールアドレスはすでに登録されています',
          [
            {text: 'OK', style: 'default'},
          ]
        );
      } else {
        try {
          AsyncStorage.setItem('access_token', res.access_token);
          this.props.navigator.resetTo({key: 'maintabbar',});
          // this.props.navigator.push({index: 2,});
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
        <View
          style={initialView.textBoxArea}
        >
          <TextField
            hasFloating={true}
            placeholder={this.placeholderText.email}
            autoCapitalize='none'
            keyboardType='email-address'
            autoCorrect={false}
            onChangeText={(email) => {this.setState({email})}}
            onSubmitEditing={() => {this.setState({email: ''})}}
            value={(this.state && this.state.email) || ''}
          />
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
    );
  }
}