<template>
    <div>
        <el-row :gutter="20" class="mgb20">
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg1">
                        <User />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color1" :end="6666" />
                        <div>用户访问量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg2">
                        <Loading />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color2" :end="168" />
                        <div>累计生成</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg3">
                        <Star />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color3" :end="8888" />
                        <div>单词数量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg4">
                        <View />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color4" :end="568" />
                        <div>今日访问量</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mgb20">
            <el-col :span="18">
                <el-card shadow="hover">
                    <div class="card-header">
                        <p class="card-header-title">请求动态</p>
                        <p class="card-header-desc">最近一周请求状态</p>
                    </div>
                    <v-chart class="chart" :option="dashOpt1" />
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="card-header">
                        <p class="card-header-title">单词分布</p>
                        <p class="card-header-desc">词库总体情况</p>
                    </div>
                    <v-chart class="chart" :option="dashOpt2" />
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="7">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">时间线</p>
                        <p class="card-header-desc">最新的销售动态和活动信息</p>
                    </div>
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in activities" :key="index" :color="activity.color">
                            <div class="timeline-item">
                                <div>
                                    <p>{{ activity.content }}</p>
                                    <p class="timeline-desc">{{ activity.description }}</p>
                                </div>
                                <div class="timeline-time">{{ activity.timestamp }}</div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">渠道统计</p>
                        <p class="card-header-desc">最近一个月的请求来源统计</p>
                    </div>
                    <v-chart class="map-chart" :option="mapOptions" />
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">排行榜</p>
                        <p class="card-header-desc">单词错误榜单Top5</p>
                    </div>
                    <div>
                        <div class="rank-item" v-for="(rank, index) in ranks">
                            <div class="rank-item-avatar">{{ index + 1 }}</div>
                            <div class="rank-item-content">
                                <div class="rank-item-top">
                                    <div class="rank-item-title">{{ rank.title }}</div>
                                    <div class="rank-item-desc">错误量：{{ rank.value }}</div>
                                </div>
                                <el-progress
                                    :show-text="false"
                                    striped
                                    :stroke-width="10"
                                    :percentage="rank.percent"
                                    :color="rank.color"
                                />
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts" name="dashboard">
import countup from '@/components/countup.vue';
import { use, registerMap } from 'echarts/core';
import { BarChart, LineChart, PieChart, MapChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import { dashOpt1, dashOpt2, mapOptions } from './chart/options';
import chinaMap from '@/utils/china';
use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    LineChart,
    PieChart,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    VisualMapComponent,
    MapChart,
]);
registerMap('china', chinaMap);
const activities = [
    {
        content: '背词',
        description: 'xxx开始会话',
        timestamp: '30分钟前',
        color: '#00bcd4',
    },
    {
        content: '用户做题',
        description: 'xxx在开始做题',
        timestamp: '55分钟前',
        color: '#1ABC9C',
    },
    {
        content: '文章生成',
        description: 'xxx生成了新文章',
        timestamp: '1小时前',
        color: '#3f51b5',
    },
    {
        content: '选择了词书',
        description: 'xxx选择了词书',
        timestamp: '15小时前',
        color: '#f44336',
    },
    {
        content: '完成会话',
        description: 'xxx终于完成了会话',
        timestamp: '1天前',
        color: '#009688',
    },
];

const ranks = [
    {
        title: '手机',
        value: 10000,
        percent: 80,
        color: '#f25e43',
    },
    {
        title: '电脑',
        value: 8000,
        percent: 70,
        color: '#00bcd4',
    },
    {
        title: '相机',
        value: 6000,
        percent: 60,
        color: '#64d572',
    },
    {
        title: '衣服',
        value: 5000,
        percent: 55,
        color: '#e9a745',
    },
    {
        title: '书籍',
        value: 4000,
        percent: 50,
        color: '#009688',
    },
];
</script>

<style>
.card-body {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 0;
}
</style>
<style scoped>
.card-content {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
    padding: 0 20px;
}

.card-num {
    font-size: 30px;
}

.card-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.bg1 {
    background: #2d8cf0;
}

.bg2 {
    background: #64d572;
}

.bg3 {
    background: #f25e43;
}

.bg4 {
    background: #e9a745;
}

.color1 {
    color: #2d8cf0;
}

.color2 {
    color: #64d572;
}

.color3 {
    color: #f25e43;
}

.color4 {
    color: #e9a745;
}

.chart {
    width: 100%;
    height: 400px;
}

.card-header {
    padding-left: 10px;
    margin-bottom: 20px;
}

.card-header-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.card-header-desc {
    font-size: 14px;
    color: #999;
}

.timeline-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #000;
}

.timeline-time,
.timeline-desc {
    font-size: 12px;
    color: #787878;
}

.rank-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.rank-item-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f2f2f2;
    text-align: center;
    line-height: 40px;
    margin-right: 10px;
}

.rank-item-content {
    flex: 1;
}

.rank-item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #343434;
    margin-bottom: 10px;
}

.rank-item-desc {
    font-size: 14px;
    color: #999;
}
.map-chart {
    width: 100%;
    height: 350px;
}
</style>
