import { ElLoading, ElMessage } from 'element-plus'
const MSG_TYPE = ['info', 'success', 'warning', 'error']
// 全屏Loading
// globalLoading.show()
// globalLoading.close()s
const globalLoading = {
  loading: null,
  loadingNum: 0,
  show () {
    this.loading = ElLoading.service({
      lock: true,
      text: '请稍等...'
    })
    this.loadingNum++
  },
  close () {
    --this.loadingNum
    if (this.loadingNum <= 0) {
      this.loadingNum = 0
      this.loading && this.loading.close()
    }
  }
}

// 弹窗提示
// alertMessage.info(msg)
const alertMessage = {}
MSG_TYPE.forEach(type => {
  alertMessage[type] = (msg = '') => {
    ElMessage.closeAll()
    ElMessage({
      message: msg,
      type,
      showClose: true
    })
  }
})

// 日期格式化
const formatDate = (date, rule) => {
  let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, date.getFullYear())
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const key in o) {
    if (new RegExp(`(${key})`).test(fmt)) {
      const val = o[key] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? val : ('00' + val).substr(val.length))
    }
  }
  return fmt
}

export {
  globalLoading,
  alertMessage,
  formatDate
}
