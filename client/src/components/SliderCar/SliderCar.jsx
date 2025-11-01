import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SliderCar.css";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Pagination } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import CarCard from "../CarCard/CarCard";
const SliderCar = ({ vehicles }) => {
  const navigate = useNavigate();
  const handleSlideClick = (plate) => {
    navigate(`/detail/${plate}`);
    window.scrollTo(0, 0);
  };
  const car = vehicles;
  const carSlides = car?.map((car, index) => (
    <SwiperSlide
      style={{ height: "500px" }}
      // style={{ width: 400, margin: "0 10px" }}
      onClick={() => handleSlideClick(car?.plates)}
      key={index}
      // className="card"
    >
      <CarCard
        data={{
          img: car?.image[0],
          address: car?.address,
          type: car?.type,
          name: car?.name,
          engine: car?.engine,
          plate: car?.plates,
        }}
      />
      {/* <img className="display-image" src={car?.image[0]} alt="vehicle" />
      <h2>{car?.name}</h2>
      <p>Engine: {car?.engine}</p> */}
    </SwiperSlide>
  ));
  return (
    <div className=" py-4">
      <Swiper
        freeMode={true}
        // grabCursor={true}
        effect="fade"
        className="mySwiper"
        slidesPerView={5}
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        autoplay={{
          delay: 5000, // Delay between slides in milliseconds (adjust as needed)
          disableOnInteraction: false, // Keep autoplay running even after user interaction
          stopOnLastSlide: false, // Continue autoplay in loop even after reaching the last slide
          waitForTransition: true, // Wait for slide transition to complete before starting autoplay
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {carSlides}
      </Swiper>
    </div>
  );
};

export default SliderCar;
