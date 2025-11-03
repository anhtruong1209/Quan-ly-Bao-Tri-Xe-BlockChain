import React from "react";
import { Card, Row, Col, Image } from "antd";
import "./AdvertisementSection.css";

const AdvertisementSection = () => {
  const advertisements = [
    {
      id: 1,
      title: "Dịch vụ bảo dưỡng chuyên nghiệp",
      description: "Đội ngũ kỹ thuật viên giàu kinh nghiệm, phụ tùng chính hãng",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800",
      link: "#",
    },
    {
      id: 2,
      title: "Phụ tùng chính hãng",
      description: "Cam kết 100% phụ tùng chính hãng, bảo hành dài hạn",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      link: "#",
    },
    {
      id: 3,
      title: "Ưu đãi đặc biệt",
      description: "Giảm 20% cho khách hàng thân thiết, áp dụng cho mọi dịch vụ",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
      link: "#",
    },
  ];

  return (
    <div className="advertisement-section">
      <h2 className="section-title">Dịch vụ & Ưu đãi</h2>
      <Row gutter={[24, 24]}>
        {advertisements.map((ad) => (
          <Col xs={24} md={8} key={ad.id}>
            <Card
              className="ad-card"
              hoverable
              cover={
                <div className="ad-image-container">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    className="ad-image"
                    preview={false}
                    fallback="https://via.placeholder.com/400x250?text=Advertisement"
                  />
                  <div className="ad-overlay">
                    <span className="ad-badge">Mới</span>
                  </div>
                </div>
              }
              onClick={() => window.open(ad.link, "_blank")}
            >
              <div className="ad-content">
                <h3 className="ad-title">{ad.title}</h3>
                <p className="ad-description">{ad.description}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdvertisementSection;

