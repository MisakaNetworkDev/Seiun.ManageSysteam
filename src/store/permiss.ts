import { defineStore } from 'pinia';
import { jwtDecode } from "jwt-decode"; 

interface ObjectList {
    [key: string]: string[];
}

export const usePermissStore = defineStore('permiss', {
    state: () => {
        const defaultList: ObjectList = {
            admin: [
                '0', '1', '11', '12', '13', '2', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                '291', '292', '3', '31', '32', '33', '34', '4', '41', '42', '5', '7', '6', '61', '62',
                '63', '64', '65', '66',
            ],
            user: ['0', '1', '11', '12', '13'],
        };

        let key: string[] = [];
        const token = localStorage.getItem('auth_token');

        if (token != null) {
            try {
                const tokenDecoded = jwtDecode(token);
                const role = tokenDecoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                key = role === 'SuperAdmin' ? defaultList.admin : defaultList.user;
            } catch (error) {
                console.error('Token 解析失败:', error);
            }
        }

        return {
            key,  
            defaultList,
        };
    },
    actions: {
        handleSet(val: string[]) {
            this.key = val;
        },
    },
});
