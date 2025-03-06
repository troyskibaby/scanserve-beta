const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://scanserve-api.azurewebsites.net',
      changeOrigin: true,
      secure: true, // set to false if you have self-signed certificates
      cookieDomainRewrite: {
        "*": "localhost"
      }
    })
  );
};
