<template>
	<!-- 使用 Element Plus 的 el-descriptions 组件显示数据 -->
	<el-descriptions :title="title" :column="column" border>
		<!-- 遍历 list 数组，为每个 item 生成一个 el-descriptions-item -->
		<el-descriptions-item v-for="item in list" :span="item.span">
			<!-- 作用域插槽，定义 label 的内容 -->
			<template #label> 
				{{ item.label }} 
			</template>

			<!-- 这里是默认插槽，允许外部自定义显示内容 -->
			<slot :name="item.prop" :rows="row">
				<!-- 默认情况下，显示 item.value 或 row[item.prop] -->
				{{ item.value || row[item.prop] }}
			</slot>
		</el-descriptions-item>
	</el-descriptions>
</template>

<script lang="ts" setup>
// 定义组件的 props
const props = defineProps({
	data: {
		type: Object, // 传入的数据对象
		required: true, // 必须传递该数据
	}
});

// 解构 props.data，获取 row、title、column、list
const { row, title, column = 2, list } = props.data;
</script>
