import React, { Component } from 'react';

export default class DismissKeyboard extends Component {
  constructor(props) {
    super(props);
  }

  static dismissKeyboard(refs = [], childRef = 'textField') {
    for(ref of refs) {
      console.log('dismissed1')
      let textInput = this.refs[ref].refs[childRef];
      if(textInput.isFocused()) {
        console.log('dismissed2')
        textInput.blur();
      }
    }
  }
}
