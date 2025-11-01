import React, { useEffect, useState } from "react";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import Loading from "../../LoadingComponent/Loading";
import DisplayContract from "../../DisplayContract/DisplayContract";
import TextArea from "antd/es/input/TextArea";
import { ethers } from "ethers";
import "./Contract.css";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
import {
  carTransactionHistoryAdress,
  carmaintenanceAdress,
  caraccidentAdress,
  carTransactionHistoryABI,
  carmaintenanceABI,
  caraccidentABI,
} from "../../../../Constant/constant";
import InputComponent from "../../InputComponent/InputComponent";
import { FormProvider } from "antd/es/form/context";

const Contract = (props) => {
  console.log("Row select: ", props.rowSelected);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [contractInstance, setcontractInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectTable, setSelectTable] = useState("his");
  const [history, setHistory] = useState({
    carID: "", //
    date: "",
    buyerID: "", //
    sellerID: "", //
    price: "", //
    buyerSign: "", //
    sellerSign: "", //
  });
  const [maintenance, setMaintenance] = useState({
    carID: "",
    totalKmRun: "",
    typeOfMaintain: "",
    placeMatintain: "",
    result: "",
  });
  const [accidence, setAccidence] = useState({
    carID: "",
    decribeAccident: "",
    decribeFix: "",
    result: "",
  });

  const [contractHistory, setContractHistory] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [contractMaintenace, setContracMaintenance] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [contractAccidence, setContracAccidence] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const handleHistory = (e) => {
    // console.log("E target: ", e.target.name);
    setHistory({
      ...history,
      [e.target.name]: e.target.value,
    });
  };
  const handleMaintenance = (e) => {
    // console.log("E target: ", e.target.name);
    setMaintenance({
      ...maintenance,
      [e.target.name]: e.target.value,
    });
  };
  const handleAccidence = (e) => {
    // console.log("E target: ", e.target.name);
    setAccidence({
      ...accidence,
      [e.target.name]: e.target.value,
    });
  };
  const onFinish = async (e) => {
    setLoadingForm(true);
    console.log("contractHistory: ", contractHistory);
    let transaction;
    if (props.isHistoryOpen) {
      console.log("Vo duoc giao dich");
      transaction =
        await contractHistory._carTransactionHistoryAdress.addTransaction(
          history.carID,
          history.date,
          history.buyerID,
          history.sellerID,
          history.price,
          history.buyerSign,
          history.sellerSign
        );
      await transaction.wait();
    } else if (props.isSoldOpen) {
      console.log("Vo duoc bao duong");
      console.log("Maintenance contract: ", contractMaintenace);
      console.log("Main: ", maintenance);
      let totalKmRunUint16 = ethers.utils.parseUnits(maintenance.totalKmRun, 0);
      transaction =
        await contractMaintenace._carmaintenanceAdress.addMaintenance(
          maintenance.carID,
          totalKmRunUint16,
          maintenance.typeOfMaintain,
          maintenance.placeMatintain,
          maintenance.result
        );
      await transaction.wait();
    } else if (props.isAccidentOpen) {
      console.log("Vo duoc tai nan");
      console.log("Maintenance contract: ", contractAccidence);
      transaction = await contractAccidence._caraccidentAdress.addAccidentFix(
        accidence.carID,
        accidence.decribeAccident,
        accidence.decribeFix,
        accidence.result
      );
      await transaction.wait();
    }
    alert("Transaction is successul");
    console.log("Transaction is successul");
    // window.location.reload();
    setLoadingForm(false);
  };
  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        console.log("Co metamask");
        setLoading(true);
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        const provider = new ethers.providers.Web3Provider(ethereum); //read the Blockchain
        const signer = provider.getSigner(); //write the blockchain
        const address = await signer.getAddress();
        const _carTransactionHistoryAdress = new ethers.Contract(
          carTransactionHistoryAdress,
          carTransactionHistoryABI,
          signer
        );
        const _carmaintenanceAdress = new ethers.Contract(
          carmaintenanceAdress,
          carmaintenanceABI,
          signer
        );
        const _caraccidentAdress = new ethers.Contract(
          caraccidentAdress,
          caraccidentABI,
          signer
        );
        console.log("Metamask Connected : " + address);
        setContractHistory({ provider, signer, _carTransactionHistoryAdress });
        setContracMaintenance({ provider, signer, _carmaintenanceAdress });
        setContracAccidence({ provider, signer, _caraccidentAdress });
        console.log("Ket noi xong");
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }
  useEffect(() => {
    console.log("Đã tạo được contractHistory");
    console.log(contractHistory);
  }, [contractHistory]);
  useEffect(() => {
    setHistory({
      ...history,
      carID: props.rowSelected,
    });
    setMaintenance({
      ...maintenance,
      carID: props.rowSelected,
    });
    setAccidence({
      ...accidence,
      carID: props.rowSelected,
    });
    console.log("ID trong useEffect: ", props.rowSelected);
    connectToMetamask();
  }, [props.HistoryOpen, props.AccidentOpen, props.SoldOpen]);
  useEffect(() => {
    props.form.setFieldsValue(history);
  }, [history]);
  return (
    <div>
      <DrawerComponent
        title="Lịch sử đăng kiểm"
        width="100%"
        isOpen={props.isOpenDrawer2}
        onClose={props.handleOnclose}
      >
        <Loading isLoading={loading}>
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h6>Thêm lịch sử giao dịch</h6>
                <Button
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "6px",
                    borderStyle: "solid",
                  }}
                  onClick={props.HistoryOpen}
                >
                  <PlusOutlined style={{ fontSize: "15px" }} />
                </Button>
              </div>
              <div className="col-md-4">
                <h6>Thêm lịch sử bảo dưỡng</h6>
                <Button
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "6px",
                    borderStyle: "solid",
                  }}
                  onClick={props.SoldOpen}
                >
                  <PlusOutlined style={{ fontSize: "15px" }} />
                </Button>
              </div>
              <div className="col-md-4">
                <h6>Thêm lịch sử tai nạn</h6>
                <Button
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "6px",
                    borderStyle: "solid",
                  }}
                  onClick={props.AccidentOpen}
                >
                  <PlusOutlined style={{ fontSize: "15px" }} />
                </Button>
              </div>
            </div>
          </div>
          <Loading isLoading={loadingForm}>
            <Modal
              title="Thêm mới lịch sử giao dịch"
              open={props.isHistoryOpen}
              width={800}
              onOk={onFinish}
              okButtonProps={{ style: { background: "green" } }}
              onCancel={props.handleCancel}
            >
              <Form
                name="history"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={onFinish}
                autoComplete="on"
                form={props.form}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label="ID xe"
                      name="carID"
                      rules={[
                        {
                          required: true,
                          message: "Please input your carID!",
                        },
                      ]}
                    >
                      <InputComponent
                        value={props.carID}
                        // onChange={handleHistory}
                        name="carID"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Ngày"
                      name="date"
                      rules={[
                        {
                          required: true,
                          message: "Please input your date!",
                        },
                      ]}
                    >
                      <InputComponent
                        // value={stateVehicle.date}
                        onChange={handleHistory}
                        name="date"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label="Người mua"
                      name="buyerID"
                      rules={[
                        {
                          required: true,
                          message: "Please input your buyerID!",
                        },
                      ]}
                    >
                      <InputComponent
                        // value={stateVehicle.buyerID}
                        onChange={handleHistory}
                        name="buyerID"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Người bán"
                      name="sellerID"
                      rules={[
                        {
                          required: true,
                          message: "Please input your sellerID!",
                        },
                      ]}
                    >
                      <InputComponent
                        // value={stateVehicle.sellerID}
                        onChange={handleHistory}
                        name="sellerID"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label="Giá"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "Please input your price!",
                    },
                  ]}
                >
                  <InputComponent
                    // value={stateVehicle.price}
                    onChange={handleHistory}
                    name="price"
                  />
                </Form.Item>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label="Chữ kí 1"
                      name="buyerSign"
                      rules={[
                        {
                          required: true,
                          message: "Please input your buyerSign!",
                        },
                      ]}
                    >
                      <InputComponent
                        // value={stateVehicle.buyerSign}
                        onChange={handleHistory}
                        name="buyerSign"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Chứ kí 2"
                      name="sellerSign"
                      rules={[
                        {
                          required: true,
                          message: "Please input your sellerSign!",
                        },
                      ]}
                    >
                      <InputComponent
                        // value={stateVehicle.sellerSign}
                        onChange={handleHistory}
                        name="sellerSign"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </Loading>
          <Modal
            title="Thêm mới lịch sử bảo dưỡng"
            open={props.isSoldOpen}
            width={800}
            onOk={onFinish}
            onCancel={props.handleCancel}
            okButtonProps={{ style: { background: "green" } }}
          >
            <Form
              name="maintenance"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={onFinish}
              autoComplete="on"
              form={props.form}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="ID xe"
                    name="carID"
                    rules={[
                      {
                        required: true,
                        message: "Please input your carID!",
                      },
                    ]}
                  >
                    <InputComponent
                      // value={stateVehicle.carID}
                      // onChange={handleOnchange}
                      name="carID"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Lăn bánh"
                    name="totalKmRun"
                    rules={[
                      {
                        required: true,
                        message: "Please input your totalKmRun!",
                      },
                    ]}
                  >
                    <InputComponent
                      onChange={handleMaintenance}
                      name="totalKmRun"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Loại"
                    name="typeOfMaintain"
                    rules={[
                      {
                        required: true,
                        message: "Please input your typeOfMaintain!",
                      },
                    ]}
                  >
                    <InputComponent
                      // value={stateVehicle.typeOfMaintain}
                      onChange={handleMaintenance}
                      name="typeOfMaintain"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nơi"
                    name="placeMatintain"
                    rules={[
                      {
                        required: true,
                        message: "Please input your placeMatintain!",
                      },
                    ]}
                  >
                    <InputComponent
                      onChange={handleMaintenance}
                      name="placeMatintain"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Col span={12}>
                <Form.Item
                  label="Kết quả"
                  name="result"
                  rules={[
                    {
                      required: true,
                      message: "Please input your result!",
                    },
                  ]}
                >
                  <InputComponent
                    // value={stateVehicle.result}
                    onChange={handleMaintenance}
                    name="result"
                  />
                </Form.Item>
              </Col>
            </Form>
          </Modal>
          <Modal
            title="Thêm mới lịch sử bốc đầu"
            open={props.isAccidentOpen}
            okButtonProps={{ style: { background: "green" } }}
            width={800}
            onOk={onFinish}
            onCancel={props.handleCancel}
          >
            <Form
              name="accidence"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              autoComplete="on"
              form={props.form}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="ID xe"
                    name="carID"
                    rules={[
                      {
                        required: true,
                        message: "Please input your carID!",
                      },
                    ]}
                  >
                    <InputComponent
                      // value={stateVehicle.carID}
                      // onChange={handleOnchange}
                      name="carID"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Mô tả"
                    name="decribeAccident"
                    rules={[
                      {
                        required: true,
                        message: "Please input your decribeAccident!",
                      },
                    ]}
                  >
                    <InputComponent
                      onChange={handleAccidence}
                      name="decribeAccident"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Loại"
                    name="decribeFix"
                    rules={[
                      {
                        required: true,
                        message: "Please input your decribeFix!",
                      },
                    ]}
                  >
                    <InputComponent
                      // value={stateVehicle.decribeFix}
                      onChange={handleAccidence}
                      name="decribeFix"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nơi"
                    name="result"
                    rules={[
                      {
                        required: true,
                        message: "Please input your result!",
                      },
                    ]}
                  >
                    <InputComponent onChange={handleAccidence} name="result" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
          <div className="container mb-6">
            <div className="row">
              <div className="col-md-4">
                <Button
                  className="button-choose-contract"
                  onClick={() => setSelectTable("his")}
                >
                  Xem lịch sử giao dịch
                </Button>
              </div>
              <div className="col-md-4">
                <Button
                  className="button-choose-contract"
                  onClick={() => setSelectTable("mainte")}
                >
                  Xem lịch sử bảo dưỡng
                </Button>
              </div>
              <div className="col-md-4">
                <Button
                  className="button-choose-contract"
                  onClick={() => setSelectTable("acci")}
                >
                  Xem lịch sử tai nạn
                </Button>
              </div>
            </div>
          </div>
          <div>
            <DisplayContract type={selectTable} carId={props.rowSelected} handleOnclose={props.handleOnclose} />
          </div>
        </Loading>
      </DrawerComponent>
    </div>
  );
};

export default Contract;
