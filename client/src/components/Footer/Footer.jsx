import React from "react";
import { Row, Col, Space, Typography } from "antd";
import {
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import "./Footer.css";

const { Title, Text } = Typography;

function Footer() {
  return (
    <div className="footer_container">
      <div className="container-fluid">
        <Row gutter={[32, 32]} style={{ padding: "40px 20px" }}>
          <Col xs={24} sm={12} lg={8}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Title level={4} style={{ color: "#fff", margin: 0 }}>
                <CarOutlined style={{ marginRight: 8 }} />
                Hệ Thống Quản Lý Bảo Trì & Bảo Hành Xe Vận Tải
              </Title>
              <Text style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8" }}>
                Hệ thống theo dõi, sửa chữa, bảo hành và bảo trì cho xe vận tải sử dụng công nghệ blockchain để đảm bảo tính minh bạch, không thể thay đổi và truy xuất nguồn gốc của dữ liệu bảo trì.
              </Text>
              <div style={{ marginTop: "16px" }}>
                <Space>
                  <SafetyOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
                  <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>Bảo mật Blockchain</Text>
                </Space>
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Title level={5} style={{ color: "#fff", marginBottom: "20px" }}>
              Liên Hệ
            </Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text strong style={{ color: "#fff", fontSize: "16px" }}>
                  Trường Đại Học Hàng Hải
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <PhoneOutlined style={{ color: "#fff", fontSize: "16px" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>0832206397</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MailOutlined style={{ color: "#fff", fontSize: "16px" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>sdtla0911114819@gmail.com</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClockCircleOutlined style={{ color: "#fff", fontSize: "16px" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  8:00 - 17:00 (Thứ 2 - Thứ 6)
                </Text>
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Title level={5} style={{ color: "#fff", marginBottom: "20px" }}>
              Chức Năng Hệ Thống
            </Title>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div className="footer_link_item">
                <DatabaseOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>Quản lý xe</Text>
              </div>
              <div className="footer_link_item">
                <DatabaseOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>Lịch sử bảo trì</Text>
              </div>
              <div className="footer_link_item">
                <DatabaseOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>Quản lý bảo hành</Text>
              </div>
              <div className="footer_link_item">
                <DatabaseOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>Thống kê & Báo cáo</Text>
              </div>
              <div className="footer_link_item">
                <SafetyOutlined style={{ marginRight: 8 }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>Xác thực Blockchain</Text>
              </div>
            </Space>
          </Col>
        </Row>

        <div className="copyright">
          <Row justify="center" align="middle">
            <Col>
              <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                © 2025 Trường Đại Học Hàng Hải. Hệ thống quản lý bảo trì & bảo hành xe vận tải.
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Footer;
