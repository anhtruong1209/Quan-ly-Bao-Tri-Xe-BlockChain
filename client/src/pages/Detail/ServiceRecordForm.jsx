import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Button, message, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as RecordsService from "../../services/RecordsService";
import dayjs from "dayjs";

const ServiceRecordForm = ({ vehicleId, vehicleKey, onSuccess, open, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        vehicleId,
        vehicleKey,
        content: {
          odo: values.odo,
          job: values.job,
          garage: values.garage,
          cost: values.cost,
          note: values.note || "",
          date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : new Date().toISOString().split("T")[0],
          technician: values.technician || "",
          parts: values.parts ? values.parts.split(",").map(p => p.trim()) : [],
        },
      };
      const res = await RecordsService.createServiceRecord(payload);
      if (res?.status === "OK") {
        message.success("Đã ghi bản bảo trì thành công!");
        form.resetFields();
        onSuccess?.();
        onCancel?.();
      } else {
        message.error(res?.message || "Có lỗi xảy ra");
      }
    } catch (e) {
      message.error("Lỗi: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Ghi Bản Bảo Trì Mới"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ date: dayjs() }}
      >
        <Form.Item
          name="date"
          label="Ngày bảo trì"
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="odo"
          label="Số km (Odo)"
          rules={[{ required: true, message: "Vui lòng nhập số km" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Ví dụ: 50000"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="job"
          label="Hạng mục công việc"
          rules={[{ required: true, message: "Vui lòng nhập hạng mục" }]}
        >
          <Input placeholder="Ví dụ: Thay dầu động cơ, lọc gió, kiểm tra phanh" />
        </Form.Item>

        <Form.Item
          name="garage"
          label="Garage/Cơ sở sửa chữa"
          rules={[{ required: true, message: "Vui lòng nhập tên garage" }]}
        >
          <Input placeholder="Ví dụ: Garage ABC" />
        </Form.Item>

        <Form.Item
          name="technician"
          label="Kỹ thuật viên"
        >
          <Input placeholder="Tên kỹ thuật viên" />
        </Form.Item>

        <Form.Item
          name="cost"
          label="Chi phí (VNĐ)"
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Ví dụ: 1500000"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="parts"
          label="Phụ tùng thay thế (phân cách bằng dấu phẩy)"
        >
          <Input.TextArea
            rows={2}
            placeholder="Ví dụ: Lọc dầu, dầu động cơ 5W30, lọc gió"
          />
        </Form.Item>

        <Form.Item
          name="note"
          label="Ghi chú"
        >
          <Input.TextArea
            rows={3}
            placeholder="Ghi chú thêm về tình trạng xe, các vấn đề phát hiện..."
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Ghi Bản Bảo Trì & Xác Thực Blockchain
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceRecordForm;

