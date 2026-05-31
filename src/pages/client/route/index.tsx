import { useState, useEffect } from 'react';
import {
    Card, Tabs, Typography, Tag, Progress,
    Checkbox, List, Space, Button, Modal, message,
    Row, Col, Divider, Empty, Result
} from 'antd';
import {
    InfoCircleOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    SyncOutlined,
    CompassOutlined,
} from '@ant-design/icons';

import { callApiGetSkinCoach } from "../../../api";
import SkinUploadSection from '../../../components/client/upload/indexl';

const { Text, Paragraph } = Typography;

const RoutePage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [activeKey, setActiveKey] = useState("1");

    // Khởi tạo completedTasks từ localStorage
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
        const savedProgress = localStorage.getItem('skin_coach_progress');
        return savedProgress ? JSON.parse(savedProgress) : {};
    });

    useEffect(() => {
        fetchSkinCoachByUser();
    }, []);

    useEffect(() => {
        localStorage.setItem('skin_coach_progress', JSON.stringify(completedTasks));
    }, [completedTasks]);

    const fetchSkinCoachByUser = async () => {
        try {
            const response = await callApiGetSkinCoach();
            if (response && response.data) {
                setData(response.data);
                // Đồng bộ activeKey với ngày hiện tại của người dùng từ backend sinh ra
                if (response.data.currentDay) {
                    setActiveKey(response.data.currentDay.toString());
                }
            }
        } catch (error) {
            message.error('Không thể tải dữ liệu lộ trình');
        } finally {
            setLoading(false);
        }
    };

    // Hàm kiểm tra ngày X đã xong toàn bộ task chưa (Nếu không có task nào, mặc định là true)
    const isDayFullyCompleted = (dayNumber: number) => {
        const dayData = data?.routine30Days.find((d: any) => d.day === dayNumber);
        if (!dayData) return false;
        if (dayData.tasks.length === 0) return true;
        return dayData.tasks.every((task: any) => completedTasks[`day-${dayNumber}-${task.name}`]);
    };

    const handleCheckTask = (taskKey: string, dayNumber: number) => {
        const newState = {
            ...completedTasks,
            [taskKey]: !completedTasks[taskKey]
        };
        setCompletedTasks(newState);

        const dayData = data.routine30Days.find((d: any) => d.day === dayNumber);
        const willBeDone = dayData.tasks.every((t: any) => {
            const key = `day-${dayNumber}-${t.name}`;
            return key === taskKey ? !completedTasks[taskKey] : completedTasks[key];
        });

        if (willBeDone) {
            message.success(`Tuyệt vời! Bạn đã hoàn thành tất cả nhiệm vụ mới của Ngày ${dayNumber}!`);
        }
    };

    const handleTabChange = (key: string) => {
        const targetDay = parseInt(key);
        const currentDay = data?.currentDay || 1;

        // Cơ chế khóa tab: Không cho phép xem trước ngày vượt quá tiến trình của hệ thống nếu ngày trước đó chưa hoàn thành
        if (targetDay > currentDay && !isDayFullyCompleted(targetDay - 1)) {
            message.warning(`Vui lòng hoàn thành lộ trình ngày trước đó để mở khóa Ngày ${targetDay}.`);
            return;
        }
        setActiveKey(key);
    };

    if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><SyncOutlined spin style={{ fontSize: 24 }} /> Đang tải dữ liệu...</div>;
    if (!data) return <Empty description="Không tìm thấy lộ trình chăm sóc da" />;

    if (data.shouldSeeDoctor) {
        return (
            <div style={{ maxWidth: 800, margin: '50px auto', padding: '0 20px' }}>
                <Result
                    status="warning"
                    icon={<WarningOutlined style={{ color: '#ff4d4f' }} />}
                    title="Khuyến nghị từ chuyên gia AI"
                    subTitle={data.medicalWarning || "Tình trạng da có dấu hiệu chuyển biến phức tạp, bạn nên thăm khám bác sĩ da liễu."}
                    extra={[
                        <Button type="primary" danger key="doctor">Tìm kiếm phòng khám gần đây</Button>,
                        <Button key="back" onClick={() => window.location.reload()}>Tải lại trang</Button>
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1050, margin: '0 auto', padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>

            {/* TỔNG QUAN TÌNH TRẠNG DA */}
            <Card style={{ marginBottom: 24, borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Row gutter={[24, 24]} align="stretch">
                    <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>Chẩn đoán hiện tại</Text>
                            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {data.detectedIssues.map((issue: string) => (
                                    <Tag color="error" key={issue} style={{ borderRadius: 6, padding: '4px 12px', fontWeight: 500 }}>
                                        {issue === 'Oily-Skin' ? 'Da Dầu' : issue === 'Acne' ? 'Mụn Trứng Cá' : issue}
                                    </Tag>
                                ))}
                                <Tag color="processing" style={{ borderRadius: 6, padding: '4px 12px', fontWeight: 500 }}>
                                    Loại da: {data.inputSurvey.skinType.toUpperCase()}
                                </Tag>
                            </div>
                        </div>
                        <Divider style={{ margin: '16px 0' }} />
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <Text strong>Chỉ số nghiêm trọng (Severity Score):</Text>
                                <Text style={{ color: '#ff4d4f', fontSize: 20, fontWeight: 700 }}>{data.severityScore}<span style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>/10</span></Text>
                            </div>
                            <Progress
                                percent={(data.severityScore / 10) * 100}
                                strokeColor={{ '0%': '#ffc069', '100%': '#ff4d4f' }}
                                showInfo={false}
                                status="active"
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                    </Col>

                    <Col xs={24} md={12}>
                        <div style={{ background: '#fafff0', border: '1px solid #d3f261', borderRadius: 12, padding: 16, height: '100%' }}>
                            <Space style={{ marginBottom: 6 }}>
                                <InfoCircleOutlined style={{ color: '#73d13d', fontSize: 16 }} />
                                <Text strong style={{ color: '#389e0d' }}>Cơ chế phân tích hành vi độc quyền:</Text>
                            </Space>
                            <Paragraph style={{ margin: 0, fontSize: 13, color: '#434343', lineHeight: 1.6 }}>
                                {data.analysis}
                            </Paragraph>
                        </div>
                    </Col>
                </Row>
            </Card>



            {/* KHU VỰC TABS SỰ KIỆN 30 NGÀY */}
            <Tabs
                activeKey={activeKey}
                onChange={handleTabChange}
                type="card"
                tabBarStyle={{ marginBottom: 0 }}
                items={data.routine30Days.map((dayData: any) => {
                    const dayKey = `day-${dayData.day}`;
                    const totalTasks = dayData.tasks.length;
                    const doneTasks = dayData.tasks.filter((t: any) => completedTasks[`${dayKey}-${t.name}`]).length;
                    const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 100;

                    // Kiểm tra trạng thái khóa tab theo logic ngày trước đó phải xong
                    const isLocked = dayData.day > data.currentDay && !isDayFullyCompleted(dayData.day - 1);

                    return {
                        label: (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {isDayFullyCompleted(dayData.day) && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                Ngày {dayData.day}
                            </span>
                        ),
                        key: dayData.day.toString(),
                        disabled: isLocked,
                        children: (
                            <div style={{ padding: '24px', background: '#fff', borderRadius: '0 12px 12px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>

                                {/* HEADER CỦA TAB NGÀY HIỆN TẠI */}
                                <Row justify="space-between" align="middle" style={{ marginBottom: 24, gap: 16 }}>
                                    <Col xs={24} sm={16}>
                                        <Tag color="blue" style={{ fontSize: 12, padding: '4px 8px', marginBottom: 8, fontWeight: 600 }}>
                                            {dayData.phase}
                                        </Tag>
                                        <div style={{ marginTop: 4 }}>
                                            <Text type="secondary">Tập trung tối ưu hóa thói quen cốt lõi giảm tiết dầu và bít tắc.</Text>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 12, color: '#8c8c8c' }}>Nhiệm vụ mới</div>
                                            <Text strong style={{ fontSize: 16 }}>{doneTasks}/{totalTasks}</Text>
                                        </div>
                                        <Progress type="circle" percent={progressPercent} width={45} strokeWidth={10} size="small" />
                                    </Col>
                                </Row>

                                <Row gutter={[24, 24]}>
                                    {/* CỘT TRÁI: DANH SÁCH DUY TRÌ THÓI QUEN CŨ (MAINTAIN) */}
                                    <Col xs={24} md={10}>
                                        <Card
                                            title={<span style={{ color: '#096dd9' }}><SyncOutlined spin={dayData.maintain.length > 0} /> Thói Quen Cần Duy Trì</span>}
                                            size="small"
                                            style={{ background: '#f0f5ff', border: '1px solid #adc6ff', height: '100%', borderRadius: 12 }}
                                        >
                                            {dayData.maintain && dayData.maintain.length > 0 ? (
                                                <List
                                                    size="small"
                                                    dataSource={dayData.maintain}
                                                    renderItem={(item: string) => (
                                                        <List.Item style={{ borderBottom: '1px style #d9d9d9', padding: '10px 4px' }}>
                                                            <Space align="start">
                                                                <CheckCircleOutlined style={{ color: '#1890ff', marginTop: 4 }} />
                                                                <Text strong style={{ color: '#262626', fontSize: 13 }}>{item}</Text>
                                                            </Space>
                                                        </List.Item>
                                                    )}
                                                />
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '20px 0', color: '#8c8c8c' }}>
                                                    <CompassOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                                                    <p style={{ margin: 0, fontSize: 12 }}>Giai đoạn khởi động chưa có thói quen tích lũy cũ.</p>
                                                </div>
                                            )}
                                        </Card>
                                    </Col>

                                    {/* CỘT PHẢI: DANH SÁCH THỰC HIỆN NHIỆM VỤ MỚI TRONG NGÀY (TASKS) */}
                                    <Col xs={24} md={14}>
                                        <Card
                                            title={<span><ThunderboltOutlined style={{ color: '#faad14' }} /> Nhiệm Vụ Mới Hôm Nay</span>}
                                            size="small"
                                            style={{ borderRadius: 12, height: '100%' }}
                                        >
                                            {dayData.tasks && dayData.tasks.length > 0 ? (
                                                <List
                                                    dataSource={dayData.tasks}
                                                    renderItem={(task: any) => {
                                                        const taskUniqueId = `${dayKey}-${task.name}`;
                                                        const isChecked = completedTasks[taskUniqueId];
                                                        return (
                                                            <Card
                                                                size="small"
                                                                style={{
                                                                    marginBottom: 12,
                                                                    borderRadius: 8,
                                                                    backgroundColor: isChecked ? '#f6ffed' : '#ffffff',
                                                                    borderLeft: isChecked ? '4px solid #52c41a' : '4px solid #fa8c16',
                                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                                                    transition: 'all 0.3s'
                                                                }}
                                                                bodyStyle={{ padding: '12px 16px' }}
                                                            >
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onChange={() => handleCheckTask(taskUniqueId, dayData.day)}
                                                                    style={{ width: '100%', alignItems: 'flex-start' }}
                                                                >
                                                                    <div style={{ marginLeft: 8, marginTop: -2 }}>
                                                                        <div style={{ marginBottom: 4 }}>
                                                                            <Text delete={isChecked} strong={!isChecked} style={{ color: isChecked ? '#8c8c8c' : '#262626', fontSize: 14 }}>
                                                                                {task.name}
                                                                            </Text>
                                                                        </div>
                                                                        <Space size={4} style={{ flexWrap: 'wrap' }}>
                                                                            <span style={{ fontSize: 11, color: '#8c8c8c', marginRight: 4 }}>{task.topic}</span>
                                                                            <Tag color={getTagColor(task.tag)} style={{ fontSize: 10, borderRadius: 4, lineHeight: '16px' }}>
                                                                                {task.tag.toUpperCase()}
                                                                            </Tag>
                                                                            <Tag color="default" style={{ fontSize: 10, borderRadius: 4, lineHeight: '16px' }}>
                                                                                {getTimeOfDayLabel(task.timeOfDay)}
                                                                            </Tag>
                                                                        </Space>
                                                                    </div>
                                                                </Checkbox>
                                                            </Card>
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                                                    <Empty
                                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                        description={
                                                            <div style={{ color: '#8c8c8c' }}>
                                                                <Text strong style={{ display: 'block', color: '#52c41a', marginBottom: 4 }}>Hôm nay là ngày củng cố!</Text>
                                                                Không có nhiệm vụ mới. Hãy tập trung duy trì thật tốt các thói quen cũ bên tay trái nhé!
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                            </div>
                        )
                    };
                })}
            />

            {/* MODAL UPLOAD HÌNH ẢNH */}
            <Modal
                title="AI Skin Analysis - Quét Da Định Kỳ"
                open={isUploadModalOpen}
                onCancel={() => setIsUploadModalOpen(false)}
                footer={null}
                width={700}
                destroyOnClose
            >
                <SkinUploadSection />
            </Modal>
        </div>
    );
};


const getTimeOfDayLabel = (time: string) => {
    switch (time) {
        case 'morning': return '☀️ Buổi Sáng';
        case 'evening': return '🌙 Buổi Tối';
        case 'both': return '🔄 Sáng & Tối';
        case 'anytime': return '🕐 Linh Hoạt';
        default: return time;
    }
};


const getTagColor = (tag: string) => {
    switch (tag?.toLowerCase()) {
        case 'skincare': return 'blue';
        case 'lifestyle': return 'green';
        case 'diet': return 'orange';
        case 'treatment': return 'volcano';
        case 'assessment': return 'purple';
        default: return 'default';
    }
};

export default RoutePage;