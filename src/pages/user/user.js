const userRules = {
  loginName: {
    rules: [
      {
        required: true,
        errorMessage: '请输入用户名'
      }
    ]
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请输入密码!'
      }
    ]
  }
};

export const user = {
  userRules
}
