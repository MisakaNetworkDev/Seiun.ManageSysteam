<template>
    <div class="login-bg">
        <div class="login-container">
            <div class="login-header">
                <img class="logo mr10" src="../../assets/img/logo.svg" alt="" />
                <div class="login-title">后台管理系统</div>
            </div>
            <el-form :model="param" :rules="rules" ref="login" size="large">
                <el-form-item prop="user_name">
                    <el-input v-model="param.user_name" placeholder="用户名">
                        <template #prepend>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="密码"
                        v-model="param.password"
                        @keyup.enter="submitForm(login)"
                    >
                        <template #prepend>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                        <template #append>
                            <el-icon @click="togglePassword" style="cursor: pointer;">
                                <component :is="showPassword ? 'View' : 'Hide'" />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="pwd-tips">
                    <el-checkbox class="pwd-checkbox" v-model="checked" label="记住密码" />
                    <el-link type="primary" @click="$router.push('/reset-pwd')">忘记密码</el-link>
                </div>
                <el-button class="login-btn" type="primary" size="large" @click="submitForm(login)">登录</el-button>
                <p class="login-text">
                    没有账号？<el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
                </p>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTabsStore } from '@/store/tabs';
import { usePermissStore } from '@/store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { jwtDecode } from "jwt-decode"; 
import { Lock } from '@element-plus/icons-vue';

const showPassword = ref(false);
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

interface LoginInfo {
    user_name: string;
    password: string;
}

const lgStr = localStorage.getItem('login-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
    user_name: defParam ? defParam.user_name : '',
    password: defParam ? defParam.password : '',
});

const rules: FormRules = {
    user_name: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid: boolean) => {
        if (!valid) {
            ElMessage.error('登录失败');
            return false;
        }

        try {
            const response = await fetch("api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(param),
            });

            if (!response.ok) {
                throw new Error(`登录失败，状态码：${response.status}`);
            }

            const data = await response.json(); 
            if (!data?.data?.token) {
                throw new Error("登录失败，未返回 Token");
            }

            const token = data.data.token;
            const tokenDecoded = jwtDecode(token);
            const role = tokenDecoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            if (role !== "SuperAdmin") {
                ElMessage.error('权限不足，仅 SuperAdmin 可登录');
                return;
            }

            localStorage.setItem('auth_token', token);
            localStorage.setItem('token_expire', data.data.expire_at.toString());
            localStorage.setItem('vuems_name', param.user_name);

            if (checked.value) {
                localStorage.setItem('login-param', JSON.stringify(param));
            } else {
                localStorage.removeItem('login-param');
            }

            const keys = permiss.defaultList["admin"];
            permiss.handleSet(keys);

            ElMessage.success('登录成功');
            router.push('/');
        } catch (error) {
            console.error("登录请求失败:", error);
            ElMessage.error(error.message || '登录失败，请检查用户名或密码');
        }
    });
};

const tabs = useTabsStore();
tabs.clearTabs();
</script>

<style scoped>
.login-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: url(../../assets/img/login-bg.jpg) center/cover no-repeat;
}

.login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
}

.logo {
    width: 35px;
}

.login-title {
    font-size: 22px;
    color: #333;
    font-weight: bold;
}

.login-container {
    width: 450px;
    border-radius: 5px;
    background: #fff;
    padding: 40px 50px 50px;
    box-sizing: border-box;
}

.pwd-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin: -2px 0 10px;
    color: #787878;
}

.pwd-checkbox {
    height: auto;
}

.login-btn {
    display: block;
    width: 100%;
}

.login-tips {
    font-size: 12px;
    color: #999;
}

.login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #787878;
}
</style>
