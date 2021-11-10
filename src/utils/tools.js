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
    ElMessage({
      message: msg,
      type,
      showClose: true
    })
  }
})

// 弹窗提示
export {
  globalLoading,
  alertMessage
}
