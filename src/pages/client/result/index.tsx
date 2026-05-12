import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Typography, Tabs, Button, Empty, Modal, List, Space, Tag, message, Radio, Checkbox, Divider, Select } from 'antd';
import {
    ArrowLeftOutlined,
    FireOutlined,
    ExperimentOutlined,
    SafetyCertificateOutlined,
    BulbOutlined,
    HistoryOutlined,
    ScheduleOutlined,
    CoffeeOutlined,
    MedicineBoxOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import ViewDetail from '../../../components/client/view';
import { useState, useEffect } from 'react';
import { callApiRecommendProduct } from '../../../api';
import { Option } from 'antd/es/mentions';

const { Title, Text, Paragraph } = Typography;

const SKIN_CLASSES = ['Acne', 'Blackheads', 'Dark-Spots', 'Dry-Skin', 'Englarged-Pores', 'Eyebags', 'Oily-Skin', 'Whiteheads', 'Wrinkles'];

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.detectionData;

    const [isLoading, setIsLoading] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [recommendData, setRecommendData] = useState<any>(null);

    const [isSurveyVisible, setIsSurveyVisible] = useState(false);
    const [validatedResults, setValidatedResults] = useState<any>([]);
    const [survey, setSurvey] = useState({
        skinType: 'oily',
        sensitive: 'no',
        hasPain: 'none',
        sunscreen: 'yes',
        sleepHabit: 'before_12',
        treatments: [] as string[],
        lifestyleFactor: [] as string[],
        waterIntake: 'enough'
    });

    const handleAddProblem = () => {
        const newItem = {
            id: `manual-${Date.now()}`,
            label: SKIN_CLASSES[0],
            score: 1.0,
            checked: true,
            isManual: true
        };
        setValidatedResults([...validatedResults, newItem]);
    };

    const removeProblem = (id: string) => {
        setValidatedResults(validatedResults.filter((item: any) => item.id !== id));
    };

    const updateProblem = (id: string, field: string, value: any) => {
        const newResults = validatedResults.map((item: any) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setValidatedResults(newResults);
    };


    useEffect(() => {
        if (data?.results) {
            const allDetections = [
                ...(data.results.front?.detections || []),
                ...(data.results.left?.detections || []),
                ...(data.results.right?.detections || [])
            ].map((d, index) => ({
                ...d,
                id: `ai-${index}`,
                checked: true,
                isManual: false
            }));
            setValidatedResults(allDetections);
        }
    }, [data]);



    const handleOpenRecommendModal = async () => {
        try {
            setIsLoading(true);
            message.loading({ content: 'Đang phân tích sản phẩm...', key: 'recommend' });
            const response = await callApiRecommendProduct({
                session_id: data.session_id,
                stats: data.stats,
                total_acne: data.total_acne,
                results: data.results
            });
            if (response.data) {
                setRecommendData(response.data);
                setIsModalVisible(true);
                message.success({ content: 'Gợi ý sản phẩm đã sẵn sàng!', key: 'recommend' });
            }
        } catch (error) {
            message.error({ content: 'Lỗi khi gọi API!', key: 'recommend' });
        } finally {
            setIsLoading(false);
        }
    };


    const handleGenerateRoadmap = async () => {
        const finalDetections = validatedResults.filter((r: any) => r.checked);
        message.loading({ content: 'Gemini đang thiết kế lộ trình...', key: 'roadmap' });

        console.log("Dữ liệu gửi đi tạo lộ trình:", { survey, finalDetections });

        setIsSurveyVisible(false);
        message.success({ content: 'Lộ trình đã được gửi đến email/tài khoản của bạn!', key: 'roadmap' });
    };

    if (!data) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Empty description="Không tìm thấy dữ liệu phân tích" />
                <Button onClick={() => navigate('/')}>Quay lại trang chủ</Button>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#f0f2f5', minHeight: '100vh' }}>

            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ borderRadius: '6px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                    Quay lại
                </Button>

                <Space size="middle">
                    <Button
                        type="default"
                        icon={<ExperimentOutlined />}
                        size="large"
                        onClick={handleOpenRecommendModal}
                        loading={isLoading}
                        style={{ borderRadius: '8px', height: '45px', fontWeight: '500' }}
                    >
                        Tư vấn sản phẩm
                    </Button>

                    <Button
                        type="primary"
                        icon={<ScheduleOutlined />}
                        size="large"
                        onClick={() => setIsSurveyVisible(true)}
                        style={{
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #52c41a 0%, #237804 100%)',
                            border: 'none',
                            height: '45px',
                            boxShadow: '0 4px 12px rgba(82,196,26,0.3)'
                        }}
                    >
                        Thiết lập lộ trình cải thiện
                    </Button>
                </Space>
            </Row>

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>BÁO CÁO PHÂN TÍCH DA CHI TIẾT</Title>
                <Space style={{ marginTop: 8 }}>
                    <Tag icon={<HistoryOutlined />} color="processing">Mã phiên: {data.session_id}</Tag>
                    <Tag color="cyan">{new Date().toLocaleDateString('vi-VN')}</Tag>
                </Space>
            </div>

            <Row gutter={24} style={{ marginBottom: 30 }}>
                <Col span={8}>
                    <Card style={{ borderRadius: '12px', borderLeft: '6px solid #ff4d4f' }}>
                        <Statistic
                            title="TỔNG SỐ ĐỐM MỤN"
                            value={data.total_acne}
                            valueStyle={{ color: '#cf1322', fontWeight: 800 }}
                            prefix={<FireOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={16}>
                    <Card style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', gap: '32px', overflowX: 'auto' }}>
                            {Object.entries(data.stats).map(([label, count]) => (
                                <Statistic
                                    key={label}
                                    title={label.toUpperCase()}
                                    value={count as number}
                                    valueStyle={{ color: '#1890ff', fontWeight: 700 }}
                                />
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Tabs
                    items={[
                        { key: 'front', label: 'Mặt chính diện', children: <ViewDetail view={data.results.front} /> },
                        { key: 'left', label: 'Mặt trái (45°)', children: <ViewDetail view={data.results.left} /> },
                        { key: 'right', label: 'Mặt phải (45°)', children: <ViewDetail view={data.results.right} /> },
                    ]}
                />
            </div>

            <Modal
                title={<Space><SafetyCertificateOutlined style={{ color: '#52c41a' }} />Gợi ý sản phẩm</Space>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[<Button key="ok" type="primary" onClick={() => setIsModalVisible(false)}>Đã hiểu</Button>]}
                width={850}
                centered
            >
                {recommendData && (
                    <>
                        <div style={{ padding: '16px', background: '#e6f7ff', borderRadius: '8px', marginBottom: 20 }}>
                            <Text strong><BulbOutlined /> Phân tích:</Text>
                            <Paragraph>{recommendData.analysis}</Paragraph>
                        </div>
                        <List
                            dataSource={recommendData.recommendations}
                            renderItem={(item: any) => (
                                <List.Item>
                                    <Card size="small" style={{ width: '100%' }}>
                                        <Row gutter={16} align="middle">
                                            <Col span={4}><img src={item.imageUrl} style={{ width: '100%' }} /></Col>
                                            <Col span={20}>
                                                <Text strong>{item.productName}</Text>
                                                <Paragraph style={{ fontSize: '12px' }}>{item.reason}</Paragraph>
                                            </Col>
                                        </Row>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </>
                )}
            </Modal>

            <Modal
                title={<Space><MedicineBoxOutlined style={{ color: '#722ed1' }} /> Khám da cùng Chuyên gia AI</Space>}
                open={isSurveyVisible}
                onCancel={() => setIsSurveyVisible(false)}
                onOk={handleGenerateRoadmap}
                okText="Phân tích & Tạo lộ trình"
                width={850}
                centered
            >
                <div style={{ padding: '0 10px' }}>

                    <Divider >1. Xác nhận vùng da (AI Detection)</Divider>
                    <div style={{ border: '1px solid #f0f0f0', padding: '15px', borderRadius: '8px', background: '#fafafa' }}>
                        <List
                            dataSource={validatedResults}
                            renderItem={(item: any) => (
                                <List.Item style={{ padding: '8px 0' }}>
                                    <Row gutter={16} align="middle" style={{ width: '100%' }}>
                                        <Col span={1}><Checkbox checked={item.checked} onChange={(e) => updateProblem(item.id, 'checked', e.target.checked)} /></Col>
                                        <Col span={5}>{item.isManual ? <Tag color="green">Bạn thêm</Tag> : <Tag color="blue">AI tìm thấy</Tag>}</Col>
                                        <Col span={12}>
                                            <Select style={{ width: '100%' }} value={item.label} disabled={!item.checked} onChange={(val) => updateProblem(item.id, 'label', val)}>
                                                {SKIN_CLASSES.map(cls => <Option key={cls} value={cls}>{cls}</Option>)}
                                            </Select>
                                        </Col>
                                        <Col span={4}>{!item.isManual && <Text type="secondary" style={{ fontSize: '11px' }}>{(item.confidence * 100).toFixed(0)}%</Text>}</Col>
                                        <Col span={2}>{item.isManual && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeProblem(item.id)} />}</Col>
                                    </Row>
                                </List.Item>
                            )}
                        />
                        <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddProblem} style={{ marginTop: 12 }}>Thêm vấn đề da khác</Button>
                    </div>


                    <Divider >2. Khảo sát tình trạng & Sinh hoạt</Divider>

                    <Row gutter={[32, 24]}>
                        {/* Nhóm 1: Cơ địa da */}
                        <Col span={12}>
                            <Text strong>Loại da hiện tại (Sau rửa mặt 2h):</Text>
                            <Radio.Group style={{ display: 'block', marginTop: 8 }} value={survey.skinType} onChange={e => setSurvey({ ...survey, skinType: e.target.value })}>
                                <Radio value="oily">Đổ dầu</Radio>
                                <Radio value="dry">Khô căng</Radio>
                                <Radio value="combination">Hỗn hợp</Radio>
                            </Radio.Group>
                        </Col>

                        <Col span={12}>
                            <Text strong>Cảm giác tại vùng da vấn đề:</Text>
                            <Select style={{ width: '100%', marginTop: 8 }} value={(survey as any).hasPain} placeholder="Chọn cảm giác..." onChange={val => setSurvey({ ...survey, hasPain: val })}>
                                <Option value="none">Bình thường</Option>
                                <Option value="pain">Đau nhức (Mụn sưng)</Option>
                                <Option value="itchy">Ngứa râm ran</Option>
                                <Option value="stinging">Châm chích/Rát</Option>
                            </Select>
                        </Col>

                        {/* Nhóm 2: Điều trị & Dị ứng */}
                        <Col span={12}>
                            <Text strong>Đang sử dụng đặc trị (Treatment):</Text>
                            <Select mode="multiple" style={{ width: '100%', marginTop: 8 }} placeholder="Chọn hoạt chất đang dùng" onChange={val => setSurvey({ ...survey, treatments: val })}>
                                <Option value="BHA">BHA / Salicylic Acid</Option>
                                <Option value="Retinol">Retinol / Tretinoin</Option>
                                <Option value="VitaminC">Vitamin C</Option>
                                <Option value="Benzoyl">Benzoyl Peroxide</Option>
                                <Option value="Adapalene">Adapalene / Klenzit MS</Option>
                            </Select>
                        </Col>

                        <Col span={12}>
                            <Text strong>Tiền sử dị ứng thành phần:</Text>
                            <Select
                                mode="tags"
                                style={{ width: '100%', marginTop: 8 }}
                                placeholder="Nhập tên thành phần bị dị ứng (nếu có)"
                                onChange={val => setSurvey({ ...survey, allergy: val } as any)}
                            >
                                <Option value="fragrance">Hương liệu (Fragrance)</Option>
                                <Option value="alcohol">Cồn khô (Alcohol Denat)</Option>
                                <Option value="paraben">Paraben</Option>
                            </Select>
                        </Col>

                        {/* Nhóm 3: Thói quen sinh hoạt */}
                        <Col span={12}>
                            <Text strong>Thói quen dùng Kem chống nắng:</Text>
                            <Radio.Group style={{ display: 'block', marginTop: 8 }} value={survey.sunscreen} onChange={e => setSurvey({ ...survey, sunscreen: e.target.value })}>
                                <Radio value="yes">Mỗi ngày</Radio>
                                <Radio value="no">Không dùng</Radio>
                            </Radio.Group>
                        </Col>

                        <Col span={12}>
                            <Text strong><CoffeeOutlined /> Lượng nước uống hằng ngày:</Text>
                            <Radio.Group style={{ display: 'block', marginTop: 8 }} value={survey.waterIntake} onChange={e => setSurvey({ ...survey, waterIntake: e.target.value })}>
                                <Radio value="enough">{">"} 2 Lít</Radio>
                                <Radio value="less">{"<"} 1 Lít</Radio>
                            </Radio.Group>
                        </Col>

                        <Col span={24}>
                            <Text strong>Yếu tố ảnh hưởng (Lifestyle):</Text>
                            <Checkbox.Group style={{ width: '100%', marginTop: 8 }} onChange={val => setSurvey({ ...survey, lifestyleFactor: val as string[] })}>
                                <Row>
                                    <Col span={6}><Checkbox value="late_night">Thức khuya</Checkbox></Col>
                                    <Col span={6}><Checkbox value="stress">Căng thẳng</Checkbox></Col>
                                    <Col span={6}><Checkbox value="sugar">Ăn đồ ngọt</Checkbox></Col>
                                    <Col span={6}><Checkbox value="makeup">Makeup nhiều</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        </Col>

                        {/* Nhóm 4: Mục tiêu & Ghi chú */}
                        <Col span={24}>
                            <Divider style={{ margin: '8px 0' }} />
                            <Text strong>Mục tiêu bạn muốn ưu tiên nhất:</Text>
                            <Select
                                style={{ width: '100%', marginTop: 8 }}
                                placeholder="Chọn mục tiêu ưu tiên cải thiện"
                                onChange={val => setSurvey({ ...survey, priority: val } as any)}
                            >
                                <Option value="clear_acne">Trị mụn & Gom cồi nhanh</Option>
                                <Option value="fade_spots">Mờ thâm & Sáng da</Option>
                                <Option value="repair">Phục hồi da nhạy cảm/Kích ứng</Option>
                                <Option value="pore">Se khít lỗ chân lông</Option>
                            </Select>
                        </Col>


                    </Row>
                </div>
            </Modal>


        </div>
    );
};

export default ResultPage;