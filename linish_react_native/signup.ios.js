import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Navigator,
} from 'react-native'

class SignupView extends Component {
  render() {
    return (
      <View style={[baseStyles.wrapper, loginStyles.wrapper]}>
          <View>
            <Text
              style={[baseStyles.font, loginStyles.pageTitle]}>
              ログイン
            </Text>
            <View
              style={loginStyles.textBoxArea}
              >
              <TextInput
                style={[baseStyles.textBox, loginStyles.textBox, loginStyles.textBoxTop]}
                // TODO: set up validation and behabier
                placeholder={placeholderText.userId}
                placeholderTextColor={ placeholderTextColor }
                onChangeText={(text) => {this.setState({text})}}
                onSubmitEditing={() => {this.setState({text: ''})}}
                value={(this.state && this.state.text) || ''}
              />
              <TextInput
                style={[baseStyles.textBox, loginStyles.textBox]}
                // TODO: set up validation and behabier
                placeholder={placeholderText.password}
                placeholderTextColor={ placeholderTextColor }
                onChangeText={(text) => {this.setState({text})}}
                onSubmitEditing={() => {this.setState({text: ''})}}
                value={(this.state && this.state.text) || ''}
              />
            </View>
            <Text
              style={[baseStyles.button, baseStyles.buttonPrimary, loginStyles.formButton]}>
              ログイン
            </Text>
          </View>
          <View
            style={loginStyles.signupArea}>
            <Text
              style={loginStyles.signupDesc}>
              新規ではじめる
            </Text>
            
              <Navigator
                initialRoute={{title: '', index: 0}}
                renderScene={(route, navigator) => 
                  <Text
                    style={loginStyles.signupLink}>
                    アカウント作成
                  </Text>
                }
              />
            
          </View>
      </View>
    );
  }
}

const window = Dimensions.get('window');
const placeholderTextColor = '#CACACF';
const placeholderText = {
  userId: 'ユーザーID（半角英数25文字以内）',
  password: 'パスワード（半角英数8〜100文字）',
}
const baseStyles = StyleSheet.create({
  font: {
    fontFamily: 'Helvetica Neue',
    fontWeight: 'normal',
    fontSize: 16,
    color: '#333333',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
  },
  container: {
    
  },
  button: {
    padding: 12,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  buttonPrimary: {
    backgroundColor: '#40AE10',
  },
  buttonSecondary: {
  },
  buttonTertiary: {
  },
  buttonDisabled: {
  },
  buttonDanger: { 
  },
  textBox: {
    height: 40,
    paddingLeft:  7,
    paddingRight: 7,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  list: {
    
  }
});
const loginStyles = StyleSheet.create({
  wrapper: {
    paddingRight: 15,
    paddingLeft: 15,
    marginTop: 40,
    marginBottom: 40
  },
  pageTitle: {
    textAlign: 'center',
    fontWeight: "bold",
  },
  textBoxArea: {
    marginTop: 30,
  },
  textBox: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  textBoxTop: {
    marginTop: 0,
  },
  formButton: {
    marginTop: 35,
    marginRight: 10,
    marginLeft: 10,
  },
  signupArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  signupDesc: {
    marginRight: 8,
    fontSize: 14,
  },
  signupLink: {
    fontSize: 12,
    color: '#3B82FD',
  },
});

AppRegistry.registerComponent('linish_react_native', () => SignupView);
