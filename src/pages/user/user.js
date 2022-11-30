// 用户登录表单
const userLoginForm = {
  loginName: null,
  password: null
}

// 用户登录表单校验
const userLoginRule = {
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

const userForm = {
  // 姓名
  userName: null,
  // 登录名
  loginName: null,
  // 密码
  password: null,
  // 身份证号
  idCard: null,
  // 车牌号
  vehicleNo: null
}

const userRule = {
  userName: {
    rules: [
      {
        required: true,
        errorMessage: '请输入姓名'
      },
      {
        pattern: /^(?:[一-龥·]{2,16})$/,
        errorMessage: '请输入有效的姓名'
      }
    ]
  },
  loginName: {
    rules: [
      {
        required: true,
        errorMessage: '请输入登录名'
      },
      {
        pattern: /^[a-zA-Z0-9_-]{4,16}$/,
        errorMessage: '请输入有效的登录名'
      }
    ]
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请输入密码'
      },
      {
        maxLength: 20,
        errorMessage: '密码最大长度为20位'
      }
    ]
  },
  idCard: {
    rules: [
      {
        required: true,
        errorMessage: '请输入身份证号'
      },
      {
        pattern: /^[1-9][0-9]{5}(?:18|19|20)[0-9]{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2][0-9]|30|31)[0-9]{3}[0-9Xx]$/,
        errorMessage: '请输入有效的身份证号'
      }
    ]
  },
  vehicleNo: {
    rules: [
      {
        required: true,
        errorMessage: '请输入车牌号'
      },
      {
        pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
        errorMessage: '请输入有效的车牌号'
      }
    ]
  }
}

const userForgetForm = {
  loginName: null,
  oldPassword: null,
  password: null
};

const userForgetRule = {
  loginName: {
    rules: [
      {
        required: true,
        errorMessage: '请输入用户名'
      }
    ]
  },
  oldPassword: {
    rules: [
      {
        required: true,
        errorMessage: '请输入密码!'
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
}

export const user = {
  userLoginForm,
  userLoginRule,
  userForm,
  userRule,
  userForgetForm,
  userForgetRule
}
