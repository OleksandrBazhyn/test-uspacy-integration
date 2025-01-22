require('dotenv').config();
const axios = require('axios');

let SESSION_TOKEN;

const startTokenLifecycle = async () => {
  try {
    console.log('Starting initial token fetch...');
    
    const optionsFetch = {
      method: 'POST',
      url: `https://${process.env.SPACE}.uspacy.ua/auth/v1/auth/sign_in`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      data: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    };

    const res = await axios.request(optionsFetch);

    SESSION_TOKEN = res.data.refreshToken;
    let expireInSeconds = res.data.expireInSeconds;

    console.log('✅ New token fetched successfully.');
    console.log(`ℹ️ Token: ${SESSION_TOKEN}`);
    console.log(`⏳ Token will expire in ${expireInSeconds} seconds.`);

    const refreshToken = async () => {
      try {
        console.log('Starting token refresh...');

        const optionsRefresh = {
          method: 'POST',
          url: `https://${process.env.SPACE}.uspacy.ua/auth/v1/auth/refresh_token`,
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${SESSION_TOKEN}`,
          },
        };

        const res = await axios.request(optionsRefresh);

        SESSION_TOKEN = res.data.refreshToken;
        expireInSeconds = res.data.expireInSeconds;

        console.log('🔄 Token refreshed successfully.');
        console.log(`ℹ️ New Token: ${SESSION_TOKEN}`);
        console.log(`⏳ Token will expire in ${expireInSeconds} seconds.`);

        // Запуск наступного оновлення
        setTimeout(refreshToken, expireInSeconds * 1000);
      } catch (err) {
        console.error('❌ Error refreshing token:', err);
        console.log('🔁 Retrying token refresh in 5 seconds...');
        setTimeout(refreshToken, 5000); // Повторна спроба оновлення токена
      }
    };

    // Запуск оновлення токена перед закінченням його терміну дії
    setTimeout(refreshToken, expireInSeconds * 1000);
  } catch (err) {
    console.error('❌ Error fetching token:', err);
    console.log('🔁 Retrying token fetch in 5 seconds...');
    setTimeout(startTokenLifecycle, 5000); // Повторна спроба отримання токена
  }
};

startTokenLifecycle();