import React from "react";
import { Row, Col, Space, Typography } from "antd";
import {
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  ToolOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { FaTruck } from "react-icons/fa";
import "./Footer.css";

const { Title, Text } = Typography;

function Footer() {
  return (
    <div className="footer_container">
      <div className="container-fluid">
        <Row gutter={[32, 32]} style={{ padding: "40px 20px" }}>
          <Col xs={24} sm={12} lg={8}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#f9a826",
                  borderRadius: "12px"
                }}>
                  <FaTruck style={{ fontSize: "24px", color: "#000d6b" }} />
                </div>
                <Title level={4} style={{ color: "#fff", margin: 0 }}>
                  Hệ Thống Quản Lý Bảo Trì Xe Vận Tải
                </Title>
              </div>
              <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.8", fontSize: "14px" }}>
                Hệ thống theo dõi, sửa chữa, bảo hành và bảo trì cho xe vận tải sử dụng công nghệ blockchain để đảm bảo tính minh bạch, không thể thay đổi và truy xuất nguồn gốc của dữ liệu bảo trì.
              </Text>
              <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "rgba(82, 196, 26, 0.1)", borderRadius: "8px", border: "1px solid rgba(82, 196, 26, 0.3)" }}>
                <Space>
                  <SafetyOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
                  <Text style={{ color: "#52c41a", fontWeight: 500 }}>Bảo mật Blockchain</Text>
                </Space>
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Title level={5} style={{ color: "#fff", marginBottom: "24px", fontSize: "18px", fontWeight: 600 }}>
              <PhoneOutlined style={{ marginRight: "8px", color: "#f9a826" }} />
              Liên Hệ
            </Title>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div style={{ 
                padding: "12px", 
                backgroundColor: "rgba(255, 255, 255, 0.05)", 
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <Text strong style={{ color: "#fff", fontSize: "15px", display: "block", marginBottom: "4px" }}>
                  Trường Đại Học Hàng Hải
                </Text>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                padding: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                transition: "all 0.3s ease"
              }} className="footer_contact_item">
                <div style={{ 
                  width: "36px", 
                  height: "36px", 
                  backgroundColor: "rgba(249, 168, 38, 0.2)", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <PhoneOutlined style={{ color: "#f9a826", fontSize: "18px" }} />
                </div>
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>0832206397</Text>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                padding: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px"
              }} className="footer_contact_item">
                <div style={{ 
                  width: "36px", 
                  height: "36px", 
                  backgroundColor: "rgba(249, 168, 38, 0.2)", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <MailOutlined style={{ color: "#f9a826", fontSize: "18px" }} />
                </div>
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>sdtla0911114819@gmail.com</Text>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                padding: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px"
              }} className="footer_contact_item">
                <div style={{ 
                  width: "36px", 
                  height: "36px", 
                  backgroundColor: "rgba(249, 168, 38, 0.2)", 
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <ClockCircleOutlined style={{ color: "#f9a826", fontSize: "18px" }} />
                </div>
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>
                  8:00 - 17:00 (Thứ 2 - Thứ 6)
                </Text>
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Title level={5} style={{ color: "#fff", marginBottom: "24px", fontSize: "18px", fontWeight: 600 }}>
              <ToolOutlined style={{ marginRight: "8px", color: "#f9a826" }} />
              Chức Năng Hệ Thống
            </Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div className="footer_link_item">
                <CarOutlined style={{ marginRight: 12, fontSize: "18px", color: "#f9a826" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>Quản lý xe</Text>
              </div>
              <div className="footer_link_item">
                <FileTextOutlined style={{ marginRight: 12, fontSize: "18px", color: "#f9a826" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>Lịch sử bảo trì</Text>
              </div>
              <div className="footer_link_item">
                <ToolOutlined style={{ marginRight: 12, fontSize: "18px", color: "#f9a826" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>Quản lý bảo hành</Text>
              </div>
              <div className="footer_link_item">
                <BarChartOutlined style={{ marginRight: 12, fontSize: "18px", color: "#f9a826" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>Thống kê & Báo cáo</Text>
              </div>
              <div className="footer_link_item">
                <SafetyOutlined style={{ marginRight: 12, fontSize: "18px", color: "#52c41a" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14px" }}>Xác thực Blockchain</Text>
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
