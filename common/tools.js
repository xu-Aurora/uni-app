const install = (Vue, vm) => {
	
	Vue.prototype.$t = {
		// 测试方法
		toUpperCase(msg){
			return msg && msg.toUpperCase();
		},
		/**	
		 * 千位分割
		 *  @param { number } 
		 */
		formatPrice(val) {
			let value;
			if (typeof val !== "undefined") {
				if (val.toString().includes('.')) {
					value = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
				} else {
					value = val + '.00'
				}
			} else {
				value = 0
			}
			return value
		}
	}
	
}

export default {
	install
}
