// Configuration for different environments
const config = {
  development: {
    serverUrl: 'http://localhost:5000',
    apiBaseUrl: ''
  },
  production: {
    serverUrl: process.env.REACT_APP_SERVER_URL || 'https://your-backend-url.herokuapp.com',
    apiBaseUrl: process.env.REACT_APP_SERVER_URL || 'https://your-backend-url.herokuapp.com'
  }
};

const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

export default currentConfig; 