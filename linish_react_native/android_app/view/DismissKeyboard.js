import React, { Component } from 'react';

export default class DismissKeyboard extends Component {
  constructor(props) {
    super(props);
  }

  static dismissKeyboard(refs = [], childRef = 'textField', context = this) {
    for(ref of refs) {
      let textInput = context.refs[ref].refs[childRef];
      if(textInput.isFocused()) {
        textInput.blur();
      }
    }
  }
}
