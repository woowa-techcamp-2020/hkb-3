import UserApi from './user/UserApi.js';
import TransactionApi from './transaction/transationApi.js';
import AuthApi from './auth/AuthApi.js';
import CategoryApi from './category/categoryApi.js';

export default {
  User() {
    return UserApi;
  },
  Transaction() {
    return TransactionApi;
  },
  Auth() {
    return AuthApi;
  },
  Category() {
    return CategoryApi;
  },
};