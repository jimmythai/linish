import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {GiftedChat} from 'react-native-gifted-chat';

import baseStyles from '../style/base';
import Validation from './Validation';
import Network from './Network';
import ActionCable from 'react-native-actioncable';
// import ActionCable from 'actioncable';
export default class RoomView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      user: {
        _id: props.userId,
        name: props.userId,
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
      },
    };
    this.onSend = this.onSend.bind(this);

    this.url = Network.makeUrl('ws');
    this.cable = this.cable || ActionCable.createConsumer(this.url);
  }

  componentWillMount() {
    this.makeMessages();
  }

  componentDidMount() {
    const that = this;
    this.subscription = this.cable.subscriptions.create('MessageChannel', {
      connected() {
        console.log('connected');
      },
      disconnected() {
        console.log('disconnected');
      },
      received(data) {
        console.log('received');
        const messages = [{
          _id: data.message_id,
          text: data.message,
          createdAt: new Date(data.created_at),
          user: {
            _id: data.user_id,
            name: data.user_id,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          }
        }];

        that.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, messages),
          };
        });
      },
      rejected() {
        console.log('rejected');
      }
    });

    Actions.refresh({onBack: () => {
      this.subscription.unsubscribe();
      Actions.pop();
    }});
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  makeMessages() {
    (async() => {
      const res = await Network._fetch({
        path: '/rooms/' + this.props.roomId + '/messages',
        method: 'GET',
      });

      const messages = res.messages.map(function(obj) {
        return {
            _id: obj.message_id,
            text: obj.message,
            createdAt: new Date(obj.created_at),
            user: {
              _id: obj.user_id,
              name: obj.user_id,
              avatar: 'https://facebook.github.io/react/img/logo_og.png',
            }
          }
      }).reverse();

      this.setState({
        messages: messages,
      });
    })().catch(err => {
      console.log(err);
    });
  }

  onSend(messages = []) {
    (async() => {
      console.log(messages)
      const res = await Network._fetch({
        path: '/rooms/' + this.props.roomId + '/messages/add',
        method: 'POST',
        body: {
          message: messages[0].text,
        }
      });

      // this.setState((previousState) => {
      //   return {
      //     messages: GiftedChat.append(previousState.messages, messages),
      //   };
      // });
    })().catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        user={this.state.user}
        onSend={this.onSend}
      />
    );
  }
}