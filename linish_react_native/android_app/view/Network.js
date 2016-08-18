// import { ActionCable } from 'actioncable-js';
// import ActionCable from 'actioncable';
import {
  AsyncStorage,
} from 'react-native';

export default class Network {
  constructor() {
    this.HTTP_PROTOCOL = 'http:';
    this.WEBSOCKET_PROTOCOL = 'ws:';
    this.HOST = '//192.168.100.103:3000';
    this.API_DIRECTORY = '/api';
    this.API_VERSION = '/v1';
    this.WEBSOCKET_DIRECTORY = '/cable';
  }
  
  static makeUrl(protocol, path) {
    const nw = new Network();
    let url;

    switch(protocol) {
      case 'http':
        url = nw.HTTP_PROTOCOL + nw.HOST + nw.API_DIRECTORY + nw.API_VERSION + path;
        break;
      case 'ws':
        url = nw.WEBSOCKET_PROTOCOL + nw.HOST + nw.WEBSOCKET_DIRECTORY;
        break;
    }
    return url;
  }

  static makeQueryString() {
    
  }

  static async getAccessToken() {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      return accessToken;
    } catch(err) {
      return '';
    }
  }

  static async _fetch({path = '', method = 'GET', body = {}} = {}) {
    let url = this.makeUrl('http', path);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const hasAccessToken = !(path === '/accounts/signup' || path === '/accounts/signin');
    let res;

    return (async() => {
      try {
        switch(method) {
          case 'GET':
            if(hasAccessToken) {
              const accessToken = await this.getAccessToken();
              url = await url + '?access_token=' + accessToken;
            }
            res = await fetch(url);
            break;

          case 'POST':
            if(hasAccessToken) {
              const accessToken = await this.getAccessToken();
              body.access_token = await accessToken;
            }
            res = await fetch(url, {
              method: method,
              headers: headers,
              body: JSON.stringify(body)
            });
            break;
        }

        const json = await res.json();

        if (!res.ok) {
          await console.warn(
            'ResponseError\n',
            {
              status: res.status,
              message: res.statusText,
              responseJson: json,
            }
          );
        }
        return await json;
      } catch(err) {
        return await err;
      }
    })();
  }

  static connectCable() {
    const url = this.makeUrl('ws');
    const cable = ActionCable.createConsumer(url);
    return cable;
  }
}