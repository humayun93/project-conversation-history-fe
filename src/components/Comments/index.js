import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { List, Comment, Typography, Input, Button, Form } from 'antd';

const { Title } = Typography;

const ADD_REPLY = gql`
  mutation createReply($parentCommentId: ID!, $content: String!) {
    createReply(input: { parentCommentId: $parentCommentId, content: $content }) {
      comment {
        id
      }
      errors
    }
  }
`;

const ADD_COMMENT = gql`
  mutation createComment($projectId: ID!, $content: String!) {
    createComment(input: { projectId: $projectId, content: $content }) {
      comment {
        id
        content
        createdAt
        user {
          name
        }
      }
      errors
    }
  }
`;

const CustomComments = ({ projectId, comments, parentId, refetchProject }) => {
  const [addComment] = useMutation(ADD_COMMENT);
  const [addReply] = useMutation(ADD_REPLY);
  const [replyVisible, setReplyVisible] = useState({});
  const [commentInput, setCommentInput] = useState('');

  const handleCommentSubmit = async (parentId) => {
    if (!commentInput.trim()) return;
    try {
      if (parentId) await addReply({ variables: { parentCommentId: parentId, content: commentInput } });
      else await addComment({ variables: { projectId, content: commentInput } });

      setCommentInput('');
      refetchProject();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyVisible({ ...replyVisible, [commentId]: true });
  };

  return (
    <div>
      <List
        locale={{ emptyText: 'No comments yet' }}
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={(item) => (
          <Comment
            author={item.user.name}
            content={item.content}
            datetime={item.createdAt}
            actions={item.replies && [
              <span key="reply" onClick={() => handleReplyClick(item.id)}>
                Reply
              </span>,
            ]}
          >
            {(item.replies && item.replies.length > 0 || item.replies && replyVisible[item.id]) && (
              <CustomComments comments={item.replies || []} parentId={item.id} refetchProject={refetchProject} />
            )}
          </Comment>
        )}
      />
      <Form
        onFinish={() => handleCommentSubmit(parentId)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <Form.Item style={{ flex: 1, marginRight: '1rem' }}>
          <Input
            placeholder="Add a comment"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Comment
          </Button>
        </Form.Item>
      </Form>
  </div>
  );
};

export default CustomComments;
