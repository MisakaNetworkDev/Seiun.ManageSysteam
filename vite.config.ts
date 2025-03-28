import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
	export default defineConfig({
	base: './',
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
		resolvers: [ElementPlusResolver()]
		}),
		Components({
		resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	resolve: {
		alias: {
		'@': '/src',
		'~': '/src/assets'
		}
	},
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
	},
	server: {
		proxy: {
			'/api': {
			target: 'http://localhost:5222',  // 后端 API 地址
			changeOrigin: true,  // 允许跨域
			rewrite: (path) => path.replace(/^\/api/, '')  // 可选: 如果需要修改请求路径前缀
		}
	}
  }
});
