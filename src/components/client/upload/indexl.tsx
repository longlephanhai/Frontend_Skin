import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, message, Badge } from 'antd';
import {
    PictureOutlined,
    CheckCircleFilled,
    DeleteOutlined,
    ScanOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

type Position = 'left' | 'front' | 'right';

interface ImageState {
    file: File | null;
    preview: string | null;
}

interface UploadData {
    left: ImageState;
    front: ImageState;
    right: ImageState;
}

const SkinUploadSection = () => {
    const [data, setData] = useState<UploadData>({
        left: { file: null, preview: null },
        front: { file: null, preview: null },
        right: { file: null, preview: null },
    });

    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, position: Position) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                message.error("Vui lòng chỉ chọn tệp hình ảnh!");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({
                    ...prev,
                    [position]: { file: file, preview: reader.result as string }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (position: Position) => {
        setData(prev => ({
            ...prev,
            [position]: { file: null, preview: null }
        }));
    };

    const handleAnalyze = async () => {
        const { left, front, right } = data;

        if (!left.file || !front.file || !right.file) {
            return message.error("Bạn cần tải lên đủ 3 góc độ: Trái, Thẳng, và Phải!");
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('left_view', left.file);
        formData.append('front_view', front.file);
        formData.append('right_view', right.file);

        try {
            console.log("Đang gửi FormData lên Server...");
            await new Promise(resolve => setTimeout(resolve, 2000));

            message.success("Tải lên thành công! Đang đợi YOLOv11 xử lý...");
        } catch (err) {
            message.error("Lỗi hệ thống, vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const UploadBox: React.FC<{ position: Position; label: string }> = ({ position, label }) => {
        const hasImage = !!data[position].preview;

        return (
            <Col xs={24} md={8}>
                <Card
                    hoverable
                    style={{
                        textAlign: 'center',
                        borderRadius: '16px',
                        border: hasImage ? '2px solid #52c41a' : '1px dashed #d9d9d9',
                        transition: 'all 0.3s'
                    }}
                >
                    <div style={{ marginBottom: '12px' }}>
                        <Text strong size-={16}>{label}</Text>
                    </div>

                    <div style={{
                        width: '100%',
                        height: '200px',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        marginBottom: '15px',
                        border: '1px solid #f0f0f0'
                    }}>
                        {hasImage ? (
                            <>
                                <img
                                    src={data[position].preview!}
                                    alt={label}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                                />
                                <Button
                                    danger
                                    type="primary"
                                    shape="circle"
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    onClick={() => removeImage(position)}
                                    style={{ position: 'absolute', top: 8, right: 8 }}
                                />
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <ScanOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                                <div style={{ color: '#bfbfbf', marginTop: '8px' }}>Chưa có ảnh</div>
                            </div>
                        )}
                    </div>

                    {!hasImage ? (
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                block
                                type="dashed"
                                icon={<PictureOutlined />}
                                onClick={() => document.getElementById(`file-${position}`)?.click()}
                            >
                                Chọn ảnh từ máy
                            </Button>
                            <input
                                type="file"
                                id={`file-${position}`}
                                hidden
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, position)}
                            />
                        </Space>
                    ) : (
                        <Badge status="success" text={<Text style={{ color: '#52c41a' }}>Ảnh hợp lệ</Text>} />
                    )}
                </Card>
            </Col>
        );
    };

    return (
        <div style={{ padding: '80px 20px', background: '#ffffff' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <Title level={2} style={{ color: '#001529' }}>Chẩn Đoán Tình Trạng Da AI</Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        Hệ thống yêu cầu 3 góc độ để phân tích chính xác các vùng mụn khuất
                    </Text>
                </div>

                <Row gutter={[32, 32]}>
                    <UploadBox position="left" label="Vùng mặt Trái" />
                    <UploadBox position="front" label="Vùng mặt Chính diện" />
                    <UploadBox position="right" label="Vùng mặt Phải" />
                </Row>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<CheckCircleFilled />}
                        loading={loading}
                        onClick={handleAnalyze}
                        style={{
                            height: '60px',
                            padding: '0 80px',
                            borderRadius: '12px',
                            fontSize: '20px',
                            fontWeight: '600',
                            background: '#1890ff'
                        }}
                    >
                        BẮT ĐẦU PHÂN TÍCH
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SkinUploadSection;