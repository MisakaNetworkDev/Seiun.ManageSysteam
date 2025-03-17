<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit" :refresh="getData">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                </template>
            </TableCustom>

        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData"></TableDetail>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { dayjs, ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User, UserUpdate, UserUpdateTable } from '@/types/user';
import { fetchUserData, fetchUserDelete, fetchUserUpdate } from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import utc from "dayjs/plugin/utc";


dayjs.extend(utc); 

// 查询相关
const query = reactive({
    name: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '用户名：', prop: 'name' }
])
const handleSearch = () => {
    changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'user_name', label: '用户名' },
    { prop: 'phone_number', label: '手机号' },
    { prop: 'role', label: '角色' },
    { prop: 'email', label: '邮箱' },
    { prop: 'gender', label: '性别' },
    { prop: 'last_check_in_time', label: '最后打卡时间' },
    // { prop: 'nick_name', label: '昵称' },
    { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
    index: 1,
    size: 20,
    total: 0,
})
// 角色映射
const roleMap: Record<number, string> = {
    0: "超级管理员",
    1: "管理员",
    2: "创作者",
    3: "普通用户",
};

// 性别映射
const genderMap: Record<number, string> = {
    0: "未知",
    1: "男",
    2: "女"
};
const tableData = ref<User[]>([]);

const getData = async () => {
    try {
        const res = await fetchUserData(); 
        if (res.code === 200 && res.data) {
            tableData.value = res.data.list.map((user: { role: string | number; gender: string | number; last_check_in_time: string; }) => ({
                ...user,
                role: roleMap[user.role] || '未知角色',
                gender: genderMap[user.gender] || '未知',
                last_check_in_time: user.last_check_in_time === "0001-01-01T00:00:00" 
                    ? "未打卡" 
                    : dayjs.utc(user.last_check_in_time).local().format("YYYY-MM-DD HH:mm:ss")
            }));
            page.total = res.data.total;
        } else {
            ElMessage.error(res.message);
        }
    } catch (error) {
        ElMessage.error('网络错误，数据获取失败');
        console.error(error);
    }
};

getData();

const changePage = (val: number) => {
    page.index = val;
    getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
    labelWidth: '100px',
    span: 12,
    list: [
        // { type: 'input', label: '用户名', prop: 'user_name', required: true },
        { type: 'input', label: '手机号', prop: 'phone_number', required: true },
        // // { type: 'input', label: '密码', prop: 'password', required: true },
        // { type: 'input', label: '邮箱', prop: 'email', required: false },
        // { type: 'input', label: '角色', prop: 'role', required: true },
        { type: 'input', label: '性别 (男,女)', prop: 'gender', required: true },
        { type: 'input', label: '昵称', prop: 'nick_name', required: true },
        { type: 'input', label: '描述',prop: 'description', required: false },
    ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref<User>({} as User);

const handleEdit = (row: User) => {
    rowData.value = { ...row };
    isEdit.value = true;
    visible.value = true;
};


const updateData = async (newData: UserUpdateTable) => {
    console.log(newData);
    if (!rowData.value) {
        console.error('rowData 为空，无法更新');
        return;
    }
    closeDialog();

    const updatedData: UserUpdate = {
        user_id: rowData.value.user_id,
        nick_name: newData.nick_name,
        gender: newData.gender === "男" ? 1 : rowData.value.gender === "女" ? 2 : 0,
        description: newData.description,
    };


    try {
        console.log('提交数据:', updatedData);
        const res = await fetchUserUpdate(updatedData);
        if (res.code === 200) {
            ElMessage.success('更新成功');
            getData();
        } else {
            ElMessage.error(res.message || '更新失败');
        }
    } catch (error) {
        console.error('更新失败', error);
        ElMessage.error('更新失败，请稍后重试');
    }
};


// const updateData = () => {
//     closeDialog();
//     console.log(rowData.value);
//     console.log(rowData.value.user_id);
//     getData();
// };

const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
    row: {},
    list: []
});
const handleView = (row: User) => {
    viewData.value.row = { ...row }
    viewData.value.list = [
        {
            prop: 'user_id',
            label: '用户ID',
        },
        {
            prop: 'user_name',
            label: '用户名',
        },
        {
            prop: 'email',
            label: '邮箱',
        },
        {
            prop: 'phone_number',
            label: '电话',
        },
        {
            prop: 'role',
            label: '角色',
        },
        {
            prop: 'last_check_in_time',
            label: '最后打卡日期',
        },
        {
            prop: 'gender',
            label: '性别',
        },
        {
            prop: 'nick_name',
            label: '昵称',
        },
        {
            prop: 'description',
            label: '描述',
        }
    ]
    visible1.value = true;
};


// 删除相关
const handleDelete = async (row: User) => {
    try {
        const res = await fetchUserDelete(row.user_id);
        if (res.code === 200) {
            ElMessage.success('删除成功');
            getData(); 
        } else {
            ElMessage.error(res.message);
        }
    } catch (error) {
        console.error('删除失败', error);
        ElMessage.error('删除失败，请稍后重试');
    }
};

</script>

<style scoped></style>
