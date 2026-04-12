import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const FooterComponent = () => {
  return (
    <AntFooter style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '40px 0' }}>
      <div style={{ marginBottom: '10px' }}>
        <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
          ©2026 Skin Detect Project - Powered by YOLOv11 & Ant Design
        </Text>
      </div>
      <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '12px' }}>
        Hệ thống hỗ trợ nhận diện tình trạng da dựa trên trí tuệ nhân tạo.
      </Text>
    </AntFooter>
  );
};

export default FooterComponent;