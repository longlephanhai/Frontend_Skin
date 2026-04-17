import axios from "../config/index"

export const callApiLogin = async (data: { email: string, password: string }): Promise<IBackendRes<IAccount>> => {
    return await axios.post('/auth/login', data);
}

export const callApiDetection = async (data: {
    front: File,
    left: File,
    right: File
}): Promise<IBackendRes<any>> => {
    const formData = new FormData()
    formData.append('front', data.front)
    formData.append('left', data.left)
    formData.append('right', data.right)

    return await axios.post('/detections/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}