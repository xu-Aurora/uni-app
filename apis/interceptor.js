// common/http.interceptor.js

import config from '@/common/config.js';

const codeMessage = {
	404: '您所请求的资源无法找到',
	500: '服务器内部错误，无法完成请求',
};

const install = (Vue, vm) => {

	// 这个配置是一次配置，全局通用的，具体参数见 https://www.uviewui.com/js/http.html
	Vue.prototype.$u.http.setConfig({
		baseUrl: config.baseUrl, // 请求的本域名
		showLoading: true, // 是否显示请求中的loading
		loadingText: '正在加载...', // 请求loading中的文字提示
		loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		originalData: true // 是否在拦截器中返回服务端的原始数据
	});

	// 请求拦截部分，如配置，每次请求前都会执行
	Vue.prototype.$u.http.interceptor.request = (config) => {
		const token = vm.vuex_token;
		
		if(token) {
			config.header = {
				'Authorization': token && `Bearer ${token}`
			}
		}
		
		// 不缓存get请求
		if (config.method === 'get') {
			config.header['Cache-Control'] = 'no-cache'
		}

		return config;
	}

	// 响应拦截，如配置，每次请求结束都会执行本方法
	Vue.prototype.$u.http.interceptor.response = (res) => {

		// if 状态码是否正常
		if (res.statusCode == 200) {
			let result = res.data;
			// if 与后台规定的成功码是否正常
			if (result.code == 200) {
				return result.result || result.data;
			} else if (result.code == 300) {
				vm.$u.toast('未登录!');
			} else {
				vm.$u.toast(result.msg);
			}
		} else {
			let errorMessage = codeMessage[res.statusCode] ? codeMessage[res.statusCode] : res.statusCode;
			vm.$u.toast(errorMessage);
		}
		return false;
	}
}

export default {
	install
}
