import { Layout, Menu, Typography, Button, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const HeaderComponent = () => {
    const navigate = useNavigate();

    // Giả sử bạn lưu token trong localStorage sau khi login
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload(); // Để cập nhật lại trạng thái UI
    };

    // Menu cho Dropdown khi đã login
    const userMenuItems = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile')
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        },
    ];

    return (
        <AntHeader style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 50px'
        }}>
            <Title
                level={4}
                style={{ margin: 0, color: '#1890ff', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                SkinVision AI
            </Title>

            <Menu
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={[
                    { key: '1', label: 'Trang chủ', onClick: () => navigate('/') },
                    { key: '2', label: 'Phân tích da', onClick: () => navigate('/detect') },
                ]}
                style={{ flex: 1, marginLeft: '20px', borderBottom: 'none' }}
            />

            <div style={{ display: 'flex', alignItems: 'center' }}>
                {token ? (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                            <span style={{ fontWeight: 500 }}>{user.fullName || 'User'}</span>
                        </Space>
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        onClick={() => navigate('auth/login')}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
        </AntHeader>
    );
};

export default HeaderComponent;