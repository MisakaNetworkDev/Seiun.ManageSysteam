<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">

            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :page-change="changePage" :editFunc="handleEdit">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                </template>
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
            </TableCustom>
        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData">
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
            </TableDetail>
        </el-dialog>
        <el-dialog title="权限管理" v-model="visible2" width="500px" destroy-on-close>
            <RolePermission :permiss-options="permissOptions" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="system-role">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Role } from '@/types/role';
import { fetchRolesData, fetchRolesDelete } from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import RolePermission from './role-permission.vue'
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
    Keyword: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '角色Guid:', prop: 'name' }
])
const handleSearch = () => {
    changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'user_id', label: '用户Guid' },
    { prop: 'role_name', label: '角色标识' },
    { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
    Index: 1,
    Size: 10,
    total: 0,
})
const roleMap: Record<number, string> = {
    0: "超级管理员",
    1: "管理员",
    2: "创作者",
    3: "普通用户",
    4: "未知"
};
const tableData = ref<Role[]>([]);
const getData = async () => {
    // console.log(roleMap[0]);
    const res = await fetchRolesData({
            Index: page.Index,
            Size: page.Size,    
            ...query, 
        }); 
    console.log(res);
    if (res.code === 200 && res.data) {
        tableData.value = res.data.list.map((Role) => ({
            ...Role,
            role_name: roleMap[Role.role_name],
        }));

        page.total = res.data.total;
    }
};

getData();
const changePage = (val: number) => {
    page.Index = val;
    getData();
};

// 新增/编辑弹窗相关
const options = ref<FormOption>({
    labelWidth: '100px',
    span: 24,
    list: [
        { type: 'input', label: '用户Guid', prop: 'user_id', required: true },
        { type: 'input', label: '角色名称', prop: 'role_name', required: false },
    ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: Role) => {
    rowData.value = { ...row };
    console.log(row.role_name);
    isEdit.value = true;
    visible.value = true;
};
const updateData = () => {
    closeDialog();
    getData();
};
const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
    rowData.value = {};
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
    row: {},
    list: [],
    column: 1
});
const handleView = (row: Role) => {
    viewData.value.row = { ...row }
    viewData.value.list = [
        {
            prop: 'user_id',
            label: '用户Guid',
        },
        {
            prop: 'role_name',
            label: '角色标识',
        }
    ]
    visible1.value = true;
};

// 删除相关
const handleDelete = async (row: Role) => {
    try {
        const res = await fetchRolesDelete(row.user_id);
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
}


// 权限管理弹窗相关
const visible2 = ref(false);
const permissOptions = ref({})
</script>

<style scoped></style>