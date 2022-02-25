<template>
	<view>
		<map 
			id="map"
			:longitude="longitude"
			:latitude="latitude"
			:scale="scale"
			:markers="markers"
			:enable-rotate="true"
			:show-location="true"
			:enable-overlooking="true"
			style="height: 100vh; width: 100%;"
		>
			<view class="search" @click="searchAddress">搜索</view>
			<view class="location" @click="getLocation">定位</view>
		</map>
	</view>
</template>

<script>
	// https://ext.dcloud.net.cn/plugin?id=1837
	import Map from '@/js_sdk/fx-openMap/openMap.js'
	
	export default {
		data() {
			return {
				latitude: 30.31974,
				longitude: 120.1421,
				scale: 16,
				markers: [],
				destination: {	// 导航终点点坐标和名称
					latitude: 39.98848272,
					longitude: 116.47560823,
					name: "终点名称"
				}
			}
		},
		methods: {
			// 点击弹出第三方地图
			openMap() {
				Map.routePlan({
					destination: this.destination,
					mode: "drive", // 导航方式 公交：bus,驾车：drive(默认),步行：walk,骑行：bike
					mapId: "map" // map 组件的 id (微信小程序端必传)
				})
			},
			// 获取当前经纬度
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true,
					success: ({ longitude, latitude }) => {
						this.longitude = longitude
						this.latitude = latitude
					}
				})
			},
			// 搜索地址
			searchAddress() {
				uni.chooseLocation({
					success: ({ longitude, latitude, address, name }) => {
						this.scale = 18
						this.longitude = longitude
						this.latitude = latitude
						const marker = [{
							latitude: latitude,
							longitude: longitude,
							callout: {
								content: name,
								padding: 10,
								display: 'ALWAYS',
								bgColor: '#5584ff',
								color: '#ffffff',
								textAlign: 'center',
								borderRadius: 4
							}
						}]
						this.markers = marker
					}
				})
			}
		},
		onLoad() {
			this.getLocation()
		}
	}
</script>

<style lang="scss" scoped>
.search {
	position: fixed;
	right: 15px;
	bottom: 60px;
}
.location {
	position: fixed;
	position: fixed;
	right: 15px;
	bottom: 20px;
}
</style>
