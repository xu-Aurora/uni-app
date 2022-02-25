<template>
	<view class="map-search">
		<view class="up-down-img">
			<image src="../static/image/home-up.png" mode="" v-if="boxHeight === 400"></image>
			<image src="../static/image/home-down.png" mode="" v-else></image>
		</view>
		<scroll-view 
		:style="{ height: `${boxHeight}rpx` }" 
		:scroll-y="scrollY" 
		class="scroll-Y" 
		@touchmove="handleTouchmove" 
		@touchstart="handleTouchstart" 
		@touchend="handleTouchend">
			<view class="top-content">
				<view class="trans" @click="showSearch('start')">
					<text class="trans-text">{{startInfo? startInfo.nodeName : '从哪出发'}}</text>
				</view>
				<view class="trans" @click="showSearch('end')">
					<text class="trans-text">{{endInfo? endInfo.nodeName : '您要去哪儿'}}</text>
				</view>
			</view>
			<!-- 其他列表 -->
			<!-- 其他列表 -->
		</scroll-view>
		<view class="search-content" :style="{ height: `${searchHeight}vh` }">
			<view class="input-box">
				<image src="../static/image/right-arow.png" mode="" class="right-arow" @click="searchHeight = 0"></image>
				<input type="text" v-model="searchText" placeholder="请输入" class="input"/>
			</view>
			<scroll-view scroll-y="true" :style="{ height: `calc(${searchHeight}vh - 120rpx)` }" class="search-scroll">
				<view class="address-list">
					<view class="address-item" v-for="(item,index) in addressList" :key="index" @click="getAddressInfo(item)">
						<image src="../static/image/address.png" class="address-img"></image>
						<view class="address-info">
							<view class="title">{{item.name}}</view>
							<view class="info">{{item.district + item.address}}</view>
						</view>
					</view>
				</view>
				<view class="no-data" v-if="!addressList.length">
					<image src="../static/image/no-data.png" mode="widthFix" class="no-data-img"></image>
					<text class="no-data-text">请输入搜索关键字</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
/**
 * @description map-search
 * @property {Array} searchResult 搜索地址列表
 * @property {Boolean} backEvent 返回事件
 */
	export default {
		props: {
			searchResult: {
				type: Array,
				default:() => {
					return []
				}
			},
			backEvent: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				scrollY: false,
				boxHeight: 400,
				flag: 0,
				lastX: 0,
				lastY: 0,
				searchText: '',
				addressList: [],
				searchHeight: 0,
				searchType: '',
				startInfo: null,
				endInfo: null,
				addressInfoChange: false,
			};
		},
		watch:{
			boxHeight(newVal,oldVal){
				this.scrollY = newVal !== 400
			},
			searchHeight(newVal,oldVal){
				if(!newVal) {
					this.searchText = ''
				}
			},
			searchText(newVal,oldVal){
				this.$emit('changeSearchText', newVal)
			},
			addressInfoChange(newVal,oldVal){
				this.$emit('addressInfoChange', [this.startInfo,this.endInfo])
			},
			searchResult: {
				handler:function(newVal,oldVal){
					this.addressList = [...newVal]
				},
				deep: true,
				immediate: true
			},
			backEvent(newVal,oldVal){
				this.searchHeight = 0
			}
		},
		methods: {
			// search外层滑动
			handleTouchmove(event) {
				if (this.flag !== 0) {
					return
				}
				let currentX = event.touches[0].pageX
				let currentY = event.touches[0].pageY
				let tx = currentX - this.lastX
				let ty = currentY - this.lastY
				let text = ''
				this.mindex = -1
				//左右方向滑动
				if (Math.abs(tx) > Math.abs(ty)) {
					if (tx < 0) {
						text = '向左滑动'
						this.flag = 1
					} else if (tx > 0) {
						text = '向右滑动'
						this.flag = 2
					}
				}
				//上下方向滑动
				else {
					if (ty < 0) {
						text = '向上滑动'
						this.boxHeight = 1200
						this.flag = 3
					} else if (ty > 0) {
						text = '向下滑动'
						this.boxHeight = 400
						this.flag = 4
					}
				}
		
				//将当前坐标进行保存以进行下一次计算
				this.lastX = currentX
				this.lastY = currentY
			},
			
			// search外层滑动开始
			handleTouchstart(event) {
				this.lastX = event.touches[0].pageX
				this.lastY = event.touches[0].pageY
			},
			
			// search外层滑动结束
			handleTouchend(event) {
				this.flag = 0
			},
			
			// 点击搜索类型，弹起搜索框
			showSearch(type) {
				this.searchType = type
				this.searchHeight = 90
				if(type === 'start' && this.startInfo){
					this.searchText = this.startInfo.nodeName
				}else if(type === 'end' && this.endInfo){
					this.searchText = this.endInfo.nodeName
				}
			},
			
			// 点击地址设置起始信息
			getAddressInfo(data) {
				this.searchHeight = 0
				if(this.searchType === 'start') {
					this.startInfo = {
						nodeName: data.name,
						longitude: data.location[0],
						latitude: data.location[1]
					}
				}else if(this.searchType === 'end'){
					this.endInfo = {
						nodeName: data.name,
						longitude: data.location[0],
						latitude: data.location[1]
					}
				}
				if(this.startInfo && this.endInfo){
					this.addressInfoChange = !this.addressInfoChange
				}
			},
			
			
		},
	}
