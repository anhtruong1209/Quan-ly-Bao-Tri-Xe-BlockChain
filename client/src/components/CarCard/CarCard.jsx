import React from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CarCard.css";
import { Card, Button, CardBody } from "react-bootstrap";
const CarCard = (props) => {
  let { plate, img, name, engine, address, type , price} = props.data;
  return (
    <Card
      style={{ borderRadius: "20px", cursor: "pointer", border: "none" }}
      className="p-0 overflow-hidden h-100 custom-card"
    >
      <div className="overflow-hidden p-0 bg-light">
        <Card.Img
          style={{ height: "300px", objectFit: "cover" }}
          variant="top"
          src={img}
        />
      </div>
      <Card.Body className="text-left">
        <Card.Title className="name-title">{name}</Card.Title>
        <Card.Title className="price-title">{price}</Card.Title>
        <div className="horizontal-custom"></div>
        <Card.Title className="plate-title">{plate}</Card.Title>
        <Card.Title className="address-title">{address}</Card.Title>
        <div className="more-title">
          <div className="more-tile-option">{engine}</div>
          <div className="more-tile-option">{type}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;
