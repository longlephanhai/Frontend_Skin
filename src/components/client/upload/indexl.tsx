import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, message, Badge, Spin } from 'antd';
import {
    PictureOutlined,
    CheckCircleFilled,
    DeleteOutlined,
    ScanOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import * as faceapi from 'face-api.js';
import { checkFacePose } from '../../../helper';
import { callApiDetection } from '../../../api';
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;

type Position = 'left' | 'front' | 'right';

interface ImageState {
    file: File | null;
    preview: string | null;
    isValidating: boolean;
}

interface UploadData {
    left: ImageState;
    front: ImageState;
    right: ImageState;
}

const SkinUploadSection = () => {
    const [data, setData] = useState<UploadData>({
        left: { file: null, preview: null, isValidating: false },
        front: { file: null, preview: null, isValidating: false },
        right: { file: null, preview: null, isValidating: false },
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);


    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/weights';
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error(err);
                message.error("AI Models failed to load!");
            }
        };
        loadModels();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, position: Position) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            message.error("Vui lòng chỉ chọn tệp hình ảnh!");
            return;
        }

        if (!modelsLoaded) {
            message.warning("AI đang khởi động, đợi tí nhé...");
            return;
        }

        setData(prev => ({ ...prev, [position]: { ...prev[position], isValidating: true } }));

        try {
            const imageUrl = URL.createObjectURL(file);
            const img = new Image();
            img.src = imageUrl;

            img.onload = async () => {
                const result = await checkFacePose(img, position);

                if (result.valid) {
                    setData(prev => ({
                        ...prev,
                        [position]: { file, preview: imageUrl, isValidating: false }
                    }));
                    message.success(`Ảnh ${labelMap[position]} hợp lệ!`);
                } else {
                    setData(prev => ({ ...prev, [position]: { file: null, preview: null, isValidating: false } }));
                    message.error(result.message);
                }
            };
        } catch (err) {
            message.error("Lỗi kiểm tra hình ảnh.");
            setData(prev => ({ ...prev, [position]: { ...prev[position], isValidating: false } }));
        }
        e.target.value = '';
    };

    const removeImage = (position: Position) => {
        setData(prev => ({
            ...prev,
            [position]: { file: null, preview: null, isValidating: false }
        }));
    };

    const labelMap = { left: 'Mặt Trái', front: 'Chính Diện', right: 'Mặt Phải' };

    const handleAnalyze = async () => {
        setLoading(true);
        message.loading("Đang phân tích, đợi tí nhé...", 2);
        const { left, front, right } = data;
        if (!left.file || !front.file || !right.file) {
            setLoading(false);
            return message.error("Bạn cần tải lên đủ 3 góc độ hợp lệ!");
        }
        const response = await callApiDetection({
            front: front.file,
            left: left.file,
            right: right.file
        });
        console.log(response);
        if (response.statusCode == 201 && response.data) {
            message.success("Phân tích thành công! Chuyển sang trang kết quả...");
            navigate('/result', { state: { detectionData: response.data } });
        } else {
            message.error("Phân tích thất bại, thử lại sau nhé!");
        }
        setLoading(false);
    };

    const UploadBox: React.FC<{ position: Position; label: string }> = ({ position, label }) => {
        const item = data[position];
        const hasImage = !!item.preview;

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
                        <Text strong style={{ fontSize: '16px' }}>{label}</Text>
                    </div>

                    <div style={{
                        width: '100%', height: '200px', background: '#f8f9fa',
                        borderRadius: '12px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', position: 'relative', marginBottom: '15px',
                        border: '1px solid #f0f0f0', overflow: 'hidden'
                    }}>
                        {item.isValidating ? (
                            <div style={{ textAlign: 'center' }}>
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
                                <div style={{ marginTop: 8 }}>Đang check mặt...</div>
                            </div>
                        ) : hasImage ? (
                            <>
                                <img src={item.preview!} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Button
                                    danger type="primary" shape="circle" icon={<DeleteOutlined />}
                                    size="small" onClick={() => removeImage(position)}
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

                    {!hasImage && !item.isValidating ? (
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button
                                block type="dashed" icon={<PictureOutlined />}
                                onClick={() => document.getElementById(`file-${position}`)?.click()}
                                disabled={!modelsLoaded}
                            >
                                Chọn ảnh từ máy
                            </Button>
                            <input
                                type="file" id={`file-${position}`} hidden
                                accept="image/*" onChange={(e) => handleFileChange(e, position)}
                            />
                        </Space>
                    ) : (
                        <div style={{ height: '32px' }}>
                            {hasImage && <Badge status="success" text={<Text style={{ color: '#52c41a' }}>Ảnh hợp lệ</Text>} />}
                        </div>
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
                        type="primary" size="large" icon={<CheckCircleFilled />}
                        loading={loading} onClick={handleAnalyze}
                        disabled={!data.left.file || !data.front.file || !data.right.file}
                        style={{
                            height: '60px', padding: '0 80px', borderRadius: '12px',
                            fontSize: '20px', fontWeight: '600', background: '#1890ff'
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