<script>
	export default {
		onLaunch: function() {
			// 热启动时实现版本更新
			if (uni.canIUse('getUpdateManager')) {
				// 创建 updateManager 实例
				const updateManager = uni.getUpdateManager()
				// 检查是否有新版本
				updateManager.onCheckForUpdate(function(res) {
					// hasUpdate 指是否有新版本，为 boolean 值
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										// 强制更新版本
										updateManager.applyUpdate()
									}
								}
							})
						}),
						updateManager.onUpdateFailed(function() {
							uni.showModal({
								title: '已经有新版本了',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开'
							})
						})
					}
				})
			} else {
				wx.showModal({
						title: '提示',
						content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
