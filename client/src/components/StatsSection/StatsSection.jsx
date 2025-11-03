import React from "react";
import { Row, Col, Card } from "antd";
import { CarOutlined, ToolOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./StatsSection.css";

const StatsSection = ({ vehicles, maintenanceRegs, serviceRecords }) => {
  const stats = [
    {
      title: "Tổng số xe",
      value: vehicles?.length || 0,
      icon: <CarOutlined />,
      color: "#1890ff",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Chờ duyệt",
      value: maintenanceRegs?.length || 0,
      icon: <ClockCircleOutlined />,
      color: "#faad14",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Đã xác thực",
      value: serviceRecords?.filter((r) => r.status === "anchored" || r.anchored)?.length || 0,
      icon: <CheckCircleOutlined />,
      color: "#52c41a",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Tổng bảo trì",
      value: serviceRecords?.length || 0,
      icon: <ToolOutlined />,
      color: "#722ed1",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
  ];

  return (
    <Row gutter={[24, 24]} className="stats-section">
      {stats.map((stat, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card className="stat-card" style={{ background: stat.gradient }}>
            <div className="stat-card-content">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsSection;

