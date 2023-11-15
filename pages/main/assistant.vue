<template>
	<view>
		<view v-if="isDevelop">
			<view class="login-content">
				<view class="login-title">
					文件查询
				</view>
				<view class="iphone">
					<input type="text" placeholder="输入文件名" />
					<uni-icons type="closeempty" color="#808080" size="25"></uni-icons>
				</view>
		
				<view class="password">
					<input placeholder="请输入文件路径" />
					<uni-icons type="eye-filled" color="#808080" size="25"></uni-icons>
				</view>
				<view class="test">
					<input type="text" placeholder="输入关键词" />
					<view class="get-test" type="default">获取</view>
				</view>
				<button class="mybutton" @click="showMessage">点击我</button>
			</view>
		</view>
		<view v-if="!isDevelop">
			<cu-custom bgColor="bg-cyan" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">角色列表</block>
			</cu-custom>
			<view class="box">
				<view style="height: 2px;"></view> <!-- 2px 的间隔 -->
				<view class="boxitem">
					<view class="boxitem1">
						<text class="title">收藏</text>
						<text class="title1">FAVORITE</text>
					</view>
					<view style="display: flex;flex-direction: column;">
						<block v-for="(x,i) in favoriteList" :key="i">
							<view class="dataList">
								<view style="display: flex;flex-direction: row;justify-content: space-between;">
									<view class="dataListStyle" @click="toIndex(x)">
										<view>
											<image :src="x.image"
												style="height: 60px;width: 60px;padding-top: 6px;padding-right: 12px;padding-bottom: 6px;">
											</image>
										</view>
										<view style="display: flex;flex: 1;flex-direction: column;">
											<text
												style="font-size: 15px;padding-top: 10px;padding-bottom: 5px;">{{x.name}}</text>
											<text class="clamp-two-lines">{{x.description}}</text>
										</view>
									</view>
									<view class="rightDetail">
										<view style="padding: 6px;">
											<image
												:src="x.favorite < 10 ? '../../static/cold.png': x.favorite < 10000 ?'../../static/hot.png':'../../static/veryhot.png'"
												class="myheal"></image>
											<text
												style="padding-left: 2px;">{{x.favorite > 10000 ? (x.favorite/10000).toFixed(1) + 'w':x.favorite }}</text>
										</view>
										<view class="myview" @click="open(x)">
											<image src="../../static/info.png" class="myimage"></image>
											<text class="text-blue" style="font-size: 10px;">详情</text>
										</view>
									</view>
								</view>
							</view>
							<view style="background: #E0E3DA;width: 100%;height: 1rpx;"></view> <!-- 2px 的间隔 -->
						</block>
					</view>
				</view>
				<view class="spacer"></view> <!-- 2px 的间隔 -->
				<view class="boxitem">
					<view class="boxitem2">
						<view class="boxitem1">
							<text class="title">热门推荐</text>
							<text class="title1">RECOMMEND</text>
						</view>
						<view style="padding-top: 10px;" @click="$squni.navigateTo('/pages/main/prompt')">
							<text style="padding-right: 15px;color: #58b8b3;">查看更多>></text>
						</view>
					</view>
					<view style="display: flex;flex-direction: column;">
						<block v-for="(x,i) in recommendlist" :key="i">
							<view class="dataList">
								<view style="display: flex;flex-direction: row;justify-content: space-between;">
									<view class="dataListStyle" @click="toIndex(x)">
										<view>
											<image :src="x.image"
												style="height: 60px;width: 60px;padding-top: 6px;padding-right: 12px;padding-bottom: 6px;">
											</image>
										</view>
										<view style="display: flex;flex: 1;flex-direction: column;">
											<text
												style="font-size: 15px;padding-top: 10px;padding-bottom: 5px;">{{x.name}}</text>
											<text class="clamp-two-lines">{{x.description}}</text>
										</view>
									</view>
									<view class="rightDetail">
										<view style="padding: 6px;">
											<image
												:src="x.favorite < 10 ? '../../static/cold.png': x.favorite < 10000 ?'../../static/hot.png':'../../static/veryhot.png'"
												class="myheal"></image>
											<text
												style="padding-left: 2px;">{{x.favorite > 10000 ? (x.favorite/10000).toFixed(1) + 'w':x.favorite }}</text>
										</view>
										<view class="myview" @click="open(x)">
											<image src="../../static/info.png" class="myimage"></image>
											<text class="text-blue" style="font-size: 10px;">详情</text>
										</view>
									</view>
								</view>
							</view>
							<view style="background: #E0E3DA;width: 100%;height: 1rpx;"></view> <!-- 2px 的间隔 -->
						</block>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" background-color="#fff">
				<scroll-view scroll-y style="height: 500px;">
					<view style="display: flex;flex-direction: row;padding-top: 5px;align-items: center;">
						<text style="font-size: 17px;padding-left: 37%;">提示词详细</text>
						<uni-fav :checked="detail.isFavorite=='1'" class="favBtn" :circle="true" bg-color="#dd524d"
							bg-color-checked="#007aff" fg-color="#ffffff" fg-color-checked="#ffffff" @click="favClick"
							style="padding-left: 2%;" />
						<view style="flex: 1;" @click="toIndex(detail)">
							<text style="color:#58b8b3 ;padding-left: 30px;">进入对话</text>
						</view>
					</view>
					<view
						style="padding-top: 30px;display: flex;flex-direction: row;padding-left: 15px;padding-bottom: 10px;">
						<view style="background-color: #58b8b3;width: 6px;border-radius: 30rpx;">
						</view>
						<view style="flex: 1;padding-left: 15px;">
							<text>提示词</text>
						</view>
					</view>
					<view style="background: #E0E3DA;width: 100%;height: 1px;"></view>
					<view style="padding-top: 5px;">
						<view
							style="display: flex;flex-direction: row;justify-content: space-between;padding-left: 13px;align-items: center;">
							<text style="font-size: 15px;">{{detail.name}}</text>
							<view style="padding: 6px;">
								<image
									:src="detail.favorite < 10 ? '../../static/cold.png': detail.favorite < 10000 ?'../../static/hot.png':'../../static/veryhot.png'"
									class="myheal"></image>
								<text
									style="font-size: 15px;padding-left: 2px;padding-right: 5px;">{{detail.favorite > 10000 ? (detail.favorite/10000).toFixed(1) + 'w':detail.favorite }}</text>
							</view>
						</view>
					</view>
					<view
						style="padding-top: 25px;display: flex;flex-direction: row;padding-left: 15px;padding-bottom: 10px;">
						<view style="background-color: #58b8b3;width: 6px;border-radius: 30rpx;">
						</view>
						<view style="flex: 1;padding-left: 15px;">
							<text>说明</text>
						</view>
					</view>
					<view style="background: #E0E3DA;width: 100%;height: 1px;"></view>
					<view style="padding-top: 5px;padding-right: 2px;">
						<view style="padding-left: 13px;padding-right: 10px;">
							<text style="font-size: 15px;">{{detail.description}}</text>
						</view>
					</view>
					<view
						style="padding-top: 25px;display: flex;flex-direction: row;padding-left: 15px;padding-bottom: 10px;">
						<view style="background-color: #58b8b3;width: 6px;border-radius: 30rpx;">
						</view>
						<view style="flex: 1;padding-left: 15px;">
							<text>中文提示</text>
						</view>
					</view>
					<view style="background: #E0E3DA;width: 100%;height: 1px;"></view>
					<view style="padding-top: 5px;padding-right: 2px;">
						<view style="padding-left: 13px;padding-right: 10px;">
							<text style="font-size: 15px;">{{detail.contentZh}}
							</text>
						</view>
					</view>
					<view
						style="padding-top: 25px;display: flex;flex-direction: row;padding-left: 15px;padding-bottom: 10px;">
						<view style="background-color: #58b8b3;width: 6px;border-radius: 30rpx;">
						</view>
						<view style="flex: 1;padding-left: 15px;">
							<text>英文提示</text>
						</view>
					</view>
					<view style="background: #E0E3DA;width: 100%;height: 1px;"></view>
					<view style="padding-top: 5px;padding-right: 2px;">
						<view style="padding-left: 13px;padding-right: 10px;">
							<text style="font-size: 15px;">{{detail.contentEn}}
							</text>
						</view>
					</view>
				</scroll-view>
			</uni-popup>
		</view>
	</view>

