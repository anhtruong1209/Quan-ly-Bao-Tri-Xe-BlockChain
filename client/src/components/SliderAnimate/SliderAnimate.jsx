import React from "react";
import Slider from "react-slick";

import "./SliderAnimate.css";

import ava01 from "../../assets/slider-img/slide1.png";
import ava02 from "../../assets/slider-img/slide2.png";
import ava03 from "../../assets/slider-img/slide3.png";

const SliderAnimate = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div style={{ marginLeft: "130px", marginRight: "130px" }}>
      <Slider {...settings}>
        <div className="testimonial py-4 px-3">
          <p className="section__description">
            <h3 style={{ color: "blue" }}>Bước 1: Nhận giá xe online</h3>Ở đây
            hệ thống định giá xe trực tuyến tiên tiến, sử dụng trí tuệ nhân tạo
            (AI) để tự động đánh giá giá trị của một chiếc xe dựa trên các yếu
            tố như thương hiệu, mô hình, năm sản xuất và điều kiện. Hơn nữa,
            chúng tôi sử dụng công nghệ lưu trữ chuỗi khối để đảm bảo tính minh
            bạch và an toàn cho thông tin về giá cả và lịch sử của các giao dịch
            liên quan đến xe hơi.
          </p>
        </div>

        <div className="testimonial py-4 px-3">
          <p className="section__description">
            <h3 style={{ color: "blue" }}>Bước 2: Kiểm định xe</h3>
            Chúng tôi sử dụng các nguồn dữ liệu đáng tin cậy để lấy thông tin về
            các lần kiểm định, bảo dưỡng trước đó và các sửa chữa đã được thực
            hiện. Từ những thông tin này, chúng tôi có thể đánh giá mức độ bảo
            dưỡng và sửa chữa của xe, cũng như nhận biết các vấn đề tiềm ẩn hoặc
            cần chú ý.
          </p>
        </div>
        <div className="testimonial py-4 px-3">
          <p className="section__description">
            <h3 style={{ color: "blue" }}>Bước 3: Bàn giao xe và thanh toán</h3>
            Sau khi đã thu thập đủ thông tin và quyết định mua chiếc xe phù hợp,
            quá trình bàn giao xe và thanh toán sẽ diễn ra một cách thuận lợi và
            an toàn nhất cho cả người mua và người bán.
          </p>
        </div>
      </Slider>
    </div>
  );
};

export default SliderAnimate;
