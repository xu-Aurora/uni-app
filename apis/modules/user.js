// test user request api
import Vue from 'vue';
let vm = new Vue();

// test get api
export function getUserInfo(params) {
	return vm.$u.get('/http/getUserInfo', params)
}