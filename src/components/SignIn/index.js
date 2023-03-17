import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const SIGN_IN_USER = gql`
  mutation SignInUser($email: String!, $password: String!) {
    signInUser(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
      errors
    }
  }
`;

function SignIn({ onSignIn }) {
  const [signInUser, { loading, error }] = useMutation(SIGN_IN_USER);

  const onFinish = async (values) => {
    try {
      const { data } = await signInUser({ variables: values });
      if (data.signInUser.errors.length === 0) {
        sessionStorage.setItem('token', data.signInUser.token);
        onSignIn(data.signInUser.token);
      } else {
        console.log(data.signInUser.errors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: '300px', margin: 'auto' }}>
      <Title level={3}>Sign In</Title>
      <Form onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign In
          </Button>
        </Form.Item>
      </Form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default SignIn;

