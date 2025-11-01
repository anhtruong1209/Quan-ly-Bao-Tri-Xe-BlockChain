import React, { useEffect, useState } from "react";
import "./DisplayContract.css";
import { ethers } from "ethers";
import Loading from "../LoadingComponent/Loading";
import { contractAddress, abi } from "../../constant/constant";
import {
  carTransactionHistoryAdress,
  carmaintenanceAdress,
  caraccidentAdress,
  carTransactionHistoryABI,
  carmaintenanceABI,
  caraccidentABI,
} from "../../../Constant/constant";
const DisplayContract = (props) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchCarsFromContract() {
    console.log("KeyID click: ", props.carId);
    // setLoading(false);
    if (props.type == "his") {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://eth-sepolia.g.alchemy.com/v2/MPMfIIQQw3C8j6ZPKtmlX-dBPCSE7rmU"
        );
        const contract = new ethers.Contract(
          carTransactionHistoryAdress,
          carTransactionHistoryABI,
          provider
        );

        const carArray = await contract.getTransactionsByCarID(props.carId);

        setCars(carArray);
        console.log("Car: ", cars);
      } catch (error) {
        console.error("Error fetching cars from contract:", error);
      }
    } else if (props.type == "mainte") {
      try {
        console.log("Vo duoc mainte");
        const provider = new ethers.providers.JsonRpcProvider(
          "https://eth-sepolia.g.alchemy.com/v2/MPMfIIQQw3C8j6ZPKtmlX-dBPCSE7rmU"
        );
        const contract = new ethers.Contract(
          carmaintenanceAdress,
          carmaintenanceABI,
          provider
        );
        const carArray = await contract.getMaintenanceHistoryByCarId(
          props.carId
        );
        setCars(carArray);
      } catch (error) {
        console.error("Error fetching cars from contract:", error);
      }
    } else if (props.type == "acci") {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://eth-sepolia.g.alchemy.com/v2/MPMfIIQQw3C8j6ZPKtmlX-dBPCSE7rmU"
        );
        const contract = new ethers.Contract(
          caraccidentAdress,
          caraccidentABI,
          provider
        );
        console.log(contract);
        const carArray = await contract.getAccidentFixHistoryByCarId(
          props.carId
        );
        setCars(carArray);
      } catch (error) {
        console.error("Error fetching cars from contract:", error);
      }
    }
    // setLoading(false);
  }

  useEffect(() => {
    fetchCarsFromContract();
  }, [props.type]);
  useEffect(() => {
    fetchCarsFromContract();
  }, []);

  useEffect(() => {
    setCars([]);
  }, [props.type]);

  useEffect(() => {
    setCars([]);
  }, [props.handleOnclose]);

  return (
    <div className="block-table-container">
      {/* <button
        onClick={fetchCarsFromContract}
        style={{ cursor: "pointer", borderRadius: "10px" }}
      >
        <p className="button-watch-custom">Watch</p>
      </button> */}
      <table className="block-table">
        <thead>
          {props.type == "his" && (
            <tr>
              <th>ID của xe</th>
              <th>Ngày tháng</th>
              <th>ID người mua</th>
              <th>ID người bán</th>
              <th>Giá</th>
              <th>Chữ ký người mua</th>
              <th>Chữ ký người bán</th>
              {/* Thêm các cột khác tùy theo yêu cầu */}
            </tr>
          )}
          {props.type == "mainte" && (
            <tr>
              <th>ID của xe</th>
              <th>Lăn bánh</th>
              <th>Loại bảo dưỡng</th>
              <th>Địa điểm</th>
              <th>Kết quả</th>
              {/* Thêm các cột khác tùy theo yêu cầu */}
            </tr>
          )}
          {props.type == "acci" && (
            <tr>
              <th>ID của xe</th>
              <th>Mô tả</th>
              <th>Sửa chữa</th>
              <th>Kết quả</th>
              {/* Thêm các cột khác tùy theo yêu cầu */}
            </tr>
          )}
        </thead>
        <tbody>
          {/* {console.log("Loai xuat: ", props.type)} */}

          {props.type == "his" &&
            (cars.length > 0 ? (
              cars.map((car, index) => (
                <tr key={index}>
                  <td style={{ color: "black" }}>{car.carId}</td>
                  <td style={{ color: "black" }}>{car.dateTransaction}</td>
                  <td style={{ color: "black" }}>{car.buyerId}</td>
                  <td style={{ color: "black" }}>{car.sellerId}</td>
                  <td style={{ color: "black" }}>{car.price}</td>
                  <td style={{ color: "black" }}>{car.signatureBuyer}</td>
                  <td style={{ color: "black" }}>{car.signatureSeller}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ color: "black" }} colSpan="5">
                  No cars available
                </td>
              </tr>
            ))}
          {/* {console.log("Loai xuat: ", props.type)} */}

          {props.type == "mainte" &&
            (cars.length > 0 ? (
              cars.map((car, index) => (
                <tr key={index}>
                  <td style={{ color: "black" }}>{car.carId}</td>
                  <td style={{ color: "black" }}>{car.totalKmRun}</td>
                  <td style={{ color: "black" }}>{car.typeOfMaintain}</td>
                  <td style={{ color: "black" }}>{car.placeMatintain}</td>
                  <td style={{ color: "black" }}>{car.result}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ color: "black" }} colSpan="5">
                  No cars available
                </td>
              </tr>
            ))}
          {/* {console.log("Loai xuat: ", props.type)} */}
          {props.type == "acci" &&
            (cars.length > 0 ? (
              cars.map((car, index) => (
                <tr key={index}>
                  <td style={{ color: "black" }}>{car.carId}</td>
                  <td style={{ color: "black" }}>{car.decribeAccident}</td>
                  <td style={{ color: "black" }}>{car.decribeFix}</td>
                  <td style={{ color: "black" }}>{car.result}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ color: "black" }} colSpan="5">
                  No cars available
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayContract;
