/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Form, Row, Col, Modal, Spinner } from "react-bootstrap";
import { useState } from "react";
import "../CuocThiVanNghe.css";
import {
  AccessTime,
  ArrowBack,
  ConfirmationNumber,
  EmojiEvents,
  MusicNote,
  NoteAlt,
  QueueMusicRounded,
  Refresh,
  Save,
} from "@mui/icons-material";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Axios from "axios";
import MuiDatatable from "../../../components/table/MuiDatatable";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, IconButton, Tooltip as MuiToolTip } from "@mui/material";
import { saveAs } from "file-saver";
import { write, utils } from "xlsx";

export default function ChinhSuaTietMucCaNhan() {
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

  const params = useParams();
  const navigate = useNavigate();
  const dayjs = require("dayjs");

  const [dataLoaiTietMuc, setDataLoaiTietMuc] = useState([]);
  const [dataGiaiThuong, setDataGiaiThuong] = useState([]);

  const [dataThiSinh, setDataThiSinh] = useState([]);
  const [dataThiSinhKTB, setDataThiSinhKTB] = useState([]);
  const [maThiSinhThayThe, setMaThiSinhThayThe] = useState(-1);

  // eslint-disable-next-line no-unused-vars
  const [maThiSinh, setMaThiSinh] = useState(-1);

  const [tenCuocThi, setTenCuocThi] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState();
  const [ngayKetThuc, setNgayKetThuc] = useState();
  const [trangThai, setTrangThai] = useState(1);
  const [soVongThi, setSoVongThi] = useState(0);

  const [tenTietMuc, setTenTietMuc] = useState("");
  const [giaiThuong, setGiaiThuong] = useState({
    value: 0,
    label: "Kh??ng c?? gi???i",
  });
  const [vongThi, setVongThi] = useState(1);
  const [loaiTietMuc, setLoaiTietMuc] = useState(3);
  const [nhanSo, setNhanSo] = useState(1);
  const [noiDungTietMuc, setNoiDungTietMuc] = useState("");
  const [thoiGianThucHien, setThoiGianThucHien] = useState("");

  const [refresh, setRefresh] = useState(1);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setMaThiSinhThayThe(-1);
  };

  // L???y Th??ng Tin T??? Database
  useEffect(() => {
    const getDataLoaiTietMuc = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/loaitietmuc"
      );
      let arr = [];
      data.forEach((d) => {
        if (d.MaPhanThi == 1)
          arr.push({ value: d.MaLoaiTietMuc, label: d.TenLoaiTietMuc });
      });
      setDataLoaiTietMuc(arr);
    };
    getDataLoaiTietMuc();

    const getDataLoaiGiaiThuong = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/giaithuong"
      );
      let arr = [];
      data.forEach((d) => {
        arr.push({ value: d.MaGiaiThuong, label: d.TenGiaiThuong });
      });
      setDataGiaiThuong(arr);
    };
    getDataLoaiGiaiThuong();
  }, [refresh]);

  useEffect(() => {
    const getDataChiTietCuocThi = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/tatcacuocthi/${params.idCuocThi}`
      );
      setTenCuocThi(data[0].TenCuocThi);
      setNgayBatDau(dayjs(data[0].NgayBatDau).format("YYYY-MM-DD"));
      setNgayKetThuc(dayjs(data[0].NgayKetThuc).format("YYYY-MM-DD"));
      setTrangThai(data[0].MaTrangThai);
      setSoVongThi(data[0].SoVongThi);
    };
    getDataChiTietCuocThi();
  }, [refresh]);

  useEffect(() => {
    const getDataThiSinhTrinhBay = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/thisinhtrinhbaytietmuc/${params.idTietMuc}`
      );
      data.forEach((d) => {
        d.GioiTinh = d.GioiTinh == 1 ? "Nam" : "N???";
        if (d.MaDinhDanh == "" || d.MaDinhDanh == null) d.MaDinhDanh = "Kh??ng";
        if (d.MaLop == "" || d.MaLop == null) d.MaLop = "Kh??ng";
      });
      setDataThiSinh(data);
      setMaThiSinh(data[0].MaThiSinh);

      let value = data[0].MaThiSinh;
      const getDataThiSinhTrinhBayKhongTrinhBay = async () => {
        const { data } = await Axios.post(
          `http://localhost:3001/api/admin/thisinhkhongtrinhbay/${value}`
        );
        data.forEach((d) => {
          d.GioiTinh = d.GioiTinh == 1 ? "Nam" : "N???";
          if (d.MaDinhDanh == "" || d.MaDinhDanh == null)
            d.MaDinhDanh = "Kh??ng";
          if (d.MaLop == "" || d.MaLop == null) d.MaLop = "Kh??ng";
        });
        setDataThiSinhKTB(data);
      };
      getDataThiSinhTrinhBayKhongTrinhBay();
    };

    getDataThiSinhTrinhBay();
  }, [refresh]);

  // useEffect(() => {
  //   const getDataThiSinhTrinhBayKhongTrinhBay = async () => {
  //     const { data } = await Axios.post(
  //       `http://localhost:3001/api/admin/thisinhkhongtrinhbay/${maThiSinh}`
  //     );
  //     setDataThiSinhKTB(data);
  //   };
  //   getDataThiSinhTrinhBayKhongTrinhBay();
  // }, [refresh]);

  // L???y Th??ng Tin Ti???t m???c t??? database
  useEffect(() => {
    const getDataChiTietTietMuc = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/chitiettietmuc/${params.idTietMuc}`
      );
      setTenTietMuc(data[0].TenTietMuc);
      setLoaiTietMuc({
        value: data[0].MaLoaiTietMuc,
        label: data[0].TenLoaiTietMuc,
      });
      setNoiDungTietMuc(data[0].NoiDungTietMuc);
      setNhanSo(data[0].NhanSo);
      setThoiGianThucHien(
        data[0].NgayGioThucHien == null
          ? null
          : dayjs(data[0].NgayGioThucHien).format("YYYY-MM-DDTHH:mm")
      );
      setVongThi(data[0].VongThi);
      setGiaiThuong({
        value: data[0].MaGiaiThuong,
        label: data[0].TenGiaiThuong,
      });
    };
    getDataChiTietTietMuc();
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
        customHeadLabelRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "25px" }}>STT</div>;
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "35px" }}>{value}</div>;
        },
      },
    },
    { name: "TenThiSinh", label: "H??? T??n" },
    {
      name: "MaDinhDanh",
      label: "M?? ?????nh Danh",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{value == "" ? "Kh??ng" : value}</div>;
        },
      },
    },
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
    {
      name: "TenDonVi",
      label: "Thu???c ????n V???",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{value}</div>;
        },
      },
    },
    {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        print: false,
        viewColumns: false,
        disableColumnMenu: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <MuiToolTip title={"Change"}>
              <IconButton
                edge="middle"
                aria-label="Change"
                className="icon-hover"
                onClick={() => {
                  setShow(true);
                }}
              >
                <Refresh />
              </IconButton>
            </MuiToolTip>
          );
        },
      },
    },
  ];

  const optionsThiSinh = {
    search: true,
    download: false,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "auto",
    tableBodyMaxHeight: "1200px",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: 5,
    selectableRows: "none",
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      if (rowsSelected == "") {
        setMaThiSinh(-1);
      } else {
        let data = dataThiSinhKTB.filter((data) => {
          return data.stt == rowsSelected[0] + 1;
        });
        setMaThiSinhThayThe(data[0].MaThiSinh);
      }
    },
  };

  const columnsThiSinhKTB = [
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
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "10px" }}>{value}</div>;
        },
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
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{value == "" ? "Kh??ng" : value}</div>;
        },
      },
    },
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
        filterType: "multiselect",
        filterOptions: { fullWidth: true },
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
      name: "TenDonVi",
      label: "Thu???c ????n V???",
      options: {
        filterType: "multiselect",
        filterOptions: { fullWidth: true },
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "220px" }}>{value}</div>;
        },
      },
    },
  ];

  const optionsThiSinhKTB = {
    search: true,
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "400px",
    tableBodyMaxHeight: "1200px",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: 5,
    selectableRows: "single",
    selectToolbarPlacement: "none",
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      if (rowsSelected == "") {
        setMaThiSinh(-1);
      } else {
        let data = dataThiSinhKTB.filter((data) => {
          return data.stt == rowsSelected[0] + 1;
        });
        setMaThiSinhThayThe(data[0].MaThiSinh);
      }
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

      const fileName = `DanhSachThiSinh`;
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

  const handleUpdateThiSinhTrinhBay = () => {
    if (maThiSinhThayThe == -1) {
      alert("Ch??a ch???n th?? sinh thay th???!");
    } else {
      Axios.post(`http://localhost:3001/api/admin/updatethisinhtrinhbay`, {
        MaTietMuc: params.idTietMuc,
        MaThiSinh: maThiSinhThayThe,
      }).then((response) => {
        setRefresh(Math.random());
        handleClose();
        setTimeout(() => {
          alert("Thay ?????i Th?? Sinh Th??nh C??ng!");
        }, 400);
      });
    }
  };

  const handleUpdateTietMuc = () => {
    Axios.post(
      `http://localhost:3001/api/admin/updatetietmuc/${params.idTietMuc}`,
      {
        TenTietMuc: tenTietMuc,
        MaLoaiTietMuc: loaiTietMuc.value,
        NhanSo: nhanSo,
        NgayGioThucHien: thoiGianThucHien,
        NoiDungTietMuc: noiDungTietMuc,
        MaGiaiThuong: giaiThuong.value,
      }
    ).then((response) => {
      document.getElementById("topBtn").click();
      setRefresh(Math.random());
      setTimeout(() => {
        alert("Thay ?????i Th??ng Tin Ti???t M???c Th??nh C??ng!");
      }, 400);
    });
  };

  const [load, setLoad] = useState(false);
  useEffect(() => {
    setLoad(true);
    document.getElementById("cuocthivannghe").classList.add("actives");
    setTimeout(() => {
      setLoad(false);
    }, 300);
  }, [refresh]);

  return (
    <>
      {load ? (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Spinner
            animation="border"
            variant="primary"
            id="spinner"
            style={{
              position: "absolute",
              top: "38%",
              left: "48%",
              width: "50px",
              height: "50px",
              border: "2px soft black",
            }}
          />
        </div>
      ) : (
        <>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home" className="link">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/tatcacuocthi" className="link">
                T???t C??? Cu???c Thi
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link
                to={`/chinhsuacuocthi/${params.idCuocThi}`}
                className="link"
              >
                {tenCuocThi}
              </Link>
            </li>

            <li className="breadcrumb-item active">Chi Ti???t Ti???t M???c</li>
          </ol>

          {/* Th??m Ti???t M???c */}
          <div className="text-start">
            <h2 className="text-center d-flex align-items-center justify-content-center pb-2">
              <MusicNote style={{ fontSize: "2.6rem" }} />
              Chi Ti???t Ti???t M???c
              <MusicNote style={{ fontSize: "2.6rem" }} />
            </h2>
            <Form>
              {/* T??n Ti???t M???c, ????n V??? T??? Ch???c */}
              <Row>
                {/* T??n Ti???t M???c */}
                <Col xs="12" md={vongThi == soVongThi ? "8" : "12"}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="d-flex align-items-center"
                      style={{ fontWeight: "500" }}
                    >
                      <MusicNote /> T??n Ti???t M???c
                    </Form.Label>
                    <Form.Control
                      placeholder="Nh???p T??n Ti???t M???c..."
                      type="text"
                      id="tentietmuc"
                      defaultValue={tenTietMuc}
                      onBlur={(e) => setTenTietMuc(e.target.value)}
                      readOnly={trangThai == 3 ? true : false}
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                </Col>
                {vongThi == soVongThi ? (
                  <>
                    {trangThai == 3 ? (
                      <Col xs="12" md="4">
                        <Form.Group className="mb-3">
                          <Form.Label
                            htmlFor="giaithuong"
                            className="d-flex align-items-center"
                            style={{ fontWeight: "500" }}
                          >
                            <EmojiEvents />
                            &nbsp;Gi???i Th?????ng
                          </Form.Label>

                          <Form.Control
                            type="text"
                            value={giaiThuong.label}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    ) : (
                      <Col xs="12" md="4">
                        <Form.Group className="mb-3">
                          <Form.Label
                            htmlFor="giaithuong"
                            className="d-flex align-items-center"
                            style={{ fontWeight: "500" }}
                          >
                            <EmojiEvents />
                            &nbsp;Gi???i Th?????ng
                          </Form.Label>

                          <Select
                            options={dataGiaiThuong}
                            value={giaiThuong}
                            id="giaithuong"
                            onChange={setGiaiThuong}
                            className="zIndex-997"
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Row>

              {/* Lo???i Ti???t M???c, Nh??n S???, Th???i Gian Th???c Hi???n */}
              <Row>
                {/* Lo???i Ti???t M???c, Nh??n S??? */}
                <Col xs="12" md="8">
                  <Row>
                    {trangThai == 3 ? (
                      <Col xs="12" md="9">
                        <Form.Group className="mb-3">
                          <Form.Label
                            htmlFor="loaitietmuc"
                            className="d-flex align-items-center"
                            style={{ fontWeight: "500" }}
                          >
                            <QueueMusicRounded /> Lo???i Ti???t M???c
                          </Form.Label>

                          <Form.Control
                            type="text"
                            value={loaiTietMuc.label}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    ) : (
                      <Col xs="12" md="9">
                        <Form.Group className="mb-1">
                          <Form.Label
                            className="d-flex align-items-center"
                            style={{ fontWeight: "500", width: "100%" }}
                          >
                            <QueueMusicRounded /> Lo???i Ti???t M???c
                          </Form.Label>
                          <Select
                            options={dataLoaiTietMuc}
                            value={loaiTietMuc}
                            id="loaitietmuc"
                            onChange={setLoaiTietMuc}
                            className="zIndex-997"
                          />
                        </Form.Group>
                      </Col>
                    )}

                    <Col xs="12" md="3">
                      <Form.Group className="mb-3">
                        <Form.Label
                          className="d-flex align-items-center"
                          style={{ fontWeight: "500" }}
                        >
                          <ConfirmationNumber />
                          &nbsp;Nh??n S???
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Nh???p S??? l?????ng tham gia..."
                          value={nhanSo}
                        />
                        <Form.Text className="text-muted"></Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                {/* Th???i Gian Th???c Hi???n */}
                <Col xs="12" md="4">
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="d-flex align-items-center"
                      style={{ fontWeight: "500" }}
                    >
                      <AccessTime />
                      &nbsp;Th???i Gian Th???c Hi???n
                    </Form.Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={thoiGianThucHien}
                        inputFormat="HH:mm, DD/MM/YYYY"
                        maxDate={ngayKetThuc}
                        minDate={ngayBatDau}
                        minTime={dayjs("2018-01-01T07:30")}
                        maxTime={dayjs("2018-01-01T22:00")}
                        onChange={(newValue) =>
                          setThoiGianThucHien(
                            dayjs(newValue).format("YYYY-MM-DDTHH:mm")
                          )
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
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              {/* N???i Dung Ti???t M???c */}
              <Row className="pb-1">
                <Form.Group className="mb-3">
                  <Form.Label
                    className="d-flex align-items-center"
                    style={{ fontWeight: "500" }}
                  >
                    <NoteAlt /> &nbsp;N???i Dung Ti???t M???c
                  </Form.Label>

                  <SunEditor
                    plugin=""
                    placeholder="Nh???p N???i dung ti???t m???c..."
                    setContents={noiDungTietMuc}
                    onChange={setNoiDungTietMuc}
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

              <h2 className="text-center d-flex align-items-center justify-content-center pb-2">
                <MusicNote style={{ fontSize: "2.6rem" }} />
                Th?? Sinh Tr??nh B??y
                <MusicNote style={{ fontSize: "2.6rem" }} />
              </h2>

              {/* B???ng Th?? Sinh Thu???c ????n V??? */}
              <Row style={{ padding: "15px 12px" }}>
                <MuiDatatable
                  title="Th??ng Tin Th?? Sinh"
                  data={dataThiSinh}
                  columns={columnsThiSinh}
                  options={optionsThiSinh}
                />
              </Row>

              {/* Button Add, Back */}
              <Row className="py-2 justify-content-center">
                {trangThai == 3 ? (
                  <>
                    <Col xs="12" md="3"></Col>
                    <Col xs="12" md="3" className="text-center my-1">
                      <Button
                        variant="contained"
                        color="error"
                        className="button-style"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                          navigate(`/chinhsuacuocthi/${params.idCuocThi}`)
                        }
                      >
                        Back
                      </Button>
                    </Col>
                    <Col xs="12" md="3"></Col>
                  </>
                ) : (
                  <>
                    <Col xs="12" md="3"></Col>
                    <Col xs="12" md="3" className="text-center my-1">
                      <Button
                        variant="contained"
                        className="button-style"
                        startIcon={<Save />}
                        onClick={() => {
                          handleUpdateTietMuc();
                        }}
                      >
                        Save
                      </Button>
                    </Col>
                    <Col xs="12" md="3" className="text-center my-1">
                      <Button
                        variant="contained"
                        color="error"
                        className="button-style"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                          navigate(`/chinhsuacuocthi/${params.idCuocThi}`)
                        }
                      >
                        Back
                      </Button>
                    </Col>
                    <Col xs="12" md="3"></Col>
                  </>
                )}
              </Row>
            </Form>
          </div>

          {/* Modal Thay ?????i ??o??n ?????i */}
          <Modal
            show={show}
            onHide={handleClose}
            dialogClassName="modal-width-80"
          >
            <Modal.Header closeButton className="px-4">
              <Modal.Title className="ms-auto">
                Thay ?????i Th?? Sinh Tr??nh B??y
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Row style={{ padding: "10px 12px" }}>
                <MuiDatatable
                  title="Danh S??ch Th?? sinh"
                  data={dataThiSinhKTB}
                  columns={columnsThiSinhKTB}
                  options={optionsThiSinhKTB}
                />
              </Row>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Row>
                <Col xs="12" md="6">
                  <Button
                    variant="contained"
                    className="modal-button-style"
                    onClick={() => {
                      handleUpdateThiSinhTrinhBay();
                    }}
                  >
                    Change
                  </Button>
                </Col>
                <Col xs="12" md="6">
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
      )}
    </>
  );
}
