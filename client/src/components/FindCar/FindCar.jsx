import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../../constant/constant";
import { DiCodepen } from "react-icons/di";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import plate from "./plate.svg";
import carImage from "./desbribe.jpg";
import * as VehicleService from "../../services/VehicleService";
import "./FindCar.css";
import VehicleByType from "../../pages/VehicleByType/VehicleByType";
import { Skeleton } from "antd";
// Component hiển thị nội dung khi chọn theo hãng
// Component hiển thị nội dung khi chọn theo nhu cầu
const ByNeedsContent = () => {
  return (
    <div className="content-theo-nhu-cau">
      <div className="nhucau xe-gia-dinh"></div>
      <div className="nhucau xe-luot"></div>
      <div className="nhucau xe-flex"></div>
    </div>
  );
};

// Component hiển thị nội dung khi chọn theo trả góp
const ByInstallmentsContent = () => {
  return (
    <div className="content-theo-tra-gop">
      <div className="tragop truoc"></div>
      <div className="tragop dinhky"></div>
      <div></div>
    </div>
  );
};

// Component hiển thị nội dung khi chọn theo kiểu dáng
const ByStyleContent = () => {
  return (
    <div className="content-theo-kieu-dang">
      <div class="kieu sedan"></div>
      <div class="kieu hatchback"></div>
      <div class="kieu suv"></div>
      <div class="kieu mpv"></div>
      <div class="kieu van"></div>
      <div class="kieu pickup"></div>
      <div class="kieu crossover"></div>
    </div>
  );
};

