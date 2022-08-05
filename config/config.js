const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID
} = process.env;

assert(API_KEY, 'API_KEY debe estar definida');
assert(AUTH_DOMAIN, 'AUTH_DOMAIN debe estar definido');
assert(PROJECT_ID, 'PROJECT_ID debe estar definido');
assert(STORAGE_BUCKET, 'STORAGE_BUCKET debe estar definido');
assert(MESSAGING_SENDER_ID, 'MESSAGING_SENDER_ID debe estar definido');
assert(APP_ID, 'APP_ID debe estar definido');

module.exports = {
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageId: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID
    }
}