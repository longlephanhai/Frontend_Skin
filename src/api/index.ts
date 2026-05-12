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

export const callApiUploadImageProduct = async (file: File): Promise<IBackendRes<IUpload>> => {
    const formData = new FormData()
    formData.append('file', file)

    return await axios.post('/cloudinary/upload-product', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const callApiCreateProduct = async (data: IProduct): Promise<IBackendRes<IProduct>> => {
    return await axios.post('/products', data);
}

export const callApiRecommendProduct = async (data: any): Promise<IBackendRes<any>> => {
    return await axios.post('/products/recommend', data);
}