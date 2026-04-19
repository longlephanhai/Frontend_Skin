import { Card, Row, Col, Image, List, Typography, Modal, Button, Radio, Space, Tag } from 'antd';
import { skinConditionInfo } from '../../../helper/index';
import { InfoCircleOutlined, GlobalOutlined, EyeOutlined, FireOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text } = Typography;

const ViewDetail = ({ view }: { view: any }) => {
    const [viewMode, setViewMode] = useState<'detection' | 'heatmap' | 'gradcam'>('detection');

    const showInfo = (label: string) => {
        const info = skinConditionInfo[label];
        if (!info) return;

        Modal.info({
            title: info.title,
            icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
            width: 500,
            centered: true,
            maskClosable: true,
            content: (
                <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 15 }}>
                        <Text strong>Định nghĩa:</Text>
                        <p style={{ color: '#595959' }}>{info.definition}</p>
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <Text strong style={{ color: '#cf1322' }}>Nguyên nhân:</Text>
                        <p style={{ color: '#595959' }}>{info.cause}</p>
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <Text strong style={{ color: '#389e0d' }}>Lời khuyên xử lý:</Text>
                        <p style={{ color: '#595959' }}>{info.advice}</p>
                    </div>
                    <Button
                        type="link"
                        icon={<GlobalOutlined />}
                        href={info.link}
                        target="_blank"
                        style={{ padding: 0 }}
                    >
                        Đọc bài viết y khoa chi tiết
                    </Button>
                </div>
            ),
            okText: 'Đã hiểu',
            okButtonProps: { style: { borderRadius: '6px' } }
        });
    };


    const getDisplayImage = () => {
        if (viewMode === 'heatmap') return view.heatmap_url || view.visualization_url;
        if (viewMode === 'gradcam') return view.gradcam_url || view.visualization_url;
        return view.visualization_url;
    };

    return (
        <Row gutter={24}>
            <Col span={16}>
                <Card 
                    title={
                        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                            <span>Ảnh phân tích AI</span>
                            <Radio.Group 
                                value={viewMode} 
                                onChange={(e) => setViewMode(e.target.value)}
                                buttonStyle="solid"
                                size="small"
                            >
                                <Radio.Button value="detection"><EyeOutlined /> Nhận diện</Radio.Button>
                                <Radio.Button value="heatmap"><FireOutlined /> Mật độ</Radio.Button>
                                <Radio.Button value="gradcam"><ExperimentOutlined /> AI Insight</Radio.Button>
                            </Radio.Group>
                        </Space>
                    }
                >
                    <div style={{ position: 'relative' }}>
                        <Image
                            src={getDisplayImage()}
                            style={{ borderRadius: 8, width: '100%' }}
                            placeholder={true}
                        />
                      
                        {viewMode !== 'detection' && (
                            <div style={{ 
                                marginTop: 10, 
                                padding: '8px 12px', 
                                background: '#f0f5ff', 
                                borderRadius: 4,
                                border: '1px solid #adc6ff' 
                            }}>
                                <Text italic style={{ fontSize: '12px' }}>
                                    {viewMode === 'heatmap' 
                                        ? "Vùng màu nóng (đỏ/vàng) thể hiện mật độ tập trung của các vấn đề da." 
                                        : "AI Insight: Các vệt sáng thể hiện những đặc trưng mà AI dùng để đưa ra chẩn đoán."}
                                </Text>
                            </div>
                        )}
                    </div>
                </Card>
            </Col>
            <Col span={8}>
                <Card title={<Space>Detections <Tag color="red">{view.total}</Tag></Space>} bodyStyle={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <List
                        dataSource={view.detections}
                        renderItem={(item: any) => {
                            const info = skinConditionInfo[item.label];
                            return (
                                <List.Item
                                    style={{ cursor: 'pointer', transition: '0.3s', borderRadius: 8, marginBottom: 8, border: '1px solid #f0f0f0' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    onClick={() => showInfo(item.label)}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Image
                                                    src={item.crop_url}
                                                    width={50}
                                                    style={{ borderRadius: 4, border: '1px solid #f0f0f0' }}
                                                />
                                            </div>
                                        }
                                        title={<Text strong>{info?.title || item.label}</Text>}
                                        description={
                                            <div>
                                                <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                                                    Độ tin cậy: {(item.confidence * 100).toFixed(0)}%
                                                </Text>
                                                <Text style={{ fontSize: '11px', color: '#1890ff' }}>Ấn để xem giải thích</Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default ViewDetail;