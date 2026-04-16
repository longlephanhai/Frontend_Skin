import axios from "../config/index"

export const callApiLogin = async (data: { email: string, password: string }): Promise<IBackendRes<IAccount>> => {
    return await axios.post('/auth/login', data);
}