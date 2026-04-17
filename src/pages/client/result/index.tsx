import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Typography, Tabs, Button, Empty } from 'antd';
import { ArrowLeftOutlined, FireOutlined } from '@ant-design/icons';
import ViewDetail from '../../../components/client/view';

const { Title, Text } = Typography;

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();


    const data = location.state?.detectionData;



    if (!data) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Empty description="Không tìm thấy dữ liệu phân tích" />
                <Button onClick={() => navigate('/')}>Quay lại trang chủ</Button>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#f5f7fa' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: 20 }}
            >
                Quay lại
            </Button>

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2}>BÁO CÁO PHÂN TÍCH DA CHI TIẾT</Title>
                <Text type="secondary">Mã phiên: {data.session_id}</Text>
            </div>

            <Row gutter={24} style={{ marginBottom: 30 }}>
                <Col span={8}>
                    <Card bordered={false} style={{ borderLeft: '5px solid #ff4d4f' }}>
                        <Statistic
                            title="Tổng số đốm mụn"
                            value={data.total_acne}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<FireOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={16}>
                    <Card bordered={false}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {Object.entries(data.stats).map(([label, count]) => (
                                <Statistic
                                    key={label}
                                    title={label}
                                    value={count as number}
                                    style={{ borderRight: '1px solid #f0f0f0', paddingRight: '20px' }}
                                />
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>


            <Tabs
                type="card"
                items={[
                    { key: 'front', label: 'Chính diện', children: <ViewDetail view={data.results.front} /> },
                    { key: 'left', label: 'Mặt trái', children: <ViewDetail view={data.results.left} /> },
                    { key: 'right', label: 'Mặt phải', children: <ViewDetail view={data.results.right} /> },
                ]}
            />
        </div>
    );
};



export default ResultPage;