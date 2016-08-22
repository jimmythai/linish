import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import {GiftedChat, Composer, Bubble, MessageText, Time, Day} from 'react-native-gifted-chat';

import ActionCable from 'react-native-actioncable';

import Validation from '../Validation';
import Network from '../Network';
import BackHandler from '../BackHandler';
import HeaderView from '../HeaderView';

export default class Room extends Component {
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
    const that = this;
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

  async makeMessages() {
    const res = await Network._fetch({
      path: '/rooms/' + this.route.roomId + '/messages',
      method: 'GET',
    });

    const messages = await res.messages.map(function(obj) {
      const createdAt = new Date(obj.created_at);
      return {
          _id: obj.message_id,
          text: obj.message,
          createdAt: createdAt,
          user: {
            _id: obj.user_id,
            name: obj.user_id,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          }
        }
    }).reverse();

    await this.setState({
      messages: messages,
    });
  }

  async onSend(messages = []) {
    const res = await Network._fetch({
      path: '/rooms/' + this.route.roomId + '/messages/add',
      method: 'POST',
      body: {
        message: messages[0].text,
      }
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
          left: selfStyles.leftBubble,
          right: selfStyles.rightBubble,
        }}
      />
    );
  }

  renderMessageText(props) {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: selfStyles.messageText,
          right: selfStyles.messageText,
        }}
      />
    );
  }

  renderDay(props) {
    return (
      <Day
        {...props}
        wrapperStyle={selfStyles.dayWrapper}
        textStyle={selfStyles.dayText}
      />
    );
  }

  renderTime(props) {
    return (
      <Time
        {...props}
        textStyle={{
          left: selfStyles.timeText,
          right: selfStyles.timeText,
        }}
      />
    );
  }

  _renderPlaceholderView() {
    return (
      <View style={selfStyles.wrapper}></View>
    );
  }

  render() {
    if(this.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }

    return (
      <View style={selfStyles.wrapper}>
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
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#7292C1',
  },
  timeText: {
    fontSize: 10,
    color: '#333333',
  },
  dayWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
    paddingTop: 3,
    paddingBottom: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dayText: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#F0F0F0',
  },
  messageText: {
    fontSize: 15,
    color: '#333333',
  },
  leftBubble: {
    backgroundColor: '#F0F0F0',
  },
  rightBubble: {
    backgroundColor: '#87E64A',
  },
});