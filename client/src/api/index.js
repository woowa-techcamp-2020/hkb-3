import UserApi from './user/UserApi.js';
import TransactionApi from './transaction/transationApi.js';
import CategoryApi from './category/categoryApi.js';

export default {
  User() {
    return UserApi;
  },
  Transaction() {
    return TransactionApi;
  },
  Category() {
    return CategoryApi;
  },
};