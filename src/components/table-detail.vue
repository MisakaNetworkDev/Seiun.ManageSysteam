<template>
	<el-descriptions :title="title" :column="column" border>
		<el-descriptions-item v-for="item in list" :key="item.prop" :span="item.span">
			<template #label> 
				{{ item.label }} 
			</template>

			<template v-if="item.type === 'image'">
				<div style="display: flex; gap: 5px;">
					<el-image
						v-for="(imgSrc, index) in row[item.prop] || []"
						:key="index"
						:src="typeof imgSrc === 'string' && imgSrc.startsWith('http') ? imgSrc : `http://localhost:5222/resources/article-image/${imgSrc}`"
						style="width: 50px; height: 50px; cursor: pointer;"
						fit="cover"
						@click="showCarousel(row[item.prop])"
					/>
				</div>
			</template>

			<template v-else>
				<slot :name="item.prop" :rows="row">
					{{ item.value || row[item.prop] }}
				</slot>
			</template>
		</el-descriptions-item>
	</el-descriptions>

	<!-- 弹出轮播对话框 -->
	<el-dialog v-model="dialogVisible" title="图片预览" width="50%">
		<el-carousel height="400px">
			<el-carousel-item v-for="(imgSrc, index) in currentImages" :key="index">
				<el-image :src="imgSrc" fit="contain" style="width: 100%; height: 100%;" />
			</el-carousel-item>
		</el-carousel>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 定义组件的 props
const props = defineProps({
	data: {
		type: Object, 
		required: true,
	}
});

const { row, title, column = 2, list } = props.data;

// 弹出层相关状态
const dialogVisible = ref(false);
const currentImages = ref<string[]>([]);

const showCarousel = (images: string[]) => {
  currentImages.value = images;
  dialogVisible.value = true;
};
</script>
