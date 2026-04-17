
import { Card, Row, Col, Image, List, Typography } from 'antd';


const { Text } = Typography;


const ViewDetail = ({ view }: { view: any }) => (
    <Row gutter={24}>
        <Col span={16}>
            <Card title="Ảnh phân tích AI">
                <Image src={view.visualization_url} style={{ borderRadius: 8 }} />
            </Card>
        </Col>
        <Col span={8}>
            <Card title={`Detections (${view.total})`} bodyStyle={{ maxHeight: '500px', overflowY: 'auto' }}>
                <List
                    dataSource={view.detections}
                    renderItem={(item: any) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Image src={item.crop_url} width={50} />}
                                title={<Text strong>{item.label}</Text>}
                                description={`Conf: ${(item.confidence * 100).toFixed(0)}%`}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </Col>
    </Row>
);
export default ViewDetail;