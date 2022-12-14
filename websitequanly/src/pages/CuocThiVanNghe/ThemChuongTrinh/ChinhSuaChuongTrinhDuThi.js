/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Form, Row, Col, Tabs, Tab, Spinner, Modal } from "react-bootstrap";
import { useState } from "react";
import "../CuocThiVanNghe.css";
import Axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Edit,
  Add,
  MusicNote,
  AccessTime,
  EditLocationAlt,
  NoteAlt,
  Radio,
  School,
  Mail,
  Phone,
  Delete,
  EmojiEvents,
  Save,
  ArrowBack,
  Person,
  ChangeCircleOutlined,
  Visibility,
} from "@mui/icons-material";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import MuiDatatable from "../../../components/table/MuiDatatable";
import { Button, IconButton, Tooltip as MuiToolTip } from "@mui/material";
import { saveAs } from "file-saver";
import { write, utils } from "xlsx";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function ChinhSuaChuongTrinhDuThi() {
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

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const navigate = useNavigate();
  const params = useParams();
  const dayjs = require("dayjs");

  const [refresh, setRefresh] = useState(-1);
  const [load, setLoad] = useState(true);

  const [dataDonVi, setDataDonVi] = useState([]);

  const [dataThiSinh, setDataThiSinh] = useState([]);
  const [dataTietMuc, setDataTietMuc] = useState([]);
  const [dataGiaiThuong, setDataGiaiThuong] = useState([]);

  const [dataNhomTruong, setDataNhomTruong] = useState([]);

  const [tenCuocThi, setTenCuocThi] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState();
  const [ngayKetThuc, setNgayKetThuc] = useState();
  const [trangThai, setTrangThai] = useState(1);

  const [tenChuongTrinh, setTenChuongTrinh] = useState("");
  const [ngayGioToChuc, setNgayGioToChuc] = useState("");
  const [diaDiemToChuc, setDiaDiemToChuc] = useState("");
  const [giaiThuong, setGiaiThuong] = useState();

  const [donViToChuc, setDonViToChuc] = useState();
  const [noiDungChuongTrinh, setNoiDungChuongTrinh] = useState("");

  const [maNhomTruong, setMaNhomTruong] = useState(-1);
  const [maDoanDoi, setMaDoanDoi] = useState(-1);
  const [hoTenNhomTruong, setHoTenNhomTruong] = useState("");
  const [emailNhomTruong, setEmailNhomTruong] = useState("");
  const [phoneNhomTruong, setPhoneNhomTruong] = useState("");
  const [stt, setSTT] = useState(-1);
  const [refreshNhomTruong, setRefreshNhomTruong] = useState(-1);

  // L???y Th??ng Tin T??? Database
  useEffect(() => {
    const getDataChiTietCT = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/chitietchuongtrinh/${params.idChuongTrinh}`
      );
      setTenChuongTrinh(data[0].TenChuongTrinh);
      setDonViToChuc({ value: data[0].MaDonVi, label: data[0].TenDonVi });
      setNgayGioToChuc(
        data[0].NgayGioToChuc == null
          ? null
          : dayjs(data[0].NgayGioToChuc).format("YYYY-MM-DDTHH:mm")
      );
      setNoiDungChuongTrinh(data[0].NoiDungChuongTrinh);
      setMaNhomTruong(data[0].MaTruongDonVi);
      setHoTenNhomTruong(data[0].TenThiSinh);
      setEmailNhomTruong(data[0].Email);
      setPhoneNhomTruong(data[0].Phone);
      setGiaiThuong({
        value: data[0].MaGiaiThuong,
        label: data[0].TenGiaiThuong,
      });
      setMaDoanDoi(data[0].MaDoanDoi);
    };
    getDataChiTietCT();
  }, [refresh]);

  useEffect(() => {
    const getDataNhomTruong = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/doandoi/nguoidungtruongnhom/${donViToChuc.value}`
      );
      data.forEach((d) => {
        d.GioiTinh = d.GioiTinh == 1 ? "Nam" : "N???";
        let val = d.stt - 1;
        if (d.MaDinhDanh == "" || d.MaDinhDanh == null) d.MaDinhDanh = "Kh??ng";
        if (d.MaLop == "" || d.MaLop == null) d.MaLop = "Kh??ng";
        if (d.MaThiSinh == maNhomTruong) setSTT(val);
      });
      setDataNhomTruong(data);
    };
    getDataNhomTruong();
  }, [refreshNhomTruong]);

  // L???y Th??ng Tin ????n v??? T??? ch???c, ?????a ??i???m T??? Database
  useEffect(() => {
    const getDataChiTietCuocThi = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/tatcacuocthi/${params.idCuocThi}`
      );
      setTenCuocThi(data[0].TenCuocThi);
      setDiaDiemToChuc(data[0].TenDiaDiem);
      setNgayBatDau(dayjs(data[0].NgayBatDau).format("YYYY-MM-DD"));
      setNgayKetThuc(dayjs(data[0].NgayKetThuc).format("YYYY-MM-DD"));
      setTrangThai(data[0].MaTrangThai);
    };
    getDataChiTietCuocThi();
  }, [refresh]);

  useEffect(() => {
    const getDataDonVi = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/donvitochuc"
      );
      let arr = [];
      data.forEach((d) => {
        arr.push({ value: d.MaDonVi, label: d.TenDonVi });
      });
      setDataDonVi(arr);
    };
    getDataDonVi();

    const getDataGiaiThuong = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/giaithuong"
      );
      let arr = [];
      data.forEach((d) => {
        arr.push({ value: d.MaGiaiThuong, label: d.TenGiaiThuong });
      });
      setDataGiaiThuong(arr);
    };
    getDataGiaiThuong();
  }, [refresh]);

  useEffect(() => {
    const getDataTietMucThuocChuongTrinh = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/tietmucthuocchuongtrinh/${params.idChuongTrinh}`
      );
      data.forEach((d) => {
        d.DiemTrungBinh =
          d.DiemTrungBinh == null ? "Ch??a ch???m" : d.DiemTrungBinh;
      });
      setDataTietMuc(data);
    };
    getDataTietMucThuocChuongTrinh();
  }, [refresh]);

  useEffect(() => {
    const getDataThiSinhThamDu = async () => {
      const { data } = await Axios.post(
        `http://localhost:3001/api/admin/thisinhchuongtrinh/${params.idChuongTrinh}`
      );
      data.forEach((d) => (d.GioiTinh = d.GioiTinh == 1 ? "Nam" : "N???"));
      setDataThiSinh(data);
    };
    getDataThiSinhThamDu();
  }, [refresh]);

  const handleUpdateChuongTrinh = () => {
    if (maNhomTruong == -1) {
      alert("Ch??a ch???n Tr?????ng ????n v??? !");
    } else if (tenChuongTrinh == "") {
      alert("T??n Ch????ng tr??nh kh??ng ???????c ????? tr???ng !");
    } else {
      Axios.post(
        `http://localhost:3001/api/admin/updatechuongtrinh/${params.idChuongTrinh}`,
        {
          TenChuongTrinh: tenChuongTrinh,
          DonViToChuc: donViToChuc.value,
          NgayGioToChuc: ngayGioToChuc,
          NoiDungChuongTrinh: noiDungChuongTrinh,
          MaTruongDonVi: maNhomTruong,
          MaGiaiThuong: giaiThuong.value,
          MaDoanDoi: maDoanDoi,
        }
      ).then((response) => {
        document.getElementById("topBtn").click();
        setRefresh(Math.random());
        setTimeout(() => {
          alert("Ch???nh S???a Th??nh C??ng!");
        }, 400);
      });
    }
  };

  const handleDeleteTietMuc = (id) => {
    if (window.confirm("B???n c?? ch???c mu???n X??A Ti???t m???c n??y ?")) {
      Axios.post(`http://localhost:3001/api/admin/deletetietmuc/${id}`).then(
        (response) => {
          setRefresh(Math.random());
        }
      );
    }
  };

  const columnsTietMuc = [
    {
      name: "MaTietMuc",
      options: {
        display: false,
        filter: false,
        viewColumns: false,
        download: false,
      },
    },
    {
      name: "stt",
      label: "STT",
      options: {
        filter: false,
        customHeadLabelRender: (value, tableMeta, updateValue) => {
          return <div style={{ marginLeft: "25px" }}>STT</div>;
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "35px" }}>{value}</div>;
        },
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "TenTietMuc",
      label: "T??n Ti???t M???c",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{value}</div>;
        },
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "TenLoaiTietMuc",
      label: "Lo???i Ti???t M???c",
      options: {
        filterType: "multiselect",
        filterOptions: { fullWidth: true },
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "NhanSo",
      label: "Nh??n S???",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "25px" }}>{value}</div>;
        },
      },
    },
    {
      name: "DiemTrungBinh",
      label: "??i???m TB",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ maxWidth: "220px" }}>
              {value == null ? "..." : value}
            </div>
          );
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
            <MuiToolTip title={trangThai < 3 ? "Edit" : "View Detail"}>
              <IconButton
                edge="end"
                aria-label="edit"
                className={trangThai < 3 ? "edit-hover" : "icon-hover"}
                onClick={() => {
                  navigate(`chinhsuatietmuc/${tableMeta.rowData[0]}`);
                }}
              >
                {trangThai < 3 ? <Edit /> : <Visibility />}
              </IconButton>
            </MuiToolTip>
          );
        },
      },
    },
  ];

  const optionsTietMuc = {
    search: true,
    searchPlaceholder: "T??n Th?? Sinh, Mssv, Email,...",
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "vertical",
    tableBodyHeight: "auto",
    tableBodyMaxHeight: "800px",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: 5,
    selectableRows: "none",
    setCellProps: () => ({ align: "right" }),
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
    customToolbar: () => {
      return (
        <MuiToolTip title={"Th??m Ti???t M???c"}>
          <IconButton
            className="icon-hover"
            onClick={() =>
              navigate(
                `/chinhsuacuocthi/${params.idCuocThi}/chinhsuachuongtrinh/${params.idChuongTrinh}/themtietmuc`
              )
            }
          >
            <Add />
          </IconButton>
        </MuiToolTip>
      );
    },
    onDownload: (buildHead, buildBody, columns, values) => {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      // console.log(values.forEach((val) => console.log(val)));

      const json = values.reduce((result, val) => {
        const temp = {};
        val.data.forEach((v, idx) => {
          if (idx > 0) temp[columns[idx].label] = v;
        });
        result.push(temp);
        return result;
      }, []);

      const fileName = `DanhSachTietMuc`;
      const ws = utils.json_to_sheet(json);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      saveAs(data, fileName + fileExtension);
      // cancel default  CSV download from table
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
        customHeadLabelRender: (value, tableMeta, updateValue) => {
          return <div style={{ marginLeft: "25px" }}>STT</div>;
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "35px" }}>{value}</div>;
        },
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
      name: "MaLop",
      label: "M?? L???p",
      options: {
        filterType: "multiselect",
        filterOptions: { fullWidth: true },
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
  ];

  const optionsThiSinh = {
    search: true,
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "370px",
    tableBodyMaxHeight: "800px",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: 5,
    selectableRows: "none",
    selectToolbarPlacement: "none",
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
    onDownload: (buildHead, buildBody, columns, values) => {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      // console.log(values.forEach((val) => console.log(val)));

      const json = values.reduce((result, val) => {
        const temp = {};
        val.data.forEach((v, idx) => {
          if (idx > 0) temp[columns[idx].label] = v;
        });
        result.push(temp);
        return result;
      }, []);

      const fileName = `DanhSachThiSinh`;
      const ws = utils.json_to_sheet(json);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      saveAs(data, fileName + fileExtension);
      // cancel default  CSV download from table
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

  const columnsTruongNhom = [
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

  const optionsTruongNhom = {
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
    const dt = dataNhomTruong.filter((data) => {
      return data.stt == stt + 1;
    });
    setMaDoanDoi(dt[0].MaDoanDoi);
    setMaNhomTruong(dt[0].MaThiSinh);
    setHoTenNhomTruong(dt[0].TenThiSinh);
    setEmailNhomTruong(dt[0].Email);
    setPhoneNhomTruong(dt[0].Phone);
  };

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("cuocthivannghe").classList.add("actives");
    }, 300);
    document.title =
      "Chi ti???t Ch????ng Tr??nh D??? Thi - Website qu???n l?? c??ng t??c v??n ngh??? Tr?????ng ?????i H???c C???n Th??";
  }, []);

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
      document.getElementById("dstm").classList.remove("d-none");
    }, 400);
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
            <Breadcrumb.Item href="#" tabIndex="-1">
              <Link
                to={`/chinhsuacuocthi/${params.idCuocThi}`}
                className="link"
              >
                {tenCuocThi}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              Ch???nh S???a Ch????ng Tr??nh D??? Thi
            </Breadcrumb.Item>
          </Breadcrumb> */}

          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home" className="link">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/tatcacuocthi" className="link">
                Cu???c Thi V??n Ngh???
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
            <li className="breadcrumb-item active">
              {" "}
              Chi Ti???t Ch????ng Tr??nh D??? Thi
            </li>
          </ol>

          {/* Th??m Ch????ng Tr??nh */}
          <div className="text-start">
            {/* Th??? T??n "Th??m Ch????ng Tr??nh" */}
            <h2 className="text-center d-flex align-items-center justify-content-center pb-2">
              <MusicNote style={{ fontSize: "2.6rem" }} />
              Chi Ti???t Ch????ng Tr??nh D??? Thi
              <MusicNote style={{ fontSize: "2.6rem" }} />
            </h2>
            {/* T??n Ch????ng Tr??nh */}
            <Row className="pb-1">
              <Col xs="12" md={trangThai > 1 ? "8" : "12"}>
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
                    onBlur={(e) => setTenChuongTrinh(e.target.value)}
                    id="tenchuongtrinh"
                    defaultValue={tenChuongTrinh}
                  />
                  <Form.Text className="text-muted">
                    <b style={{ color: "red" }}></b>
                  </Form.Text>
                </Form.Group>
              </Col>
              {trangThai == 1 ? (
                <></>
              ) : (
                <Col xs="12" md="4">
                  {trangThai == 2 ? (
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
                  ) : (
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
                        id="giaithuong"
                        value={giaiThuong.label}
                      />
                      <Form.Text className="text-muted">
                        <b style={{ color: "red" }}></b>
                      </Form.Text>
                    </Form.Group>
                  )}
                </Col>
              )}
            </Row>

            {/* ????n v???, Th???i Gian T??? ch???c */}
            <Row className="pb-1">
              <Col xs="12" md="4">
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

              <Col xs="12" md="4">
                <Form.Group className="mb-3">
                  <Form.Label
                    className="d-flex align-items-center"
                    style={{ fontWeight: "500" }}
                  >
                    <School /> &nbsp;????n V??? T??? Ch???c
                  </Form.Label>

                  <Select
                    options={dataDonVi}
                    value={donViToChuc}
                    id="donvi"
                    onChange={(e) => {
                      setDonViToChuc(e);
                      setHoTenNhomTruong("");
                      setEmailNhomTruong("");
                      setPhoneNhomTruong("");
                      // setSTT(-1);
                    }}
                    className="zIndex-998"
                  />
                  <Form.Text className="text-muted">
                    {/* <b style={{ color: "red" }}>{pricePerformanceMess}</b> */}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col xs="12" md="4">
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
                      minTime={dayjs("2018-01-01T07:00")}
                      maxTime={dayjs("2018-01-01T22:00")}
                      onChange={(newValue) =>
                        setNgayGioToChuc(
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
                        // setRefreshNhomTruong(Math.random());
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
                      <Form.Control type="text" value={hoTenNhomTruong} />
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
                      <Form.Control type="email" value={emailNhomTruong} />
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
                            setRefreshNhomTruong(Math.random());
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
                        value={phoneNhomTruong}
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

            <Row id="dstm" className="d-none">
              <Tabs
                defaultActiveKey="danhsachtietmuc"
                id="uncontrolled-tab-example"
                className="my-3 responsive-tab"
              >
                <Tab eventKey="danhsachtietmuc" title="Ti???t M???c V??n Ngh???">
                  <div>
                    {/* B???ng Ti???t M???c */}
                    <Row style={{ padding: "15px 12px" }}>
                      <MuiDatatable
                        title="Ti???t M???c V??n Ngh???"
                        data={dataTietMuc}
                        columns={columnsTietMuc}
                        options={optionsTietMuc}
                      />
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="danhsachnguoithamdu" title="Th?? Sinh Tham D???">
                  {/* B???ng Sinh Vi??n Tham D??? */}
                  <Row style={{ padding: "15px 12px" }}>
                    <MuiDatatable
                      title="Danh S??ch Th?? Sinh Tham D???"
                      data={dataThiSinh}
                      columns={columnsThiSinh}
                      options={optionsThiSinh}
                    />
                  </Row>
                </Tab>
              </Tabs>
            </Row>

            {/* Button Add, Back */}
            <Row className="pt-2 justify-content-center">
              {trangThai > 2 ? (
                <>
                  <Col xs="12" md="3"></Col>
                  <Col xs="12" md="3" className="my-1">
                    <Button
                      variant="contained"
                      color="error"
                      style={{ padding: "7px 70px" }}
                      onClick={() =>
                        navigate(
                          `/chinhsuacuocthi/truyenthong/${params.idCuocThi}`
                        )
                      }
                      startIcon={<ArrowBack />}
                    >
                      Back
                    </Button>
                  </Col>
                  <Col xs="12" md="3"></Col>
                </>
              ) : (
                <>
                  <Col xs="12" md="3"></Col>
                  <Col xs="12" md="3" className="my-1">
                    <Button
                      variant="contained"
                      className="button-style"
                      onClick={() => {
                        handleUpdateChuongTrinh();
                      }}
                      startIcon={<Save />}
                    >
                      Save
                    </Button>
                  </Col>
                  <Col xs="12" md="3" className="my-1">
                    <Button
                      variant="contained"
                      color="error"
                      className="button-style"
                      onClick={() =>
                        navigate(
                          `/chinhsuacuocthi/truyenthong/${params.idCuocThi}`
                        )
                      }
                      startIcon={<ArrowBack />}
                    >
                      Back
                    </Button>
                  </Col>
                  <Col xs="12" md="3"></Col>
                </>
              )}
            </Row>
          </div>

          <Modal
            show={show}
            onHide={handleClose}
            className="modal-lg"
            dialogClassName="modal-width"
          >
            <Modal.Header closeButton className="px-4">
              <Modal.Title className="ms-auto">
                Thay ?????i Tr?????ng ????n V???
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row style={{ padding: "10px 24px" }}>
                <MuiDatatable
                  title="Danh S??ch Tr?????ng Nh??m"
                  data={dataNhomTruong}
                  columns={columnsTruongNhom}
                  options={optionsTruongNhom}
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
      )}
    </>
  );
}
