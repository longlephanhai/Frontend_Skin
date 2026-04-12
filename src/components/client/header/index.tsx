import { Layout, Menu, Typography } from 'antd';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const HeaderComponent = () => {
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
            <Title level={4} style={{ margin: 0, color: '#1890ff', flex: 1 }}>
                SkinVision AI
            </Title>
            <Menu
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={[
                    { key: '1', label: 'Trang chủ' },
                    { key: '2', label: 'Phân tích da' },
                    { key: '3', label: 'Hướng dẫn' },
                ]}
                style={{ flex: 1, justifyContent: 'end', borderBottom: 'none' }}
            />
        </AntHeader>
    );
};

export default HeaderComponent;