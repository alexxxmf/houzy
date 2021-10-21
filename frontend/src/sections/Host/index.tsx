import React, { useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Upload,
  Radio,
  InputNumber,
} from "antd";
import { Viewer } from "../../types";
import { Link, Redirect } from "react-router-dom";
import {
  DatabaseFilled,
  HomeFilled,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ListingType } from "../../graphql/globalTypes";
import { displayErrorMessage, displaySuccessNotification } from "../../utils";
import { UploadChangeParam } from "antd/lib/upload";
import { useMutation } from "@apollo/client";
import { MUTATION_HOST_LISTING } from "../../graphql/mutations/hostListing";
import {
  hostListing as HostListingData,
  hostListingVariables as HostListingVariables,
} from "../../graphql/mutations/__generated__/hostListing";
import { useScrollToTop } from "../../hooks/useScrollToTop";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
  const [imageBeingUploaded, setImageBeingUploaded] = useState(false);
  const [imageBinary, setImageBinary] = useState<string | null>(null);

  const [hostListing, { loading, data }] = useMutation<
    HostListingData,
    HostListingVariables
  >(MUTATION_HOST_LISTING, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your listing!");
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again later."
      );
    },
  });

  console.log("imageBeingUploaded", imageBeingUploaded);
  console.log("imageBinary", !!imageBinary);

  useScrollToTop();

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

  const convertFileToBase64 = (
    file: File | Blob,
    callback: (imageBinary: string) => void
  ) => {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = () => {
      callback(filereader.result as string);
    };
  };
  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageBeingUploaded(true);
      return;
    }

    if (file.status === "error") {
      console.log(file);
    }

    console.log("file.status", file.status);

    if (file.status === "done" && file.originFileObj) {
      convertFileToBase64(file.originFileObj, (imageBase64) => {
        setImageBinary(imageBase64);
        setImageBeingUploaded(false);
      });
    }
  };
  const handleHostListing = (values: any) => {
    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;
    const input = {
      ...values,
      address: fullAddress,
      image: imageBinary,
      price: values.price * 100,
    };

    delete input.city;
    delete input.state;
    delete input.postalCode;

    hostListing({
      variables: {
        input,
      },
    });
  };

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

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">We're creating your listing now.</Text>
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

        <Form.Item
          label="Home Type"
          name="homeType"
          rules={[{ required: true, message: "Please select a home type!" }]}
        >
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
          label="Max # of Guests"
          name="numGuests"
          rules={[
            { required: true, message: "Please enter a max number of guests!" },
          ]}
        >
          <InputNumber min={1} placeholder="4" />
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          extra="Max character count of 45"
          rules={[
            {
              required: true,
              message: "Please enter a title for your listing!",
            },
          ]}
        >
          <Input maxLength={45} placeholder="Marylin Manson's Mansion" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter a description for your listing!",
            },
          ]}
          extra="Max character count of 400"
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder={"Modern clean but with a crazy touch"}
          />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please enter a address for your listing!",
            },
          ]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Form.Item>

        <Form.Item
          label="City/Town"
          name="city"
          rules={[
            {
              required: true,
              message: "Please enter a city (or region) for your listing!",
            },
          ]}
        >
          <Input placeholder="Los Angeles" />
        </Form.Item>

        <Form.Item
          label="State/Province"
          name="state"
          rules={[
            {
              required: true,
              message: "Please enter a state (or province) for your listing!",
            },
          ]}
        >
          <Input placeholder="California" />
        </Form.Item>

        <Form.Item
          label="Zip/Postal Code"
          name="postalCode"
          rules={[
            {
              required: true,
              message: "Please enter a zip (or postal) code for your listing!",
            },
          ]}
        >
          <Input placeholder="Please enter a zip code for your listing!" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
          rules={[
            {
              required: true,
              message: "Please enter provide an image for your listing!",
            },
          ]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              // These two things are just a hacky trick to bypass upload's component
              // default behavior of making a request on file.status == done
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  //@ts-ignore
                  onSuccess("ok");
                }, 0);
              }}
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBinary ? (
                <img
                  src={imageBinary}
                  alt="Listing"
                  style={{ width: "100%", overflowY: "clip" }}
                />
              ) : (
                <div>
                  {imageBeingUploaded ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          label="Price"
          extra="All prices in $USD/day"
          name="price"
          rules={[
            {
              required: true,
              message: "Please enter a price for your listing!",
            },
          ]}
        >
          <InputNumber min={0} placeholder="120" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};
