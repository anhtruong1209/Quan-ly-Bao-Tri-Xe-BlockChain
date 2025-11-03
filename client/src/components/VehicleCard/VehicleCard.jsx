import React from "react";
import { Card, Button, Space, Tag, Image, Popover } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./VehicleCard.css";

const VehicleCard = ({ vehicle, onView, onEdit, onDelete }) => {
  const imageUrl = vehicle?.image && Array.isArray(vehicle.image) && vehicle.image.length > 0
    ? vehicle.image[0]
    : "https://via.placeholder.com/400x250?text=Vehicle+Image";

  return (
    <Card
      className="vehicle-card"
      hoverable
      cover={
        <div className="vehicle-card-image-container">
          <img
            src={imageUrl}
            alt={vehicle?.name || "Vehicle"}
            className="vehicle-card-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
            }}
          />
          <div className="vehicle-card-overlay">
            <Tag color="blue" className="vehicle-type-tag">
              {vehicle?.type?.toUpperCase() || "N/A"}
            </Tag>
          </div>
        </div>
      }
      actions={[
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => onView(vehicle)}
          className="card-action-btn card-action-btn-detail"
        >
          Chi tiết
        </Button>,
        <Button
          icon={<EditOutlined />}
          onClick={() => onEdit(vehicle)}
          className="card-action-btn"
        >
          Sửa
        </Button>,
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(vehicle._id)}
          className="card-action-btn"
        >
          Xóa
        </Button>,
      ]}
    >
      <div className="vehicle-card-content">
        <h3 className="vehicle-card-title">{vehicle?.name || "N/A"}</h3>
        <div className="vehicle-card-info">
          <div className="info-item">
            <span className="info-label">Biển số:</span>
            <span className="info-value">{vehicle?.plates || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Hãng:</span>
            <span className="info-value">{vehicle?.brand || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Màu:</span>
            <span className="info-value">{vehicle?.color || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Nhiên liệu:</span>
            <span className="info-value">{vehicle?.fuel || "N/A"}</span>
          </div>
        </div>
        <div className="vehicle-card-footer">
          <span className="registration-date">
            Đăng ký: {vehicle?.createdAt ? new Date(vehicle.createdAt).toLocaleDateString("vi-VN") : "N/A"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default VehicleCard;

