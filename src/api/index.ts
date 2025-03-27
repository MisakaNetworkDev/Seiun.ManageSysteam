import { UserUpdate } from '@/types/user';
import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};

// api.ts
// export const fetchUserLogin = async (param: { user_name: string, password: string }) => {
//     const response = await fetch("http://localhost:5222/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(param),
//     });

//     const data = await response.json();
//     console.log(data);
    
//     return data;
// };


export const fetchUserData = async (params = {}) => {
    try {
        const token = localStorage.getItem('auth_token'); 
        if (!token) {
            throw new Error('Token 不存在，请重新登录');
        }
        
        // 构造查询字符串
        const queryString = new URLSearchParams(params).toString();
        
        const apiUrl = `api/admin/user-list${queryString ? '?' + queryString : ''}`;

        const response = await fetch(apiUrl, {
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

        const response = await fetch('api/admin/user/update', {
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

        const response = await fetch(`api/admin/user/delete/${userId}`, {
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



export const fetchWordData = async (params = {}) => {
    const token = localStorage.getItem('auth_token'); 
    if (!token) {
        throw new Error('Token 不存在，请重新登录');
    }
    
    const queryString = new URLSearchParams(params).toString();    
    const apiUrl = `api/admin/word-list${queryString ? '?' + queryString : ''}`;

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    return await response.json();
};

export const fetchArticleData = async (params = {}) => {
    const token = localStorage.getItem('auth_token'); 
    if (!token) {
        throw new Error('Token 不存在，请重新登录');
    }

    const queryString = new URLSearchParams(params).toString();    
    const apiUrl = `api/admin/article-list${queryString ? '?' + queryString : ''}`;
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return await response.json();
}


export const fetchArticleImageLimited = async (fileNames: string[], maxConcurrent = 5) => {
    const results: string[] = [];
    const queue: Promise<void>[] = [];

    for (const fileName of fileNames) {
        const promise = (async () => {
            const imageUrl = `api/resources/article-image/${fileName}`;
            results.push(imageUrl);
        })();

        queue.push(promise);
        if (queue.length >= maxConcurrent) {
            await Promise.race(queue);
            queue.splice(queue.findIndex(p => p === promise), 1);
        }
    }

    await Promise.all(queue);
    return results;
};

export const fetchRolesData = async (params = {}) => {
    const token = localStorage.getItem('auth_token'); 
    if (!token) {
        throw new Error('Token 不存在，请重新登录');
    }   

    const queryString = new URLSearchParams(params).toString();  
    const apiUrl = `api/admin/role-list${queryString ? '?' + queryString : ''}`;
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return await response.json();
}

export const fetchRolesDelete = async (userId: String) => {
    try {
        const token = localStorage.getItem('auth_token'); 
        if (!token) {
            throw new Error('Token 不存在，请重新登录');
        }

        const response = await fetch(`api/admin/role/${userId}`, {
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

export const fetchRoleChange = async (userId: String) => {
    const token = localStorage.getItem('auth_token'); 
    if (!token) {
        throw new Error('Token 不存在，请重新登录');
    }

    const response = await fetch(`api/admin/create-role/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    return response.json();
}