import React, { useState } from "react";
import CustomButton from "../../components/CustomButtton";
import JobCard from "../../components/JobCard";
import { useForm } from "react-hook-form";
import JobTypes from "../../components/JobTypes";
import TextInput from "../../components/TextInput";
import { jobs } from "../../utils/data";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const [errMsg, setErrMsg] = useState("");
  const [jobTitle, setJobTitle] = useState("Full-Time");

  const onSubmit = async (data) => {};
  return (
    <div className="mx-auto flex flex-col md:flex-row gap-8 2xl:gap-14 bg-[#f7fdfd] px-5">
      <div className="w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md">
        <div>
          <p className="text-gray-500 font-semibold text-2xl">Đăng kiểm xe</p>

          <form
            className="w-full mt-2 flex flex-col gap-8"
            // onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="nameOwner"
              label="Họ và tên chủ xe"
              placeholder="Nguyễn Văn A"
              type="text"
              required={true}
              register={register("nameOwner", {
                required: "Điền đầy đủ họ tên",
              })}
              error={errors.nameOwner ? errors.nameOwner?.message : ""}
            />
            <p style={{ fontSize: "19px", fontWeight: "bold" }}>
              Nơi cư trú chủ xe
            </p>
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <TextInput
                  name="province"
                  label="Tỉnh/Thành"
                  placeholder="Hồ Chí Minh"
                  type="text"
                  required={true}
                  register={register("province", {
                    required: "Không được trổng Tỉnh/Thành",
                  })}
                  error={errors.province ? errors.province?.message : ""}
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  name="district"
                  label="Quận/Huyện"
                  placeholder="Quận 1"
                  type="text"
                  register={register("district", {
                    required: "Không được trổng Quận/Huyện",
                  })}
                  error={errors.district ? errors.district?.message : ""}
                />
              </div>
            </div>
            <TextInput
              name="detail"
              label="Chi tiết "
              placeholder="13/9 Xa lộ Hà Nội"
              type="text"
              required={true}
              register={register("detail", {
                required: "Điền đầy đủ thông tin địa chỉ",
              })}
              error={errors.detail ? errors.detail?.message : ""}
            />
            <TextInput
              name="identify"
              label="CCCD/CMND"
              placeholder="123456789"
              type="text"
              required={true}
              register={register("identify", {
                required: "Không được để trống cccd",
              })}
              error={errors.identify ? errors.identify?.message : ""}
            />
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <TextInput
                  name="daygiven"
                  label="Cấp ngày"
                  placeholder="20/01/2023"
                  type="Date"
                  required={true}
                  register={register("daygiven", {
                    required: "Không được trổng Tỉnh/Thành",
                  })}
                  error={errors.daygiven ? errors.daygiven?.message : ""}
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  name="where"
                  label="Nơi cấp"
                  placeholder="Quận 1"
                  type="text"
                  register={register("where", {
                    required: "Không được trống nơi cấp",
                  })}
                  error={errors.where ? errors.where?.message : ""}
                />
              </div>
            </div>
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <TextInput
                  name="phone"
                  label="Số điện thoại liên hệ"
                  placeholder="0987654321"
                  type="text"
                  required={true}
                  register={register("phone", {
                    required: "Không để trống sđt",
                  })}
                  error={errors.phone ? errors.phone?.message : ""}
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  name="email"
                  label="Email"
                  placeholder="hello@gmail.com"
                  type="text"
                />
              </div>
            </div>
            <p style={{ fontSize: "19px", fontWeight: "bold" }}>Thông tin xe</p>
            <TextInput
              name="plates"
              label="Biển số xe"
              placeholder="67-AH 3456"
              type="text"
              required={true}
              register={register("plates", {
                required: "Không được để trông biển số xe",
              })}
              error={errors.plates ? errors.plates?.message : ""}
            />
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <TextInput
                  name="bill"
                  label="Số hóa đơn điện tử"
                  placeholder="788778 vax"
                  type="text"
                  required={true}
                  register={register("bill", {
                    required: "Không được trổng số hóa đơn",
                  })}
                  error={errors.bill ? errors.bill?.message : ""}
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  name="tax"
                  label="Mã số thuế"
                  placeholder="67fg"
                  type="text"
                  register={register("tax", {
                    required: "Không được trổng mã số thuế",
                  })}
                  error={errors.tax ? errors.tax?.message : ""}
                />
              </div>
            </div>
            <TextInput
              name="seri"
              label="Số seri"
              placeholder="1111"
              type="text"
              required={true}
              register={register("seri", {
                required: "Điền đầy đủ thông tin số seri",
              })}
              error={errors.seri ? errors.seri?.message : ""}
            />
            <TextInput
              name="license"
              label="Số giấy phép kinh doanh vận tải"
              placeholder="123456789"
              type="text"
              required={true}
              register={register("license", {
                required: "Không được để trống số giấy phép kinh doanh",
              })}
              error={errors.license ? errors.license?.message : ""}
            />
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <TextInput
                  name="numberEngine"
                  label="Số máy"
                  placeholder="78"
                  type="text"
                  required={true}
                  register={register("numberEngine", {
                    required: "Không được trổng số máy",
                  })}
                  error={
                    errors.numberEngine ? errors.numberEngine?.message : ""
                  }
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  name="frame"
                  label="Số khung"
                  placeholder="77"
                  type="text"
                  register={register("frame", {
                    required: "Không được trống số khung",
                  })}
                  error={errors.frame ? errors.frame?.message : ""}
                />
              </div>
            </div>
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <TextInput
                  name="cartype"
                  label="Loại xe"
                  placeholder="sedan"
                  type="text"
                  required={true}
                  register={register("cartype", {
                    required: "Không để trống loại xe",
                  })}
                  error={errors.cartype ? errors.cartype?.message : ""}
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  name="color"
                  label="Màu sơn"
                  placeholder="xanh biển"
                  type="text"
                  required={true}
                  register={register("color", {
                    required: "Không để trống màu sơn",
                  })}
                  error={errors.color ? errors.color?.message : ""}
                />
              </div>
            </div>
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <TextInput
                  name="brand"
                  label="Nhãn hiệu"
                  placeholder="Honda"
                  type="text"
                  required={true}
                  register={register("brand", {
                    required: "Không để trống nhãn hiệu",
                  })}
                  error={errors.brand ? errors.brand?.message : ""}
                />
              </div>
              <div className="w-1/2">
                <TextInput
                  name="numberType"
                  label="Số loại"
                  placeholder="xanh biển"
                  type="text"
                  required={true}
                  register={register("numberType", {
                    required: "Không để trống số loại",
                  })}
                  error={errors.numberType ? errors.numberType?.message : ""}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Mô tả chủ xe</label>
              <textarea
                className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                rows={4}
                cols={6}
                aria-invalid={errors.desc ? "true" : "false"}
              ></textarea>
              {errors.desc && (
                <span role="alert" className="text-xs text-red-500 mt-0.5">
                  {errors.desc?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">Mô tả xe</label>
              <textarea
                className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                rows={4}
                cols={6}
              ></textarea>
            </div>

            {errMsg && (
              <span role="alert" className="text-sm text-red-500 mt-0.5">
                {errMsg}
              </span>
            )}
            <div className="mt-2">
              <CustomButton
                type="submit"
                containerStyles="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none "
                title="Đăng kí"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-full md:w-1/3 2xl:2/4 p-5 mt-20 md:mt-0">
        <p className="text-gray-500 font-semibold">Recent Job Post</p>

        <div className="w-full flex flex-wrap gap-6">
          {jobs.slice(0, 4).map((job, index) => {
            return <JobCard job={job} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Register;
