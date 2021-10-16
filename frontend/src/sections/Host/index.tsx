import React from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Radio,
} from "antd";
import { Viewer } from "../../types";
import { Link } from "react-router-dom";
import { DatabaseFilled, HomeFilled } from "@ant-design/icons";
import { ListingType } from "../../graphql/globalTypes";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
  const beforeUpload = () => {};
  const handleImageUpload = () => {};
  const handleHostListing = () => {};

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
      <Form layout="vertical" onFinish={handleHostListing}>
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Text>
        </div>
        <Form.Item label="Title">
          <Input />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Home Type">
          <Radio.Group>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeFilled style={{ color: "#1890ff" }} />
              <span>House</span>
            </Radio.Button>
            <Radio.Button value={ListingType.APARTMENT}>
              <DatabaseFilled style={{ color: "#1890ff" }} />
              <span>Apartment</span>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleImageUpload}
            ></Upload>
          </div>
        </Form.Item>
      </Form>
    </Content>
  );
};
