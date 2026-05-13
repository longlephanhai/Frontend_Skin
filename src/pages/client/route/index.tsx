import { useState, useEffect } from 'react';
import {
    Card, Tabs, Typography, Tag, Progress,
    Checkbox, List, Space, Button, Modal, message,
    Alert, Row, Col, Divider, Empty, Result
} from 'antd';
import {
    CameraOutlined,
    InfoCircleOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    WarningOutlined
} from '@ant-design/icons';

import { callApiGetSkinCoach } from "../../../api";
import SkinUploadSection from '../../../components/client/upload/indexl';

const { Title, Text, Paragraph } = Typography;

const RoutePage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [activeKey, setActiveKey] = useState("1");

    // 1. Khởi tạo completedTasks từ localStorage nếu có
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
        const savedProgress = localStorage.getItem('skin_coach_progress');
        return savedProgress ? JSON.parse(savedProgress) : {};
    });

    useEffect(() => {
        fetchSkinCoachByUser();
    }, []);

    // 2. Tự động lưu vào localStorage mỗi khi completedTasks thay đổi
    useEffect(() => {
        localStorage.setItem('skin_coach_progress', JSON.stringify(completedTasks));
    }, [completedTasks]);

    const fetchSkinCoachByUser = async () => {
        try {
            const response = await callApiGetSkinCoach();
            if (response && response.data) {
                setData(response.data);
            }
        } catch (error) {
            message.error('Không thể tải dữ liệu lộ trình');
        } finally {
            setLoading(false);
        }
    };

    // Hàm kiểm tra ngày X đã xong toàn bộ task chưa
    const isDayFullyCompleted = (dayNumber: number) => {
        const dayData = data?.routine30Days.find((d: any) => d.day === dayNumber);
        if (!dayData) return false;
        return dayData.tasks.every((task: any) => completedTasks[`day-${dayNumber}-${task.name}`]);
    };

    const handleCheckTask = (taskKey: string, dayNumber: number) => {
        const newState = {
            ...completedTasks,
            [taskKey]: !completedTasks[taskKey]
        };
        setCompletedTasks(newState);

        // Thông báo khi xong ngày
        const dayData = data.routine30Days.find((d: any) => d.day === dayNumber);
        const willBeDone = dayData.tasks.every((t: any) => {
            const key = `day-${dayNumber}-${t.name}`;
            return key === taskKey ? !completedTasks[taskKey] : completedTasks[key];
        });

        if (willBeDone) {
            message.success(`Hoàn thành Ngày ${dayNumber}! Tab mới đã được mở.`);
        }
    };

    const handleTabChange = (key: string) => {
        const targetDay = parseInt(key);
        const currentDay = parseInt(activeKey);

        if (targetDay > currentDay && !isDayFullyCompleted(targetDay - 1)) {
            message.warning(`Vui lòng hoàn thành tất cả nhiệm vụ ngày ${targetDay - 1} trước.`);
            return;
        }
        setActiveKey(key);
    };

    if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Đang tải...</div>;
    if (!data) return <Empty description="Không tìm thấy lộ trình" />;

    if (data.shouldSeeDoctor) {
        return (
            <div style={{ maxWidth: 800, margin: '50px auto', padding: '0 20px' }}>
                <Result
                    status="warning"
                    icon={<WarningOutlined style={{ color: '#ff4d4f' }} />}
                    title="Cảnh báo: Nên thăm khám chuyên khoa"
                    subTitle={data.medicalWarning || "Tình trạng da có dấu hiệu cần sự can thiệp của bác sĩ da liễu."}
                    extra={[
                        <Button type="primary" danger key="doctor">Tìm phòng khám</Button>,
                        <Button key="back" onClick={() => window.location.reload()}>Quay lại</Button>
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>

            <Card style={{ marginBottom: 24, borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size={0}>
                            <Text type="secondary">Tình trạng phát hiện</Text>
                            <div style={{ marginTop: 8 }}>
                                {data.detectedIssues.map((issue: string) => (
                                    <Tag color="red" key={issue} style={{ borderRadius: 20, padding: '2px 12px' }}>
                                        {issue}
                                    </Tag>
                                ))}
                                <Tag color="blue" style={{ borderRadius: 20, padding: '2px 12px' }}>
                                    Da {data.inputSurvey.skinType}
                                </Tag>
                            </div>
                        </Space>
                        <Divider style={{ margin: '16px 0' }} />
                        <Row align="middle" gutter={16}>
                            <Col flex="none">
                                <Text strong>Mức độ nghiêm trọng: </Text>
                                <Text style={{ color: '#ff4d4f', fontSize: 18, fontWeight: 'bold' }}>{data.severityScore}/20</Text>
                            </Col>
                            <Col flex="auto">
                                <Progress
                                    percent={(data.severityScore / 20) * 100}
                                    strokeColor={{ '0%': '#ffccc7', '100%': '#ff4d4f' }}
                                    showInfo={false}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={12} style={{ background: '#fff7e6', borderRadius: 12, padding: 16 }}>
                        <Space>
                            <InfoCircleOutlined style={{ color: '#faad14' }} />
                            <Text strong>Phân tích từ AI:</Text>
                        </Space>
                        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }} style={{ marginTop: 8, fontSize: 13 }}>
                            {data.analysis}
                        </Paragraph>
                    </Col>
                </Row>
            </Card>

            <Title level={4}><ThunderboltOutlined /> Lộ trình theo dõi</Title>
            <Tabs
                activeKey={activeKey}
                onTabClick={handleTabChange}
                type="card"
                items={data.routine30Days.map((dayData: any) => {
                    const dayKey = `day-${dayData.day}`;
                    const totalTasks = dayData.tasks.length;
                    const doneTasks = dayData.tasks.filter((t: any) => completedTasks[`${dayKey}-${t.name}`]).length;

                    // Logic khóa Tab: Khóa nếu ngày trước đó chưa xong
                    const isLocked = dayData.day > 1 && !isDayFullyCompleted(dayData.day - 1);

                    return {
                        label: (
                            <span>
                                {isDayFullyCompleted(dayData.day) && <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />}
                                Ngày {dayData.day}
                            </span>
                        ),
                        key: dayData.day.toString(),
                        disabled: isLocked,
                        children: (
                            <div style={{ padding: '16px', background: '#fff', borderRadius: '0 0 12px 12px' }}>
                                <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Title level={5} style={{ margin: 0 }}>Giai đoạn: {dayData.phase}</Title>
                                        <Text type="secondary">{dayData.note}</Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Text strong>{Math.round((doneTasks / totalTasks) * 100)}%</Text>
                                        <Progress type="circle" percent={Math.round((doneTasks / totalTasks) * 100)} width={40} strokeWidth={12} />
                                    </div>
                                </div>

                                <List
                                    dataSource={dayData.tasks}
                                    renderItem={(task: any) => {
                                        const taskUniqueId = `${dayKey}-${task.name}`;
                                        return (
                                            <Card
                                                size="small"
                                                hoverable
                                                style={{
                                                    marginBottom: 10,
                                                    borderRadius: 8,
                                                    borderLeft: completedTasks[taskUniqueId] ? '4px solid #52c41a' : '4px solid #1890ff'
                                                }}
                                            >
                                                <Checkbox
                                                    checked={completedTasks[taskUniqueId]}
                                                    onChange={() => handleCheckTask(taskUniqueId, dayData.day)}
                                                    style={{ width: '100%' }}
                                                >
                                                    <div style={{ marginLeft: 8 }}>
                                                        <Text delete={completedTasks[taskUniqueId]} strong={!completedTasks[taskUniqueId]}>
                                                            {task.name}
                                                        </Text>
                                                        <div style={{ marginTop: 4 }}>
                                                            <Tag color={getTagColor(task.tag)}>{task.tag.toUpperCase()}</Tag>
                                                            <Tag>{task.timeOfDay === 'both' ? 'Sáng & Tối' : task.timeOfDay}</Tag>
                                                        </div>
                                                    </div>
                                                </Checkbox>
                                            </Card>
                                        );
                                    }}
                                />

                                {(dayData.day % 7 === 0) && (
                                    <Alert
                                        style={{ marginTop: 20, borderRadius: 8 }}
                                        message="Cập nhật tiến độ"
                                        description="Hãy chụp ảnh để AI đánh giá sự thay đổi của da bạn sau 1 tuần."
                                        type="warning"
                                        showIcon
                                        action={
                                            <Button size="small" type="primary" icon={<CameraOutlined />} onClick={() => setIsUploadModalOpen(true)}>
                                                Chụp ảnh ngay
                                            </Button>
                                        }
                                    />
                                )}
                            </div>
                        )
                    };
                })}
            />

            <Modal
                title="AI Skin Analysis - Cập nhật tiến độ"
                open={isUploadModalOpen}
                onCancel={() => setIsUploadModalOpen(false)}
                footer={null}
                width={800}
            >
                <SkinUploadSection />
            </Modal>
        </div>
    );
};

const getTagColor = (tag: string) => {
    switch (tag) {
        case 'assessment': return 'purple';
        case 'lifestyle': return 'green';
        case 'diet': return 'orange';
        case 'cleanser': return 'blue';
        case 'treatment': return 'volcano';
        default: return 'default';
    }
};

export default RoutePage;