const FindCar = (props) => {
  const [provider, setProvider] = useState(null);
  const [predictPrice, setPredictPrice] = useState(0);
  const navigate = useNavigate(); // Move useNavigate hook here
  const [vehicleinfor, setVehicleinfor] = useState(null);
  const [origin, setOrigin] = useState("Imported");
  const [condition, setCondition] = useState("New car");
  const [carModel, setCarModel] = useState("SUV");
  const [exteriorColor, setExteriorColor] = useState("Copper");
  const [interiorColor, setInteriorColor] = useState("Black");
  const [numDoor, setNumDoor] = useState("5-door");
  const [numSeat, setNumSeat] = useState("7-seat");
  const [engine, setEngine] = useState("Petrol");
  const [transmission, setTranssision] = useState("Automatic");
  const [capacity, setCapacity] = useState("2.7 L");
  const [drivetype, setDriveType] = useState("RFD - Rear-wheel drive");
  const [inputCar, setInputCar] = useState({
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
  const [plates, setPlates] = useState(null);
  const [nameCarFind, setNameCarFind] = useState(null);
  const [mileague, setMileague] = useState(0);
  const [brand, setBrand] = useState("Toyota Fortuner");
  const [yearManufac, setYearManufac] = useState("2023");
  const [consumption, setConsumption] = useState("None");
  const [findCar, setFindcar] = useState(null);
  const [findCarName, setFindcarName] = useState(null);
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const numberPLate = document.querySelector("#message").value;
      const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-sepolia.g.alchemy.com/v2/MPMfIIQQw3C8j6ZPKtmlX-dBPCSE7rmU"
      );
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const results = await contract.getVehicleInfo(numberPLate);
      setVehicleinfor(results);
      console.log(results);
      props.addInfo(results);
    } catch (error) {
      console.error("Error fetching cars from contract:", error);
    }
  }
  const [activeButton, setActiveButton] = useState(null);
  const handleClick = (button) => {
    if (button !== activeButton) {
      setActiveButton(button);
    }
  };
  const handleOnClick = (name) => {
    console.log("Name: ", name);
    navigate(`/vehicle-type/${name}`);
  };
  const handleFindCarByName = (name) => {
    console.log("Name: ", name);
    navigate(`/findcar/${name}`);
  };

  const ByBrandContent = () => {
    return (
      <div className="content-theo-hang">
        <div
          class="item toyota"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("toyota")}
        ></div>
        <div
          class="item honda"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("honda")}
        ></div>
        <div
          class="item huyndai"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("hyundai")}
        ></div>
        <div
          class="item kia"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("kia")}
        ></div>
        <div
          class="item madza"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("Madza")}
        ></div>
        <div
          class="item ford"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("ford")}
        ></div>
        <div
          class="item audi"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("audi")}
        ></div>
        <div
          class="item bmw"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("bmw")}
        ></div>
        <div
          class="item chervolet"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("chervolet")}
        ></div>
        <div
          class="item mercedes"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("mercedes")}
        ></div>
        <div
          class="item mitsubishi"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("mitsubishi")}
        ></div>
        <div
          class="item suzuki"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("suzuki")}
        ></div>
        <div
          class="item vin"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("vin")}
        ></div>
        <div
          class="item lamborghini"
          style={{ cursor: "pointer" }}
          onClick={() => handleOnClick("lamborghini")}
        ></div>
      </div>
    );
  };
  // Render component phù hợp dựa trên activeButton
  const renderContent = () => {
    switch (activeButton) {
      case "theo-hang":
        return <ByBrandContent />;
      case "theo-nhu-cau":
        return <ByNeedsContent />;
      case "theo-tra-gop":
        return <ByInstallmentsContent />;
      case "theo-kieu-dang":
        return <ByStyleContent />;
      default:
        return <ByBrandContent />;
    }
  };
  const getPredictPrice = async (car) => {
    const res = await VehicleService.getPricePredict(car);
    console.log("input car: ", inputCar);
    console.log("Gia ca cua xe: ", res.data);
    setPredictPrice(res.data);
    return res;
  };
  const handleInput = (e) => {
    setPlates(e.target.value);
  };
  const handleNameCarFind = (e) => {
    setNameCarFind(e.target.value);
  };
  const handleMileague = (e) => {
    setMileague(Number(e.target.value));
    if (value > 0) {
      setCondition("Used car");
    } else {
      setCondition("New car"); // Reset condition if mileague is not greater than 0
    }
  };
  useEffect(() => {
    if (mileague > 0) {
      setCondition("Used car");
    } else {
      setCondition("New car"); // Reset condition if mileague is not greater than 0
    }
  }, [mileague]);
  const handleBrand = (e) => {
    setBrand(e.target.value);
  };
  const handleGrade = (e) => {
    setGrade(e.target.value);
  };
  const handleNameCar = (e) => {
    setNameCar(e.target.value);
  };
  const handleYearManufac = (e) => {
    setYearManufac(e.target.value);
  };
  const handleEngine = (e) => {
    setEngine(e.target.value);
  };
  const handleChangeOrigin = (event) => {
    setOrigin(event.target.value);
  };
  const handleChangeTranssision = (event) => {
    setTranssision(event.target.value);
  };
  const handleConsumption = (e) => {
    setConsumption(e.target.value);
  };

  const handleCarModel = (e) => {
    setCarModel(e.target.value);
  };
  const handleExteriorColor = (e) => {
    setExteriorColor(e.target.value);
  };
  const handleInterirorColor = (e) => {
    setInteriorColor(e.target.value);
  };
  const handleNumdoor = (e) => {
    setNumDoor(e.target.value);
  };
  const handleNumseat = (e) => {
    setNumSeat(e.target.value);
  };
  const handleCapacity = (e) => {
    setCapacity(e.target.value);
  };
  const handleDriveType = (e) => {
    setDriveType(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (plates) setFindcar(plates);
    else setFindcarName(nameCarFind);
    setPlates(null);
    setNameCarFind(null);
    // console.log("Plates: ", plates);
  };
  useEffect(() => {
    console.log("input car", inputCar);
  }, [inputCar]);

  const onPredict = (e) => {
    e.preventDefault();
    const updatedInputCar = {
      origin: origin,
      condition: condition,
      car_model: carModel,
      log10_mileage:
        mileague == 0 ? "0.0" : Math.log10(mileague).toFixed(1).toString(),
      exterior_color: exteriorColor,
      interior_color: interiorColor,
      num_of_doors: numDoor,
      seating_capacity: numSeat,
      fuel_type: engine,
      engine_size: capacity,
      transmission: transmission,
      drive_type: drivetype,
      fuel_consumption: consumption,
      brand_grade: brand,
      year_of_manufacture: yearManufac + ".0",
    };
    setInputCar(updatedInputCar);
    // getPredictPrice(inputCar);
    // console.log("Plates: ", plates);
  };
  useEffect(() => {
    if (inputCar.origin) {
      getPredictPrice(inputCar);
    }
  }, [inputCar]);
  useEffect(() => {
    console.log("Plates: ", findCar);
    setFindcarName(null);
  }, [findCar]);
  useEffect(() => {
    console.log("Plates: ", findCarName);
    setFindcar(null);
  }, [findCarName]);
  const reset = () => {
    setPlates(null);
    setFindcar(null);
  };
  const convertToVND = (val) => {
    const roundedValue = Math.ceil(val); // Làm tròn lên đến số nguyên gần nhất
    if (roundedValue < 1000) {
        return `${roundedValue} triệu`;
    } else {
        const billion = parseInt(roundedValue / 1000); // Chuyển đổi thành số nguyên
        const million = roundedValue % 1000;
        if (million === 0) {
            return `${billion} tỷ`;
        } else {
            return `${billion} tỷ ${million} triệu`;
        }
    }
};
  const resetAI = () => {
    console.log("Vo dc ai reset");
    setMileague(Number(0));
    setCondition("New car");
    setBrand("");
    setYearManufac("");
    setEngine("Động cơ");
    setOrigin("Xuát xứ");
    setTranssision("Cần số");
    setConsumption("");
    setCarModel("Other");
    setExteriorColor("Màu ngoại thất");
    setInteriorColor("Màu nội thất");
    setNumDoor("Số cửa");
    setNumSeat("Số chỗ ngồi");
    setCapacity("Dung tích");
    setDriveType("Dẫn động");
  };
  return (
    <div className="findcar-container">
      <div className="container filter-option">
        <div className="row mt-5 mb-5">
          <div className="col-xl-4 d-none d-xl-block">
            <h6 style={{ fontWeight: "bold", marginBottom: "18px" }}>
              Theo khoảng giá
            </h6>
            <div className="price-box">
              <a className="bttn-600-800">
                {/* <img style={{ width: "50%",   }} src={car1} alt="" /> */}
              </a>
              <div class="box2">
                <button className="bttn-800-1m"></button>
                <button className="bttn-1m"></button>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="option-container-button">
              <button
                className={`btnn-theo-hang ${
                  activeButton === "theo-hang" ? "active" : ""
                }`}
                onClick={() => handleClick("theo-hang")}
              >
                Theo hãng
              </button>
              <button
                className={`btnn-theo-hang ${
                  activeButton === "theo-nhu-cau" ? "active" : ""
                }`}
                onClick={() => handleClick("theo-nhu-cau")}
              >
                Theo nhu cầu
              </button>
              <button
                className={`btnn-theo-hang ${
                  activeButton === "theo-tra-gop" ? "active" : ""
                }`}
                onClick={() => handleClick("theo-tra-gop")}
              >
                Theo trả góp
              </button>
              <button
                className={`btnn-theo-hang ${
                  activeButton === "theo-kieu-dang" ? "active" : ""
                }`}
                onClick={() => handleClick("theo-kieu-dang")}
              >
                Theo kiểu dáng
              </button>
            </div>
            <div className="option-result">{renderContent()}</div>
          </div>
          <div className="col-xl-4">
            <div className="all-car">
              <span>Xem tất cả xe</span>
              <MdOutlineArrowCircleRight />
            </div>
            <div className="support-find-car">
              <div>
                <p style={{ fontSize: "15px", marginBottom: "6px" }}>
                  Bạn cần hỗ trợ tìm xe?
                </p>
                <p style={{ color: "#029AF2" }}>Hãy để chúng tôi giúp bạn</p>
              </div>
              <div className="img-support"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="container p-5 filter-plates mb-6">
        <div className="row" style={{ width: "100%" }}>
          <div className="col-lg-6" style={{ width: "600px" }}>
            <img src={plate} alt="" />
          </div>
          <div className="col-lg-6" style={{ width: "600px" }}>
            <form action="" onSubmit={onSubmit}>
              <div>
                <h1
                  style={{
                    fontWeight: "900",
                    fontFamily: "'Anton SC',sans-serif",
                    fontStyle: "normal",
                  }}
                >
                  Tìm Kiếm Xe Trực Tuyến
                </h1>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginTop: "0px",
                  }}
                >
                  Bạn đã có biển số xe? Hãy tìm kiếm ngay nhé!
                </p>
              </div>
              <div className="input-group2">
                <input
                  onChange={handleInput}
                  style={{ width: "100%" }}
                  className="input bienso"
                  type="text"
                  value={plates ? plates : ""}
                  placeholder="Nhập Biển Số Xe"
                />

                <div className="input-option">
                  <select className="input" placeholder="Loại xe">
                    <option value="" style={{ color: "black" }}>
                      Loại xe
                    </option>
                    <option style={{ color: "black" }} value="">
                      Sedan
                    </option>
                    <option style={{ color: "black" }} value="">
                      SUV
                    </option>
                    <option style={{ color: "black" }} value="">
                      Hatchback
                    </option>
                  </select>
                  <input
                    onChange={handleNameCarFind}
                    className="input thanhpho"
                    type="text"
                    value={nameCarFind ? nameCarFind : ""}
                    placeholder="Nhập Tên Xe"
                  />
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <button className="bttn-search">Tìm Kiếm Ngay</button>
              </div>
            </form>
            <button onClick={reset} className="hoantac">
              Hoàn Tác
            </button>
          </div>
          {/* here */}
        </div>
      </div>

      <div className="container ai-training-frame p-5 mb-6">
        <div className="row" style={{ width: "100%" }}>
          <div className="col-lg-6" style={{ width: "600px" }}>
            <form action="" onSubmit={onPredict}>
              <div style={{ marginLeft: "20px" }}>
                <h1 style={{ fontWeight: "800" }}>Tra giá xe bằng AI</h1>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginTop: "0px",
                  }}
                >
                  Bạn đã có biển số xe? Hãy tìm kiếm ngay nhé!
                </p>
              </div>
              <div className="container">
                <div className="input-group">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row align-items-center">
                        <p
                          className="col-lg-9"
                          style={{
                            padding: "5px 30px",
                            color: "black",
                            fontSize: "18px",
                            fontWeight: "bolder",
                            margin: 0,
                          }}
                        >
                          Số km đã đi :
                        </p>
                        <input
                          onChange={handleMileague}
                          className="col-lg-3 input bienso"
                          type="number"
                          style={{ color: "black" }}
                          value={mileague ? mileague : 0}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      {/* <select
                        className="input"
                        placeholder="Tình trạng"
                        value={condition}
                        disabled={true}
                      >
                        <option style={{ color: "black" }} value="Xe mới">
                          Xe mới
                        </option>
                        <option style={{ color: "black" }} value="Xe đã dùng">
                          Xe đã dùng
                        </option>
                      </select> */}
                      <input
                        // onChange={handleMileague}
                        className="input bienso"
                        style={{ fontSize: "15px" }}
                        // type="text"
                        value={condition == "New car" ? "Xe Mới" : "Xe Cũ"}
                        disabled={true}
                      />
                    </div>
                  </div>

                  {/* <input
                        onChange={handleBrand}
                        className="input bienso"
                        type="text"
                        value={brand ? brand : ""}
                        placeholder="Hãng"
                      /> */}
                  <div className="row" style={{ width: "550px" }}>
                    <div className="col-lg-9">
                      <input
                        onChange={handleBrand}
                        className="input bienso"
                        type="text"
                        value={brand ? brand : ""}
                        placeholder="Nhã hiệu xe"
                      />
                    </div>

                    <div className="col-lg-3">
                      <input
                        onChange={handleYearManufac}
                        className="input bienso"
                        type="text"
                        value={yearManufac ? yearManufac : ""}
                        placeholder="Năm sản xuất"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="row">
                      <div className="col-lg-4">
                        <select
                          className="input"
                          placeholder="Xuất xứ"
                          value={origin}
                          onChange={handleChangeOrigin}
                        >
                          <option value={"Xuát xứ"} style={{ color: "black" }}>
                            Xuất xứ
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="Domestic assembly"
                          >
                            Lắp ráp trong nước
                          </option>
                          <option style={{ color: "black" }} value="Imported">
                            Nhập khẩu
                          </option>
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <select
                          className="input"
                          placeholder="Cần số"
                          value={transmission}
                          onChange={handleChangeTranssision}
                        >
                          <option value={"Cần số"} style={{ color: "black" }}>
                            Cần số
                          </option>
                          <option style={{ color: "black" }} value="Automatic">
                            Tự động
                          </option>
                          <option style={{ color: "black" }} value="Manual">
                            Thủ công
                          </option>
                          <option style={{ color: "black" }} value="Other">
                            Khác
                          </option>
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <select
                          className="input"
                          placeholder="Dòng xe"
                          value={carModel}
                          onChange={handleCarModel}
                        >
                          <option value="Other" style={{ color: "black" }}>
                            Khác
                          </option>
                          <option style={{ color: "black" }} value="SUV">
                            SUV
                          </option>
                          <option style={{ color: "black" }} value="Crossover">
                            Crossover
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="Van/Minivan"
                          >
                            Van/Minivan
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="Bán tải / Pickup"
                          >
                            Bán tải / Pickup
                          </option>
                          <option style={{ color: "black" }} value="Sedan">
                            Sedan
                          </option>
                          <option style={{ color: "black" }} value="Hatchback">
                            Hatchback
                          </option>
                          <option style={{ color: "black" }} value="Coupe">
                            Coupe
                          </option>
                          <option style={{ color: "black" }} value="Truck">
                            Truck
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="Convertible/Cabriolet"
                          >
                            Convertible/Cabriolet
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        {" "}
                        <select
                          className="input"
                          placeholder="Màu ngoại thất"
                          value={exteriorColor}
                          onChange={handleExteriorColor}
                        >
                          <option
                            value="Màu ngoại thất"
                            disabled
                            selected
                            hidden
                          >
                            Màu ngoại thất
                          </option>
                          <option style={{ color: "black" }} value="White">
                            Trắng
                          </option>
                          <option style={{ color: "black" }} value="Black">
                            Đen
                          </option>
                          <option style={{ color: "black" }} value="Silver">
                            Bạc
                          </option>
                          <option style={{ color: "black" }} value="Copper">
                            Đồng
                          </option>
                          <option style={{ color: "black" }} value="Grey">
                            Xám
                          </option>
                          <option style={{ color: "black" }} value="Red">
                            Đỏ
                          </option>
                          <option style={{ color: "black" }} value="Brown">
                            Nâu
                          </option>
                          <option style={{ color: "black" }} value="Green">
                            Xanh
                          </option>
                          <option style={{ color: "black" }} value="Take note">
                            Ghi
                          </option>
                          <option style={{ color: "black" }} value="Orange">
                            Cam
                          </option>
                          <option style={{ color: "black" }} value="Yellow">
                            Vàng
                          </option>
                          <option style={{ color: "black" }} value="Sand">
                            Cát
                          </option>
                          <option style={{ color: "black" }} value="Colorful">
                            Nhiều màu
                          </option>
                          <option style={{ color: "black" }} value="Pink">
                            Kem
                          </option>
                          <option style={{ color: "black" }} value="Pink">
                            Hồng
                          </option>
                          <option style={{ color: "black" }} value="Cream">
                            Tím
                          </option>
                          <option style={{ color: "black" }} value="Other">
                            Màu khác
                          </option>
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <select
                          className="input"
                          placeholder="Màu nội thất"
                          value={interiorColor}
                          onChange={handleInterirorColor}
                        >
                          <option
                            value="Màu nội thất"
                            style={{ color: "black" }}
                          >
                            Màu nội thất
                          </option>
                          <option style={{ color: "black" }} value="Black">
                            Ghi
                          </option>
                          <option style={{ color: "black" }} value="Black">
                            Đen
                          </option>
                          <option style={{ color: "black" }} value="Brown">
                            Nâu
                          </option>
                          <option style={{ color: "black" }} value="Cream">
                            Kem
                          </option>
                          <option style={{ color: "black" }} value="Yellow">
                            Vàng
                          </option>
                          <option style={{ color: "black" }} value="Colorful">
                            Nhiều màu
                          </option>
                          <option style={{ color: "black" }} value="Sand">
                            Cát
                          </option>
                          <option style={{ color: "black" }} value="gray">
                            Xám
                          </option>
                          <option style={{ color: "black" }} value="Red">
                            Đỏ
                          </option>
                          <option style={{ color: "black" }} value="Silver">
                            Bạc
                          </option>
                          <option style={{ color: "black" }} value="Green">
                            Xanh
                          </option>
                          <option style={{ color: "black" }} value="Orange">
                            Cam
                          </option>
                          <option style={{ color: "black" }} value="Copper">
                            Đồng
                          </option>
                          <option style={{ color: "black" }} value="Pink">
                            Hồng
                          </option>
                          <option style={{ color: "black" }} value="Copper">
                            Tím
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="Different color"
                          >
                            Màu khác
                          </option>
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <select
                          className="input"
                          placeholder="Số cửa"
                          value={numDoor}
                          onChange={handleNumdoor}
                        >
                          <option value={"Số cửa"} style={{ color: "black" }}>
                            Số cửa
                          </option>
                          <option style={{ color: "black" }} value={"5-door"}>
                            5
                          </option>
                          <option style={{ color: "black" }} value={"4-door"}>
                            4
                          </option>
                          <option style={{ color: "black" }} value={"2-door"}>
                            2
                          </option>
                          <option style={{ color: "black" }} value={"0-door"}>
                            0
                          </option>
                          <option style={{ color: "black" }} value={"Other"}>
                            other
                          </option>
                          <option style={{ color: "black" }} value={"3-door"}>
                            3
                          </option>
                          ""
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4">
                        <select
                          className="input"
                          placeholder="Số chỗ ngồi"
                          value={numSeat}
                          onChange={handleNumseat}
                        >
                          <option
                            value={"Số chỗ ngồi"}
                            style={{ color: "black" }}
                          >
                            Số chỗ ngồi
                          </option>
                          <option style={{ color: "black" }} value={"7-seat"}>
                            7
                          </option>
                          <option style={{ color: "black" }} value={"5-seat"}>
                            5
                          </option>
                          <option style={{ color: "black" }} value={"4-seat"}>
                            4
                          </option>
                          <option style={{ color: "black" }} value={"8-seat"}>
                            8
                          </option>
                          <option style={{ color: "black" }} value={"2-seat"}>
                            2
                          </option>
                          <option style={{ color: "black" }} value={"16-seat"}>
                            16
                          </option>
                          <option style={{ color: "black" }} value={"3-seat"}>
                            3
                          </option>
                          <option style={{ color: "black" }} value={"0-seat"}>
                            0
                          </option>
                          <option style={{ color: "black" }} value={"6-seat"}>
                            6
                          </option>
                          <option style={{ color: "black" }} value={"Other"}>
                            Khác
                          </option>
                          <option style={{ color: "black" }} value={"10-seat"}>
                            10
                          </option>
                          <option style={{ color: "black" }} value={"9-seat"}>
                            9
                          </option>
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <select
                          className="input"
                          placeholder="Động cơ"
                          value={engine}
                          onChange={handleEngine}
                        >
                          <option value="Động cơ" style={{ color: "black" }}>
                            Động cơ
                          </option>
                          <option style={{ color: "black" }} value="Petrol">
                            Xăng
                          </option>
                          <option style={{ color: "black" }} value="Diesel">
                            Dầu
                          </option>
                          <option style={{ color: "black" }} value="Hybrid">
                            Hybrid
                          </option>
                          <option style={{ color: "black" }} value="Electric">
                            Hybrid
                          </option>
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <select
                          className="input"
                          placeholder="Dung tích"
                          value={capacity}
                          onChange={handleCapacity}
                        >
                          <option value="Dung tích" style={{ color: "black" }}>
                            Dung tích
                          </option>
                          <option style={{ color: "black" }} value="2.8 L">
                            1.0
                          </option>
                          <option style={{ color: "black" }} value={"3.4 L"}>
                            3.4
                          </option>
                          <option style={{ color: "black" }} value={"2.0 L"}>
                            2.0
                          </option>
                          <option style={{ color: "black" }} value={"1.8 L"}>
                            1.8
                          </option>
                          <option style={{ color: "black" }} value={"2.5 L"}>
                            2.5
                          </option>
                          <option style={{ color: "black" }} value={"1.5 L"}>
                            1.5
                          </option>
                          <option style={{ color: "black" }} value={"2.7 L"}>
                            2.7
                          </option>
                          <option style={{ color: "black" }} value={"2.2 L"}>
                            2.2
                          </option>
                          <option style={{ color: "black" }} value={"1.25 L"}>
                            1.25
                          </option>
                          <option style={{ color: "black" }} value={"11.1 L"}>
                            11.1
                          </option>
                          <option style={{ color: "black" }} value={"3.5 L"}>
                            3.5
                          </option>
                          <option style={{ color: "black" }} value={"2.8 L"}>
                            2.8
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-8">
                        <select
                          className="input"
                          placeholder="Dẫn động"
                          value={drivetype}
                          onChange={handleDriveType}
                        >
                          <option value="Dẫn động" style={{ color: "black" }}>
                            Dẫn động
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="RFD - Rear-wheel drive"
                          >
                            RFD - Dẫn động cầu sau
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="AWD - 4-wheel drive (AWD)"
                          >
                            AWD - 4 bánh toàn thời gian
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="FWD - Front-wheel drive"
                          >
                            FWD - Dẫn động cầu trước
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="4WD - Four-wheel drive (4WD)"
                          >
                            4WD - Dẫn động 4 bánh
                          </option>
                          <option
                            style={{ color: "black" }}
                            value="AWD - 4-wheel drive (AWD)"
                          >
                            4WD hoặc AWD
                          </option>
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <input
                          onChange={handleConsumption}
                          className="input bienso"
                          type="text"
                          value={consumption ? consumption : ""}
                          placeholder="Tiêu thụ nhiên liệu"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: "20px",
                  marginTop: "20px",
                  marginLeft: "20px",
                }}
              >
                <button className="bttn-search" style={{ marginTop: "10px" }}>
                  Tham khảo giá
                </button>
                <button onClick={resetAI} className="hoantac">
                  Hoàn Tác
                </button>
              </div>
            </form>
          </div>
          <div
            className="col-lg-6 container"
            style={{
              width: "600px",
              gap: "0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="ai-result">
              {predictPrice > 0 ? (
                <div className="container ai-result-price">
                  {/* <h1 style={{ color: "black" }}>Giá dự đoán được: </h1>
                  <h1 style={{ color: "black", verticalAlign: "bottom" }}>
                    {predictPrice}
                  </h1> */}
                  <div className="container pt-4">
                    <div className="row">
                      <h4 className="col-lg-5">Giá trị ước tính</h4>
                      <p
                        style={{
                          fontSize: "16px",
                          fontFamily: "revert-layer",
                          color: "black",
                        }}
                        className="col-lg-7"
                      >
                        Tổng hợp từ hơn 30.000 nguồn dữ liệu
                      </p>
                    </div>
                  </div>
                  <div className="container p-5">
                    <div
                      className="row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img style={{ width: "250px" }} src={carImage} alt="" />
                    </div>
                  </div>
                  <div className="container ai-finally-result mt-2 p-3">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <DiCodepen
                        style={{
                          width: "40px",
                          height: "30px",
                          marginTop: "-13px",
                        }}
                      />
                      <p style={{ fontSize: "18px", fontWeight: "bolder" }}>
                        AI phân tích
                      </p>
                    </div>
                    <div className="result-price">
                      <p style={{ fontSize: "15px" }}>Giá dự đoán</p>
                      <h1>{convertToVND(predictPrice)}</h1>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ margin: "0", padding: "0" }}>
                  <img src={plate} style={{ width: "400px" }} />
                </div>
              )}
            </div>
          </div>

          {/* here */}
        </div>
      </div>
      {findCar ? <VehicleByType plates={findCar} /> : <></>}
      {findCarName ? <VehicleByType names={findCarName} /> : <></>}
    </div>
  );
};

export default FindCar;
