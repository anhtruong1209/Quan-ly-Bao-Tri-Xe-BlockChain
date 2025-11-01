import React, { useState, useRef, useEffect } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Contract from "../Contract/Contract";
import "./Vehicle.css";
import InputComponent from "../../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../../utils";
import { WrapperHeader, WrapperUploadFile } from "./style";
import * as message from "../../../components/Message/Message";
import TableComponent from "../../TableComponent/TableComponent";
import Loading from "../../../components/LoadingComponent/Loading";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import * as VehicleService from "../../../services/VehicleService";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import {
  Button,
  Form,
  Modal,
  Select,
  Row,
  Col,
  InputNumber,
  Space,
  DatePicker,
  Input,
} from "antd";
const Vehicle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [rowSelected, setRowSelected] = useState("");
  const [form] = Form.useForm();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenDrawer2, setIsOpenDrawer2] = useState(false);
  const [imageCloud, setImageCloud] = useState([]);
  const searchInput = useRef(null);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAccidentOpen, setIsAccidentOpen] = useState(false);
  const [isSoldOpen, setIsSoldOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingUp, setIsLoadingUp] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [image, setImage] = useState([]);
  const user = useSelector((state) => state?.user);
  const getAllVehicle = async () => {
    const res = await VehicleService.getAllVehicle();
    return res;
  };
  const querryVehicle = useQuery({
    queryKey: ["vehicles"],
    queryFn: getAllVehicle,
  });
  console.log("Call querry: ", querryVehicle);
  const { isLoading: isLoadingVehicles, data: vehicles } = querryVehicle;
  // console.log("Data ben Vehicle: ", vehicles);
  const inittial = () => ({
    name: "", //
    image: [],
    identifynumber: "", //
    dated: "", //
    email: "", //
    phone: "", //
    address: "", //
    plates: "", //
    bill: "", //
    tax: "", //
    seri: "", //
    license: "", //
    fuel: "", //
    color: "", //
    newColor: "", //
    rolling: "", //
    gear: "", //
    engine: "", //
    frame: "", //
    type: "", //
    newType: "",
    brand: "", //
    description: "", //
  });
  const [stateVehicleDetail, setStateVehicleDetail] = useState(inittial());
  const handleOnchange = (e) => {
    // console.log("E target: ", e.target.name);
    setStateVehicle({
      ...stateVehicle,
      [e.target.name]: e.target.value,
    });
  };
  const fetchAllTypeProduct = async () => {
    const res = await VehicleService.getAllTypeVehicle();
    return res;
  };
  const fetchAllColor = async () => {
    const res = await VehicleService.getAllColor();
    return res;
  };
  const typeOfFuel = ["Xăng", "Dầu", "Điện"];
  const typeOfGear = [
    "Hộp số sàn",
    "Hộp số tự động",
    "Hộp số tự động vô cấp CVT",
    "Hộp số ly hợp kép DCT",
  ];
  const renderOptionsOther = (arr) => {
    let results = [];
    if (arr) {
      results = arr?.map((opt) => {
        return {
          value: opt,
          label: opt,
        };
      });
    }
    return results;
  };
  const fetchGetDetailsVehicle = async (rowSelected) => {
    const res = await VehicleService.getDetailsVehicle(rowSelected);
    if (res?.data) {
      // console.log("Name res: ", res?.data?.name);
      setStateVehicleDetail({
        name: res?.data?.name, //
        identifynumber: res?.data?.identifynumber, //
        fuel: res?.data.fuel, //
        gear: res?.data.gear,
        color: res?.data.color,
        rolling: res?.data.rolling,
        dated: res?.data?.dated, //
        email: res?.data?.email, //
        phone: res?.data?.phone, //
        address: res?.data?.address, //
        plates: res?.data?.plates, //
        image: res?.data.image,
        bill: res?.data?.bill, //
        tax: res?.data?.tax, //
        seri: res?.data?.seri, //
        license: res?.data?.license, //
        engine: res?.data?.engine, //
        frame: res?.data?.frame, //
        type: res?.data?.type, //
        // newType: res?.data?.newType,
        brand: res?.data?.brand, //
        description: res?.data?.description,
      });
    }
    // console.log("Image là: ", res?.data?.image);
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateVehicleDetail);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateVehicleDetail, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsVehicle(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const typeProduct = useQuery({
    queryKey: ["type-vehicle"],
    queryFn: fetchAllTypeProduct,
  });
  const colorCar = useQuery({
    queryKey: ["color-vehicle"],
    queryFn: fetchAllColor,
  });
  // const dataDetails = useQuery({
  //   queryKey: ["data-detail"],
  //   queryFn: fetchDetail,
  // });

  const handleChangeSelect = (value) => {
    if (isModalOpen)
      setStateVehicle({
        ...stateVehicle,
        type: value,
      });
    else
      setStateVehicleDetail({
        ...stateVehicleDetail,
        type: value,
      });
    // console.log("State vehicle type : ", stateVehicle.type);
  };
  const handleChangeSelectColor = (value) => {
    // console.log("Vô được handle change selcet color");
    if (isModalOpen)
      setStateVehicle({
        ...stateVehicle,
        color: value,
      });
    else
      setStateVehicleDetail({
        ...stateVehicleDetail,
        color: value,
      });
    // console.log("Vô được handle change selcet color value là: ", value);

    // console.log("State vehicle type : ", stateVehicle.type);
  };
  const handleChangeSelectFuel = (value) => {
    if (isModalOpen)
      setStateVehicle({
        ...stateVehicle,
        fuel: value,
      });
    else
      setStateVehicleDetail({
        ...stateVehicleDetail,
        fuel: value,
      });
    // console.log("State vehicle type : ", stateVehicle.type);
  };
  const handleChangeSelectGear = (value) => {
    if (isModalOpen)
      setStateVehicle({
        ...stateVehicle,
        gear: value,
      });
    else
      setStateVehicleDetail({
        ...stateVehicleDetail,
        gear: value,
      });
    // console.log("State vehicle type : ", stateVehicle.type);
  };
  const [stateVehicle, setStateVehicle] = useState(inittial());
  const mutationUpdate = useMutationHooks((data) => {
    // console.log("Voo duoc mutation update")
    const { id, token, ...rests } = data;
    const res = VehicleService.updateVehicle(id, token, { ...rests });
    return res;
  });
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };
  const renderHistory = () => {
    return (
      <div>
        <HistoryOutlined
          style={{ color: "blue", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct2}
        />
      </div>
    );
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateVehicleDetail({
      ...stateVehicleDetail,
      image: file.preview,
    });
  };
  const columns = [
    {
      title: "Biển số xe",
      dataIndex: "plates",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("plates"),
    },
    {
      title: "Tên xe",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại xe",
      dataIndex: "type",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("type"),
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "action",
      render: renderAction,
    },
    {
      title: "Lịch sử",
      dataIndex: "history",
      render: renderHistory,
    },
  ];
  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = VehicleService.deleteVehicle(id, token);
    return res;
  });
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const onUpdateVehicle = async (values) => {
    console.log("Vô được update và id là: ", rowSelected);
    // console.log("Statevehicle là : ", ...stateVehicleDetail)
    // console.log("Image bên updateVehicle là : ", stateVehicleDetail?.image);
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateVehicleDetail },
      {
        onSettled: () => {
          querryVehicle.refetch();
        },
      }
    );
    // try {
    //   const data = await mutationUpdate.mutateAsync(values);
    //   setImage([]);
    //   if (
    //     data?.status === "OK" &&
    //     data?.message === "Vehicle created successfully"
    //   ) {
    //     handleCancel();
    //     messageSuccess(alertMessages.productCreated);

    //     querryVehicle.refetch();
    //   }

    //   if (data?.status === "OK" && data?.message === "UPDATE PRODUCT SUCCESS") {
    //     handleCancel();
    //     messageSuccess(alertMessages.productUpdated);

    //     queryProduct.refetch();
    //   }
    // } catch (error) {
    //   console.error("Error creating Product:", error);
    // }
  };
  const handleCancel = () => {
    if (isHistoryOpen) setIsHistoryOpen(false);
    if (isAccidentOpen) setIsAccidentOpen(false);
    if (isSoldOpen) setIsSoldOpen(false);
    setIsModalOpen(false);
    setStateVehicle({
      name: "", //
      image: [],
      identifynumber: "", //
      gear: "",
      color: "",
      newColor: "",
      rolling: "",
      fuel: "",
      dated: "", //
      email: "", //
      phone: "", //
      address: "", //
      plates: "", //
      bill: "", //
      tax: "", //
      seri: "", //
      license: "", //
      engine: "", //
      frame: "", //
      type: "", //
      newType: "",
      brand: "", //
      description: "", //
    });
    form.resetFields();
  };
  const handleDetailsProduct = () => {
    // console.log("Vô được update và id là: ", rowSelected);
    setIsOpenDrawer(true);
  };
  const handleDetailsProduct2 = () => {
    // console.log("Vô được update và id là: ", rowSelected);
    setIsOpenDrawer2(true);
  };
  const handleDeleteVehicle = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          querryVehicle.refetch();
        },
      }
    );
  };
  const addImage = (newImage) => {
    if (isOpenDrawer) {
      setStateVehicleDetail((prevState) => ({
        ...prevState,
        image: [...prevState.image, newImage],
      }));
    } else {
      setStateVehicle((prevState) => ({
        ...prevState,
        image: [...prevState.image, newImage],
      }));
    }
  };
  const uploadPhoto = async (ev) => {
    try {
      // console.log("Vô được uploadphoto ");
      if (isModalOpen) {
        setIsLoadingUp(true);
      } else setIsLoadingUpdate(true);
      const files = ev.target.files;

      const CLOUD_NAME = "daa82uroz";
      const PRESET_NAME = "images-preset";
      const FOLDER_NAME = "warranty-website";
      const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("upload_preset", PRESET_NAME);
        formData.append("folder", FOLDER_NAME);
        formData.append("file", file);

        const response = await axios.post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data.secure_url;
      });
      const urls = await Promise.all(uploadPromises);
      console.log("Type of urls: ", typeof urls[0]);
      // addImage(urls[0]);
      form.setFieldValue({
        image: urls[0],
      });

      // const urlsString = urls.join(", "); // Thay ',' bằng dấu phân tách mà bạn muốn

      // console.log(urlsString); // In ra urlsString
      if (isOpenDrawer) {
        // console.log("Vo duoc is openDrawer");
        setStateVehicleDetail((prevState) => ({
          ...prevState,
          image: [...prevState.image, urls[0]],
        }));
        setIsLoadingUpdate(false);
      }
      if (isModalOpen) {
        // console.log("Vô được photo Is modal open");
        setStateVehicle((prevState) => ({
          ...prevState,
          image: [...prevState.image, urls[0]],
        }));
        setIsLoadingUp(false);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      // Thêm xử lý lỗi nếu cần
    }
  };
  const mutation = useMutationHooks(async (data) => {
    const {
      name,
      image,
      fuel,
      gear,
      color,
      rolling,
      identifynumber,
      dated,
      email,
      phone,
      address,
      plates,
      bill,
      tax,
      seri,
      license,
      engine,
      frame,
      type,
      brand,
      description,
    } = data;
    // console.log("Vo duoc mutation");
    const res = VehicleService.createVehicle({
      name,
      image,
      identifynumber,
      fuel,
      gear,
      color,
      rolling,
      dated,
      email,
      phone,
      address,
      plates,
      bill,
      tax,
      seri,
      license,
      engine,
      frame,
      type,
      brand,
      description,
    });

    return res;
  });
  const { data, isLoading, isSuccess, isError } = mutation;
  // console.log("Is success: ", isSuccess);

  const onFinish = async () => {
    console.log("Da vo duoc onfinish");
    setIsLoadingUp(true);
    const params = {
      name: stateVehicle.name,
      identifynumber: stateVehicle.identifynumber,
      fuel: stateVehicle?.fuel,
      gear: stateVehicle?.gear,
      rolling: stateVehicle?.rolling,
      color:
        stateVehicle.color === "add_option"
          ? stateVehicle.newColor
          : stateVehicle.color,
      dated: stateVehicle.dated,
      email: stateVehicle.email,
      image: stateVehicle.image,
      phone: stateVehicle.phone,
      address: stateVehicle.address,
      plates: stateVehicle.plates,
      bill: stateVehicle.bill,
      tax: stateVehicle.tax,
      seri: stateVehicle.seri,
      license: stateVehicle.license,
      engine: stateVehicle.engine,
      frame: stateVehicle.frame,
      type:
        stateVehicle.type === "add_option"
          ? stateVehicle.newType
          : stateVehicle.type,
      brand: stateVehicle.brand,
      description: stateVehicle.description,
    };
    try {
      // console.log("Vo dc try");
      mutation.mutate(params, {
        onSettled: () => {
          querryVehicle.refetch();
        },
      });
      setIsLoadingUp(false);
    } catch (error) {
      console.log("ERRORR chỗ onFinish: ", error);
    }
  };
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateVehicleDetail({
      name: "", //
      identifynumber: "", //
      image: [],
      fuel: "",
      gear: "",
      rolling: "",
      color: "",
      newColor: "",
      dated: "", //
      email: "", //
      phone: "", //
      address: "", //
      plates: "", //
      bill: "", //
      tax: "", //
      seri: "", //
      license: "", //
      engine: "", //
      frame: "", //
      type: "", //
      newType: "",
      brand: "", //
      description: "", //
    });
    form.resetFields();
  };
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);
  // console.log("data res: ", data?.status);
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);
  const dataTable =
    vehicles?.data?.length &&
    vehicles?.data?.map((vehicle) => {
      return { ...vehicle, key: vehicle._id };
    });
  // console.log("is Success delete: ", isSuccessDelected);
  useEffect(() => {
    if (isSuccessDelected) {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  const handleOnchangeDetails = (e) => {
    setStateVehicleDetail({
      ...stateVehicleDetail,
      [e.target.name]: e.target.value,
    });
    if (
      stateVehicleDetail.color === "add_option" &&
      stateVehicleDetail.newColor
    )
      setStateVehicleDetail({
        ...stateVehicleDetail,
        color: stateVehicleDetail.newColor,
      });
  };
  const handleOnchangeDetailsImage = (e) => {
    if (isOpenDrawer) {
      console.log("Vo duoc is OpenDrawer");
      setStateVehicleDetail((prevState) => ({
        ...prevState,
        image: [...prevState.image, e.target.value],
      }));
    } else {
      setStateVehicle((prevState) => ({
        ...prevState,
        image: [...prevState.image, e.target.value],
      }));
    }
  };

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "70px",
            width: "70px",
            borderRadius: "6px",
            borderStyle: "solid",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "20px" }} />
        </Button>
        <div style={{ marginTop: "20px" }}>
          <TableComponent
            // handleDelteMany={handleDelteManyProducts}
            columns={columns}
            data={dataTable}
            isLoading={isLoadingVehicles}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  // console.log("Row id selected: ", record._id);
                  setRowSelected(record._id);
                },
              };
            }}
          />
        </div>
        <Modal
          title="Thêm mới super idol car"
          open={isModalOpen}
          width={800}
          onCancel={handleCancel}
        >
          <Loading isLoading={isLoadingUp}>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={onFinish}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Tên xe"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <InputComponent
                  value={stateVehicle.name}
                  onChange={handleOnchange}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="Hình ảnh"
                name="image"
                // rules={[{ required: true, message: "Chọn hình ảnh!" }]}
              >
                <div>
                  <InputComponent
                    // value={stateVehicle.name}
                    onChange={(ev) => {
                      uploadPhoto(ev);
                      // handleOnchange;
                    }}
                    type="file"
                    multiple
                  />
                  <div className="pre_photos">
                    {image &&
                      image.map((photo, index) => (
                        <img
                          style={{ height: "50px" }}
                          key={index}
                          src={photo}
                          alt=""
                        />
                      ))}
                  </div>
                </div>
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Cccd"
                    name="identifynumber"
                    rules={[
                      {
                        required: true,
                        message: "Please input your identifynumber!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.identifynumber}
                      onChange={handleOnchange}
                      name="identifynumber"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Giấy phép"
                    name="license"
                    rules={[
                      {
                        required: true,
                        message: "Please input your license!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.license}
                      onChange={handleOnchange}
                      name="license"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Sđt"
                    name="phone"
                    rules={[
                      { required: true, message: "Please input your phone!" },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.phone}
                      onChange={handleOnchange}
                      name="phone"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count email!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.email}
                      onChange={handleOnchange}
                      name="email"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Nhiên liệu"
                    name="fuel"
                    rules={[
                      {
                        required: true,
                        message: "Please input your fuel!",
                      },
                    ]}
                  >
                    <Select
                      name="fuel"
                      // defaultValue="lucy"
                      // style={{ width: 120 }}
                      value={stateVehicle.fuel}
                      onChange={handleChangeSelectFuel}
                      options={renderOptionsOther(typeOfFuel)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Cần số"
                    name="gear"
                    rules={[
                      {
                        required: true,
                        message: "Please input your gear!",
                      },
                    ]}
                  >
                    <Select
                      name="gear"
                      // defaultValue="lucy"
                      // style={{ width: 120 }}
                      value={stateVehicle.gear}
                      onChange={handleChangeSelectGear}
                      options={renderOptionsOther(typeOfGear)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Màu xe"
                    name="color"
                    rules={[
                      { required: true, message: "Please input your color!" },
                    ]}
                  >
                    <Select
                      name="color"
                      // defaultValue="lucy"
                      // style={{ width: 120 }}
                      value={stateVehicle.color}
                      onChange={handleChangeSelectColor}
                      options={renderOptions(colorCar?.data?.data)}
                    />
                  </Form.Item>
                  {/* {console.log("color: ", colorCar?.data?.data)} */}
                  {/* {console.log(
                    "Vô được handle change selcet color value là: ",
                    stateVehicle.color
                  )} */}
                  {stateVehicle.color == "add_option" && (
                    <Form.Item
                      label="Thêm màu"
                      name="newColor"
                      rules={[
                        {
                          required: true,
                          message: "Please input your newColor!",
                        },
                      ]}
                    >
                      <InputComponent
                        name="newColor"
                        // defaultValue="lucy"
                        // style={{ width: 120 }}
                        value={stateVehicle.newColor}
                        onChange={handleOnchange}
                      />
                    </Form.Item>
                  )}
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Lăn bánh"
                    name="rolling"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count rolling!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.rolling}
                      onChange={handleOnchange}
                      name="rolling"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Type"
                    name="type"
                    rules={[
                      { required: true, message: "Please input your type!" },
                    ]}
                  >
                    <Select
                      name="type"
                      // defaultValue="lucy"
                      // style={{ width: 120 }}
                      value={stateVehicle.type}
                      onChange={handleChangeSelect}
                      options={renderOptions(typeProduct?.data?.data)}
                    />
                  </Form.Item>
                  {stateVehicle.type == "add_option" && (
                    <Form.Item
                      label="New type"
                      name="newType"
                      rules={[
                        {
                          required: true,
                          message: "Please input your newType!",
                        },
                      ]}
                    >
                      <InputComponent
                        name="newType"
                        // defaultValue="lucy"
                        // style={{ width: 120 }}
                        value={stateVehicle.newType}
                        onChange={handleOnchange}
                      />
                    </Form.Item>
                  )}
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count address!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.address}
                      onChange={handleOnchange}
                      name="address"
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row gutter={[16, 16]}>
              <Col span={12}></Col>
              <Col span={12}></Col>
              </Row> */}
              <Row gutter={[16, 16]}>
                {" "}
                {/* gutter là khoảng cách giữa các cột */}
                <Col span={12}>
                  <Form.Item
                    label="Bill"
                    name="bill"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count bill!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.bill}
                      onChange={handleOnchange}
                      name="bill"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nhãn hàng"
                    name="brand"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count brand!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.brand}
                      onChange={handleOnchange}
                      name="brand"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Biển số xe"
                    name="plates"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count plates!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.plates}
                      onChange={handleOnchange}
                      name="plates"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Động cơ"
                    name="engine"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count engine!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.engine}
                      onChange={handleOnchange}
                      name="engine"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Mã số thuế"
                    name="tax"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count tax!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.tax}
                      onChange={handleOnchange}
                      name="tax"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Seri"
                    name="seri"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count seri!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.seri}
                      onChange={handleOnchange}
                      name="seri"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Ngày kí"
                    name="dated"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count dated!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.dated}
                      onChange={handleOnchange}
                      name="dated"
                      // format="DD/MM/YYYY" // Định dạng ngày tháng năm
                      placeholder="Select date"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số khung"
                    name="frame"
                    rules={[
                      {
                        required: true,
                        message: "Please input your count frame!",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicle.frame}
                      onChange={handleOnchange}
                      name="frame"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea
                  value={stateVehicle.description}
                  onChange={handleOnchange}
                  name="description"
                />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button
                  style={{ backgroundColor: "blue" }}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </Modal>
        <DrawerComponent
          title="Chi tiết sản phẩm"
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          width="90%"
        >
          <Loading isLoading={isLoadingUpdate}>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={onUpdateVehicle}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Tên xe"
                name="name"
                // rules={[{ required: true, message: "Please input your name!" }]}
              >
                <InputComponent
                  value={stateVehicleDetail.name}
                  // defaultValue={stateVehicleDetail.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Cccd"
                    name="identifynumber"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your identifynumber!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.identifynumber}
                      onChange={handleOnchangeDetails}
                      name="identifynumber"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Giấy phép"
                    name="license"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your license!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.license}
                      onChange={handleOnchangeDetails}
                      name="license"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Sđt"
                    name="phone"
                    // rules={[
                    //   { required: true, message: "Please input your phone!" },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.phone}
                      onChange={handleOnchangeDetails}
                      name="phone"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count email!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.email}
                      onChange={handleOnchangeDetails}
                      name="email"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Mẫu xe"
                    name="type"
                    rules={[
                      { required: true, message: "Please input your type!" },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.type}
                      onChange={handleOnchangeDetails}
                      name="type"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count address!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.address}
                      onChange={handleOnchangeDetails}
                      name="address"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Nhiên liệu"
                    name="fuel"
                    rules={[
                      {
                        required: true,
                        message: "Please input your fuel!",
                      },
                    ]}
                  >
                    <Select
                      name="fuel"
                      // defaultValue="lucy"
                      // style={{ width: 120 }}
                      value={stateVehicleDetail.fuel}
                      onChange={handleChangeSelectFuel}
                      options={renderOptionsOther(typeOfFuel)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Màu xe"
                    name="color"
                    rules={[
                      { required: true, message: "Please input your color!" },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.color}
                      onChange={handleOnchangeDetails}
                      name="color"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Cần số"
                    name="gear"
                    rules={[
                      {
                        required: true,
                        message: "Please input your gear!",
                      },
                    ]}
                  >
                    <Select
                      name="gear"
                      // defaultValue="lucy"
                      // style={{ width: 120 }}
                      value={stateVehicleDetail.gear}
                      onChange={handleChangeSelectGear}
                      options={renderOptionsOther(typeOfGear)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Lăn bánh"
                    name="rolling"
                    rules={[
                      { required: true, message: "Please input your rolling!" },
                    ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.rolling}
                      onChange={handleOnchangeDetails}
                      name="rolling"
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row gutter={[16, 16]}>
              <Col span={12}></Col>
              <Col span={12}></Col>
              </Row> */}
              <Row gutter={[16, 16]}>
                {" "}
                {/* gutter là khoảng cách giữa các cột */}
                <Col span={12}>
                  <Form.Item
                    label="Bill"
                    name="bill"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count bill!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.bill}
                      onChange={handleOnchangeDetails}
                      name="bill"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nhãn hàng"
                    name="brand"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count brand!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.brand}
                      onChange={handleOnchangeDetails}
                      name="brand"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Biển số xe"
                    name="plates"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count plates!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.plates}
                      onChange={handleOnchangeDetails}
                      name="plates"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Động cơ"
                    name="engine"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count engine!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.engine}
                      onChange={handleOnchangeDetails}
                      name="engine"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Thuế"
                    name="tax"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count tax!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.tax}
                      // defaultValue={stateVehicleDetail.tax}
                      onChange={handleOnchangeDetails}
                      name="tax"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Seri"
                    name="seri"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count seri!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.seri}
                      // defaultValue={stateVehicle.seri}
                      onChange={handleOnchangeDetails}
                      name="seri"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Ngày kí"
                    name="dated"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count dated!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.dated}
                      onChange={handleOnchangeDetails}
                      name="dated"
                      // format="DD/MM/YYYY" // Định dạng ngày tháng năm
                      placeholder="Select date"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số khung"
                    name="frame"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please input your count frame!",
                    //   },
                    // ]}
                  >
                    <InputComponent
                      value={stateVehicleDetail.frame}
                      placeholder={stateVehicle.frame}
                      onChange={handleOnchangeDetails}
                      name="frame"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea
                  value={stateVehicleDetail.description}
                  onChange={handleOnchangeDetails}
                  name="description"
                />
              </Form.Item>
              <Form.Item
                label="Image"
                name="image"
                // rules={[
                //   { required: true, message: "Please input your count image!" },
                // ]}
              >
                <div>
                  <InputComponent
                    // value={stateVehicleDetail.image}
                    onChange={(ev) => {
                      uploadPhoto(ev);
                      // handleOnchangeDetailsImage;
                    }}
                    type="file"
                    multiple
                  />
                  <div>
                    {/* {console.log("Image data: ", stateVehicleDetail?.image)}
                    {console.log(
                      "Type of image data: ",
                      typeof stateVehicleDetail?.image
                    )} */}
                    {stateVehicleDetail?.image[0] && (
                      <img
                        style={{ height: "50px" }}
                        key={1}
                        src={stateVehicleDetail?.image[2]}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                {/* <WrapperUploadFile
                  onChange={(ev) => uploadPhoto(ev)}
                  maxCount={1}
                >
                  <Button>Select File</Button>
                  {stateVehicleDetail?.image && (
                    <img
                      src={stateVehicleDetail?.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </WrapperUploadFile> */}
              </Form.Item>
              {/* <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item> */}
              <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button
                  style={{ backgroundColor: "blue" }}
                  type="primary"
                  htmlType="submit"
                >
                  Apply
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>
        <Contract
          isOpenDrawer2={isOpenDrawer2}
          handleOnclose={() => setIsOpenDrawer2(false)}
          HistoryOpen={() => setIsHistoryOpen(true)}
          AccidentOpen={() => setIsAccidentOpen(true)}
          SoldOpen={() => setIsSoldOpen(true)}
          isHistoryOpen={isHistoryOpen}
          isAccidentOpen={isAccidentOpen}
          isSoldOpen={isSoldOpen}
          handleCancel={handleCancel}
          rowSelected={rowSelected}
          form={form}
        />
        <Modal
          title="Xóa sản phẩm"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteVehicle}
          okButtonProps={{ style: { backgroundColor: "blue" } }}
        >
          <Loading isLoading={false}>
            <div>Bạn có chắc xóa sản phẩm này không?</div>
          </Loading>
        </Modal>
      </div>
    </div>
  );
};

export default Vehicle;
