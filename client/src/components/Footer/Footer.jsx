import React from "react";
import { Row, Col, Space, Typography } from "antd";
import { 
  RiBuilding2Line, 
  RiHomeHeartLine, 
  RiFileTextLine, 
  RiShieldCheckLine,
  RiBarChartLine,
  RiContactsLine,
  RiTimeLine,
  RiMailLine,
  RiPhoneLine
} from "react-icons/ri";
import "./Footer.css";

const { Title, Text } = Typography;

function Footer() {
  return (
    <div className="footer_container">
      <div className="container-fluid">
        <Row gutter={[32, 32]} style={{ padding: "40px 20px" }}>
          <Col xs={24} sm={12} lg={8}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
                }}>
                  <RiBuilding2Line style={{ fontSize: "28px", color: "#fff" }} />
                </div>
                <Title level={4} style={{ 
                  color: "#fff", 
                  margin: 0,
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "700",
                  fontSize: "20px",
                  letterSpacing: "-0.3px"
                }}>
                  Hệ Thống Quản Lý Bảo Trì Xe
                </Title>
              </div>
              <Text style={{ 
                color: "rgba(255, 255, 255, 0.9)", 
                lineHeight: "1.8", 
                fontSize: "15px",
                fontFamily: "'Inter', 'Poppins', sans-serif",
                fontWeight: "400"
              }}>
                Hệ thống quản lý bảo trì xe sử dụng công nghệ blockchain để đảm bảo tính minh bạch, không thể thay đổi và truy xuất nguồn gốc của các giao dịch.
              </Text>
              <div style={{ 
                marginTop: "24px", 
                padding: "14px 16px", 
                background: "rgba(82, 196, 26, 0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px", 
                border: "1px solid rgba(82, 196, 26, 0.3)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
              }}>
                <Space>
                  <RiShieldCheckLine style={{ color: "#52c41a", fontSize: "22px" }} />
                  <Text style={{ 
                    color: "#52c41a", 
                    fontWeight: 600,
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    fontSize: "15px"
                  }}>Bảo mật Blockchain</Text>
                </Space>
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Title level={5} style={{ 
              color: "#fff", 
              marginBottom: "28px", 
              fontSize: "19px", 
              fontWeight: 700,
              fontFamily: "'Inter', 'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <RiContactsLine style={{ fontSize: "22px", color: "#fff" }} />
              Liên Hệ
            </Title>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div style={{ 
                padding: "14px 16px", 
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
              }}>
                <Text strong style={{ 
                  color: "#fff", 
                  fontSize: "15px", 
                  display: "block", 
                  marginBottom: "0",
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "600"
                }}>
                  Trường Đại Học Hàng Hải
                </Text>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "14px",
                padding: "14px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer"
              }} className="footer_contact_item">
                <div style={{ 
                  width: "42px", 
                  height: "42px", 
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}>
                  <RiPhoneLine style={{ color: "#fff", fontSize: "20px" }} />
                </div>
                <Text style={{ 
                  color: "rgba(255, 255, 255, 0.95)", 
                  fontSize: "15px",
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "500"
                }}>123456789</Text>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "14px",
                padding: "14px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer"
              }} className="footer_contact_item">
                <div style={{ 
                  width: "42px", 
                  height: "42px", 
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}>
                  <RiMailLine style={{ color: "#fff", fontSize: "20px" }} />
                </div>
                <Text style={{ 
                  color: "rgba(255, 255, 255, 0.95)", 
                  fontSize: "15px",
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "500"
                }}>sdtla0911114819@gmail.com</Text>
              </div>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "14px",
                padding: "14px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer"
              }} className="footer_contact_item">
                <div style={{ 
                  width: "42px", 
                  height: "42px", 
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}>
                  <RiTimeLine style={{ color: "#fff", fontSize: "20px" }} />
                </div>
                <Text style={{ 
                  color: "rgba(255, 255, 255, 0.95)", 
                  fontSize: "15px",
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "500"
                }}>
                  8:00 - 17:00 (Thứ 2 - Thứ 6)
                </Text>
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Title level={5} style={{ 
              color: "#fff", 
              marginBottom: "28px", 
              fontSize: "19px", 
              fontWeight: 700,
              fontFamily: "'Inter', 'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <RiBarChartLine style={{ fontSize: "22px", color: "#fff" }} />
              Chức Năng Hệ Thống
            </Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div className="footer_link_item">
                <RiHomeHeartLine style={{ marginRight: 14, fontSize: "20px", color: "#fff" }} />
                <Text style={{ 
                  color: "rgba(255, 255, 255, 0.95)", 
                  fontSize: "15px",
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "500"
                }}>Quản lý bất động sản</Text>
              </div>
              <div className="footer_link_item">
                <RiFileTextLine style={{ marginRight: 14, fontSize: "20px", color: "#fff" }} />
                <Text style={{ 
                  color: "rgba(255, 255, 255, 0.95)", 
                  fontSize: "15px",
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "500"
                }}>Lịch sử giao dịch</Text>
              </div>
              <div className="footer_link_item">
                <RiBarChartLine style={{ marginRight: 14, fontSize: "20px", color: "#fff" }} />
                <Text style={{ 
                  color: "rgba(255, 255, 255, 0.95)", 
                  fontSize: "15px",
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "500"
                }}>Thống kê & Báo cáo</Text>
              </div>
              <div className="footer_link_item">
                <RiShieldCheckLine style={{ marginRight: 14, fontSize: "20px", color: "#52c41a" }} />
                <Text style={{ 
                  color: "rgba(255, 255, 255, 0.95)", 
                  fontSize: "15px",
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: "500"
                }}>Xác thực Blockchain</Text>
              </div>
            </Space>
          </Col>
        </Row>

        <div className="copyright">
          <Row justify="center" align="middle">
            <Col>
              <Text style={{ 
                color: "rgba(255, 255, 255, 0.7)", 
                fontSize: "14px",
                fontFamily: "'Inter', 'Poppins', sans-serif",
                fontWeight: "400"
              }}>
                © 2025 Trường Đại Học Hàng Hải. Hệ thống quản lý giao dịch bất động sản Blockchain.
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Footer;
