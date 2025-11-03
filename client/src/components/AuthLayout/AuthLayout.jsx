import React from "react";
import { FaCar, FaWrench, FaShieldAlt } from "react-icons/fa";
import "./AuthLayout.css";

const AuthLayout = ({ children, title, subtitle, icon: Icon }) => {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Side - Visual Section */}
        <div className="auth-visual">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <div className="logo-section">
              <div className="logo-icon">
                <FaCar className="car-icon" />
                <FaWrench className="wrench-icon" />
              </div>
              <h2 className="visual-title">VehicleWarranty</h2>
              <p className="visual-subtitle">Hệ thống quản lý bảo trì & bảo hành</p>
            </div>
            <div className="features-list">
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <span>Bảo hành minh bạch</span>
              </div>
              <div className="feature-item">
                <FaCar className="feature-icon" />
                <span>Theo dõi lịch sử bảo trì</span>
              </div>
              <div className="feature-item">
                <FaWrench className="feature-icon" />
                <span>Quản lý sửa chữa hiệu quả</span>
              </div>
            </div>
            <div className="decorative-elements">
              <div className="gear gear-1"></div>
              <div className="gear gear-2"></div>
              <div className="gear gear-3"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="auth-form-section">
          <div className="form-wrapper">
            <div className="form-header">
              <h1 className="form-title">
                {Icon && <span className="title-icon"><Icon /></span>}
                {title}
              </h1>
              {subtitle && <p className="form-subtitle">{subtitle}</p>}
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

