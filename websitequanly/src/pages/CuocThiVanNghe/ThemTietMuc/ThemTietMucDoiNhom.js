/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import "../CuocThiVanNghe.css";
import {
  AccessTime,
  Add,
  ArrowBack,
  ConfirmationNumber,
  Edit,
  MusicNote,
  NoteAlt,
  QueueMusicRounded,
} from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
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
import { saveAs } from "file-saver";
import { write, utils } from "xlsx";

export default function ThemTietMucDoiNhom() {
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

  const [tableBodyHeight, setTableBodyHeight] = useState("600px");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [dataLoaiTietMuc, setDataLoaiTietMuc] = useState([]);
  const [dataCTLoaiTietMuc, setDataCTLoaiTietMuc] = useState([]);
  const [loaiCoDinh, setLoaiCoDinh] = useState(0);
  const [nhanSoTT, setNhanSoTT] = useState(2);

  const [dataDoanDoi, setDataDoanDoi] = useState([]);
  const [dataMaGiamKhao, setDataMaGiamKhao] = useState([]);

  const [tenCuocThi, setTenCuocThi] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState();
  const [ngayKetThuc, setNgayKetThuc] = useState();
  const [maDoanDoi, setMaDoanDoi] = useState(-1);

  const [tenTietMuc, setTenTietMuc] = useState("");
  const [loaiTietMuc, setLoaiTietMuc] = useState(3);
  const [nhanSo, setNhanSo] = useState("");
  const [noiDungTietMuc, setNoiDungTietMuc] = useState("");
  const [thoiGianThucHien, setThoiGianThucHien] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [refresh, setRefresh] = useState(1);
  const [ltmRefresh, setLTMRefresh] = useState(-1);

  const handleChangeNhanSo = (event) => {
    setNhanSo(event.target.value);
  };

  // L???y Th??ng Tin ????n v??? T??? ch???c, ?????a ??i???m T??? Database
  useEffect(() => {
    const getDataLoaiTietMuc = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/loaitietmuc"
      );
      setDataCTLoaiTietMuc(data);
      let arr = [];
      data.forEach((d) => {
        if (d.MaPhanThi == 2) {
          arr.push({ value: d.MaLoaiTietMuc, label: d.TenLoaiTietMuc });
        }
      });
      setDataLoaiTietMuc(arr);
      setLoaiTietMuc(arr[0]);
    };
    getDataLoaiTietMuc();

    const getDataGiamKhao = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/allmagiamkhao/${params.idCuocThi}`
      );

      setDataMaGiamKhao(data);
    };
    getDataGiamKhao();
  }, []);

  useEffect(() => {
    const getDataChiTietCuocThi = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/tatcacuocthi/${params.idCuocThi}`
      );
      setTenCuocThi(data[0].TenCuocThi);
      setNgayBatDau(dayjs(data[0].NgayBatDau).format("YYYY-MM-DD"));
      setNgayKetThuc(dayjs(data[0].NgayKetThuc).format("YYYY-MM-DD"));
    };
    getDataChiTietCuocThi();
  }, []);

  useEffect(() => {
    if (params.idVongThi == 1) {
      if (loaiCoDinh == 0) {
        const getDataDoanDoi = async () => {
          const { data } = await Axios.post(
            `http://localhost:3001/api/admin/doandoiconhansotoithieu/${nhanSoTT}`
          );
          setDataDoanDoi(data);
        };
        getDataDoanDoi();
      } else {
        const getDataDoanDoi = async () => {
          const { data } = await Axios.post(
            `http://localhost:3001/api/admin/doandoiconhanphuhop/codinh/${nhanSoTT}`
          );
          setDataDoanDoi(data);
        };
        getDataDoanDoi();
      }
    }

    if (params.idVongThi == 2) {
      const getDataDoanDoi = async () => {
        const { data } = await Axios.post(
          `http://localhost:3001/api/admin/doandoidauvongtruoc/${params.idCuocThi}/vongthi/1/nhanso/${nhanSoTT}`
        );

        setDataDoanDoi(data);
      };
      getDataDoanDoi();
    }

    if (params.idVongThi == 3) {
      const getDataDoanDoi = async () => {
        const { data } = await Axios.post(
          `http://localhost:3001/api/admin/doandoidauvongtruoc/${params.idCuocThi}/vongthi/2/nhanso/${nhanSoTT}`
        );

        setDataDoanDoi(data);
      };
      getDataDoanDoi();
    }
  }, [refresh, ltmRefresh]);

  const columnsDoanDoi = [
    {
      name: "MaDoanDoi",
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
    {
      name: "TenDoanDoi",
      label: "T??n ??o??n ?????i",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "220px" }}>{value}</div>;
        },
      },
    },

    { name: "TenNhomTruong", label: "Tr?????ng Nh??m" },
    {
      name: "Email",
      label: "Email Tr?????ng Nh??m",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ maxWidth: "200px", lineBreak: "anywhere" }}>
              {value}
            </div>
          );
        },
      },
    },
    { name: "Phone", label: "Phone" },
    { name: "SoLuongThanhVien", label: "S??? S???" },
    {
      name: "TenDonVi",
      label: "Thu???c ????n v???",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "180px" }}>{value}</div>;
        },
      },
    },
    {
      name: "",
      options: {
        filter: true,
        sort: false,
        empty: true,
        disableColumnMenu: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <a
              href={`/chinhsuadoandoi/${tableMeta.rowData[0]}`}
              target="_blank"
              rel="noreferrer"
            >
              <IconButton edge="end" aria-label="edit">
                <Edit />
              </IconButton>
            </a>
          );
        },
      },
    },
  ];

  const optionsDoanDoi = {
    search: true,
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "auto",
    tableBodyMaxHeight: "auto",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: rowsPerPage,
    selectableRows: "single",
    page: page,
    selectToolbarPlacement: "none",
    onChangePage: (number) => {
      setPage(number);
    },
    onChangeRowsPerPage: (number) => {
      if (number > 5) {
        setTableBodyHeight("auto");
        setRowsPerPage(number);
      } else {
        setTableBodyHeight("600px");
        setRowsPerPage(number);
      }
    },
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      if (rowsSelected == "") {
        setMaDoanDoi(-1);
      } else {
        let data = dataDoanDoi.filter((data) => {
          return data.stt == rowsSelected[0] + 1;
        });
        setMaDoanDoi(data[0].MaDoanDoi);
        setNhanSo(data[0].SoLuongThanhVien);
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

      const fileName = `DanhSachDoiNhom`;
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

  const handleAddTietMuc = () => {
    if (tenTietMuc == "") {
      alert("T??n ti???t m???c kh??ng ???????c ????? tr???ng!");
    } else if (maDoanDoi == -1) {
      alert("Ch??a ch???n ??o??n ?????i tr??nh b??y !!!");
    } else if (dataMaGiamKhao.length > 0) {
      Axios.post(
        `http://localhost:3001/api/admin/addtietmucdoinhom/${params.idCuocThi}/vongthi/${params.idVongThi}`,
        {
          TenTietMuc: tenTietMuc,
          MaLoaiTietMuc: loaiTietMuc.value,
          NgayGioThucHien: thoiGianThucHien,
          NhanSo: nhanSo,
          NoiDungTietMuc: noiDungTietMuc,
          MaDoanDoi: maDoanDoi,
          arrMaGiamKhao: dataMaGiamKhao,
        }
      ).then((response) => {
        navigate(`/chinhsuacuocthi/${params.idCuocThi}`);
        setTimeout(() => {
          alert("Th??m Ti???t M???c Th??nh C??ng!");
        }, 400);
      });
    } else {
      Axios.post(
        `http://localhost:3001/api/admin/addtietmucdoinhom/khonggiamkhao/${params.idCuocThi}/vongthi/${params.idVongThi}`,
        {
          TenTietMuc: tenTietMuc,
          MaLoaiTietMuc: loaiTietMuc.value,
          NgayGioThucHien: thoiGianThucHien,
          NhanSo: nhanSo,
          NoiDungTietMuc: noiDungTietMuc,
          MaDoanDoi: maDoanDoi,
        }
      ).then((response) => {
        navigate(`/chinhsuacuocthi/${params.idCuocThi}`);
        setTimeout(() => {
          alert("Th??m Ti???t M???c Th??nh C??ng!");
        }, 400);
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      document.title =
        "Th??m ti???t m???c ?????i nh??m- Website qu???n l?? c??ng t??c v??n ngh???";
      document.getElementById("cuocthivannghe").classList.add("actives");
    }, 100);
  });

  return (
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
          <Link to={`/chinhsuacuocthi/${params.idCuocThi}`} className="link">
            {tenCuocThi}
          </Link>
        </li>

        <li className="breadcrumb-item active">Th??m Ti???t M???c</li>
      </ol>
      {/* <Breadcrumb>
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
        <Breadcrumb.Item href="#" tabIndex="-1" style={{ textAlign: "left" }}>
          <Link
            to={`/chinhsuacuocthi/dangkytudo/${params.idCuocThi}`}
            className="link"
          >
            {tenCuocThi}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Th??m Ti???t M???c</Breadcrumb.Item>
      </Breadcrumb> */}

      {/* Th??m Ti???t M???c */}
      <div className="text-start">
        <h2 className="text-center d-flex align-items-center justify-content-center pb-2">
          <MusicNote style={{ fontSize: "2.6rem" }} />
          Th??m Ti???t M???c D??? Thi
          <MusicNote style={{ fontSize: "2.6rem" }} />
        </h2>
        <Form>
          {/* T??n Ti???t M???c, ????n V??? T??? Ch???c */}
          <Row>
            {/* T??n Ti???t M???c */}
            <Col xs="12">
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
                  required
                  id="tentietmuc"
                  defaultValue={tenTietMuc}
                  onBlur={(e) => setTenTietMuc(e.target.value)}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Lo???i Ti???t M???c, Nh??n S???, Th???i Gian Th???c Hi???n */}
          <Row>
            {/* Lo???i Ti???t M???c */}
            <Col xs="12" md="8">
              <Row>
                <Col xs="12" md="8">
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
                      onChange={(e) => {
                        setLoaiTietMuc(e);
                        let value = dataCTLoaiTietMuc.filter((d) => {
                          return d.MaLoaiTietMuc == e.value;
                        });
                        if (value[0].CoDinh == 1) {
                          setNhanSo(value[0].NhanSoToiThieu);
                          setLoaiCoDinh(value[0].CoDinh);
                          setNhanSoTT(value[0].NhanSoToiThieu);
                          setLTMRefresh(Math.random());
                        } else {
                          setNhanSo("");
                          setLoaiCoDinh(value[0].CoDinh);
                          setNhanSoTT(value[0].NhanSoToiThieu);
                          setLTMRefresh(Math.random());
                        }
                      }}
                      className="zIndex-997"
                    />
                  </Form.Group>
                </Col>
                {/* Nh??n S??? */}
                <Col xs="12" md="4">
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="d-flex align-items-center"
                      style={{ fontWeight: "500" }}
                    >
                      <ConfirmationNumber />
                      &nbsp;
                      {loaiCoDinh == 0
                        ? `Nh??n S??? (T???i thi???u: ${nhanSoTT})`
                        : "Nh??n S???"}
                    </Form.Label>
                    {loaiCoDinh == 0 ? (
                      <Form.Control
                        type="number"
                        placeholder="Nh???p S??? l?????ng tham gia..."
                        value={nhanSo}
                        onChange={(e) => handleChangeNhanSo(e)}
                      />
                    ) : (
                      <Form.Control
                        type="number"
                        placeholder="Nh???p S??? l?????ng tham gia..."
                        value={nhanSo}
                        readOnly
                      />
                    )}
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
            Th??m ?????i Nh??m Tr??nh B??y
            <MusicNote style={{ fontSize: "2.6rem" }} />
          </h2>

          {/* B???ng Th?? Sinh Thu???c ????n V??? */}
          <Row className="mx-0 justify-content-end">
            <>
              <MuiDatatable
                title="Danh s??ch ??o??n ?????i"
                data={dataDoanDoi}
                columns={columnsDoanDoi}
                options={optionsDoanDoi}
              />
            </>
          </Row>

          {/* Button Add, Back */}
          <Row className="pt-2">
            <Col xs="12" md="3"></Col>

            <Col xs="12" md="3" className="text-center my-1">
              <Button
                variant="contained"
                className="button-style"
                startIcon={<Add />}
                onClick={handleAddTietMuc}
              >
                Add
              </Button>
            </Col>
            <Col xs="12" md="3" className="text-center my-1">
              <Button
                variant="contained"
                color="error"
                className="button-style"
                startIcon={<ArrowBack />}
                onClick={() => navigate(`/chinhsuacuocthi/${params.idCuocThi}`)}
              >
                Back
              </Button>
            </Col>
            <Col xs="12" md="3"></Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
