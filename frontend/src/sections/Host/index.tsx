import React, { useState } from "react";
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
import {
  DatabaseFilled,
  HomeFilled,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ListingType } from "../../graphql/globalTypes";
import { displayErrorMessage } from "../../utils";
import { UploadChangeParam } from "antd/lib/upload";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
  const [imageBeingUploaded, setImageBeingUploaded] = useState(false);
  const [imageBinary, setImageBinary] = useState<string | null>(null);
  const beforeImageUpload = (file: File | Blob) => {
    const fileIsValidImage =
      file.type === "image/jpeg" || file.type === "image/png";
    const fileIsValidSize = file.size / 1024 / 1024 < 1;

    if (!fileIsValidImage) {
      displayErrorMessage("You're only able to upload valid JPG or PNG files!");
      return false;
    }

    if (!fileIsValidSize) {
      displayErrorMessage(
        "You're only able to upload valid image files of under 1MB in size!"
      );
      return false;
    }

    return fileIsValidImage && fileIsValidSize;
  };

  const convertFileToBinary = (
    file: File | Blob,
    callback: (imageBinary: string) => void
  ) => {
    const filereader = new FileReader();
    filereader.readAsBinaryString(file);

    filereader.onload = () => {
      callback(filereader.result as string);
    };
  };
  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      console.log("file.status", file.status);
      setImageBeingUploaded(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      convertFileToBinary(file.originFileObj, (imageBinary) => {
        setImageBinary(imageBinary);
        setImageBeingUploaded(false);
      });
    }
  };
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
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBinary ? (
                <img src={imageBinary} alt="Listing" />
              ) : (
                <div>
                  {imageBeingUploaded ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Content>
  );
};