</template>

<script>
	import {
		getPromptTypeTop10,
		getFavoritePrompt,
		saveFavoritePrompt,
		cannelFavoritePrompt
	} from '@/api/chat.js'
	export default {
		data() {
			return {
				favoriteList: [],
				recommendlist: [],
				detail: '',
				checkList: false,
				isDevelop: 'true',
			}
		},
		beforeMount() {
			this.isDevelop = this.globalData.IsDevelop // 访问全局变量
		},
		onShow() {
			getPromptTypeTop10().then(res => {
				this.recommendlist = res.data
			})
			getFavoritePrompt().then(res => {
				this.favoriteList = res.data
			})
		},
		methods: {
			open(x) {
				this.detail = x;
				this.$refs.popup.open()
			},
			favClick() {
				this.detail.isFavorite = !this.detail.isFavorite
				this.$forceUpdate();
				if (!this.detail.isFavorite) { // 取消收藏
					const id = this.detail.id;
					cannelFavoritePrompt({
						'id': id
					}).then(res => {
						this.favoriteList = this.favoriteList.filter(function(item) {
							return item.id !== id
						});
					});
				} else {
					// 添加收藏
					saveFavoritePrompt({
						'id': this.detail.id
					}).then(res => {
						this.favoriteList.unshift(this.detail)
					});
				}
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close() {
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
				// ...
				this.$refs.popup.close()
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 * @param {Object} value
			 */
			confirm(value) {
				this.$refs.popup.close()
			},
			toIndex(value) {
				console.log("开始调用跳转页面")
				console.log(value)
				uni.navigateTo({
					url: "/pages/main/index?data=" + encodeURIComponent(JSON.stringify(value)),
					// url:"../component/classdetails/classdetails?newsid="+ newsid,
					success: res => {
						console.log("调用成功")
					},
					fail: () => {
						console.log("调用失败")
					},
					complete: () => {
						console.log("调用完成")
					}
				});
			},
			getMore() {
				this.$squni.toast('功能完善中，敬请期待~');
			}
		}
	}
</script>

<style>
	.mybutton {
		width: 200px;
		height: 40px;
		background-color: #007AFF;
		color: #fff;
		border: none;
		border-radius: 5px;
		margin: 20px auto;
		text-align: center;
		line-height: 40px;
		cursor: pointer;
	}
	
	.login-content {
		padding: 70px 10px 35px;
		text-align: center;
		color: #333333;
	}
	
	.login-title {
		font-size: 26px;
		font-weight: bold;
		margin-bottom: 31px;
	}
	
	.login-content input {
		height: 50px;
		background: #F8F8F8;
		border-radius: 25px;
		text-align: left;
		padding: 15px;
		box-sizing: border-box;
		font-size: 15px;
	}
	
	.iphone,
	.password,
	.test {
		position: relative;
		margin-bottom: 30px;
	}
	
	.iphone .uni-icons,
	.password .uni-icons {
		position: absolute;
		top: 14px;
		right: 30px;
	}
	
	.test-btn,
	.password-btn {
		color: #ff8b33;
		font-size: 15px;
		text-align: right;
	}
	
	.get-test {
		color: #ff8b33;
		font-size: 15px;
		width: 122px;
		height: 50px;
		border: 1px solid #FF8B33;
		border-radius: 25px;
		line-height: 50px;
	}
	
	.test {
		display: flex;
		justify-content: space-between;
	}
	
	.login-btn {
		width: 355px;
		height: 45px;
		background: #FF8B33;
		border-radius: 36px;
		color: #fff;
		font-size: 20px;
		text-align: center;
		line-height: 45px;
		position: fixed;
		bottom: 60px;
	}
	page {
		padding-bottom: 200upx;
	}

	.title {
		color: #58b8b3;
		font-size: 20px;
		padding-left: 25px;
	}

	.title1 {
		color: rgba(88, 184, 179, 0.5);
		/* 使用 rgba 函数来设置半透明的文本颜色 */
		font-size: 20px;
		padding-left: 40px;
		font-style: italic;

	}

	.title,
	.title1 {
		margin: -6px;

	}

	.box {
		/* 每个部分均等分父元素的剩余空间，以横向占满 */
		margin: 10;
		/* 为了创建上下间距 */
		display: flex;
		flex-direction: column;
		padding-top: 3px;
	}

	.boxitem {
		background-color: white;
	}

	.boxitem2 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		/* 使两个元素分别在最左边和最右边 */
	}

	.boxitem1 {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* 保持两个 text 之间的距离相等 */
		padding-top: 10px;
		/* 添加顶部空隙，你可以根据需要调整值 */
		padding-bottom: 10px;
		/* 添加底部空隙，你可以根据需要调整值 */
	}

	.spacer {
		height: 10px;
		background-color: transparent;
		/* 透明的间隔 */
	}

	.dataList {
		/* 	padding-top: 5px; */
		padding-left: 20px;
	}

	.dataListStyle {
		display: flex;
		flex-direction: row;
		flex: 1;
	}

	.myimage {
		height: 10px;
		width: 10px;
		vertical-align: middle;
	}

	.myheal {
		height: 18px;
		width: 18px;
		vertical-align: middle;
	}

	.myview {
		border: 1rpx solid #58b8b3;
		border-radius: 30rpx;
		padding: 13rpx;
		display: flex;
		align-items: center;
		/* 垂直居中对齐子元素 */
	}

	.clamp-two-lines {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		/* 最多展示两行 */
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 12px;
		color: lightgray;
	}

	.rightDetail {

		padding-right: 10px;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		/* 水平居中 */
		padding-bottom: 10px;
		/* 上下间距 5px */
	}
</style>
