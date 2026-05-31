import { useEffect, useState } from "react";
import { Modal, Spin, Card, Typography, List, Tag, Space, Divider, Empty } from "antd";
import {
    RobotOutlined,
    BulbOutlined,
    SafetyCertificateOutlined,
    StepForwardOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import { callApiExplainTask } from "../../../api";


const { Title, Paragraph, Text } = Typography;

export default function AIHelper() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Hàm gọi API lên Backend để phân tích câu nhiệm vụ Skincare
    const explainSkincareTask = async (taskName: string) => {
        setOpen(true);
        setLoading(true);

        try {
            const response = await callApiExplainTask(taskName);
            if (response && response.data) {
                setResult(response.data);
            }
        } catch (error) {
            console.error("Lỗi gọi trợ lý AI:", error);
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = (e: any) => {
            if (e.detail) {
                explainSkincareTask(e.detail);
            }
        };
        window.addEventListener("explain_sentence", handler);
        return () => window.removeEventListener("explain_sentence", handler);
    }, []);

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    right: 24,
                    bottom: 24,
                    zIndex: 9999,
                    background: "linear-gradient(135deg, #722ed1 0%, #1d39c4 100%)",
                    padding: 16,
                    borderRadius: "50%",
                    cursor: "pointer",
                    color: "#fff",
                    boxShadow: "0 6px 16px rgba(114, 46, 209, 0.35)",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onClick={() => setOpen(true)}
            >
                <RobotOutlined style={{ fontSize: 24 }} />
            </div>

            <Modal
                open={open}
                footer={null}
                onCancel={() => setOpen(false)}
                title={
                    <Space size={8}>
                        <RobotOutlined style={{ color: '#722ed1', fontSize: 20 }} />
                        <span style={{ color: '#722ed1', fontWeight: 600, fontSize: 16 }}> SkinCoach AI Assistant</span>
                    </Space>
                }
                width={600}
                centered
                destroyOnClose
            >
                {loading ? (
                    <div style={{ textAlign: "center", padding: "50px 0" }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#722ed1' }} spin />} />
                        <div style={{ marginTop: 16, color: '#595959', fontWeight: 500 }}>
                            Chuyên gia AI đang phân tích chuyên sâu nhiệm vụ...
                        </div>
                    </div>
                ) : result ? (
                    <div style={{ marginTop: 12 }}>

                        {/* KHỐI HIỂN THỊ NHIỆM VỤ GỐC ĐANG ĐƯỢC HỎI */}
                        <Card size="small" style={{ background: '#f5f5f5', border: 'none', marginBottom: 20, borderRadius: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Nhiệm vụ bạn chọn:</Text>
                            <Paragraph strong style={{ fontSize: 14, margin: '4px 0 0 0', color: '#262626' }}>
                                {result.originalTask || "Chưa rõ nhiệm vụ"}
                            </Paragraph>
                        </Card>

                        {/* PHẦN 1: CƠ SỞ KHOA HỌC */}
                        <div style={{ marginBottom: 20 }}>
                            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#1f1f1f' }}>
                                <BulbOutlined style={{ color: '#faad14' }} /> Cơ sở khoa học từ AI:
                            </Title>
                            <Paragraph style={{ color: '#434343', lineHeight: 1.6, paddingLeft: 24, margin: 0 }}>
                                {result.whyItMatters || "Nhiệm vụ này giúp tối ưu hóa hàng rào bảo vệ da, giảm bít tắc lỗ chân lông."}
                            </Paragraph>
                        </div>

                        <Divider style={{ margin: '16px 0' }} />

                        {/* PHẦN 2: CÁC BƯỚC THỰC HIỆN CHI TIẾT */}
                        <div style={{ marginBottom: 20 }}>
                            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#1f1f1f' }}>
                                <StepForwardOutlined style={{ color: '#1890ff' }} /> Các bước thực hiện chi tiết:
                            </Title>

                            {result.steps && result.steps.length > 0 ? (
                                <List
                                    size="small"
                                    dataSource={result.steps}
                                    renderItem={(step: string, idx: number) => (
                                        <List.Item style={{ border: 'none', padding: '6px 0 6px 24px' }}>
                                            <Space align="start" size={10}>
                                                <Tag color="purple" style={{
                                                    borderRadius: '50%',
                                                    width: 18,
                                                    height: 18,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '2px 0 0 0',
                                                    fontSize: 10,
                                                    fontWeight: 'bold'
                                                }}>
                                                    {idx + 1}
                                                </Tag>
                                                <Text style={{ color: '#262626', fontSize: 13.5 }}>{step}</Text>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Text type="secondary" style={{ paddingLeft: 24 }}>Thực hiện nhẹ nhàng theo thói quen sinh hoạt hàng ngày.</Text>
                            )}
                        </div>

                        {/* PHẦN 3: LƯU Ý AN TOÀN KHI THỰC HIỆN */}
                        {result.caution && (
                            <>
                                <Divider style={{ margin: '16px 0' }} />
                                <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', padding: '12px 16px', borderRadius: 8 }}>
                                    <Space align="start" size={10}>
                                        <SafetyCertificateOutlined style={{ color: '#faad14', marginTop: 3, fontSize: 16 }} />
                                        <div>
                                            <Text strong style={{ color: '#d46b08', display: 'block', marginBottom: 2, fontSize: 13 }}>
                                                Khuyến cáo an toàn cho làn da:
                                            </Text>
                                            <Text style={{ color: '#613400', fontSize: 13, lineHeight: 1.5 }}>
                                                {result.caution}
                                            </Text>
                                        </div>
                                    </Space>
                                </div>
                            </>
                        )}

                    </div>
                ) : (
                    // Trạng thái trống khi chưa kích hoạt task nào
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Vui lòng nhấn vào biểu tượng 🤖 tại mỗi nhiệm vụ để được chuyên gia AI giải thích quy trình."
                    />
                )}
            </Modal>
        </>
    );
}