import React from 'react';
import { PoweroffOutlined } from '@ant-design/icons';
import { Layout, Typography, Button} from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const CustomHeader = ({ onSignOut }) => {
  return (
    <Header style={{ background: '#001529', padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', paddingRight: '16px' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Projects
        </Title>
        <Button type="primary" onClick={onSignOut}>
          Sign Out <PoweroffOutlined />
        </Button>
      </div>
    </Header>
  );
};

export default CustomHeader;
