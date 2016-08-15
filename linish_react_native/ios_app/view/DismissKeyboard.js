import React, { Component } from 'react';

export default class DismissKeyboard extends Component {
  constructor(props) {
    super(props);
  }

  static dismissKeyboard(refs) {
    for(ref of refs) {
      let textInput = this.refs[ref];
      if(textInput.isFocused()) {
        textInput.blur();
      }
    }
  }
}