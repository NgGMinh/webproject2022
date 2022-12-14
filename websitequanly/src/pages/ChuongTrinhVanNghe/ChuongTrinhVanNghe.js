/* eslint-disable eqeqeq */
import { Row, Col, Form } from "react-bootstrap";
import { Edit, ManageSearch, MusicNote } from "@mui/icons-material";
import React, { useEffect } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, IconButton, Tooltip as MuiToolTip } from "@mui/material";
import MuiDatatable from "../../components/table/MuiDatatable";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { saveAs } from "file-saver";
import { write, utils } from "xlsx";

export default function ChuongTrinhVanNghe() {
  const navigate = useNavigate();

  const dayjs = require("dayjs");
  const [tableBodyHeight, setTableBodyHeight] = useState("480px");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const columnsChuongTrinh = [
    {
      name: "MaCuocThi",
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
      name: "MaChuongTrinh",
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

    //STT
    {
      name: "stt",
      label: "STT",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
        customHeadLabelRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "10px" }}>STT</div>;
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "25px" }}>{value}</div>;
        },
      },
    },

    //T??n Ch????ng Tr??nh
    {
      name: "TenChuongTrinh",
      label: "T??n Ch????ng Tr??nh",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "280px" }}>{value}</div>;
        },
      },
    },
    {
      name: "SapLich",
      label: "S???p L???ch",
      options: {
        display: false,
        viewColumns: false,
        filterType: "multiselect",
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    //Ng??y Gi??? T??? Ch???c
    {
      name: "NgayGioToChuc",
      label: "Th???i Gian",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "220px" }}>{value}</div>;
        },
      },
    },

    //?????a ??i???m T??? Ch???c
    {
      name: "TenDiaDiem",
      label: "?????a ??i???m",
      options: {
        filterType: "multiselect",
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    //Thu???c Khoa
    {
      name: "TenDonVi",
      label: "????n v??? T??? ch???c",
      options: {
        filterType: "multiselect",
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "180px" }}>{value}</div>;
        },
      },
    },
    {
      name: "ChamDiem",
      label: "Ch???m ??i???m",
      options: {
        display: false,
        viewColumns: false,
        filterType: "multiselect",
        sortThirdClickReset: true,
        sortDescFirst: true,
      },
    },
    {
      name: "DiemTrungBinh",
      label: "??i???m Thi",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "290px" }}>{value}</div>;
        },
      },
    },
    {
      name: "TenGiaiThuong",
      label: "Gi???i",
      options: {
        filterType: "multiselect",
        filterOptions: { fullWidth: true },
        sortThirdClickReset: true,
        sortDescFirst: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div style={{ maxWidth: "290px" }}>{value}</div>;
        },
      },
    },

    //Xem Chi Ti???t / Ch???nh S???a
    {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        print: false,
        disableColumnMenu: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <MuiToolTip title="Edit">
              <IconButton
                edge="end"
                aria-label="edit"
                className="edit-hover"
                onClick={() => {
                  navigate(
                    `/chinhsuacuocthi/${tableMeta.rowData[0]}/chinhsuachuongtrinh/${tableMeta.rowData[1]}`
                  );
                }}
              >
                <Edit />
              </IconButton>
            </MuiToolTip>
          );
        },
      },
    },
  ];

  const optionsChuongTrinh = {
    search: true,
    searchPlaceholder: "T??n Ch????ng Tr??nh, ?????a ??i???m, Ng??y T??? Ch???c,...",
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: tableBodyHeight,
    tableBodyMaxHeight: "auto",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: rowsPerPage,
    selectableRows: "none",
    page: page,
    onChangePage: (number) => {
      setPage(number);
    },
    onChangeRowsPerPage: (number) => {
      if (number > 5) {
        setTableBodyHeight("auto");
        setRowsPerPage(number);
      } else {
        setTableBodyHeight("480px");
        setRowsPerPage(number);
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

      // console.log(values.forEach((val) => console.log(val)));

      const json = values.reduce((result, val) => {
        const temp = {};
        val.data.forEach((v, idx) => {
          temp[columns[idx].label] = v;
        });
        result.push(temp);
        return result;
      }, []);

      const fileName = `DanhSachThongKe`;
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

  const [dt, setDT] = useState([]);
  const [selectRadio, setSelectRadio] = useState(1);
  const [dataNguyenBan, setDataNguyenBan] = useState([]);

  useEffect(() => {
    const getDataChuongTrinh = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/tatcachuongtrinh"
      );
      data.forEach((d) => {
        if (d.DiemTrungBinh == null) {
          d.DiemTrungBinh = "Ch??a ch???m";
          d.TenGiaiThuong = "Ch??a x??t";
          d.ChamDiem = "Ch??a ch???m";
        } else {
          d.ChamDiem = "???? ch???m";
        }
        if (d.NgayGioToChuc == null) {
          d.NgayGioToChuc = "Ch??a s???p l???ch";
          d.SapLich = "Ch??a s???p l???ch";
        } else {
          d.NgayGioToChuc = dayjs(d.NgayGioToChuc).format("HH:mm, DD/MM/YYYY");
          d.SapLich = "???? s???p l???ch";
        }
      });
      setDT(data);
      setDataNguyenBan(data);
    };
    getDataChuongTrinh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRadioChange = (e) => {
    setBatDau(null);
    setKetThuc(null);
    setSelectRadio(e.target.value);
  };
  const [batDau, setBatDau] = useState(null);
  const [ketThuc, setKetThuc] = useState(null);

  const handleFilter = () => {
    if (selectRadio == 1) {
      Axios.post(`http://localhost:3001/api/admin/filterchuongtrinh/ngay`, {
        NgayBatDau: batDau,
        NgayKetThuc: ketThuc,
      }).then((response) => {
        const data = response.data;
        data.forEach((d) => {
          if (d.DiemTrungBinh == null) {
            d.DiemTrungBinh = "Ch??a ch???m";
            d.TenGiaiThuong = "Ch??a x??t";
            d.ChamDiem = "Ch??a ch???m";
          } else {
            d.ChamDiem = "???? ch???m";
          }
          if (d.NgayGioToChuc == null) {
            d.NgayGioToChuc = "Ch??a s???p l???ch";
            d.SapLich = "Ch??a s???p l???ch";
          } else {
            d.NgayGioToChuc = dayjs(d.NgayGioToChuc).format(
              "HH:mm, DD/MM/YYYY"
            );
            d.SapLich = "???? s???p l???ch";
          }
        });
        setDT(data);
      });
    }
    if (selectRadio == 2) {
      Axios.post(`http://localhost:3001/api/admin/filterchuongtrinh/thang`, {
        NgayBatDau: batDau,
        NgayKetThuc: ketThuc,
      }).then((response) => {
        const data = response.data;
        data.forEach((d) => {
          if (d.DiemTrungBinh == null) {
            d.DiemTrungBinh = "Ch??a ch???m";
            d.TenGiaiThuong = "Ch??a x??t";
            d.ChamDiem = "Ch??a ch???m";
          } else {
            d.ChamDiem = "???? ch???m";
          }
          if (d.NgayGioToChuc == null) {
            d.NgayGioToChuc = "Ch??a s???p l???ch";
            d.SapLich = "Ch??a s???p l???ch";
          } else {
            d.NgayGioToChuc = dayjs(d.NgayGioToChuc).format(
              "HH:mm, DD/MM/YYYY"
            );
            d.SapLich = "???? s???p l???ch";
          }
        });
        setDT(data);
      });
    }
    if (selectRadio == 3) {
      Axios.post(`http://localhost:3001/api/admin/filterchuongtrinh/nam`, {
        NgayBatDau: batDau,
        NgayKetThuc: ketThuc,
      }).then((response) => {
        const data = response.data;
        data.forEach((d) => {
          if (d.DiemTrungBinh == null) {
            d.DiemTrungBinh = "Ch??a ch???m";
            d.TenGiaiThuong = "Ch??a x??t";
            d.ChamDiem = "Ch??a ch???m";
          } else {
            d.ChamDiem = "???? ch???m";
          }
          if (d.NgayGioToChuc == null) {
            d.NgayGioToChuc = "Ch??a s???p l???ch";
            d.SapLich = "Ch??a s???p l???ch";
          } else {
            d.NgayGioToChuc = dayjs(d.NgayGioToChuc).format(
              "HH:mm, DD/MM/YYYY"
            );
            d.SapLich = "???? s???p l???ch";
          }
        });
        setDT(data);
      });
    }
  };

  return (
    <>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/home" className="link">
            Home
          </Link>
        </li>
        <li className="breadcrumb-item active">Ch????ng Tr??nh V??n Ngh???</li>
      </ol>

      <div className="text-start pb-1">
        <h2 className="text-center d-flex align-items-center justify-content-center pb-2">
          <MusicNote style={{ fontSize: "2.6rem" }} />
          Qu???n L?? Ch????ng Tr??nh V??n Ngh???
          <MusicNote style={{ fontSize: "2.6rem" }} />
        </h2>{" "}
        <Row className="d-flex align-items-center">
          <Col xs="12" md="5">
            <div
              className="p-0 m-0 d-flex align-items-center justify-content-between"
              style={{ fontWeight: "500" }}
            >
              <span>
                <ManageSearch /> L???c Theo Th???i Gian: &nbsp;
              </span>
              <Form.Check
                type="radio"
                value="1"
                name="date"
                label={"Ng??y"}
                defaultChecked
                onChange={(e) => handleRadioChange(e)}
                // style={{ marginRight: "50px" }}
              />
              <Form.Check
                type="radio"
                value="2"
                name="date"
                label={"Th??ng"}
                onChange={(e) => handleRadioChange(e)}
                // style={{ marginRight: "50px" }}
              />
              <Form.Check
                type="radio"
                value="3"
                name="date"
                label={"N??m"}
                onChange={(e) => handleRadioChange(e)}
                // style={{ marginRight: "50px" }}
              />
            </div>
          </Col>
          <Col
            xs="12"
            md="7"
            className="pt-1 pb-2"
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "flex-end",
            }}
          >
            {selectRadio == 1 && (
              <>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  id="ngaybatdau"
                >
                  <DesktopDatePicker
                    inputFormat="DD/MM/YYYY"
                    value={batDau}
                    label="Ng??y B???t ?????u"
                    maxDate={ketThuc}
                    onChange={(newValue) =>
                      setBatDau(dayjs(newValue).format("YYYY-MM-DD"))
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" helperText={null} />
                    )}
                  />
                </LocalizationProvider>
                &nbsp; - &nbsp;
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  id="ngayketthuc"
                >
                  <DesktopDatePicker
                    inputFormat="DD/MM/YYYY"
                    value={ketThuc}
                    minDate={batDau}
                    label="Ng??y K???t Th??c"
                    onChange={(newValue) =>
                      setKetThuc(dayjs(newValue).format("YYYY-MM-DD"))
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" helperText={null} />
                    )}
                  />
                </LocalizationProvider>
              </>
            )}
            {selectRadio == 2 && (
              <>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  id="thangbatdau"
                >
                  <DesktopDatePicker
                    inputFormat="MM/YYYY"
                    views={["year", "month"]}
                    value={batDau}
                    maxDate={ketThuc}
                    label="Th??ng B???t ?????u"
                    onChange={(newValue) =>
                      setBatDau(dayjs(newValue).format("YYYY-MM"))
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" helperText={null} />
                    )}
                  />
                </LocalizationProvider>
                &nbsp; - &nbsp;
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  id="thangketthuc"
                >
                  <DesktopDatePicker
                    inputFormat="MM/YYYY"
                    views={["year", "month"]}
                    value={ketThuc}
                    minDate={batDau}
                    label="Th??ng K???t Th??c"
                    onChange={(newValue) =>
                      setKetThuc(dayjs(newValue).format("YYYY-MM"))
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" helperText={null} />
                    )}
                  />
                </LocalizationProvider>
              </>
            )}
            {selectRadio == 3 && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs} id="nambatdau">
                  <DesktopDatePicker
                    inputFormat="YYYY"
                    views={["year"]}
                    value={batDau}
                    maxDate={ketThuc}
                    label="N??m B???t ?????u"
                    onChange={(newValue) =>
                      setBatDau(dayjs(newValue).format("YYYY"))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        helperText={null}
                        className="focus-d"
                      />
                    )}
                  />
                </LocalizationProvider>
                &nbsp; - &nbsp;
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  id="namketthuc"
                >
                  <DesktopDatePicker
                    inputFormat="YYYY"
                    views={["year"]}
                    value={ketThuc}
                    minDate={batDau}
                    label="N??m K???t Th??c"
                    onChange={(newValue) =>
                      setKetThuc(dayjs(newValue).format("YYYY"))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        helperText={null}
                        className="focus-d"
                      />
                    )}
                  />
                </LocalizationProvider>
              </>
            )}
            {/* &nbsp;
            <Button onClick={handleFilter}>Search</Button>&nbsp;
            {onSearch == true ? (
              <Button
                variant="outline-danger"
                onClick={() => {
                  setDT(dataNguyenBan);
                  setOnSearch(false);
                }}
              >
                Clear
              </Button>
            ) : (
              <></>
            )} */}
            &nbsp;
            <Button
              variant="contained"
              sx={{ padding: "7px 10px 5px 10px" }}
              onClick={handleFilter}
            >
              Filter
            </Button>
            &nbsp;
            <Button
              variant="contained"
              color="error"
              sx={{ padding: "7px 10px 5px 10px" }}
              onClick={() => {
                setDT(dataNguyenBan);
                setBatDau(null);
                setKetThuc(null);
                setPage(0);
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
        <Row style={{ padding: "0px 10px" }}>
          <MuiDatatable
            title="Danh S??ch Ch????ng Tr??nh V??n Ngh???"
            data={dt}
            columns={columnsChuongTrinh}
            options={optionsChuongTrinh}
          />
        </Row>
      </div>
    </>
  );
}
