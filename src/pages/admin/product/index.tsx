import { Form, Input, InputNumber, Button, Card, Typography, type GetProp, type UploadProps, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined, ShoppingCartOutlined, TagsOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { callApiCreateProduct, callApiUploadImageProduct } from '../../../api';

const { Title } = Typography;
const { TextArea } = Input;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ProductPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();


    const handleUploadImage = async (options: any) => {
        const { onSuccess, file } = options;
        try {
            setLoading(true);
            const response = await callApiUploadImageProduct(file);
            if (response.data) {
                const { url } = response.data;
                setImageUrl(url);
                form.setFieldsValue({ imageUrl: url });
                onSuccess(response.data);
                message.success('Upload ảnh thành công!');
                setLoading(false)
            }
        } catch {
            message.error('Upload ảnh thất bại!');
            setLoading(false)
        }
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể upload file JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onFinish = async (values: IProduct) => {
        values.imageUrl = imageUrl as any;
        try {
            const response = await callApiCreateProduct(values);
            if (response.data) {
                message.success('Tạo sản phẩm thành công!');
                form.resetFields();
                setImageUrl(undefined);
            }
        } catch {
            message.error('Tạo sản phẩm thất bại!');
        }

    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Card style={{ width: '100%', maxWidth: 600, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>Tạo Sản Phẩm Mới</Title>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
                        <Input prefix={<ShoppingCartOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item label="Danh mục" name="category" rules={[{ required: true }]}>
                        <Input prefix={<TagsOutlined />} size="large" />
                    </Form.Item>

                    <Form.Item label="Giá sản phẩm" name="price" rules={[{ required: true }]}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => String(value).replace(/\$\s?|(,*)/g, '')}
                            size="large"
                        />
                    </Form.Item>

                    {/* Image URL Field */}
                    <Form.Item
                        label="Hình ảnh sản phẩm"
                        name="imageUrl" // Đây là field sẽ chứa chuỗi URL sau khi upload xong
                        rules={[{ required: true, message: 'Vui lòng upload ảnh!' }]}
                    >
                        <Upload
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            customRequest={handleUploadImage}
                            beforeUpload={beforeUpload}
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="product" style={{ width: '100%', borderRadius: '4px' }} />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Hướng dẫn sử dụng" name="instructions" rules={[{ required: true }]}>
                        <TextArea showCount maxLength={500} rows={4} />
                    </Form.Item>

                    <Form.Item label="Mô tả sản phẩm" name="description" rules={[{ required: true }]}>
                        <TextArea showCount maxLength={500} rows={4} />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" block size="large">
                            Tạo Sản Phẩm
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ProductPage;