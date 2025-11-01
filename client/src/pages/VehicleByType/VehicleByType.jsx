import React, { useEffect, useState } from "react";
import { Col, Pagination, Row, Button } from "antd";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as VehicleServices from "../../services/VehicleService.js";
import { useQuery } from "@tanstack/react-query";
import CarCard from "../../components/CarCard/CarCard.jsx";
import Loading from "../../components/LoadingComponent/Loading.jsx";
import { Skeleton } from "antd";
const VehicleByType = (props) => {
  const { name } = useParams();
  console.log("Plates bên vehy: ", props.plates);
  // const [vehicles, setVehicles] = useState([])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(6);
  const handleSlideClick = (plate) => {
    navigate(`/detail/${plate}`);
    window.scrollTo(0, 0);
  };
  const KNOWN_BRANDS = [
    "Toyota","Honda","Hyundai","Kia","Mercedes","BMW","Audi","Porsche","VinFast","Ford","Mazda","Nissan","Mitsubishi","Lexus"
  ];
  const KNOWN_TYPES = [
    "SUV","Sedan","Hatchback","Crossover","Pickup","Coupe","MPV","Van"
  ];

  const pickFieldForName = (n) => {
    if (!n) return null;
    if (KNOWN_BRANDS.includes(n)) return "brand";
    if (KNOWN_TYPES.includes(n)) return "type";
    return "name";
  };

  const fetchVehicleAll = async (name, limit) => {
    setLoading(true);
    // const limit = 10;
    // try {
    //   const res = await VehicleServices.getAllVehicle(name, limit);
    //   // console.log("res ben homepage: ", res);
    //   if (res?.status === "OK") {
    //     setLoading(false);
    //     setVehicles(res);
    //   } else {
    //     setLoading(false);
    //   }
    // } catch (error) {
    //   setLoading(false);
    // }
    setLoading(true);
    try {
      let res;
      let total;
      if (props.plates) {
        res = await VehicleServices.getAllVehicleByPlates(name, limit);
        total = await VehicleServices.getAllVehicleByPlates(name, 0);
      } else {
        const field = pickFieldForName(name);
        if (field) {
          res = await VehicleServices.getVehiclesByField(field, name, 0, limit);
          total = await VehicleServices.getVehiclesByField(field, name, 0, 0);
        } else {
          res = await VehicleServices.getAllVehicle(name, limit);
          total = await VehicleServices.getAllVehicle(name, 0);
        }
      }
      if (res?.status === "OK" && total?.status === "OK") {
        setLoading(false);
        setVehicles((prevCars) => {
          const newCars = res?.data.filter(
            (newCar) =>
              !prevCars.some((carExists) => carExists._id === newCar._id)
          );
          return [...prevCars, ...newCars];
        });
        // console.log("Check: ", total?.data.length);
        setHasMore(res?.data.length < total?.data.length);
      } else {
        setLoading(false);
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      setLoading(false);
      // Handle error, e.g., show an error message
    }
  };
  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 6);
    }
  };
  // fetchVehicleAll;

  // useEffect(() => {
  //   console.log("Use parame là: ", name);
  //   fetchVehicleAll(name);
  // }, [name]);

  useEffect(() => {
    // console.log("Vehicles là: ", vehicles?.data);
  }, [vehicles]);

  const resetStateOnVehicleChange = () => {
    setVehicles([]);
    setPage(6);
    setHasMore(true);
  };

  useEffect(() => {
    resetStateOnVehicleChange();
  }, [name]);
  useEffect(() => {
    resetStateOnVehicleChange();
  }, [props.plates]);
  useEffect(() => {
    if (name && hasMore) {
      fetchVehicleAll(name, page);
    }
    if (props.plates && hasMore) {
      fetchVehicleAll(props.plates, page);
    }
    if (props.names && hasMore) {
      fetchVehicleAll(props.names, page);
    }
  }, [props.plates, props.names, name, page, hasMore]);

  const renderVehicle =
    vehicles?.length > 0 &&
    vehicles?.map((car, index) => (
      <div
        className="col-xl-4 col-lg-6 mt-5"
        onClick={() => handleSlideClick(car?.plates)}
      >
        {console.log("Vo duoc render Vehicle")}
        <CarCard
          data={{
            img: car?.image[0],
            address: car?.address,
            type: car?.type,
            name: car?.name,
            price: car?.price,
            engine: car?.engine,
            plate: car?.plates,
          }}
        />
      </div>
    ));
  return (
    // <Skeleton key={1} height={390} width={292.5} />
    <Loading isLoading={loading}>
      <div style={{ marginTop: "100px" }}>
        <div className="container m-9">
          <div className="row mt-5">
            {console.log("Vehicle data: ", vehicles)}
            {vehicles?.length > 0 ? (
              renderVehicle
            ) : (
              <div>Chưa có dữ liệu xe</div>
            )}
          </div>
          <div className="m-6">
            {hasMore && (
              <Button
                type="primary"
                title="Xem thêm"
                style={{ backgroundColor: "blue" }}
                className="button-load"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Xem thêm"}
              </Button>
            )}
            {!hasMore && <></>}
          </div>
          {console.log("Double check: ", hasMore)}
        </div>
      </div>
    </Loading>
  );
};

export default VehicleByType;
