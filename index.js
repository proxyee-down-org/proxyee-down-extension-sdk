const buildPromiseCommon = (asyncFunc, syncFunc, args) => {
  return new Promise((resolve, reject) => {
    if (pdown) {
      if (pdown[asyncFunc]) {
        pdown[asyncFunc](...args, response => resolve(response), error => reject(error))
      } else if (pdown[syncFunc]) {
        try {
          resolve(pdown[syncFunc](...args))
        } catch (error) {
          reject(error)
        }
      }
    }
  })
}

export default {
  /**
   * 根据下载请求解析响应相关内容
   * @param {Object} request 下载请求
   */
  resolve(request) {
    return buildPromiseCommon('resolveAsync', 'resolve', [request])
  },

  /**
   * 创建一个任务，会唤醒Proxyee Down并弹出下载框
   * @param {Object} taskForm 下载任务请求
   */
  createTask(taskForm) {
    return buildPromiseCommon('createTaskAsync', 'createTask', [taskForm])
  },

  /**
   * 创建一个任务，不弹下载框直接在后台下载
   * @param {Object} taskForm 下载任务请求
   */
  pushTask(taskForm) {
    return buildPromiseCommon('pushTask', '', [taskForm])
  },

  /**
   * 刷新一个任务的请求信息
   * @param {String} id 任务ID
   * @param {Object} request 下载请求
   */
  refreshTask(id, request) {
    return buildPromiseCommon('refreshTaskAsync', 'refreshTask', [id, request])
  },

  /**
   * 暂停一个任务
   * @param {String} id 任务ID
   */
  pauseTask(id) {
    return buildPromiseCommon('pauseTaskAsync', 'pauseTask', [id])
  },

  /**
   * 恢复一个任务
   * @param {String} id 任务ID
   */
  resumeTask(id) {
    return buildPromiseCommon('resumeTaskAsync', 'resumeTask', [id])
  },

  /**
   * 删除一个任务
   * @param {String} id 任务ID
   * @param {Boolean} delFile 是否删除文件
   */
  deleteTask(id, delFile) {
    return buildPromiseCommon('deleteTaskAsync', 'deleteTask', [id, delFile])
  },

  /**
   * 取下载相关配置信息
   */
  getDownConfig() {
    return buildPromiseCommon('getDownConfigAsync', 'getDownConfig', [])
  },

  /**
   * 取目标网站的cookie，支持HttpOnly cookie，需要经过代理服务器才能生效
   * @param {string} url 要获取的网站url，空则为当前网址
   */
  getCookie(url) {
    return buildPromiseCommon('getCookieAsync', 'getCookie', [url || '/'])
  }
}

/**
 * 简单模拟jQuery的ajax函数
 */
export const jQuery = window.jQuery || {
  ajax() {
    let settings
    if (arguments.length == 2) {
      settings = arguments[1]
      settings.url = arguments[0]
    } else {
      settings = arguments[0]
    }
    const xhr = new XMLHttpRequest()
    const options = {
      ...{
        method: 'GET',
        url: settings.url,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {},
        data: null,
        dataType: null,
        success() {},
        error() {},
        complete() {}
      },
      ...settings
    }
    let hasRequestBody = false
    if (options.method.toUpperCase === 'POST' || options.method.toUpperCase === 'PUT') {
      xhr.setRequestHeader('Content-Type', options.contentType)
      hasRequestBody = true
    }
    if (document.cookie) {
      xhr.setRequestHeader('Cookie', document.cookie)
    }
    for (const key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key])
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let result = xhr.responseText
          if (options.dataType) {
            if (options.dataType.toUpperCase() === 'JSON') {
              result = JSON.parse(result)
            }
          } else if (xhr.getResponseHeader('content-type').match(/^.*json.*$/i)) {
            result = JSON.parse(result)
          }
          options.success(result, xhr.status, xhr)
        } else {
          options.error(xhr, xhr.status)
        }
        options.complete(xhr, xhr.status)
      }
    }
    let data
    if (options.data) {
      if (options.data.toString() === '[object Object]') {
        data = ''
        for (const key in options.data) {
          if (data) {
            data += '&'
          }
          data += key + '=' + options.data[key]
        }
      } else {
        data = options.data
      }
    }
    if(!hasRequestBody){
      if(options.url.indexOf('?') === -1){
        options.url += '?'
      }
      if(options.url.indexOf('&') !== -1){
        options.url += '&'
      }
      options.url += data
      xhr.open(options.method, options.url)
      xhr.send()
    }else{
      xhr.open(options.method, options.url)
      xhr.send(data ? data : null)
    }
  }
}