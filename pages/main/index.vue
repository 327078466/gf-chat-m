<template>
	<!-- 跳过审核 用于专门给审核人员看 -->
	<view>
		<view v-if="!isDevelop">
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
		<view v-if="isDevelop">
			<cu-custom bgColor="bg-cyan" :isBack="false">
				<!-- 	<block slot="backText">返回</block> -->
				<block slot="content">GF聊天</block>
			</cu-custom>
			<view class="cu-chat">
				<block v-for="(x,i) in msgList" :key="i">
					<!-- 用户消息 -->
					<view v-if="x.my && x.type === 'msg'" class="cu-item self"
						:class="[i === 0 ? 'first' : '', i === 1 ? 'sec' : '']">
						<view class="main">
							<view class="content bg-cyan shadow"
								:class="{ 'hidden-pseudo-element': !isPseudoElementVisible }"
								@click="x.msg && $squni.copy(x.msg)">
								<text class="mytext">{{ x.msg }}</text>
							</view>
						</view>
						<image class="cu-avatar round" :src="'../../static/answer.png'">
							<view v-if="i === 0" class="date">{{ x.date }}</view>
					</view>
					<!-- AI消息 -->
					<view v-if="!x.my" class="cu-item" :class="[i === 0 ? 'first' : '', i === 1 ? 'sec' : '']">
						<view class="flex flex-direction align-center">
							<image class="cu-avatar round chat-avatar"
								:src="mode == '1' ? '../../static/M1.png' : mode == '2' ? '../../static/M2.png':mode == '3'? '../../static/M3.png':'' ">
								<text v-if="i === 0" class="cuIcon-title" :class="[statusColor]"></text>
						</view>
						<view class="main" style="display: flex;flex-direction: row;">
							<view class="content shadow" :class="{ 'hidden-pseudo-element': !isPseudoElementVisible }">
								<text class="mytext" v-if="x.type == 'msg'"
									@click="x.msg && $squni.copy(x.msg)">{{ x.msg }}</text>
								<image v-if="x.type === 'image'" :src="x.msg" @longtap="savePosterPath(x.msg,false)"></image>
								<video :src="x.msg" v-if="x.type === 'video'" @longtap="savePosterPath(x.msg,true)"></video>
							</view>
						</view>
						<view @click="open" v-if="i === 0">
							<image src="../../static/mode.png"
								style="height: 20px;width: 20px; vertical-align: middle; "></image>
							<text class="text-blue" style="line-height: 100upx;">模式</text>
						</view>
						<view v-if="i === 0" class="date">{{ x.date }}</view>
					</view>
					<view v-if="x.type === 'error'" class="cu-info">
						<text class="cuIcon-roundclosefill text-red "></text> {{ x.msg }}
					</view>
				</block>

				<view v-if="msgLoading" class="cu-item">
					<view class="flex flex-direction align-center">
						<image class="cu-avatar round chat-avatar" src="/static/manager.png">
					</view>
					<view class="main">
						<text class="cuIcon-loading2 cuIconfont-spin text-cyan"></text>
					</view>
				</view>
			</view>

			<view class="cu-bar foot input box" :style="[{bottom:(inputBottom)+'px'}]">
				<view class="box1 fcbox">
					<view class="myview" @click="clearChat">
						<image src="../../static/clear.png" class="myimage"></image>
						<text class="text-blue" style="font-size: 10px;">清除</text>
					</view>
					<view class="myview" @click="$squni.navigateTo('/pages/main/history')">
						<image src="../../static/history.png" class="myimage"></image>
						<text class="text-blue" style="font-size: 10px;">历史</text>
					</view>
					<view class="myview" @click="$squni.navigateTo('/pages/main/assistant')" v-if="mode == 1">
						<image src="../../static/assistant.png" class="myimage"></image>
						<text class="text-blue" style="font-size: 10px;">角色</text>
					</view>
				</view>
				<view class="box1">
					<view class="" @click="openBottomFunc">
						<text class="cuIcon-list text-cyan" style="font-size: 60upx;"></text>
					</view>
					<input v-model="msg" class="solid padding-lr" :adjust-position="false" :focus="false"
						maxlength="1000" cursor-spacing="10" :placeholder="loading ? '正在思考中，请稍后~' : inputMessage"
						@focus="inputFocus" @blur="inputBlur" @confirm="sendMsg"></input>
						<view class="action" v-if="(mode =='5' || mode == '6') && selectimageIsShow">
							<text class="cuIcon-upload text-grey" @click="selectPicture"></text>
						</view>
					<button class="cu-btn bg-cyan shadow" :disabled="loading" @click="sendMsg">
						<text class="cuIcon-loading2 cuIconfont-spin"
							v-if="loading || !ready"></text>{{ !ready ? '连接中' : '发送' }}
					</button>
				</view>
			</view>

			<bottom-func v-if="bottomFuncShow" ref="bottomFunc" :chatAsset="chatAsset"></bottom-func>
			<uni-popup ref="popup" type="center">
				<uni-popup-dialog mode="base" title="请选择需要的模式哦～" :duration="2000" :before-close="true" @close="close"
					@confirm="confirm(mode)">
					<view style="background-color: #fff;" class="box">
						<radio-group @change="radioChange">
							<view style="display: flex;flex-direction: column;">
								<view style="display: flex;flex-direction: row;gap: 36px;">
									<view style="display: flex;gap: 20px;padding-bottom: 15px;">
										<text>AI聊天</text>
										<radio :value="1" :checked="mode=='1'"></radio>
									</view>
									<view style="display: flex;gap: 10px;padding-bottom: 15px;">
										<text>AI绘画</text>
										<radio :value="2" :checked="mode=='2'"></radio>
									</view>
								</view>
								<view style="display: flex;flex-direction: row;gap: 20px;">
									<view style="display: flex;gap: 5px;padding-bottom: 15px;">
										<text>视频解析</text>
										<radio :value="3" :checked="mode=='3'"></radio>
									</view>
									<view style="display: flex;gap: 10px;padding-bottom: 15px;">
										<text>文字转录</text>
										<radio :value="4" :checked="mode=='4'"></radio>
									</view>
								</view>
								<view style="display: flex;flex-direction: row;gap: 6px;">
									<view style="display: flex;gap: 20px;padding-bottom: 15px;">
										<text>证件照</text>
										<radio :value="5" :checked="mode=='5'"></radio>
									</view>
									<view style="display: flex;gap: 10px;padding-bottom: 15px;">
										<text>个性二维码</text>
										<radio :value="6" :checked="mode=='6'"></radio>
									</view>
								</view>
							</view>
						</radio-group>
						<radio-group @change="radioGptChange" style="padding-bottom: 25px;padding-left: 25px;">
							<view v-if="mode=='1'">
								<view class="box2">
									<text>GPT3.5</text>
									<radio :value="1" :checked="sayModeValue=='1'"></radio>
								</view>
								<view class="box2">
									<text>GPT4.0</text>
									<radio :value="2" :checked="sayModeValue=='2'"></radio>
								</view>
							</view>
							<view v-if="mode=='2'"
								style="display: flex;flex-direction: column;gap: 35px;padding-bottom: 30px;">
								<view style="display: flex;flex-direction: row;gap: 10px;">
									<view>
										生成数量:
									</view>
									<view style="border: 1rpx solid #58b8b3 ;flex: 1;border-radius: 15rpx;">
										<picker @change="bindImageNumChange" :value="imageNumIndex" :range="imageNum">
											<view style="text-align: center;">{{imageNum[imageNumIndex]}}</view>
										</picker>
									</view>
								</view>
								<view style="display: flex;flex-direction: row;gap: 10px;">
									<view>
										生成尺寸:
									</view>
									<view style="border: 1rpx solid #58b8b3 ;flex: 1;border-radius: 15rpx;">
										<picker @change="bindImageSizeChange" :value="imageSizeIndex"
											:range="imageSize">
											<view style="text-align: center;">{{imageSize[imageSizeIndex]}}</view>
										</picker>
									</view>
								</view>
							</view>
						</radio-group>
					</view>
				</uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		dateFormat,
		interval
	} from '@/util/squ.js'
	import {
		scrollToBottom
	} from '@/util/squni.js'
	import websocket from '@/util/websocket'
	import {
		sendMsgApi,
		getUserChatAssetApi,
		uploadOssFile,
	} from '@/api/chat.js'
	import BottomFunc from './bottom-func'
	import baseUrl  from  '@/common/config.js'
	const HELLO_MSG = {
		type: 'msg',
		my: false,
		msg: '连接中，请稍后~',
		date: dateFormat(new Date(), 'yyyy年MM月dd日 hh:mm')
	}
	export default {
		components: {
			BottomFunc
		},
		data() {
			return {
				loading: false,
				userId: this.$store.getters.userId,
				msgList: [HELLO_MSG],
				msgContent: "",
				msg: "",
				inputBottom: 0,
				bottomFuncShow: false,
				chatAsset: {},
				assetType: 'n',
				statusColor: 'text-red',
				statusTimer: null,
				msgLoading: false,
				isDevelop: 'true',
				type: 'top',
				mode: "1",
				sayModeValue: '1',
				inputMessage: '',
				assistantDetail: {
					'id': '0'
				},
				imageNum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
				imageSize: ['256*256', '512*512', '1024*1024'],
				imageSizeIndex: 0,
				imageNumIndex: 0,
				imageList: [], // 反显图片集合
				cusNo: '', // 客户号
				selectimageIsShow: true, // 添加图片功能按钮默认显示
				accessToken: '',
			}
		},
		computed: {
			ready() {
				return this.statusColor === 'text-green'
			}
		},
		beforeMount() {
			this.isDevelop = this.globalData.IsDevelop // 访问全局变量
		},
		watch: {
			loading(n, o) {
				if (n !== o && !n) {
					let last = this.msgList[this.msgList.length - 1]
					console.log("插入记录", last)
					if (!last.my) {
						this.addHistory(last)
					}
				}
			},
			statusColor(n, o) {
				this.mode = this.$squni.getStorageSync('mode')
				if (n === 'text-green') {
					this.setHELLO_MSG();
				} else {
					HELLO_MSG.msg = '连接中，请稍后~'
				}
			}
		},
		async onShow() {
			this.heartStatus()
			await this.$ready
			this.mode = this.$squni.getStorageSync('mode')
			if (!this.mode) { // 有值
				this.mode = '1'
				this.$squni.setStorageSync('mode', '1');
			}
			if (!this.userId) {
				this.$squni.toast('请先进行登录哦')
				return
			}
			getUserChatAssetApi().then(res => {
				this.chatAsset = res.data
			})
			console.log("开始链接")
			this.connectWebsocket();
		},
		onHide() {
			websocket.closeSocket()
			clearInterval(this.statusTimer)
		},
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			if (option && option.data) {
				const data = JSON.parse(decodeURIComponent(option.data));
				this.assistantDetail = data;
			} else {
				this.open()
			}
		},

		methods: {
			sendMsg() {
				if (this.msg == "") {
					this.$squni.toast('请先输入您的问题哦')
					return
				}
				if(this.mode == '4' || this.mode == '5'|| this.mode == '6'){
					this.$squni.toast('正在开发中敬请期待～')
					return
				}
				let msg = this.msg
				this.putMsg(this.msg, true)
				this.msgLoading = true
				this.loading = true

				// ======== 开发环境模拟回复 ========
				//return this.mockReply()
				// ======== 开发环境模拟回复 ========

				if (this.calcAsset() === false) {
					this.loading = false
					return
				}
				// 发送消息
				websocket.sendMessage(msg, null, () => {
					this.putMsgError('机器人被拔网线了，请稍后再试~')
				})
			},
			setHELLO_MSG() {
				if (this.mode == '1') {
					HELLO_MSG.msg = '我是您的聊天助手,可以帮您解答疑难困惑'
					this.inputMessage = '您有什么问题，问什么都可以'
				} else if (this.mode == '2') {
					HELLO_MSG.msg = '我是您的绘画助手,可以描述场景的关键词，帮您绘画，长按可以下载哦'
					this.inputMessage = '请告诉我您的需求哦～'
				} else if (this.mode == '3') {
					HELLO_MSG.msg = '我是您的视频解析助手,支持抖音,快手,西瓜等等 长按可以下载哦 ～'
					this.inputMessage = '短视频链接都复制到这里哦～'
				} else if (this.mode == '4') {
					HELLO_MSG.msg = '我是您的文字转录助手,编辑好的文案发我哦，让我来给您朗读～'
					this.inputMessage = '告诉我您的文章哦～'
				}else if (this.mode == '5') {
					HELLO_MSG.msg = '我是您的证件照转化助手，可以将您的证件照快速换底色哦～'
					this.inputMessage = '告诉我您需要怎样转换呢～'
				}else if (this.mode == '6') {
					HELLO_MSG.msg = '我是您的个性二维码助手，我可以将您需要整合的图片和二维码融合成个性二维码哦～'
					this.inputMessage = '告诉我您需要怎么融合呢～'
				}
				if (this.mode == '1' && this.assistantDetail.id != '0') {
					HELLO_MSG.msg = '我是您的聊天助手,可以帮您解答疑难困惑' + '[提示词:' + this.assistantDetail.name + ']'
				}
			},
			connectWebsocket() {
				try {
					//建立socket连接
					websocket.connectSocket(this.$config.wssUrl + '/tools/chat/user/' + this.userId + '/' + this.mode +
						'/' + (this.mode == '1' ? this.sayModeValue + '/' + this.assistantDetail.id :
							this.mode == '2' ? this.imageNum[this.imageNumIndex] + '/' + this.imageSize[this
								.imageSizeIndex] :
							this.mode == '3' ? '0' + '/' + '0' :
							this.mode == '4' ? '0' + '/' + '0' : this.mode == '5' ? '0' + '/' + '0' :this.mode == '6' ? '0' + '/' + '0':''),
						msg => {
							this.recvMsg(msg)
						}, () => {
							//如果连接成功则发送心跳检测
							this.heartBeatTest()
						})
				} catch (error) {
					console.log('websocket connectSocket error:' + error)
				}
			},
			recvMsg(msg) {
				this.msgLoading = false
				if (!msg) {
					this.putMsgError('机器人开小差了，请稍后再试~')
					return
				}
				if (msg === '[DONE]') {
					this.loading = false
				} else if(msg === 'sensitive'){
					this.putMsgError("请求中出现敏感词，请重新输入")
					this.loading = false
				}else{
					if (this.mode == '1') {
							try {
								let msgJson = JSON.parse(msg)
								if (msgJson.role === 'sqchat') {
									let content = msgJson.content
									if (msgJson.codeKey) {
										content += `[${msgJson.codeKey}]`
										if (msgJson.codeKey === 'chat.asset_short') {
											this.openBottomFunc()
										} else if (msgJson.codeKey.indexOf('chat.asset_') >= 0) {
											this.chatAsset[this.assetType]++
										}
									}
									this.putMsgError(content)
								}
								if (msgJson.role === 'assistant') {
									this.putMsg('', false)
								} else if (msgJson.role == null && msgJson.content) {
									this.msgList[this.msgList.length - 1].msg += msgJson.content
									scrollToBottom()
								}
							} catch (error) {
								this.putMsgError(msg)
							}
					} else if (this.mode == '2') { // 作图
							try {
								let msgJson = JSON.parse(msg)
								if (msgJson.role === 'assistant') {
									this.putMsg('', false, 'image')
								} else if (msgJson.role == null && msgJson.content) {
									this.msgList[this.msgList.length - 1].msg += msgJson.content
									scrollToBottom()
								}
							} catch (error) {
								this.putMsgError(msg)
							}
					} else if (this.mode == '3') { // 视频解析
							try {
								let msgJson = JSON.parse(msg)
								if (msgJson.role === 'assistant') {
									console.log(msg)
									this.putMsg('视频文案:' + msgJson.content, false, 'msg') // title
									this.putMsg('', false, 'video')
								} else if (msgJson.role == null && msgJson.content) {
									this.msgList[this.msgList.length - 1].msg += msgJson.content
									scrollToBottom()
								}
							} catch (error) {
								this.putMsgError(msg)
							}
					} else if (this.mode == '4') { // 文字转录
					
					}else if (this.mode == '5') { // 证件照换底
					
					}else if (this.mode == '6') { // 个性二维码
					
					}
					this.loading = false
				}
			},
			sendMsgBak() {
				let that = this
				if (this.msg == "") {
					return
				}
				this.msgContent += (this.userId + ":" + this.msg + "\n")
				if (this.mode == '1') {
					this.putMsg(this.msg, true)
				} else if(this.mode == '2'){
					this.putMsg(this.msg, true, 'image')
				}else if(this.mode == '3'){
					this.putMsg(this.msg, true, 'video')
				}else if(this.mode == '4'){
					// 录音待开发
				}else if(this.mode == '5'){
					// 证件照换底待开发
				}else if(this.mode == '6'){
					// 个性二维码待开发
				}
				this.loading = true

				// ======== 开发环境模拟回复 ========
				return this.mockReply()
				// ======== 开发环境模拟回复 ========

				sendMsgApi({
					userId: this.userId + '',
					question: this.msgContent
				}).then(({
					status,
					data
				}) => {
					if (status === 'success') {
						this.putMsg(data.ack, false)
						this.msgContent += ("openai:" + this.msg + "\n")
					} else {
						this.putMsg(res.message || '机器人开小差了，请稍后再试~', false, 'error')
					}
					that.loading = false
				})
			},
			calcAsset() {
				if (this.chatAsset.dfn > 0) {
					this.chatAsset.dfn--
					this.assetType = 'dfn'
				} else if (this.chatAsset.n > 0) {
					this.chatAsset.n--
					this.assetType = 'n'
				} else {
					this.$squni.toast('剩余次数不足')
					this.openBottomFunc()
					return false
				}
			},
			putMsg(msg, my = false, type = 'msg') {
				let item = {
					type: type,
					msg: msg,
					my: my,
					date: dateFormat(new Date(), 'yyyy年MM月dd日 hh:mm')
				}
				this.msgList.push(item)
				scrollToBottom()
				if (my) {
					this.addHistory(item)
					console.log("item", item)
					// 清除消息
					this.msg = ''
					this.msgReply = ''
				}
			},
			putMsgError(msg) {
				this.putMsg(msg, false, 'error')
				this.msgLoading = false
				this.loading = false
			},
			addHistory(item) {
				// if (item.type === 'msg') {
				let chatHistory = this.$squni.getStorageSync('chatHistory')
				if (!chatHistory) {
					chatHistory = []
				}
				if (chatHistory.length >= 50) {
					chatHistory.splice(0, 1)
				}
				chatHistory.push(item)
				this.$squni.setStorageSync('chatHistory', chatHistory)
				// }
			},
			//心跳检测
			heartBeatTest() {
				let globalTimer = null
				//清除定时器
				clearInterval(globalTimer)
				//开启定时器定时检测心跳
				globalTimer = setInterval(() => {
					//发送消息给服务端
					websocket.sendMessage('PING', null, () => {
						//如果失败则清除定时器
						clearInterval(globalTimer)
					})
				}, 15000)
			},
			heartStatus() {
				this.statusTimer = interval(() => {
					if (websocket.isOpen) {
						this.statusColor = 'text-green'
					} else if (this.statusColor === 'text-red') {
						this.statusColor = 'text-yellow'
					} else {
						this.statusColor = 'text-red'
					}
				}, this.statusTimer, 200)
			},
			inputFocus(e) {
				this.inputBottom = e.detail.height
			},
			inputBlur(e) {
				this.inputBottom = 0
			},
			openBottomFunc() {
				this.bottomFuncShow = true
				this.$nextTick(() => {
					this.$refs.bottomFunc.open()
				})
			},
			mockReply() {
				// 开发环境模拟回复
				if (process.env.NODE_ENV === 'development') {
					setTimeout(() => {
						this.putMsg('这是模拟返回消息: ' + new Date(), false)
						this.loading = false
					}, 1000)
					return
				}
			},
			showMessage() {
				uni.showToast({
					title: '你点击了按钮',
					icon: 'success'
				});
			},
			clearChat() {
				this.msgList = [HELLO_MSG];
				this.$squni.toast('清理完成~')
			},
			open() {
				this.msgLoading = true
				this.loading = true
				this.$refs.popup.open()
			},
			/**
			 * 点击取消按钮触发
			 * @param {Object} done
			 */
			close() {
				this.msgLoading = false
				this.loading = false
				this.mode = this.$squni.getStorageSync('mode')
				this.$refs.popup.close()
				this.setHELLO_MSG();
			},
			/**
			 * 点击确认按钮触发
			 * @param {Object} done
			 * @param {Object} value
			 */
			confirm(value) {
				this.msgLoading = false
				this.loading = false
				this.$squni.setStorageSync('mode', value)
				this.mode = this.$squni.getStorageSync('mode')
				// 重新连接
				this.connectWebsocket();
				// 输入框的值

				// TODO 做一些其他的事情，手动执行 close 才会关闭对话框
				this.msgList = [HELLO_MSG];
				this.$refs.popup.close()
				if (this.mode == '1' && this.sayModeValue == '2') {
					this.$squni.toast('GPT4.0功能更加丰富~')
				}else if (this.mode == '2') {
					this.$squni.toast('作图功能很强大哦~')
				}else if (this.mode == '3') {
					this.$squni.toast('主流视频平台都可以哦~')
				}else if(this.mode == '4'){
					this.$squni.toast('正在开发中敬请期待～')
				}else if(this.mode == '5'){
					this.$squni.toast('正在开发中敬请期待～')
				}else if(this.mode == '6'){
					this.$squni.toast('正在开发中敬请期待～')
				}
			},
			radioChange(v) {
				this.mode = v.detail.value
				// 输入框的值
				this.setHELLO_MSG();
			},
			radioGptChange(v) {
				this.sayModeValue = v.detail.value
				console.log('this.sayModeValue',this.sayModeValue)
			},
			bindImageSizeChange(e) {
				this.imageSizeIndex = e.detail.value
			},
			bindImageNumChange(e) {
				this.imageNumIndex = e.detail.value
			},
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
			selectPicture() {
				console.log("开始调用oss")
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(tempFilePaths)
						uni.uploadFile({
							url: baseUrl + "/oss/uploadOssFile", //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.cu-chat .cu-item>.main .content::after {
		z-index: 1;
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

	page {
		padding-bottom: 200upx;
	}

	.cu-chat .chat-avatar.cu-avatar {
		width: 82upx;
		height: 82upx;
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

	.foot {
		padding-top: 20upx;
		padding-bottom: 60upx;
	}

	/* 	.cu-bar{
		height: 120px;
	} */

	.myimage {
		height: 12px;
		width: 12px;
		vertical-align: middle;
	}

	/**index.wxss**/
	.box {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		/* 子元素水平占满父元素 */
	}

	.box1 {
		flex: 1;
		/* 每个部分均等分父元素的剩余空间，以横向占满 */
		margin: 10;
		/* 为了创建上下间距 */
		display: flex;
		flex-direction: row;

		padding-left: 15px;
		padding-bottom: 5px;
	}

	.box2 {
		padding: 20rpx;
		display: flex;
		gap: 45px;
	}

	.myview {
		border: 1rpx solid #58b8b3;
		border-radius: 30rpx;
		padding: 13rpx;
		display: flex;
		gap: 8px;
		align-items: center;
		/* 垂直居中对齐子元素 */
	}

	.fcbox {
		gap: 20px;
	}

	.mytext {
		display: -webkit-box;
		/* 最多展示两行 */
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.material-box {
				width: 686rpx;
				padding: 32rpx;
				background: #fff;
				margin-top: 24rpx;
				margin-left: 32rpx;
				padding-bottom: 32rpx;
				border-radius: 8rpx;
	
				.item-top {
					height: 50rpx;
					line-height: 50rpx;
					font-size: 36rpx;
					font-weight: 500;
					color: #333;
				}
	
				.material-item {
					width: 622rpx;
					border-radius: 8rpx;
					background: #f8f8f8;
					padding: 16rpx;
					margin-top: 24rpx;
	
					.item-list {
						font-size: 28rpx;
						font-weight: 400;
						line-height: 56rpx;
						height: 56rpx;
						color: #B99C65;
					}
				}
	
				.material-select {
					display: flex;
					flex-wrap: wrap;
					margin-top: 24rpx;
	
					.material-png {
						width: 191rpx;
						height: 191rpx;
						border-radius: 12rpx;
						border: 2rpx dashed #B99C65;
						margin-right: 8rpx;
						margin-left: 8rpx;
						margin-bottom: 16rpx;
						position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						background: #F8F8F8;
	
						.material-sent {
							width: 189rpx;
							height: 189rpx;
							background: rgba(245, 245, 245, 0.5);
							position: absolute;
							display: flex;
							justify-content: center;
							align-items: center;
							flex-direction: column;
	
							.select-tips {
								width: 130rpx;
								height: 10rpx;
								margin-bottom: 12rpx;
							}
	
							.tips-text {
								font-size: 24rpx;
								color: #B99C65;
							}
						}
	
						.close-png {
							position: absolute;
							top: 6rpx;
							right: 6rpx;
							width: 40rpx;
							height: 40rpx;
						}
	
						.selected-png {
							width: 180rpx;
							height: 180rpx;
							border-radius: 12rpx;
						}
	
						.selected-name {
							width: 180rpx;
							word-break: break-all;
							overflow: hidden;
						}
	
						.picture-png {
							width: 40rpx;
							height: 32rpx;
							margin-bottom: 8rpx;
						}
	
						.picture-text {
							font-size: 28rpx;
							height: 40rpx;
							line-height: 40rpx;
							color: #B99C65;
						}
					}
				}
			}	
</style>
