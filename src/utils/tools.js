import { ElLoading } from 'element-plus'
// 全屏Loading
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
export {
  globalLoading
}
