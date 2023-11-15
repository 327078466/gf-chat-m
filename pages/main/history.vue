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
				<block slot="content">聊天历史</block>
			</cu-custom>
			<view class="cu-chat">
				<block v-for="(x,i) in msgList" :key="i">
					<!-- 用户消息 -->
					<view v-if="x.my && x.type === 'msg'" class="cu-item self"
						:class="[i === 0 ? 'first' : '', i === 1 ? 'sec' : '']">
						<view class="main">
							<view class="content bg-cyan shadow" @click="x.msg && $squni.copy(x.msg)">
								<text>{{ x.msg }}</text>
							</view>
						</view>
						<image class="cu-avatar round" src="/static/answer.png">
							<view v-if="i === 0" class="date">{{ x.date }}</view>
					</view>
					<!-- AI消息 -->
					<view v-if="!x.my" class="cu-item"
						:class="[i === 0 ? 'first' : '', i === 1 ? 'sec' : '']">
						<image class="cu-avatar round chat-avatar" src="/static/manager.png">
							<view class="main">
								<view class="content shadow">
									<text v-if="x.type === 'msg'"
										@click="x.msg && $squni.copy(x.msg)">{{ x.msg }}</text>
									<image v-if="x.type === 'image'" :src="x.msg"
										@longtap="savePosterPath(x.msg,false)"></image>
										<video :src="x.msg" v-if="x.type === 'video'" @longtap="savePosterPath(x.msg,true)"></video>
										
								</view>
							</view>
							<view v-if="i === 0" class="date">{{ x.date }}</view>
					</view>
					<view v-if="x.type === 'error'" class="cu-info">
						<text class="cuIcon-roundclosefill text-red "></text> {{ x.msg }}
					</view>
				</block>
				<view v-if="msgList.length === 0" class="text-center gray margin-top">无历史聊天记录</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				msgList: [],
				isDevelop: 'true',
			}
		},
		beforeMount() {
			this.isDevelop = this.globalData.IsDevelop // 访问全局变量
		},
		onShow() {
			this.msgList = this.$squni.getStorageSync('chatHistory') || []
		},
		methods: {
			savePosterPath(url, isVideo) {
			    uni.downloadFile({
			        url,
			        success: (resFile) => {
			            console.log(resFile, "resFile");
			            if (resFile.statusCode === 200) {
			                uni.getSetting({
			                    success: (res) => {
			                        if (!res.authSetting["scope.writePhotosAlbum"]) {
			                            uni.authorize({
			                                scope: "scope.writePhotosAlbum",
			                                success: () => {
			                                    if (isVideo) {
			                                        uni.saveVideoToPhotosAlbum({
			                                            filePath: resFile.tempFilePath,
			                                            success: (res) => {
			                                                return uni.showToast({
			                                                    title: "保存成功！",
			                                                });
			                                            },
			                                            fail: (res) => {
			                                                return uni.showToast({
			                                                    title: res.errMsg,
			                                                });
			                                            },
			                                            complete: (res) => {},
			                                        });
			                                    } else {
			                                        uni.saveImageToPhotosAlbum({
			                                            filePath: resFile.tempFilePath,
			                                            success: (res) => {
			                                                return uni.showToast({
			                                                    title: "保存成功！",
			                                                });
			                                            },
			                                            fail: (res) => {
			                                                return uni.showToast({
			                                                    title: res.errMsg,
			                                                });
			                                            },
			                                            complete: (res) => {},
			                                        });
			                                    }
			                                },
			                                fail: () => {
			                                    uni.showModal({
			                                        title: "您已拒绝获取相册权限",
			                                        content: "是否进入权限管理，调整授权？",
			                                        success: (res) => {
			                                            if (res.confirm) {
			                                                uni.openSetting({
			                                                    success: (res) => {
			                                                        console.log(res.authSetting);
			                                                    },
			                                                });
			                                            } else if (res.cancel) {
			                                                return uni.showToast({
			                                                    title: "已取消！",
			                                                });
			                                            }
			                                        },
			                                    });
			                                },
			                            });
			                        } else {
			                            if (isVideo) {
			                                uni.saveVideoToPhotosAlbum({
			                                    filePath: resFile.tempFilePath,
			                                    success: (res) => {
			                                        return uni.showToast({
			                                            title: "保存成功！",
			                                        });
			                                    },
			                                    fail: (res) => {
			                                        return uni.showToast({
			                                            title: res.errMsg,
			                                        });
			                                    },
			                                    complete: (res) => {},
			                                });
			                            } else {
			                                uni.saveImageToPhotosAlbum({
			                                    filePath: resFile.tempFilePath,
			                                    success: (res) => {
			                                        return uni.showToast({
			                                            title: "保存成功！",
			                                        });
			                                    },
			                                    fail: (res) => {
			                                        return uni.showToast({
			                                            title: res.errMsg,
			                                        });
			                                    },
			                                    complete: (res) => {},
			                                });
			                            }
			                        }
			                    },
			                    fail: (res) => {},
			                });
			            } else {
			                return uni.showToast({
			                    title: resFile.errMsg,
			                });
			            }
			        },
			        fail: (res) => {
			            return uni.showToast({
			                title: res.errMsg,
			            });
			        },
			    });
			},
		}
	}
</script>

<style>
	page {
		padding-bottom: 200upx;
	}

	.cu-item:not(.first) {
		padding-bottom: 0upx;
	}

	.cu-item.sec {
		padding-top: 0upx;
	}

	.main .content {
		word-wrap: break-word;
	}

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
</style>
