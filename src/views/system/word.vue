<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total_words" :page-size="page.Size" :viewFunc="handleView"
                :delFunc="handleDelete" :change-page="changePage" :editFunc="handleEdit" :refresh="getData">
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
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User, UserUpdate, UserUpdateTable } from '@/types/user';
import {  fetchUserDelete, fetchUserUpdate, fetchWordData } from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';


// 查询相关
const query = reactive({
    Keyword: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '单词Guid', prop: 'Keyword' }
])


const getData = async () => {
    const res = await fetchWordData({
        Index: page.Index,
        Size: page.Size,    
        ...query, 
    }); 
    console.log(res);
    if(res.code === 200) {
        tableData.value = res.data.words;
        page.total_words = res.data.total_words;
    }else if(res.message == "error.controller.admin.word.words_not_found") {
        ElMessage.error("没有找到相关单词");
    }else if(res.message == "error.controller.admin.word.get_all_words_failed") {
        ElMessage.error("服务器错误,获取单词失败");
    }else {
        ElMessage.error("未知错误");
    }
};

const handleSearch = () => {
    changePage(1);
    getData();
};

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'word_id', label: '单词Guid' },
    { prop: 'word_text', label: '单词' },
    { prop: 'pronunciation', label: '音标' },
    { prop: 'definition', label: '释义' },
    { prop: 'distractor_ids', label: '干扰项Guid' },
    { prop: 'word_book_name', label: '所属词库' },
    // { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
    Index: 1,
    Size: 20,
    total_words: 0,
})

const tableData = ref<[]>([]);
getData();

const changePage = (val: number) => {
    page.Index = val;
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
            prop: 'word_id',
            label: '单词Guid',
        },
        {
            prop: 'word_text',
            label: '单词',
        },
        {
            prop: 'pronunciation',
            label: '音标',
        },
        {
            prop: 'definition',
            label: '释义',
        },
        {
            prop: 'distractor_ids',
            label: '干扰项Guid',
        },
        {
            prop: 'word_book_name',
            label: '所属词库',

        },
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

<style scoped>
</style>
