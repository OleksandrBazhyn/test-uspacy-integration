require('dotenv').config();
const { startTokenLifecycle, getToken } = require('./tokenManager');

(async () => {
  try {
    console.log('Starting application...');
    
    await startTokenLifecycle();
    console.log('ℹ️ Token lifecycle started.');

    const token = getToken();
    console.log('ℹ️ Current token:', token);

    // Other processes

  } catch (err) {
    console.error('❌Error in application:', err);
  }
})();
