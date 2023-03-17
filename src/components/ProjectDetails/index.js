import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, Typography, Popover, Tag, Modal, Form, Input, Select, Button } from 'antd';
import { gql } from '@apollo/client';
import { HistoryOutlined } from '@ant-design/icons';
import CustomComments from '../Comments';
import 'antd/dist/antd.css';

const { Title } = Typography;
const { Option } = Select;
const statusTags = {
  'pending': 'gold',
  'active': 'green',
  'done': 'blue',
  'inactive': 'red'
}

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $status: String, $description: String) {
    updateProject(input: {id: $id, status: $status, description: $description}) {
      project {
        id
        status
        description
      }
      errors
    }
  }
`;


const GET_PROJECT_DETAILS = gql`
  query project($projectId: ID!) {
    project(id: $projectId) {
      id
      title
      status
      description
      statusChanges {
        status
        createdAt
        user {
          name
        }
      }
      comments {
        id
        content
        createdAt
        replies {
          id
          content
          createdAt
          user {
            name
          }
        }
        user {
          name
        }
      }
    }
  }
`;

const ProjectDetails = ({ projectId }) => {
  const [projectData, setProjectData] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_PROJECT_DETAILS, {
    variables: { projectId },
    fetchPolicy: 'network-only',
  });

  const renderStatusChangeHistory = () => {
    return (
      <div>
        {projectData &&
          projectData.statusChanges.map((statusChange, index) => (
            <p key={index}>
              {statusChange.status} - {statusChange.createdAt} - {statusChange.user.name}
            </p>
          ))}
      </div>
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [visible, setVisible] = useState(false);
  const [updateProject, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_PROJECT);

  const onFinish = (values) => {
    updateProject({
      variables: { id: projectId, status: values.status, description: values.description },
    })
    .then(() => {
      setIsModalVisible(false);
      setTimeout(() => {
        refetchProject();
      }, 1000);
    })
    .catch((error) => {
      console.error("Error updating project:", error);
    });
  };
  
  
  useEffect(() => {
    if (data) {
      setProjectData(data.project);
    }
  }, [data]);

  const refetchProject = async () => {
    await refetch();
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
       <Card
        title={projectData && projectData.title}
        style={{ width: '80%', margin: '0 auto', marginTop: 16 }}
      >
        <Title level={4}>
          Status:{' '}
          {projectData && (
            <Tag color={statusTags[projectData.status]}>{projectData.status}</Tag>
          )}
          <Popover content={renderStatusChangeHistory()} title="Status Change History">
            <HistoryOutlined />
          </Popover>
        </Title>
        <p>{projectData && projectData.description}</p>
        <Button type="primary" onClick={showModal}>
          Update Status and Description
        </Button>
        <CustomComments
          projectId={projectId}
          comments={projectData && projectData.comments || []}
          refetchProject={refetchProject}
        />
      </Card>
      <Modal title="Update Status and Description" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Status" name="status">
            <Select>
              {Object.keys(statusTags).map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
