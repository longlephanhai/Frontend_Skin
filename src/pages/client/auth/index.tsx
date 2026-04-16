import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, InputNumber, message, Tabs } from 'antd';
import { LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { callApiLogin } from '../../../api';

const { Title, Text } = Typography;
const { Option } = Select;

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();

    const onFinishLogin = async (values: { email: string, password: string }) => {
        setLoading(true);
        try {
            const res = await callApiLogin(values);
            if (res.data?.access_token) {
                localStorage.setItem('access_token', res.data.access_token);
            }

            message.success('Đăng nhập thành công!');
            navigate('/');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    const onFinishRegister = async (values: any) => {
        setLoading(true);
        // try {
        //     await axios.post(import.meta.env.VITE_BACKEND_URL + '/auth/register', values);
        //     message.success('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        //     setActiveTab('login'); // Chuyển sang tab login sau khi đăng ký xong
        // } catch (error: any) {
        //     message.error(error.response?.data?.message || 'Đăng ký thất bại');
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh' // Chiều cao vừa phải nếu đặt trong Layout
        }}>
            <Card style={{ width: 400, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3} style={{ color: '#1890ff', marginBottom: 0 }}>SkinVision AI</Title>
                    <Text type="secondary">Phân tích & Chăm sóc da liễu</Text>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    centered
                    items={[
                        {
                            key: 'login',
                            label: 'Đăng nhập',
                            children: (
                                <Form name="login_form" layout="vertical" onFinish={onFinishLogin}>
                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập Email hợp lệ!' }]}
                                    >
                                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                                        Đăng nhập
                                    </Button>
                                </Form>
                            )
                        },
                        {
                            key: 'register',
                            label: 'Đăng ký',
                            children: (
                                <Form name="register_form" layout="vertical" onFinish={onFinishRegister}>
                                    <Form.Item name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                                        <Input prefix={<IdcardOutlined />} placeholder="Họ và tên" />
                                    </Form.Item>

                                    <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                                        <Input prefix={<MailOutlined />} placeholder="Email" />
                                    </Form.Item>

                                    <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' }]}>
                                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                                    </Form.Item>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <Form.Item name="age" label="Tuổi" rules={[{ required: true }]} style={{ flex: 1 }}>
                                            <InputNumber min={1} style={{ width: '100%' }} />
                                        </Form.Item>

                                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]} style={{ flex: 1 }}>
                                            <Select placeholder="Chọn">
                                                <Option value="male">Nam</Option>
                                                <Option value="female">Nữ</Option>
                                                <Option value="other">Khác</Option>
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#52c41a' }}>
                                        Đăng ký tài khoản
                                    </Button>
                                </Form>
                            )
                        }
                    ]} />
            </Card>
        </div>
    );
};

export default LoginPage;