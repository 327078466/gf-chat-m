import { get, post } from '@/util/request.js'

// AI聊天(弃用)
export const sendMsgApi = (params, config = {}) => post('/tools/chat/sendMsg', params, config)

// 查询用户余额
export const getUserChatAssetApi = (params, config = {}) => post('/tools/chat/getUserChatAsset', params, config)

// 获取提示词前10
export const getPromptTypeTop10 = (params, config = {}) => get('/prompt/type/selectTop10', params, config)

// 获取收藏的提示
export const getFavoritePrompt = (params, config = {}) => post('/prompt/type/selectFavorite', params, config)

// 添加收藏
export const saveFavoritePrompt = (params, config = {}) => post('/prompt/type/saveFavoritePrompt', params, config)

// 取消收藏
export const cannelFavoritePrompt = (params, config = {}) => post('/prompt/type/cannelFavoritePrompt', params, config)

// 获取所有分类

export const getPromptType = (params, config = {}) => post('/prompt/type/getPromptType', params, config)

// 根据id 查询所属分类下的列表
export const getPromptById = (params, config = {}) => post('/prompt/type/getPromptById', params, config)


