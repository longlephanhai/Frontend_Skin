import { Layout, Button, Typography, Row, Col, Card, Space } from 'antd';
import { CameraOutlined, RocketOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import HeaderComponent from '../../../components/client/header';
import FooterComponent from '../../../components/client/footer/inddex';
import SkinUploadSection from '../../../components/client/upload/indexl';
import RecoveryHero from '../../../components/client/recovery';



const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Homepage = () => {
    return (
        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
            <HeaderComponent />

            <Content>
                {/* Hero Section */}
                <RecoveryHero />

                <SkinUploadSection />

                {/* Features Section */}
                <div style={{ padding: '80px 50px' }}>
                    <Row gutter={[32, 32]} justify="center">
                        <Col xs={24} md={8}>
                            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                                <RocketOutlined style={{ fontSize: '40px', color: '#1890ff', marginBottom: '20px' }} />
                                <Title level={4}>Tốc độ vượt trội</Title>
                                <Paragraph>Dựa trên YOLOv11, hệ thống phản hồi kết quả gần như tức thời.</Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                                <SafetyCertificateOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '20px' }} />
                                <Title level={4}>Độ chính xác cao</Title>
                                <Paragraph>Xử lý ảnh qua SAHI giúp nhận diện các chi tiết cực nhỏ trên da.</Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>

            <FooterComponent />
        </Layout>
    );
};

export default Homepage;