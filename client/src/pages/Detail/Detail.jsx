import React, { useState, useEffect } from "react";
import "./Detail.css";
import { Mercedes } from "../../assets";
import { Mercedes1 } from "../../assets";
import { Mercedes2 } from "../../assets";
import { MdOutlineLocationOn } from "react-icons/md";
import DisplayContract from "../../components/DisplayContract/DisplayContract";
import { FaRegHeart } from "react-icons/fa";
import * as VehicleService from "../../services/VehicleService";
import { ethers } from "ethers";
import {
  carTransactionHistoryAdress,
  carmaintenanceAdress,
  caraccidentAdress,
  carTransactionHistoryABI,
  carmaintenanceABI,
  caraccidentABI,
} from "../../../Constant/constant";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FaHeart } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { FaTachometerAlt } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FaChargingStation } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { useParams } from "react-router-dom";
import Loading from "../../components/LoadingComponent/Loading";
import { FaRobot } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import * as RecordsService from "../../services/RecordsService";
import { FaInfoCircle } from "react-icons/fa";
import ServiceRecordForm from "./ServiceRecordForm";
import { Timeline, Tag, Card, Button, Space, Statistic, Row, Col, message } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, ToolOutlined, CopyOutlined } from "@ant-design/icons";
const Detail = () => {
  const { plate } = useParams();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [love, setLove] = useState(false);
  const [image, setImage] = useState([]);
  const [selectedButton, setSelectedButton] = useState("detail-button");
  const [car, setCar] = useState({});
  const [inputData, setInputdata] = useState({
    origin: "",
    condition: "",
    car_model: "",
    log10_mileage: "",
    exterior_color: "",
    interior_color: "",
    num_of_doors: "",
    seating_capacity: "",
    fuel_type: "",
    engine_size: "",
    transmission: "",
    drive_type: "",
    fuel_consumption: "",
    brand_grade: "",
    year_of_manufacture: "",
  });
  const [serviceRecords, setServiceRecords] = useState([]);
  const [creating, setCreating] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const handleClick = (buttonType) => {
    setSelectedButton(buttonType);
  };
  const resetStateOnProductChange = () => {
    setCar({});
  };
  useEffect(() => {
    resetStateOnProductChange();
  }, [plate]);
  const fetchCar = async (plate) => {
    try {
      const res = await VehicleService.getDetailsVehicleByPlate(plate);
      if (res?.status === "OK") {
        setIsLoading(false);
        setCar(res?.data);
        console.log("Data ben detail : ", res?.data);
        // const updatedInputCar = {
        //   origin: res?.data.origin,
        //   condition: condition,
        //   car_model: carModel,
        //   log10_mileage:
        //     mileague == 0 ? "0.0" : Math.log10(mileague).toFixed(1).toString(),
        //   exterior_color: exteriorColor,
        //   interior_color: interiorColor,
        //   num_of_doors: numDoor,
        //   seating_capacity: numSeat,
        //   fuel_type: engine,
        //   engine_size: capacity,
        //   transmission: transmission,
        //   drive_type: drivetype,
        //   fuel_consumption: consumption,
        //   brand_grade: brand,
        //   year_of_manufacture: yearManufac + ".0",
        // };
        // setInputCar(updatedInputCar);
      } else {
        setIsLoading(false);
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      setIsLoading(false);
      // Handle error, e.g., show an error message
    }
  };
  useEffect(() => {
    if (car) {
      
      // console.log("Có phải array không : ", Array.isArray(car.image));
      if (car?.image && Array.isArray(car.image) && car.image.length > 0) {
        // console.log("Type of image : ", typeof car?.image[0]);
        // console.log("Image : ", car?.image[0]);
        setImage(car?.image);
      } else {
        console.log("Image array is undefined, empty, or not an array.");
      }
      console.log("ID CUA XE: ", car?._id);
    }
  }, [car]);
  useEffect(() => {
    if (plate) {
      fetchCar(plate);
    }
  }, [plate]);

  const refreshServiceRecords = async (vehicleId) => {
    if (!vehicleId) return;
    try {
      const res = await RecordsService.listServiceRecords(vehicleId);
      if (res?.status === "OK") setServiceRecords(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    console.log("Cars: ", cars);
  }, [cars]);
  useEffect(() => {}, [car?._id]);
  useEffect(() => {
    if (car?._id) refreshServiceRecords(car._id);
  }, [car?._id]);
  // const imgs = [
  //   { id: 0, value: Mercedes },
  //   { id: 1, value: Mercedes1 },
  //   { id: 2, value: Mercedes2 },
  // ];
  // const [wordData, setWordData] = useState(imgs[0]);
  // const [val, setVal] = useState(0);
  // const handleClick1 = (index) => {
  //   console.log(index);
  //   setVal(index);
  //   const wordSlider = imgs[index];
  //   setWordData(wordSlider);
  // };
  // const handleNext = () => {
  //   let index = val < imgs.length - 1 ? val + 1 : val;
  //   setVal(index);
  //   const wordSlider = imgs[index];
  //   setWordData(wordSlider);
  // };
  // const handlePrevious = () => {
  //   let index = val <= imgs.length - 1 && val > 0 ? val - 1 : val;
  //   setVal(index);
  //   const wordSlider = imgs[index];
  //   setWordData(wordSlider);
  // };
  function generateImageArray(images) {
    const generatedImages = images.map((image) => ({
      original: image,
      thumbnail: image,
    }));
    return generatedImages;
  }

  return (
    <Loading isLoading={isLoading}>
      <div className="detail">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-6">
              <ImageGallery items={generateImageArray(image)} />
            </div>
            <div className="col-xl-6">
              <div className="product-info">
                <div className="product-info-location">
                  <MdOutlineLocationOn size={20} />
                  <p style={{ fontWeight: "500", fontSize: "12px" }}>
                    {car?.address}
                  </p>
                </div>
                <p style={{ fontWeight: "bolder", fontSize: "20px" }}>
                  {car?.name}
                </p>
                <p className="product-info-price">{car?.price}</p>
                <div className="product-info-more-info">
                  <p className="product-info-more-info-1">Biển số xe: </p>
                  <p className="product-info-more-info-2">{car?.plates}</p>
                </div>
                {/* <div className="product-info-option">
            <div className="product-info-options">47,000Km</div>
            <div className="product-info-options">5 chỗ</div>
            <div className="product-info-options">Số tự động</div>
            <div className="product-info-options">Sedan</div>
          </div> */}
                <div class="grid grid-cols-4 items-center gap-2">
                  <div class="rounded bg-gray-100 py-1">
                    <p class="text-gray-800 text-[12px] leading-[20px] md:text-[14px] md:leading-[20px] font-semibold text-center">
                      {car?.rolling}
                    </p>
                  </div>
                  <div class="rounded bg-gray-100 py-1">
                    <p class="text-gray-800 text-[12px] leading-[20px] md:text-[14px] md:leading-[20px] font-semibold text-center">
                      {car?.gear}
                    </p>
                  </div>
                  <div class="rounded bg-gray-100 py-1">
                    <p class="text-gray-800 text-[12px] leading-[20px] md:text-[14px] md:leading-[20px] font-semibold text-center">
                      {car?.type}
                    </p>
                  </div>
                  <div class="rounded bg-gray-100 py-1">
                    <p class="text-gray-800 text-[12px] leading-[20px] md:text-[14px] md:leading-[20px] font-semibold text-center">
                      {car?.color}
                    </p>
                  </div>
                  <div className="product-info-contact">
                    <div className="product-info-contact-compare">
                      <input
                        style={{
                          display: "inline-block",
                          width: "20%",
                        }}
                        type="checkbox"
                      />
                      <p style={{ display: "inline-block", width: "50%" }}>
                        So sánh
                      </p>
                    </div>
                    <div className="product-info-contact-count">
                      {love ? (
                        <FaRegHeart
                          className="product-info-contact-counts"
                          onClick={() => {
                            setLove(!love);
                          }}
                        />
                      ) : (
                        <FaHeart
                          className="product-info-contact-counts"
                          onClick={() => {
                            setLove(!love);
                          }}
                          style={{ color: "red" }}
                        />
                      )}

                      <p className="product-info-contact-counts">Yêu thích</p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "right",
                    justifyContent: "end",
                  }}
                >
                  <p
                    style={{
                      display: "inline-block",
                    }}
                  >
                    ID: 567
                  </p>
                </div>
              </div>
              <div className="product-book" style={{ width: "100%", maxWidth: "100%" }}>
                <Card
                  title={
                    <Space>
                      <ToolOutlined />
                      <span>Quản Lý Bảo Trì & Bảo Hành</span>
                    </Space>
                  }
                  extra={
                    <Button
                      size="large"
                      style={{ 
                        backgroundColor: "#1890ff", 
                        borderColor: "#1890ff",
                        color: "#fff",
                        fontWeight: 600,
                        height: "40px",
                        padding: "0 24px"
                      }}
                      icon={<ToolOutlined />}
                      onClick={() => setFormVisible(true)}
                      disabled={!car?._id}
                    >
                      Ghi Bảo Trì Mới
                    </Button>
                  }
                  style={{ width: "100%" }}
                >
                  {serviceRecords?.length > 0 ? (
                    <div style={{ maxHeight: 500, overflowY: "auto", width: "100%" }}>
                      <Timeline
                        items={serviceRecords
                          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                          .map((r) => ({
                            color: r.anchored ? "green" : "orange",
                            dot: r.anchored ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
                            children: (
                              <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                                  <strong>{r?.content?.job}</strong>
                                  <Space>
                                    {!r.anchored && (
                                      <Button
                                        size="small"
                                        type="primary"
                                        style={{ 
                                          backgroundColor: "#52c41a", 
                                          borderColor: "#52c41a",
                                          color: "#fff",
                                          fontSize: "11px",
                                          height: "24px",
                                          padding: "0 12px"
                                        }}
                                        icon={<CheckCircleOutlined />}
                                        onClick={async () => {
                                          try {
                                            setCreating(true);
                                            const res = await RecordsService.acceptServiceRecord(r._id);
                                            if (res?.status === "OK") {
                                              message.success("Đã xác thực transaction thành công!");
                                              refreshServiceRecords(car._id);
                                            } else {
                                              message.error(res?.message || "Xác thực thất bại!");
                                            }
                                          } catch (error) {
                                            message.error("Có lỗi xảy ra khi xác thực!");
                                            console.error(error);
                                          } finally {
                                            setCreating(false);
                                          }
                                        }}
                                        loading={creating}
                                      >
                                        Xác thực
                                      </Button>
                                    )}
                                    <Tag color={r.anchored ? "success" : "warning"}>
                                      {r.anchored ? "Đã xác thực blockchain" : "Chưa xác thực"}
                                    </Tag>
                                  </Space>
                                </div>
                                <div style={{ fontSize: 12, color: "#666" }}>
                                  <Space split="•">
                                    <span>Odo: {r?.content?.odo?.toLocaleString() || "N/A"} km</span>
                                    <span>Garage: {r?.content?.garage || "N/A"}</span>
                                    {r?.content?.cost && <span>Chi phí: {r.content.cost.toLocaleString()} VNĐ</span>}
                                  </Space>
                                </div>
                                {r?.content?.technician && (
                                  <div style={{ fontSize: 12, color: "#666" }}>KTV: {r.content.technician}</div>
                                )}
                                {r?.content?.parts && r.content.parts.length > 0 && (
                                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                                    Phụ tùng: {Array.isArray(r.content.parts) ? r.content.parts.join(", ") : r.content.parts}
                                  </div>
                                )}
                                {r?.content?.note && (
                                  <div style={{ fontSize: 12, color: "#999", marginTop: 4, fontStyle: "italic" }}>
                                    {r.content.note}
                                  </div>
                                )}
                                {r.txHash && (
                                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1890ff", marginTop: 8, padding: "12px", backgroundColor: "#e6f7ff", borderRadius: 6, border: "1px solid #91d5ff", wordBreak: "break-all" }}>
                                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: "#666", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span>Transaction Hash:</span>
                                      <Button 
                                        type="text" 
                                        size="small" 
                                        icon={<CopyOutlined />} 
                                        onClick={() => {
                                          navigator.clipboard.writeText(r.txHash);
                                          message.success("Đã sao chép transaction hash!");
                                        }}
                                        style={{ padding: "0 8px", height: "24px" }}
                                      >
                                        Copy
                                      </Button>
                                    </div>
                                    <code style={{ fontSize: 14, fontFamily: "monospace", color: "#1890ff", fontWeight: 600, display: "block", wordBreak: "break-all" }}>{r.txHash}</code>
                                  </div>
                                )}
                                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                                  {new Date(r.createdAt).toLocaleString("vi-VN")}
                                </div>
                              </div>
                            ),
                          }))}
                      />
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <ToolOutlined style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "16px" }} />
                        <p style={{ fontSize: "16px", color: "#666", marginBottom: "8px", fontWeight: 500 }}>
                          Chưa có lịch sử bảo trì
                        </p>
                        <p style={{ fontSize: "14px", color: "#999", marginBottom: "24px" }}>
                          Hãy ghi bản bảo trì đầu tiên cho xe này
                        </p>
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        style={{ 
                          backgroundColor: "#1890ff", 
                          borderColor: "#1890ff",
                          color: "#fff",
                          fontWeight: 600,
                          height: "48px",
                          padding: "0 32px",
                          fontSize: "16px"
                        }}
                        icon={<ToolOutlined />}
                        onClick={() => setFormVisible(true)}
                        disabled={!car?._id}
                      >
                        Ghi Bảo Trì Mới
                      </Button>
                      {!car?._id && (
                        <p style={{ fontSize: "12px", color: "#ff4d4f", marginTop: "12px" }}>
                          Đang tải thông tin xe...
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </div>
              <ServiceRecordForm
                vehicleId={car?._id}
                vehicleKey={car?.plates}
                open={formVisible}
                onCancel={() => setFormVisible(false)}
                onSuccess={() => {
                  refreshServiceRecords(car?._id);
                  setFormVisible(false);
                }}
              />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-6 mt-5">
              <Card title="Thống Kê Bảo Trì">
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Tổng lần bảo trì"
                      value={serviceRecords.length}
                      prefix={<ToolOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Đã xác thực"
                      value={serviceRecords.filter(r => r.anchored).length}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Tổng chi phí"
                      value={serviceRecords.reduce((sum, r) => sum + (r?.content?.cost || 0), 0)}
                      suffix="VNĐ"
                      precision={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    />
                  </Col>
                </Row>
                {serviceRecords.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
                      Lần bảo trì gần nhất: {new Date(Math.max(...serviceRecords.map(r => new Date(r.createdAt).getTime()))).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
              </Card>
            </div>
            <div className="col-xl-6 mt-5">
              <div>
                <div className="product-info-detail">
                  <h1>Thông tin về xe</h1>
                  <div>
                    <button
                      style={{ marginRight: "10px" }}
                      className={
                        selectedButton === "detail-button"
                          ? "onclick"
                          : "detail-button"
                      }
                      onClick={() => handleClick("detail-button")}
                    >
                      Thông số kỹ thuật
                    </button>
                    <button
                      className={
                        selectedButton === "describe-button"
                          ? "onclick"
                          : "describe-button"
                      }
                      onClick={() => handleClick("describe-button")}
                    >
                      Mô tả
                    </button>
                  </div>
                </div>
                {selectedButton === "detail-button" ? (
                  <div className="product-more-detail">
                    <table className="block-table">
                      <tbody>
                        <tr>
                          <td>
                            <FaCar
                              size={30}
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            />{" "}
                            Model
                          </td>
                          <td>{car?.name}</td>
                        </tr>
                        <tr>
                          <td>
                            <FaTachometerAlt
                              size={30}
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            />{" "}
                            Giấy phép
                          </td>
                          <td>{car?.license}</td>
                        </tr>
                        <tr>
                          <td>
                            <IoIosSettings
                              size={30}
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            />{" "}
                            Nhãn hàng
                          </td>
                          <td>{car?.brand}</td>
                        </tr>
                        <tr>
                          <td>
                            <FaChargingStation
                              size={30}
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            />{" "}
                            Nhiên liệu
                          </td>
                          <td>{car?.fuel}</td>
                        </tr>
                        <tr>
                          <td>
                            <IoIosColorPalette
                              size={30}
                              style={{
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            />{" "}
                            Kiểu dáng
                          </td>
                          <td>{car?.type}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="product-describe-more">
                    <div className="product-describe-more-more">
                      <p>
                        {car?.description ? car?.description : "Không có mô tả"}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
        {/* <div>
          {car?._id ? (
            <DisplayContract type="his" carId={car?._id} />
          ) : (
            <div>Chưa có lịch sử</div>
          )}
        </div> */}
      </div>
      <Footer />
    </Loading>
  );
};

export default Detail;
