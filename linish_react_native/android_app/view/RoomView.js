import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {GiftedChat, Composer, Bubble, MessageText, Time, Day} from 'react-native-gifted-chat';

import baseStyles from '../style/base';
import Validation from './Validation';
import Network from './Network';
import ActionCable from 'react-native-actioncable';
import BackHandler from './BackHandler';
import HeaderView from './HeaderView';

// import ActionCable from 'actioncable';
export default class RoomView extends Component {
  constructor(props) {
    super(props);

    const routeStack = props.navigator.state.routeStack;
    this.route = routeStack[routeStack.length - 1];
    this.state = {
      messages: [],
      user: {
        _id: this.route.userId,
        name: this.route.userId,
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
      },
      renderPlaceholderOnly: true,
    };
  }

  componentDidMount() {
    const that = this;

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        renderPlaceholderOnly: false,
      });

      BackHandler.popToPrevious(this.props.navigator, () => {
        this.subscription.unsubscribe();
      });

      this.makeMessages();
      this.subscribeMessageChannel();
    });
  }

  subscribeMessageChannel() {
    this.url = Network.makeUrl('ws');
    this.cable = this.cable || ActionCable.createConsumer(this.url);

    this.subscription = this.cable.subscriptions.create('MessageChannel', {
      connected() {
      },
      disconnected() {
      },
      received(data) {
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
  }

  makeMessages() {
    (async() => {
      const res = await Network._fetch({
        path: '/rooms/' + this.route.roomId + '/messages',
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
      const res = await Network._fetch({
        path: '/rooms/' + this.route.roomId + '/messages/add',
        method: 'POST',
        body: {
          message: messages[0].text,
        }
      });
    })().catch(err => {
      console.log(err);
    });
  }

  renderComposer(props) {
    return (
      <Composer
        {...props}
        refs = 'textInput'
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#F0F0F0',
          },
          right: {
            backgroundColor: '#87E64A',
          }
        }}
      />
    );
  }

  renderMessageText(props) {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: {
            fontSize: 15,
            color: '#333333',
          },
          right: {
            fontSize: 15,
            color: '#333333',
          }
        }}
      />
    );
  }

  renderDay(props) {
    return (
      <Day
        {...props}
        wrapperStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.26)',
          paddingTop: 3,
          paddingBottom: 4,
          paddingHorizontal: 8,
          borderRadius: 12,
        }}
        textStyle={{
          fontSize: 11,
          fontWeight: 'normal',
          color: '#F0F0F0'
        }}
      />
    );
  }

  renderTime(props) {
    return (
      <Time
        {...props}
        textStyle={{
          left: {
            fontSize: 10,
            color: '#333333',
          },
          right: {
            fontSize: 10,
            color: '#333333',
          }
        }}
      />
    );
  }

  _renderPlaceholderView() {
    return (
      <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#7292C1'}}></View>
    );
  }

  render() {
    if(this.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }

    return (
      <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#7292C1'}}>
        <HeaderView
          title={this.route.title}
          rightButtonVisible={false}
        />
        <GiftedChat
          renderComposer={this.renderComposer.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          renderMessageText={this.renderMessageText.bind(this)}
          renderTime={this.renderTime.bind(this)}
          renderDay={this.renderDay.bind(this)}
          onSend={this.onSend.bind(this)}
          messages={this.state.messages}
          user={this.state.user}
        />
      </View>
    );
  }
}

const selfStyles = StyleSheet.create({
  bubbleLeft: {

  },
  bubbleRight: {
    
  }
});