import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  wrapper: {
    paddingRight: 5,
    paddingLeft: 5,
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
    fontSize: 12,
  },
  signupLink: {
    fontSize: 14,
    color: '#3B82FD',
  },
});