</script>

<style lang="scss">
	@mixin flex {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: flex-start;
	}
	
	.map-search {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 8888;
		background-color: #F3F3F3;
		width: 100%;
		padding: 50rpx 0;
		border-radius: 50rpx 50rpx 0 0;
		.up-down-img{
			position: absolute;
			width: 100%;
			top: 0;
			left: 0;
			@include flex;
			justify-content: center;
			padding-top: 16rpx;
			image{
				width: 52rpx;
				height: 20rpx;
			}
		}
		.scroll-Y{
			width: 100%;
			height: 100%;
			padding: 30rpx 30rpx 0;
			box-sizing: border-box;
			transition: all ease 0.5s;
			.top-content {
				border-radius: 20rpx;
				position: relative;
				box-shadow: 1px 4px 10px 0px rgba(8, 172, 162, 0.2);
				padding: 30rpx 60rpx;
				margin-bottom: 60rpx;
				background: -webkit-linear-gradient(to right, #a8edea 0%, #fed6e3 100%); /* Safari 5.1 - 6.0 */
				background: -o-linear-gradient(to right, #a8edea 0%, #fed6e3 100%); /* Opera 11.1 - 12.0 */
				background: -moz-linear-gradient(to right, #a8edea 0%, #fed6e3 100%); /* Firefox 3.6 - 15 */
				background: linear-gradient(to right, #a8edea 0%, #fed6e3 100%); /* 标准的语法（必须放在最后） */
			
				.trans {
					border-bottom-style: dashed;
					border-bottom-color: #AAAAAA;
					border-bottom-width: 1rpx;
					position: relative;
					padding: 30rpx 0;
					&:last-child{
						border-bottom: none;
					}
					.trans-text {
						color: #FFFFFF;
					}
				}
			}
		}
		.search-content{
			width: 100%;
			box-sizing: border-box;
			transition: all ease 0.5s;
			position: fixed;
			bottom: 0;
			z-index: 9999;
			background: #FFFFFF;
			border-radius: 50rpx 50rpx 0 0;
		}
		.input-box{
			height: 120rpx;
			border-bottom: solid 1px #CCCCCC;
			padding: 0 20rpx;
			@include flex;
			.right-arow{
				width: 50rpx;
				height: 50rpx;
			}
			.input{
				flex: 1;
				margin-left: 20rpx;
				height: 100%;
			}
		}
		.search-scroll{
			width: 100%;
			height: 100%;
			
			.address-list{
				.address-item{
					width: calc(100% - 100rpx);
					margin: auto;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					border-bottom: solid 1rpx #EEEEEE;
					padding: 30rpx 0;
					
					.address-img{
						width:27rpx;
						height:34rpx;
						margin-left: 4rpx;
						margin-right: 18rpx;
					}
					.address-info{
						flex: 1;
						font-weight:500;
						.title{
							font-size:30rpx;
							color:rgba(51,51,51,1);
							text-align: left;
						}
						.info{
							font-size:24rpx;
							color:rgba(170,170,170,1);
							margin-top: 15rpx;
						}
					}
				}
			}
			
			.no-data{
				padding-top: 15vh;
				display: flex;
				flex-direction: column;
				align-items: center;
				.no-data-img{
					width: 400rpx;
				}
				.no-data-text{
					font-size: 34rpx;
					margin-top: 50rpx;
					color: #999999;
				}
			}
		}
	}
</style>
