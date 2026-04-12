import { useState } from 'react';
import { Typography, Button, Space, Modal, message } from 'antd';
import { LineChartOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const RecoveryHero = () => {

    const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);

    const handleCreateRoadmap = () => {
        if (!isAnalyzed) {
            Modal.confirm({
                title: 'Cần phân tích da trước',
                icon: <WarningOutlined style={{ color: '#faad14' }} />,
                content: 'Bạn cần thực hiện phân tích da bằng AI để chúng tôi có cơ sở lập lộ trình khôi phục chính xác nhất.',
                okText: 'Phân tích ngay',
                cancelText: 'Để sau',
                onOk: () => {
                    // Logic cuộn màn hình xuống phần Upload
                    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
            return;
        }
        // Logic chuyển hướng sang trang lộ trình
        message.success("Đang tạo lộ trình cá nhân hóa...");
    };

    return (
        <div style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)', padding: '100px 50px', textAlign: 'center' }}>
            <Title level={1}>Xây Dựng Lộ Trình Hồi Phục Da Cá Nhân Hóa</Title>
            <Paragraph style={{ fontSize: '18px', marginBottom: '30px' }}>
                Cần có dữ liệu phân tích để khởi tạo lộ trình chăm sóc phù hợp với tình trạng mụn hiện tại của bạn.
            </Paragraph>
            <Space size="large">
                <Button type="primary" size="large" icon={<LineChartOutlined />} onClick={handleCreateRoadmap}>
                    Tạo lộ trình ngay
                </Button>
                <Button size="large">Xem lộ trình mẫu</Button>
            </Space>
        </div>
    );
};
export default RecoveryHero;