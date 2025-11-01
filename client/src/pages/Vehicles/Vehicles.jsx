import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import * as VehicleServices from "../../services/VehicleService";
import CarCard from "../../components/CarCard/CarCard";
import Loading from "../../components/LoadingComponent/Loading";

const Vehicles = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(6);

  const handleSlideClick = (plate) => {
    navigate(`/detail/${plate}`);
    window.scrollTo(0, 0);
  };

  const fetchAll = async (limit) => {
    setLoading(true);
    try {
      const res = await VehicleServices.getAllVehicle("", limit);
      const total = await VehicleServices.getAllVehicle("", 0);
      if (res?.status === "OK" && total?.status === "OK") {
        setVehicles((prev) => {
          const newItems = res?.data.filter(
            (item) => !prev.some((p) => p._id === item._id)
          );
          return [...prev, ...newItems];
        });
        setHasMore(res?.data.length < total?.data.length);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setVehicles([]);
    setPage(6);
    setHasMore(true);
  }, []);

  useEffect(() => {
    if (hasMore) fetchAll(page);
  }, [page, hasMore]);

  const renderVehicle =
    vehicles?.length > 0 &&
    vehicles?.map((car) => (
      <div
        className="col-xl-4 col-lg-6 mt-5"
        key={car?._id}
        onClick={() => handleSlideClick(car?.plates)}
      >
        <CarCard
          data={{
            img: car?.image?.[0],
            address: car?.address,
            type: car?.type,
            name: car?.name,
            engine: car?.engine,
            plate: car?.plates,
          }}
        />
      </div>
    ));

  const handleLoadMore = () => {
    if (hasMore) setPage((p) => p + 6);
  };

  return (
    <Loading isLoading={loading}>
      <div style={{ marginTop: "100px" }}>
        <div className="container m-9">
          <div className="row mt-5">
            {vehicles?.length > 0 ? renderVehicle : <div>Chưa có dữ liệu xe</div>}
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
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default Vehicles;


