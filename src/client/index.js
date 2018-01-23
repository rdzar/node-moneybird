import https from '../libs/https';

export default class Client {
  constructor (token, administrationId, version = 'v2') {
    this.administrationId = administrationId;
    this.version = version;
    this.token = token;
    this.format = 'json';
    this.hostname = 'moneybird.com';
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
    const path = '/api/' + this.version + '/' + this.administrationId + Client.requestEndpoint(method, args) + '.' + this.format + Client.requestQueryString(method, args);
    console.log(path);
    return https.request({
      'hostname': this.hostname,
      'headers': {
        'Authorization': 'Bearer ' + this.token
      },
      'path': path,
      'port': 443,
      'method': method,
      'body': Client.requestBody(method, args)
    });
  }

  static requestHasBody (method) {
    return method === 'POST' || method === 'PATCH';
  }

  // Checks wether the request contains a query object
  static requestHasQuery(method, args) {
    if (args.length <= 2) { return false; }
    const objectCount = args.reduce((prev, cur) => {
        return cur instanceof Object ? prev + 1 : prev;
    }, 0);

    if (Client.requestHasBody(method) && objectCount >= 2) {
      return true;
    } else if (!Client.requestHasBody(method) && objectCount >= 1) {
      return true;
    }

    return false;
  }

  // Checks wether the request contains a body object
  static requestBody(method, args) {
    if (Client.requestHasBody(method)) {
      return Client.requestHasQuery(method, args) ? args[args.length - 2] : args[args.length - 1];
    }
    return null;
  }

  // Returns the query string when the request contains a query object, else an empty string
  static requestQueryString(method, args) {
    if (!Client.requestHasQuery(method, args)) {
      return '';
    }

    let queryParams = args[args.length - 1];
    if (!queryParams instanceof Object) {
      return '';
    }

    let queryString = '';
    for (let queryParamKey in queryParams) {
      let queryParamValue = queryParams[queryParamKey];
      queryString = queryString + (queryString == '' ? '?' : '&');
      queryString = queryString + encodeURIComponent(queryParamKey) + '=' + encodeURIComponent(queryParamValue);
    }

    return queryString;
  }

  // Returns the requested endpoint, joins all the parts together and makes sure the slashes match up
  static requestEndpoint(method, args) {
    let endIndex = args.length;

    if (Client.requestHasBody(method, args)) {
      endIndex--;
    }

    if (Client.requestHasQuery(method, args)) {
      endIndex--;
    }

    let parts = args.slice(1, endIndex).filter((item) => {
      return item !== Object(item);
    });

    if (parts.length > 1) {
      return '/' + parts.join('/');
    } else if (parts.length == 1) {
      return '/' + parts[0];
    }

    return '';
  }
}
