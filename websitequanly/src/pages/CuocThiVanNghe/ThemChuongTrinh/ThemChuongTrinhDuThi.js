/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import { Form, Row, Col, Breadcrumb, Modal } from "react-bootstrap";
import { useState } from "react";
import "../CuocThiVanNghe.css";
import Axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MusicNote,
  AccessTime,
  EditLocationAlt,
  NoteAlt,
  Radio,
  School,
  Person,
  Mail,
  Phone,
  ChangeCircleOutlined,
  Add,
  ArrowBack,
} from "@mui/icons-material";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import MuiDatatable from "../../../components/table/MuiDatatable";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import { write, utils } from "xlsx";

export default function ThemChuongTrinhDuThi() {
  const defaultFonts = [
    "Arial",
    "Comic Sans MS",
    "Courier New",
    "Impact",
    "Georgia",
    "Tahoma",
    "Trebuchet MS",
    "Verdana",
  ];

  const sortedFontOptions = [
    "Logical",
    "Salesforce Sans",
    "Garamond",
    "Sans-Serif",
    "Serif",
    "Times New Roman",
    "Helvetica",
    ...defaultFonts,
  ].sort();

  const navigate = useNavigate();
  const params = useParams();

  const dayjs = require("dayjs");

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const [tenChuongTrinh, setTenChuongTrinh] = useState("");
  const [ngayGioToChuc, setNgayGioToChuc] = useState(null);
  const [diaDiemToChuc, setDiaDiemToChuc] = useState("");
  const [donViToChuc, setDonViToChuc] = useState();
  const [noiDungChuongTrinh, setNoiDungChuongTrinh] = useState("");

  const [ngayBatDau, setNgayBatDau] = useState();
  const [ngayKetThuc, setNgayKetThuc] = useState();

  const [dataThiSinh, setDataThiSinh] = useState([]);

  const [maNhomTruong, setMaNhomTruong] = useState(-1);
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stt, setSTT] = useState();
  const [refresh, setRefresh] = useState(-1);

  const [dataDonVi, setDataDonVi] = useState([]);
  const [tenCuocThi, setTenCuocThi] = useState([]);
  const [maDiaDiem, setMaDiaDiem] = useState("");

  const [maDoanDoi, setMaDoanDoi] = useState("");

  // L???y Th??ng Tin ????n v??? T??? ch???c, ?????a ??i???m T??? Database
  useEffect(() => {
    const getDataChiTietCuocThi = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/tatcacuocthi/${params.idCuocThi}`
      );
      setTenCuocThi(data[0].TenCuocThi);
      setDiaDiemToChuc(data[0].TenDiaDiem);
      setMaDiaDiem(data[0].MaDiaDiem);
      setNgayBatDau(dayjs(data[0].NgayBatDau).format("YYYY-MM-DD"));
      setNgayKetThuc(dayjs(data[0].NgayKetThuc).format("YYYY-MM-DD"));
    };
    getDataChiTietCuocThi();
  }, []);

  useEffect(() => {
    const getDataDonVi = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/donvitochuc"
      );
      let arr = [];
      data.forEach((d) => {
        arr.push({ value: d.MaDonVi, label: d.TenDonVi });
      });
      setDonViToChuc(arr[0]);
      setDataDonVi(arr);
    };
    getDataDonVi();
  }, []);

  useEffect(() => {
    const getDataThiSinh = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/doandoi/nguoidungtruongnhom/${donViToChuc.value}`
      );
      data.forEach((d) => {
        d.GioiTinh = d.GioiTinh == 1 ? "Nam" : "N???";
        if (d.MaDinhDanh == "" || d.MaDinhDanh == null) d.MaDinhDanh = "Kh??ng";
        if (d.MaLop == "" || d.MaLop == null) d.MaLop = "Kh??ng";
      });
      setDataThiSinh(data);
    };
    getDataThiSinh();
  }, [refresh]);

  const columnsThiSinh = [
    {
      name: "MaThiSinh",
      options: {
        display: false,
        filter: false,
        viewColumns: false,
        sort: false,
        disableColumnMenu: false,
        download: false,
        print: false,
      },
    },
    {
      name: "stt",
      label: "STT",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "TenThiSinh",
      label: "H??? T??n",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "MaDinhDanh",
      label: "M?? ?????nh Danh",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "Email",
      label: "Email Th?? Sinh",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "Phone",
      label: "Phone",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "TenDoanDoi",
      label: "T??n ??o??n ?????i",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "280px" }}>{value}</div>;
        },
      },
    },
  ];

  const optionsThiSinh = {
    search: true,
    download: true,
    print: false,
    viewColumns: true,
    filter: false,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "auto",
    tableBodyMaxHeight: "800px",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: 5,
    selectableRows: "single",
    selectToolbarPlacement: "none",
    rowsSelected: [stt],
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      setSTT(currentRowsSelected[0].dataIndex);
    },
    downloadOptions: {
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    onDownload: (buildHead, buildBody, columns, values) => {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      const json = values.reduce((result, val) => {
        const temp = {};
        val.data.forEach((v, idx) => {
          temp[columns[idx].label] = v;
        });
        result.push(temp);
        return result;
      }, []);

      const fileName = `DanhSachTruongNhom`;
      const ws = utils.json_to_sheet(json);
      const header = Object.keys(json[0]); // columns name
      var wscols = [];
      for (var i = 0; i < header.length; i++) {
        // columns length added
        wscols.push({ wch: header[i].length + 10 });
      }
      ws["!cols"] = wscols;
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      saveAs(data, fileName + fileExtension);

      return false;
    },
    textLabels: {
      toolbar: {
        downloadCsv: "Xu???t Excel",
        search: "T??m Ki???m",
        viewColumns: "???n/ Hi???n C???t",
        filterTable: "L???c B???ng",
      },
      filter: {
        all: "All",
        title: "L???C B???NG",
        reset: "RESET",
      },
      viewColumns: {
        title: "???N/ HI???N C???T",
        titleAria: "???N/ HI???N C???T",
      },
    },
  };

  const handleAddNhomTruong = () => {
    const dt = dataThiSinh.filter((data) => {
      return data.stt == stt + 1;
    });
    setMaDoanDoi(dt[0].MaDoanDoi);
    setMaNhomTruong(dt[0].MaThiSinh);
    setHoTen(dt[0].TenThiSinh);
    setEmail(dt[0].Email);
    setPhone(dt[0].Phone);
    setRefresh(Math.random());
  };

  const [newCTR, setNewCTR] = useState(-1);

  const add = () => {
    if (maNhomTruong == -1) {
      alert("Ch??a ch???n Tr?????ng ????n v??? !");
    } else if (tenChuongTrinh == "") {
      alert("T??n Ch????ng tr??nh kh??ng ???????c ????? tr???ng !");
    } else {
      Axios.post(
        `http://localhost:3001/api/admin/addchuongtrinhcuocthi/${params.idCuocThi}`,
        {
          TenChuongTrinh: tenChuongTrinh,
          DiaDiemToChuc: maDiaDiem,
          DonViToChuc: donViToChuc.value,
          NgayGioToChuc: ngayGioToChuc,
          NoiDungChuongTrinh: noiDungChuongTrinh,
          MaTruongDonVi: maNhomTruong,
          MaDoanDoi: maDoanDoi,
        }
      ).then((response) => {
        setNewCTR(response.data.idCTR);
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("cuocthivannghe").classList.add("actives");
    }, 200);
    document.title =
      "Th??m Ch????ng Tr??nh D??? Thi - Website qu???n l?? c??ng t??c v??n ngh??? Tr?????ng ?????i H???c C???n Th??";
  }, []);

  useEffect(() => {
    if (newCTR > -1) {
      navigate(
        `/chinhsuacuocthi/${params.idCuocThi}/chinhsuachuongtrinh/${newCTR}`
      );
      setTimeout(() => {
        alert("Th??m Ch????ng tr??nh th??nh c??ng !");
      }, 600);
    }
  });

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="#" tabIndex="-1">
          <Link to="/home" className="link">
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#" tabIndex="-1">
          <Link to="/tatcacuocthi" className="link">
            Cu???c Thi V??n Ngh???
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#" tabIndex="-1">
          <Link to={`/chinhsuacuocthi/${params.idCuocThi}`} className="link">
            {tenCuocThi}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Th??m Ch????ng Tr??nh D??? Thi</Breadcrumb.Item>
      </Breadcrumb>

      {/* Th??m Ch????ng Tr??nh */}
      <div className="text-start">
        {/* Th??? T??n "Th??m Ch????ng Tr??nh" */}
        <h2 className="text-center d-flex align-items-center justify-content-center pb-2">
          <MusicNote style={{ fontSize: "2.6rem" }} />
          Th??m Ch????ng Tr??nh D??? Thi
          <MusicNote style={{ fontSize: "2.6rem" }} />
        </h2>
        {/* T??n Ch????ng Tr??nh */}
        <Row className="pb-1">
          <Col xs="12" md="7">
            <Form.Group className="mb-3">
              <Form.Label
                htmlFor="tenchuongtrinh"
                className="d-flex align-items-center"
                style={{ fontWeight: "500" }}
              >
                <Radio />
                &nbsp;T??n Ch????ng Tr??nh
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nh???p t??n ch????ng tr??nh"
                onChange={(e) => setTenChuongTrinh(e.target.value)}
                id="tenchuongtrinh"
                value={tenChuongTrinh}
              />
              <Form.Text className="text-muted">
                <b style={{ color: "red" }}></b>
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs="12" md="5">
            <Form.Group className="mb-3">
              <Form.Label
                className="d-flex align-items-center"
                style={{ fontWeight: "500" }}
              >
                <EditLocationAlt /> &nbsp;?????a ??i???m T??? Ch???c
              </Form.Label>
              <Form.Control type="text" value={diaDiemToChuc} />
              <Form.Text className="text-muted">
                {/* <b style={{ color: "red" }}>{pricePerformanceMess}</b> */}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {/* ????n v???, Th???i Gian T??? ch???c */}
        <Row className="pb-1">
          <Col xs="12" md="7">
            <Form.Group className="mb-3">
              <Form.Label
                className="d-flex align-items-center"
                style={{ fontWeight: "500" }}
              >
                <School /> &nbsp;????n V??? T??? Ch???c
              </Form.Label>
              {/* <Form.Select
                onChange={(e) => handleChangeDonViToChuc(e)}
                name="slDonVi"
              >
                {dataDonVi.map((data) => (
                  <option
                    key={data.MaDonVi}
                    value={data.MaDonVi}
                    name={`slDonVi-${data.MaDonVi}`}
                  >
                    {data.TenDonVi}
                  </option>
                ))}
              </Form.Select> */}
              <Select
                options={dataDonVi}
                value={donViToChuc}
                id="donvi"
                onChange={(e) => {
                  setDonViToChuc(e);
                  setMaNhomTruong(-1);
                  setEmail("");
                  setPhone("");
                  setSTT(-1);
                }}
                className="zIndex-998"
              />
              <Form.Text className="text-muted">
                {/* <b style={{ color: "red" }}>{pricePerformanceMess}</b> */}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs="12" md="5">
            <Form.Group className="mb-3">
              <Form.Label
                className="d-flex align-items-center"
                style={{ fontWeight: "500" }}
              >
                <AccessTime /> &nbsp;Ng??y Gi??? T??? Ch???c
              </Form.Label>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={ngayGioToChuc}
                  inputFormat="HH:mm, DD/MM/YYYY"
                  maxDate={ngayKetThuc}
                  minDate={ngayBatDau}
                  minTime={dayjs("2018-01-01T07:30")}
                  maxTime={dayjs("2018-01-01T22:00")}
                  onChange={(newValue) =>
                    setNgayGioToChuc(dayjs(newValue).format("YYYY-MM-DDTHH:mm"))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      helperText={null}
                      sx={{
                        ".MuiInputBase-root": {
                          marginTop: "4.4px",
                          background: "white",
                        },
                        ".MuiInputBase-input": {
                          paddingTop: "4.2px",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <Form.Text className="text-muted">
                {/* <b style={{ color: "red" }}>{amountPerformanceMess}</b> */}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {/* Th??ng tin Nh??m Tr?????ng */}
        <Row className="pb-1">
          {maNhomTruong == -1 ? (
            <>
              <Form.Group>
                <Form.Label
                  className="d-flex align-items-center"
                  style={{ fontWeight: "500" }}
                >
                  <Person /> &nbsp; Tr?????ng ????n v???
                </Form.Label>
                <p
                  className="themNhomTruong"
                  onClick={() => {
                    setRefresh(Math.random());
                    setShow(true);
                  }}
                >
                  + Th??m Tr?????ng ????n v???
                </p>
              </Form.Group>
            </>
          ) : (
            <>
              {/* H??? T??n Nh??m Tr?????ng */}
              <Col xs="12" md="4">
                <Form.Group className="mb-3">
                  <Form.Label
                    className="d-flex align-items-center"
                    style={{ fontWeight: "500" }}
                  >
                    <Person />
                    &nbsp;Tr?????ng ????n v???
                  </Form.Label>
                  <Form.Control type="text" value={hoTen} />
                  <Form.Text className="text-muted">
                    {/* <b style={{ color: "red" }}>{amountPerformanceMess}</b> */}
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Email Nh??m Tr?????ng */}
              <Col xs="12" md="4">
                <Form.Group className="mb-3">
                  <Form.Label
                    className="d-flex align-items-center"
                    style={{ fontWeight: "500" }}
                  >
                    <Mail />
                    &nbsp;Email
                  </Form.Label>
                  <Form.Control type="email" value={email} />
                  <Form.Text className="text-muted">
                    {/* <b style={{ color: "red" }}>{amountPerformanceMess}</b> */}
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Phone Nh??m Tr?????ng */}
              <Col xs="12" md="4">
                <Form.Group className="mb-3">
                  <Form.Label
                    className="d-flex align-items-center justify-content-between"
                    style={{ fontWeight: "500" }}
                  >
                    <span>
                      <Phone />
                      &nbsp;Phone{" "}
                    </span>
                    <p
                      className="themNhomTruong p-0 m-0"
                      onClick={() => {
                        setRefresh(Math.random());
                        setShow(true);
                      }}
                    >
                      <ChangeCircleOutlined />
                      Change
                    </p>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={phone}
                    //   onChange={(e) => handleAmountPerformance(e)}
                  />
                  <Form.Text className="text-muted">
                    {/* <b style={{ color: "red" }}>{amountPerformanceMess}</b> */}
                  </Form.Text>
                </Form.Group>
              </Col>
            </>
          )}
        </Row>

        {/* Chi Ti???t Ch????ng Tr??nh */}
        <Row className="pb-1">
          <Form.Group className="mb-3">
            <Form.Label
              className="d-flex align-items-center"
              style={{ fontWeight: "500" }}
            >
              <NoteAlt /> &nbsp;Chi Ti???t Ch????ng Tr??nh
            </Form.Label>

            <SunEditor
              plugin=""
              setContents={noiDungChuongTrinh}
              onChange={setNoiDungChuongTrinh}
              setDefaultStyle="font-family: Arial; font-size: 16px;"
              setOptions={{
                buttonList: [
                  ["undo", "redo"],
                  ["font", "fontSize"],
                  // ['paragraphStyle', 'blockquote'],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                  ],
                  ["fontColor", "hiliteColor"],
                  ["align", "list", "lineHeight"],
                  ["outdent", "indent"],

                  ["table", "horizontalRule", "link", "image", "video"],
                  // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                  // ['imageGallery'], // You must add the "imageGalleryUrl".
                  // ["fullScreen", "showBlocks", "codeView"],
                  ["preview", "print"],
                  ["removeFormat"],

                  // ['save', 'template'],
                  // '/', Line break
                ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                defaultTag: "div",
                minHeight: "300px",
                height: "auto",
                showPathLabel: false,
                font: sortedFontOptions,
              }}
            />
          </Form.Group>
        </Row>

        {/* Button Add, Back */}
        <Row className="pt-2 justify-content-center">
          <Col xs="12" md="3"></Col>
          <Col xs="12" md="3" className="my-1">
            <Button
              variant="contained"
              className="button-style"
              onClick={() => {
                add();
              }}
              startIcon={<Add />}
            >
              Add
            </Button>
          </Col>
          <Col xs="12" md="3" className="my-1">
            <Button
              variant="contained"
              color="error"
              className="button-style"
              onClick={() => navigate(`/chinhsuacuocthi/${params.idCuocThi}`)}
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
          </Col>
          <Col xs="12" md="3"></Col>
        </Row>
      </div>

      {/* Th??m Nh??m Tr?????ng */}
      <Modal
        show={show}
        onHide={handleClose}
        className="modal-lg"
        dialogClassName="modal-width"
      >
        <Modal.Header closeButton className="px-4">
          <Modal.Title className="ms-auto">
            {maNhomTruong == -1
              ? "Th??m Tr?????ng ????n V???"
              : "Thay ?????i Tr?????ng ????n V???"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row style={{ padding: "10px 24px" }}>
            <MuiDatatable
              title="Danh S??ch Tr?????ng Nh??m"
              data={dataThiSinh}
              columns={columnsThiSinh}
              options={optionsThiSinh}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Row>
            <Col xs="12" md="6" className="my-1">
              <Button
                variant="contained"
                className="modal-button-style"
                onClick={() => {
                  handleAddNhomTruong();
                  setShow(false);
                }}
              >
                {maNhomTruong == -1 ? "Add" : "Change"}
              </Button>
            </Col>
            <Col xs="12" md="6" className="my-1">
              <Button
                variant="contained"
                color="error"
                className="modal-button-style"
                onClick={handleClose}
              >
                Close
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
}
