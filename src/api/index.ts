import { UserUpdate } from '@/types/user';
import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

// export const fetchUserData = () => {
//     return request({
//         url: './mock/user.json',
//         method: 'get'
//     });
// };

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};


export const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('auth_token'); 
        if (!token) {
            throw new Error('Token 不存在，请重新登录');
        }
        const response = await fetch('http://localhost:5222/admin/user-list', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`请求失败: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('服务器错误:', error);
        return Promise.reject(error); 
    }
};


export const fetchUserUpdate = async (updatedData: UserUpdate) => {
    try {
        const token = localStorage.getItem('auth_token'); 
        if (!token) {
            throw new Error('Token 不存在，请重新登录');
        }

        const response = await fetch('http://localhost:5222/admin/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData), 
        });
        if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
        }
        const responseData = await response.json().catch(() => null);
        if (!responseData) {
            throw new Error('服务器返回数据格式不正确');
        }
        return responseData;
    } catch (error) {
        console.error('更新用户失败:', error);
        throw error;
    }
};

export const fetchUserDelete = async (userId: String) => {
    try {
        const token = localStorage.getItem('auth_token'); 
        if (!token) {
            throw new Error('Token 不存在，请重新登录');
        }

        const response = await fetch(`http://localhost:5222/admin/user/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
        }
        const responseData = await response.json().catch(() => null);
        if (!responseData) {
            throw new Error('服务器返回数据格式不正确');
        }
        return responseData;
    }
    catch (error) {
        console.error('删除用户失败:', error);
        throw error;
    }
}