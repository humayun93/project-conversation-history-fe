import { ProjectOutlined } from '@ant-design/icons';
import { Layout, Menu, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import CustomHeader from '../CustomHeader';
import ProjectDetails from '../ProjectDetails';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input } from 'antd';

const { Content, Footer, Sider } = Layout;
const statusTags = ['pending', 'active', 'done', 'inactive'];

const GET_PROJECTS = gql`
  query projects {
    projects {
      id
      title
      status
    }
  }
`;

const CREATE_PROJECT = gql`
  mutation createProject($title: String!, $status: Int!) {
    createProject(input: { title: $title, status: $status }) {
      id
      title
      status
    }
  }
`;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Dashboard = ({ onSignOut }) => {
  const { loading, error, data } = useQuery(GET_PROJECTS);
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);
  const [currentProject, setCurrentProject] = useState(undefined);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [createProject, { loading: createProjectLoading }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
    onError: (error) => {
      console.error('Error creating project:', error);
    },
  });

  const handleCreateProject = async (values) => {
    await createProject({ variables: values });
    setShowNewProjectModal(false);
  };

  useEffect(() => {
    if (!loading && !error) {
      const newItems = data.projects.map((project) =>
        getItem(project.title, project.id, <ProjectOutlined />)
      );

      setItems(newItems);
      setCurrentProject(newItems[0].key);
    }
  }, [loading, error, data]);

  const handleMenuClick = ({ key }) => {
    setCurrentProject(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout className="site-layout">
        <CustomHeader onSignOut={onSignOut} style={{ padding: 12 }} />
        <Content style={{ margin: '12px 16px' }}>
        <Content
              style={{
                margin: '12px 16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: 16,
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowNewProjectModal(true)}
                >
                  New Project
                </Button>
              </div>
              <Modal
                title="Create a new project"
                visible={showNewProjectModal}
                onCancel={() => setShowNewProjectModal(false)}
                footer={null}
              >
                <Form
                  layout="vertical"
                  onFinish={handleCreateProject}
                >
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input the project title!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Status"
                    name="status"
                    initialValue={0}
                  >
                    <Select>
                      {statusTags.map((status) => (
                        <Select.Option key={status} value={status}>
                          {status}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={createProjectLoading}>
                      Create Project
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                }}
              >
                {currentProject && <ProjectDetails projectId={currentProject} />}
              </div>
            </Content>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Build for Homey</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

