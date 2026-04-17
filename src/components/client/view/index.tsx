import { Card, Row, Col, Image, List, Typography, Modal, Button } from 'antd';
import { skinConditionInfo } from '../../../helper/index';
import { InfoCircleOutlined, GlobalOutlined } from '@ant-design/icons';


const { Text } = Typography;



const ViewDetail = ({ view }: { view: any }) => {
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
    return (
        <Row gutter={24}>
            <Col span={16}>
                <Card title="Ảnh phân tích AI">
                    <Image
                        src={view.visualization_url}
                        style={{ borderRadius: 8, width: '100%' }}
                        placeholder={true}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title={`Detections (${view.total})`} bodyStyle={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <List
                        dataSource={view.detections}
                        renderItem={(item: any) => {
                            const info = skinConditionInfo[item.label];


                            return (
                                <List.Item
                                    style={{ cursor: 'pointer', transition: '0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
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
                                                    conf: {(item.confidence * 100).toFixed(0)}%
                                                </Text>
                                                <Text style={{ fontSize: '11px', color: '#1890ff', cursor: 'pointer' }}>Ấn để xem chi tiết</Text>
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