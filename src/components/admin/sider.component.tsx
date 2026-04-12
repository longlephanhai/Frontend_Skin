import {
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
const { Sider } = Layout;

interface IProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const SiderComponent = (props: IProps) => {
    const { collapsed } = props;
    const navigate = useNavigate();

    const location = useLocation();
    const selectedKey = location.pathname.split('/').slice(-1)[0] || 'dashboard';


    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={[
                    {
                        key: 'admin',
                        icon: <UserOutlined />,
                        label: 'Dashboard',
                        onClick: () => {
                            navigate('');
                        }
                    },
                    {
                        key: 'user',
                        icon: <UserOutlined />,
                        label: 'Users',
                        onClick: () => {
                            navigate('user');
                        }
                    },
                ]}
            />
        </Sider>
    )
}

export default SiderComponent;