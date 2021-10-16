import React from "react";
import { Layout, Typography, Form, Input, Button, Select, Upload } from "antd";
import { Viewer } from "../../types";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
  const beforeUpload = () => {};
  const handleChange = () => {};

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">/login</Link> page and connect with Stripe shortly
            after.
          </Text>
        </div>
      </Content>
    );
  }

  return (
    <Content className="host-content">
      <Form>
        <Form.Item name="title" label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="image" label="Image">
          <Upload
            name="image"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          ></Upload>
        </Form.Item>
      </Form>
    </Content>
  );
};
