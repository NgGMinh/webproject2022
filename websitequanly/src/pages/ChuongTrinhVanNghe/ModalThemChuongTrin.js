import React from "react";
import { Form, Row, Col, Button, Card, Modal } from "react-bootstrap";
import { useState } from "react";
import "./ChuongTrinhVanNghe.css";
// import Axios from "axios";
import {
  AccessAlarm,
  AccessTime,
  ConfirmationNumber,
  Edit,
  GroupRounded,
  MusicNote,
  NoteAlt,
  QueueMusicRounded,
} from "@mui/icons-material";
import MUIDataTable from "mui-datatables";

import { TableRow, TableCell, IconButton } from "@mui/material";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Font from "@ckeditor/ckeditor5-font/src/font";
import {
  dataDoanDoi,
  dataThiSinh,
  dataThiSinhDoanDoi1,
  dataThiSinhDoanDoi2,
  dataThiSinhDoanDoi3,
  dataThiSinhDoanDoi4,
  dataThiSinhDoanDoi5,
  dataLoaiTietMuc,
} from "../../SampleData";

import { CDBCollapse } from "cdbreact";
import BangDoanDoi from "../../components/table/BangDoanDoi";
import BangThiSinh from "../../components/table/BangThiSinh";

export default function ModalThemChuongTrinh(props) {
  const [showDanhSachThiSinh, setShowDanhSachThiSinh] = useState("thisinh");
  // const [loaiTietMuc, setLoaiTietMuc] = useState("");
  const [trinhBay, setTrinhBay] = useState(2);
  const [themLoaiTietMuc, setThemLoaiTietMuc] = useState(false);
  const [nhanSo, setNhanSo] = useState(1);

  const handleShowThemLoaiTietMuc = () => setThemLoaiTietMuc(!themLoaiTietMuc);

  const handleSelectTrinhBay = (event) => {
    const val = event.target.value;
    setTrinhBay(val);
  };

  const handleChangeLoaiTietMuc = (event) => {
    const loai = event.target.value;
    // setLoaiTietMuc(loai);
    if (loai > 5) {
      document.getElementById("chuongtrinhtrinhbayboi").value = "1";
      setTrinhBay(1);
      setNhanSo("");
    }
    if (loai <= 5) {
      document.getElementById("chuongtrinhtrinhbayboi").value = "2";
      setTrinhBay(2);
      if (loai == 1 || loai == 2) setNhanSo(1);
      if (loai == 3 || loai == 4) setNhanSo(2);
      if (loai == 5) setNhanSo(3);
    }
  };

  const handleChangeNhanSo = (event) => {
    if (trinhBay == 1) setNhanSo(event.target.value);
  };

  // D??? Li???u Gi???
  const dataThiSinhDoanDoi = [
    dataThiSinhDoanDoi1,
    dataThiSinhDoanDoi2,
    dataThiSinhDoanDoi3,
    dataThiSinhDoanDoi4,
    dataThiSinhDoanDoi5,
    // dataThiSinhDoanDoi6,
  ];

  const optionsThiSinh = {
    search: true,
    searchPlaceholder: "T??n th?? sinh, email, phone...",
    download: false,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "450px",
    tableBodyMaxHeight: "800px",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: 5,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => <></>,
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
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    textLabels: {
      body: {
        noMatch: "B???ng r???ng",
      },
    },
  };

  const optionsThanhVien = {
    search: true,
    searchPlaceholder:
      "T??n Ti???t M???c, Th???i gian th???c hi???n, ??o??n ?????i, th?? sinh...",
    download: false,
    print: false,
    selectableRows: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "450px",
    tableBodyMaxHeight: "800px",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: 5,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => <></>,
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
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    textLabels: {
      body: {
        noMatch: "B???ng r???ng",
      },
    },
  };

  const optionsDoanDoi = {
    search: true,
    searchPlaceholder: "T??n ??o??n ?????i, ?????i tr?????ng, Khoa...",
    download: false,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: "dropdown",
    responsive: "simple",
    tableBodyHeight: "450px",
    tableBodyMaxHeight: "800px",
    rowsPerPageOptions: [5, 10, 50, 100],
    rowsPerPage: 5,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => <></>,
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
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    textLabels: {
      body: {
        noMatch: "B???ng r???ng",
      },
    },
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      // console.log(rowData[0]);
      const colSpan = rowData.length + 1;
      let data = "dataThiSinhDoanDoi" + rowData[0];
      const dataNew = dataThiSinhDoanDoi.find((dataTSDD) => {
        return dataTSDD[0][1] === rowData[2];
      });
      return (
        <TableRow>
          <TableCell colSpan={colSpan} style={{ padding: "10px 40px" }}>
            <MUIDataTable
              title={"Danh S??ch Th??nh Vi??n"}
              data={dataNew}
              columns={columnsThiSinh}
              options={optionsThanhVien}
            />
          </TableCell>
        </TableRow>
      );
    },
  };

  const columnsDoanDoi = [
    { name: "STT", options: { filterOptions: { fullWidth: true } } },
    { name: "tendoandoi", label: "T??n ??o??n ?????i" },
    { name: "truongnhom", label: "Tr?????ng Nh??m" },
    { name: "emailtruongnhom", label: "Email" },
    { name: "phonetruongnhom", label: "Phone" },
    { name: "khoadoandoi", label: "Khoa" },
    { name: "nhanso", label: "Nh??n S???" },
    {
      name: "",
      options: {
        filter: true,
        sort: false,
        empty: true,
        disableColumnMenu: true,
        customBodyRender: (
          value,
          tableMeta,
          updateValue,
          displayData,
          selectableRows
        ) => {
          return (
            <IconButton edge="end" aria-label="edit">
              <Edit
                onClick={() =>
                  window.alert(`Clicked "Edit" for row ${selectableRows}`)
                }
              />
            </IconButton>
          );
        },
      },
    },
  ];

  const columnsThiSinh = [
    { name: "STT", options: { filterOptions: { fullWidth: true } } },
    { name: "hotenthisinh", label: "H??? T??n" },
    { name: "mssvthisinh", label: "M?? SV" },
    {
      name: "malop",
      label: "M?? L???p",
      options: {
        display: false,
        filter: false,
        viewColumns: false,
        download: false,
      },
    },
    {
      name: "gioitinh",
      label: "Gi???i T??nh",
      options: {
        display: false,
        filter: false,
        viewColumns: false,
        download: false,
      },
    },
    { name: "emailthisinh", label: "Email" },
    { name: "phonethisinh", label: "Phone" },
    { name: "khoa", label: "Khoa" },
    {
      name: "",
      options: {
        filter: true,
        sort: false,
        empty: true,
        disableColumnMenu: true,
        customBodyRender: (
          value,
          tableMeta,
          updateValue,
          displayData,
          selectableRows
        ) => {
          return (
            <IconButton edge="end" aria-label="edit">
              <Edit
                onClick={() =>
                  window.alert(`Clicked "Edit" for row ${selectableRows}`)
                }
              />
            </IconButton>
          );
        },
      },
    },
  ];

  const data = [];

  return (
    <>
      <Modal
        show={props.showModal}
        onHide={() => props.setShowModal(false)}
        dialogClassName="modal-width"
      >
        <Modal.Header closeButton className="px-4">
          <Modal.Title className="ms-auto" style={{ color: "#344767" }}>
            <MusicNote style={{ fontSize: "2.6rem" }} />
            Th??m Ti???t M???c
            <MusicNote style={{ fontSize: "2.6rem" }} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Th??m Ti???t M???c */}
          <div style={{ color: "#344767" }}>
            <Row>
              <Form.Group className="mb-3">
                <Form.Label
                  className="d-flex align-items-center"
                  style={{ fontWeight: "500" }}
                >
                  <MusicNote /> T??n Ti???t M???c
                </Form.Label>
                <Form.Control type="text" />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-1">
                  <Form.Label
                    className="d-flex align-items-center justify-content-between"
                    style={{ fontWeight: "500", width: "100%" }}
                  >
                    <span>
                      <QueueMusicRounded /> Lo???i Ti???t M???c{" "}
                    </span>
                    <p
                      className="text-primary my-0 mx-2"
                      onClick={handleShowThemLoaiTietMuc}
                    >
                      + Add New
                    </p>
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChangeLoaiTietMuc(e)}
                    name="slLoaiTietMuc"
                  >
                    {dataLoaiTietMuc.map((data) => (
                      <option
                        key={data.MaLoaiTietMuc}
                        value={data.MaLoaiTietMuc}
                        name={`slLoaiTietMuc-${data.MaLoaiTietMuc}`}
                      >
                        {data.TenLoaiTietMuc}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <CDBCollapse isOpen={themLoaiTietMuc} className="pb-3">
                  <Card style={{ width: "100%" }}>
                    <Card.Header>Th??m Lo???i Ti???t M???c</Card.Header>
                    <Card.Body>
                      <Form.Group>
                        <Row className="px-5">
                          <Form.Label className="px-0">
                            T??n Lo???i ti???t M???c
                          </Form.Label>
                          <Form.Control type="text"></Form.Control>
                        </Row>
                        <Row className="pt-2 text-center">
                          <Col md="12">
                            <Button variant="primary" className="mx-2 px-5">
                              Add
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={handleShowThemLoaiTietMuc}
                              className="px-5"
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </CDBCollapse>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="d-flex align-items-center"
                    style={{ fontWeight: "500" }}
                  >
                    <AccessTime />
                    &nbsp;Th???i Gian Th???c Hi???n
                  </Form.Label>
                  <Form.Control type="number" />
                  <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Form.Group className="my-3">
                <Form.Label
                  className="d-flex align-items-center"
                  style={{ fontWeight: "500" }}
                >
                  <NoteAlt />
                  &nbsp;M?? T??? Ti???t M???c
                </Form.Label>
                <CKEditor
                  editor={ClassicEditor}
                  data=""
                  config={{
                    // plugins: [Font],
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                      "fontSize",
                      "fontFamily",
                      "fontColor",
                      "fontBackgroundColor",
                      "|",
                      "imageTextAlternative",
                      "imageUpload",
                      "imageStyle:side",
                      "|",
                      "mediaEmbed",
                      "insertTable",
                      "tableColumn",
                      "tableRow",
                      "mergeTableCells",
                      "|",
                      "undo",
                      "redo",
                    ],
                    ckfinder: {
                      uploadUrl:
                        "https://ckeditor.com/apps/ckfinder/3.5.0/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json",
                    },
                  }}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    // console.log("Editor is ready to use!", editor);
                    // console.log(
                    //   "toolbar:",
                    //   Array.from(editor.ui.componentFactory.names())
                    // );
                    // console.log(
                    //   "plugins:",
                    //   ClassicEditor.builtinPlugins.map(
                    //     (plugin) => plugin.pluginName
                    //   )
                    // );
                  }}
                  onChange={(e, editor) => {
                    // const dataTietMuc = editor.getData();
                    // console.log({ e, editor, dataTietMuc });
                  }}
                  onBlur={(editor) => {
                    // console.log("Blur.", editor);
                  }}
                  onFocus={(editor) => {
                    // console.log("Focus.", editor);
                  }}
                  style={{ minHeight: "200px" }}
                />
              </Form.Group>
            </Row>

            <Row>
              <Col md="6">
                <Form.Group className="mb-3">
                  <Form.Label
                    className="d-flex align-items-center"
                    style={{ fontWeight: "500" }}
                  >
                    <GroupRounded />
                    &nbsp;Tr??nh B??y B???i
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleSelectTrinhBay(e)}
                    id="chuongtrinhtrinhbayboi"
                  >
                    <option value="1">??o??n ?????i</option>
                    <option value="2" selected>
                      Th?? Sinh
                    </option>
                  </Form.Select>
                  <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
              </Col>
              <Col md="6">
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
                    value={nhanSo}
                    onChange={handleChangeNhanSo}
                  />
                  <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mx-0 justify-content-end">
              {trinhBay == 1 ? (
                <BangDoanDoi
                  data={dataDoanDoi}
                  columns={columnsDoanDoi}
                  options={optionsDoanDoi}
                />
              ) : (
                <>
                  <Row className="mb-2 px-0 mx-0">
                    {showDanhSachThiSinh === "themthisinh" ? (
                      <Col
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                        className="px-0"
                      >
                        <Button variant="outline-primary">
                          Th??m Th?? Sinh M???i
                        </Button>
                        &nbsp;
                        <Button variant="outline-success">Nh???p T??? Excel</Button>
                      </Col>
                    ) : (
                      <Col md="10"></Col>
                    )}
                    <Col xs="12" md="2" className="px-0">
                      <Form.Select
                        onChange={(e) => setShowDanhSachThiSinh(e.target.value)}
                      >
                        <option value="thisinh">T???t c??? Th?? sinh</option>
                        <option value="themthisinh">Th??m Th?? sinh m???i</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  {showDanhSachThiSinh === "thisinh" ? (
                    <BangThiSinh
                      data={dataThiSinh}
                      columns={columnsThiSinh}
                      options={optionsThiSinh}
                    />
                  ) : (
                    <BangThiSinh
                      data={data}
                      columns={columnsThiSinh}
                      options={optionsThiSinh}
                    />
                  )}
                </>
              )}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            className="px-5"
            onClick={() => {
              props.passDataTietMuc(["1", "2", "3", "4"]);
              props.setShowModal(false);
            }}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            className="px-5"
            onClick={() => props.setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
