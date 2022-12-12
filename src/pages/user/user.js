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
  // 注册类型
  roleType: 1,
  // 姓名
  userName: null,
  // 登录名
  loginName: null,
  // 密码
  password: null,
  // 客户编号
  custNo: null,
  // 身份证号
  idCard: null,
  // 车牌号
  vehicleNo: null,
  // 单位信息
  organizationId: null
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
  organizationId: {
    rules: [
      {
        required: true,
        errorMessage: '请选择单位信息'
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
