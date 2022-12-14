/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Modal } from "react-bootstrap";
import { useState } from "react";
import "../ChuongTrinhVanNghe.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  MusicNote,
  AccessTime,
  EditLocationAlt,
  NoteAlt,
  Radio,
  School,
  Person,
  ChangeCircleOutlined,
  Mail,
  Phone,
} from "@mui/icons-material";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import MuiDatatable from "../../../components/table/MuiDatatable";

export default function ThemChuongTrinh() {
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
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const [dataDiaDiem, setDataDiaDiem] = useState([]);

  const [tenChuongTrinh, setTenChuongTrinh] = useState("");
  const [ngayGioToChuc, setNgayGioToChuc] = useState();
  const [diaDiemToChuc, setDiaDiemToChuc] = useState("");
  const [donViToChuc, setDonViToChuc] = useState(1);
  const [noiDungChuongTrinh, setNoiDungChuongTrinh] = useState("");

  const [dataThiSinh, setDataThiSinh] = useState([]);

  const [maNhomTruong, setMaNhomTruong] = useState(-1);
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stt, setSTT] = useState();
  const [refresh, setRefresh] = useState(-1);

  const handleChangeDonViToChuc = (event) => {
    setDonViToChuc(event.target.value);
    setMaNhomTruong(-1);
    setSTT();
    setRefresh(Math.random());
  };

  const handleChangeDiaDiem = (event) => {
    setDiaDiemToChuc(event.target.value);
  };

  const [dataDonVi, setDataDonVi] = useState([]);

  // L???y Th??ng Tin ????n v??? T??? ch???c, ?????a ??i???m T??? Database
  useEffect(() => {
    const getDataDiaDiem = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/diadiem"
      );
      setDataDiaDiem(data);
    };
    getDataDiaDiem();
  }, []);

  useEffect(() => {
    const getDataDonVi = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/donvitochuc"
      );
      setDataDonVi(data);
    };
    getDataDonVi();
    const getDataThiSinh = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/doandoi/nguoidungtruongnhom/${donViToChuc}`
      );
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
      options: { filterOptions: { fullWidth: true } },
    },
    { name: "TenThiSinh", label: "H??? T??n" },
    { name: "MaDinhDanh", label: "M?? ?????nh Danh" },
    {
      name: "MaLop",
      label: "M?? L???p",
      options: {
        display: false,
        filter: false,
        viewColumns: false,
        download: false,
      },
    },
    {
      name: "GioiTinh",
      label: "Gi???i T??nh",
      options: {
        display: false,
        filter: false,
        viewColumns: false,
        download: false,
      },
    },
    { name: "Email", label: "Email Th?? Sinh" },
    { name: "Phone", label: "Phone" },
    { name: "TenDonVi", label: "Thu???c ????n V???" },
  ];

  const optionsThiSinh = {
    search: true,
    download: false,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "370px",
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
    onRowsDelete: (rowsDeleted, newData) => {
      // console.log("rowsDeleted");
      // console.dir(rowsDeleted);
      // console.dir(newData);
      // window.alert("were deleted!");
    },
    onTableChange: (action, state) => {
      // console.log(action);
      // console.dir(state);
    },
  };

  const handleAddNhomTruong = () => {
    const dt = dataThiSinh.filter((data) => {
      return data.stt == stt + 1;
    });
    setMaNhomTruong(dt[0].MaThiSinh);
    setHoTen(dt[0].TenThiSinh);
    setEmail(dt[0].Email);
    setPhone(dt[0].Phone);
  };

  const [newCTR, setNewCTR] = useState(-1);

  const add = () => {
    Axios.post("http://localhost:3001/api/admin/addchuongtrinh", {
      TenChuongTrinh: tenChuongTrinh,
      DiaDiemToChuc: diaDiemToChuc,
      DonViToChuc: donViToChuc,
      NgayGioToChuc: ngayGioToChuc,
      NoiDungChuongTrinh: noiDungChuongTrinh,
      MaTruongDonVi: maNhomTruong,
    }).then((response) => {
      setNewCTR(response.data.idCTR);
    });
  };

  useEffect(() => {
    if (newCTR > -1) navigate(`/chinhsuachuongtrinh/${newCTR}`);
  });

  useEffect(() => {
    document.title =
      "Th??m Ch????ng Tr??nh V??n Ngh??? - Website qu???n l?? c??ng t??c v??n ngh??? Tr?????ng ?????i H???c C???n Th??";
  }, []);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="#" tabIndex="-1">
          <Link to="/home" className="link">
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#" tabIndex="-1">
          <Link to="/tatcachuongtrinh" className="link">
            Ch????ng Tr??nh V??n Ngh???
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Th??m Ch????ng Tr??nh V??n Ngh???</Breadcrumb.Item>
      </Breadcrumb>

      {/* Th??m Ch????ng Tr??nh */}
      <div className="text-start">
        {/* Th??? T??n "Th??m Ch????ng Tr??nh" */}
        <h2 className="text-center d-flex align-items-center justify-content-center pb-2">
          <MusicNote style={{ fontSize: "2.6rem" }} />
          Th??m Ch????ng Tr??nh V??n Ngh???
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
              <Form.Select
                onChange={(e) => handleChangeDiaDiem(e)}
                name="slDiaDiem"
              >
                {dataDiaDiem.map((data) => (
                  <option
                    key={data.MaDiaDiem}
                    value={data.MaDiaDiem}
                    name={`slDiaDiem-${data.MaDiaDiem}`}
                  >
                    {data.TenDiaDiem}
                  </option>
                ))}
              </Form.Select>
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
              <Form.Select
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
              </Form.Select>
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
              <Form.Control
                type="datetime-local"
                min="0"
                onChange={(e) => setNgayGioToChuc(e.target.value)}
              />
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
                <p className="themNhomTruong" onClick={() => setShow(true)}>
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
                      onClick={() => setShow(true)}
                    >
                      <ChangeCircleOutlined /> Change
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
        <Row className="pt-2">
          <Col className="text-center my-2">
            <Button
              type="button"
              className="px-5"
              onClick={() => {
                add();
              }}
            >
              Add
            </Button>
            &nbsp;
            <Button
              variant="danger"
              className="px-5"
              onClick={() => navigate("/chuongtrinhvannghe")}
            >
              Back
            </Button>
          </Col>
        </Row>
      </div>

      {/* Th??m Nh??m Tr?????ng */}
      <Modal
        show={show}
        onHide={handleClose}
        className="modal-lg"
        dialogClassName="modal-width-70"
      >
        <Modal.Header closeButton className="px-4">
          <Modal.Title className="ms-auto">Th??m Tr?????ng ????n V???</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row style={{ padding: "10px 12px" }}>
            <MuiDatatable
              title="Danh S??ch Tr?????ng Nh??m"
              data={dataThiSinh}
              columns={columnsThiSinh}
              options={optionsThiSinh}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            className="px-5"
            onClick={() => {
              handleAddNhomTruong();
              setShow(false);
            }}
          >
            {maNhomTruong == -1 ? "Add" : "Change"}
          </Button>
          <Button variant="secondary" onClick={handleClose} className="px-5">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
