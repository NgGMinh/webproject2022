/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Row, Spinner, Modal, Form, Col } from "react-bootstrap";
import Axios from "axios";
import { Button, IconButton, Tooltip as MuiToolTip } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import MuiDatatable from "../../../../components/table/MuiDatatable";
import { saveAs } from "file-saver";
import { write, utils } from "xlsx";

export default function TatCaGiaiThuong() {
  const [dataGiaiThuong, setDataGiaiThuong] = useState([]);

  const [refresh, setRefresh] = useState(-1);
  const [load, setLoad] = useState(false);

  const [tableBodyHeight, setTableBodyHeight] = useState("450px");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [show, setShow] = useState(false);
  const [maGiaiThuong, setMaGiaiThuong] = useState(-1);
  const [tenGiaiThuong, setTenGiaiThuong] = useState("");

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setMaGiaiThuong(-1);
      setTenGiaiThuong("");
    }, 100);
  };

  useEffect(() => {
    const getDataGiaiThuong = async () => {
      const { data } = await Axios.post(
        "http://localhost:3001/api/admin/giaithuong"
      );
      setDataGiaiThuong(data);
    };
    getDataGiaiThuong();
  }, [refresh]);

  const columnsGiaiThuong = [
    {
      name: "MaGiaiThuong",
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
        sortThirdClickReset: true,
        sortDescFirst: true,
        customHeadLabelRender: (value, tableMeta, updateValue) => {
          return <div style={{ paddingLeft: "25px", width: "0px" }}>STT</div>;
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ paddingLeft: "35px", width: "0px" }}>{value}</div>
          );
        },
      },
    },
    {
      name: "TenGiaiThuong",
      label: "T??n Gi???i Th?????ng",
      options: {
        filter: false,
        sortThirdClickReset: true,
        sortDescFirst: true,
        customHeadLabelRender: (value, tableMeta, updateValue) => {
          return <div>T??n Gi???i Th?????ng</div>;
        },
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
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "20px",
                }}
              >
                <MuiToolTip title="Edit">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    className="edit-hover"
                  >
                    <Edit
                      onClick={() => {
                        setMaGiaiThuong(tableMeta.rowData[0]);
                        setTenGiaiThuong(tableMeta.rowData[2]);
                        setShow(true);
                      }}
                    />
                  </IconButton>
                </MuiToolTip>
              </div>
            </>
          );
        },
      },
    },
  ];

  const optionsGiaiThuong = {
    search: true,
    download: true,
    print: false,
    viewColumns: true,
    filter: false,
    filterType: "dropdown",
    responsive: "vertical",
    tableBodyHeight: tableBodyHeight,
    tableBodyMaxHeight: "auto",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: rowsPerPage,
    selectableRows: "none",
    setCellProps: () => ({ align: "right" }),
    customToolbar: () => {
      return (
        <MuiToolTip title={"Th??m Gi???i Th?????ng"}>
          <IconButton className="icon-hover" onClick={() => setShow(true)}>
            <Add />
          </IconButton>
        </MuiToolTip>
      );
    },
    onChangeRowsPerPage: (number) => {
      if (number > 5) {
        setTableBodyHeight("auto");
        setRowsPerPage(number);
      } else {
        setTableBodyHeight("450px");
        setRowsPerPage(number);
      }
    },
    page: page,
    onChangePage: (number) => {
      setPage(number);
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

  const handleAddGiaiThuong = () => {
    if (tenGiaiThuong == "") {
      alert("T??n gi???i th?????ng kh??ng ???????c ????? tr???ng !");
    } else {
      Axios.post(`http://localhost:3001/api/admin/themgiaithuong`, {
        TenGiaiThuong: tenGiaiThuong,
      }).then((response) => {
        setRefresh(Math.random());
        handleClose();
        setTimeout(() => {
          alert("Th??m gi???i th?????ng th??nh c??ng!");
        }, 400);
      });
    }
  };

  const handleUpdateGiaiThuong = () => {
    if (tenGiaiThuong == "") {
      alert("T??n gi???i th?????ng kh??ng ???????c ????? tr???ng !");
    } else {
      Axios.post(
        `http://localhost:3001/api/admin/updategiaithuong/${maGiaiThuong}`,
        {
          TenGiaiThuong: tenGiaiThuong,
        }
      ).then((response) => {
        setRefresh(Math.random());
        handleClose();
        setTimeout(() => {
          alert("C???p nh???t gi???i th?????ng th??nh c??ng!");
        }, 400);
      });
    }
  };

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 300);
  }, [refresh]);

  return (
    <>
      {load ? (
        <div style={{ position: "relative", width: "100%", height: "510px" }}>
          <Spinner
            animation="border"
            variant="primary"
            id="spinner"
            style={{
              position: "absolute",
              top: "50%",
              left: "49%",
              width: "50px",
              height: "50px",
            }}
          />
        </div>
      ) : (
        <>
          <Row style={{ padding: "0px 10px" }}>
            <MuiDatatable
              title="Danh S??ch Gi???i Th?????ng"
              data={dataGiaiThuong}
              columns={columnsGiaiThuong}
              options={optionsGiaiThuong}
            />
          </Row>
          <Modal show={show} onHide={handleClose} className="modal-lg">
            <Modal.Header closeButton className="px-4">
              <Modal.Title className="ms-auto">
                {maGiaiThuong == -1
                  ? "Th??m Gi???i Th?????ng"
                  : "Ch???nh S???a Gi???i Th?????ng"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Form.Group className="mb-3">
                    <Form.Label>T??n Gi???i Th?????ng</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nh???p T??n Gi???i Th?????ng..."
                      defaultValue={tenGiaiThuong}
                      onBlur={(e) => setTenGiaiThuong(e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Row>
                <Col xs="12" md="6">
                  <Button
                    variant="contained"
                    className="modal-button-style"
                    onClick={() => {
                      if (maGiaiThuong == -1) {
                        handleAddGiaiThuong();
                      } else {
                        handleUpdateGiaiThuong();
                      }
                    }}
                  >
                    {maGiaiThuong == -1 ? "Add" : "Save"}
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
