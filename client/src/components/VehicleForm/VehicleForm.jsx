import React from "react";
import { Form, Input, Select, Button, Row, Col, Upload, Image } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./VehicleForm.css";

const { Option } = Select;

const VehicleForm = ({ form, onFinish, loading, isEditMode, initialValues }) => {
  const [imageUrls, setImageUrls] = React.useState(initialValues?.image || []);

  React.useEffect(() => {
    if (initialValues?.image) {
      setImageUrls(Array.isArray(initialValues.image) ? initialValues.image : [initialValues.image]);
    }
  }, [initialValues]);

  const handleAddImageUrl = () => {
    const newUrls = [...imageUrls, ""];
    setImageUrls(newUrls);
    form.setFieldsValue({ image: newUrls });
  };

  const handleRemoveImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    form.setFieldsValue({ image: newUrls });
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    form.setFieldsValue({ image: newUrls });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onFinish({ ...values, image: imageUrls.filter((url) => url.trim()) });
      }}
      initialValues={initialValues}
      className="vehicle-form"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Tên xe"
            rules={[{ required: true, message: "Vui lòng nhập tên xe" }]}
          >
            <Input placeholder="VD: Xe Toyota Camry" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="plates"
            label="Biển số"
            rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
          >
            <Input placeholder="VD: 30A-12345" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="brand"
            label="Hãng"
            rules={[{ required: true, message: "Vui lòng nhập hãng" }]}
          >
            <Input placeholder="VD: Toyota" size="large" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="type"
            label="Loại xe"
            rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
          >
            <Select placeholder="Chọn loại xe" size="large">
              <Option value="sedan">Sedan</Option>
              <Option value="suv">SUV</Option>
              <Option value="hatchback">Hatchback</Option>
              <Option value="coupe">Coupe</Option>
              <Option value="truck">Truck</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
          >
            <Input placeholder="VD: Đen" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="fuel"
            label="Nhiên liệu"
            rules={[{ required: true, message: "Vui lòng chọn nhiên liệu" }]}
          >
            <Select placeholder="Chọn nhiên liệu" size="large">
              <Option value="gasoline">Xăng</Option>
              <Option value="diesel">Diesel</Option>
              <Option value="electric">Điện</Option>
              <Option value="hybrid">Hybrid</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="gear"
            label="Hộp số"
            rules={[{ required: true, message: "Vui lòng chọn hộp số" }]}
          >
            <Select placeholder="Chọn hộp số" size="large">
              <Option value="manual">Số sàn</Option>
              <Option value="automatic">Số tự động</Option>
              <Option value="cvt">CVT</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="rolling"
            label="Số bánh"
            rules={[{ required: true, message: "Vui lòng nhập số bánh" }]}
          >
            <Input placeholder="VD: 4" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="engine"
            label="Số máy"
            rules={[{ required: true, message: "Vui lòng nhập số máy" }]}
          >
            <Input placeholder="Số máy" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="frame"
            label="Số khung"
            rules={[{ required: true, message: "Vui lòng nhập số khung" }]}
          >
            <Input placeholder="Số khung" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="identifynumber"
            label="Số CMT/CCCD"
            rules={[{ required: true, message: "Vui lòng nhập số CMT/CCCD" }]}
          >
            <Input placeholder="Số CMT/CCCD" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Số điện thoại" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input.TextArea rows={2} placeholder="Địa chỉ" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="URL Ảnh xe (có thể thêm nhiều ảnh)">
        <div className="image-url-list">
          {imageUrls.map((url, index) => (
            <div key={index} className="image-url-item">
              <Input
                placeholder="Nhập URL ảnh"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                size="large"
                style={{ marginBottom: 12 }}
              />
              {url && (
                <div className="image-preview">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{ maxHeight: 100, borderRadius: 8 }}
                    fallback="https://via.placeholder.com/200?text=Invalid+URL"
                  />
                </div>
              )}
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveImageUrl(index)}
                className="remove-image-btn"
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddImageUrl}
            block
            style={{ marginTop: 12 }}
            size="large"
          >
            Thêm URL ảnh
          </Button>
        </div>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className="submit-btn"
        >
          {isEditMode ? "Cập nhật thông tin xe" : "Đăng ký xe mới"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VehicleForm;

