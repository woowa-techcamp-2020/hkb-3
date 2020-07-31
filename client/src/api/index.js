import UserApi from './user/UserApi.js';
import TransactionApi from './transaction/transationApi.js';

export default {
  User() {
    return UserApi;
  },
  Transaction() {
    return TransactionApi;
  },
};