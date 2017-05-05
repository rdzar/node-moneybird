import https from '../libs/https';

export default class Client {
  constructor (token, administrationId, version = 'v2') {
    this.administrationId = administrationId;
    this.version = version;
    this.token = token;
    this.format = 'json';
  }

  get (...args) {
    return this.request(...['get'].concat(...args));
  }

  post (...args) {
    return this.request(...['post'].concat(...args));
  }

  put (...args) {
    return this.request(...['patch'].concat(...args));
  }

  patch (...args) {
    return this.request(...['patch'].concat(...args));
  }

  delete (...args) {
    return this.request(...['delete'].concat(...args));
  }

  request (...args) {
    const method = String(args[0]).toUpperCase();
    return https.request({
      'hostname': 'moneybird.com',
      'headers': {
        'Authorization': 'Bearer ' + this.token
      },
      'path': '/api/' + this.version + '/' + this.administrationId + '/' + (Client.requestHasBody(method) ? args.slice(1, -1) : args.slice(1)).join('/') + '.' + this.format,
      'port': 443,
      'method': method,
      'body': (Client.requestHasBody(method) ? args.slice(-1)[0] : null)
    });
  }

  static requestHasBody (method) {
    return method === 'POST' || method === 'PATCH';
  }
}
