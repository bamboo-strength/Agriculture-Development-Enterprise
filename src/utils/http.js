export const request = options => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      success: result => {
        if (result.statusCode === 200) {
          return resolve(result.data);
        }
        return reject(result.data)
      },
      fail: error => {
        uni.showToast({
          icon: 'error',
          title: error || '系统异常!'
        })
        reject(error);
      }
    })
  })
}
