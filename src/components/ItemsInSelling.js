import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Swal from 'sweetalert2';
import rally from '../assets/img/color/rally.png';
import checkToken from "./RefreshToken";
import deleteImg from "../assets/img/delete.gif";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflow: "hidden",
  },
  container: {
    maxHeight: 440,
    overflow: "scroll",
  },
}));

const columns = [
  { id: "product", label: "Product", maxWidth: 100 },
  { id: "color", label: "Color", maxWidth: 60 },
  { id: "price", label: "Price", maxWidth: 40 , align: "right",},
  {
    id: "type",
    label: "Type",
    maxWidth: 40,
    align: "right",
  },
  {
    id: "availability",
    label: "Stock",
    maxWidth: 80,
    align: "right",
  },
  {
    id: "updateRoot",
    label: "Edit Root Product",
    maxWidth: 100,
    align: "right",
  },
  {
    id: "update",
    label: "Edit Details Product",
    maxWidth: 100,
    align: "right",
  },
  {
    id: "delete",
    label: "Delete",
    maxWidth: 100,
    align: "right",
  },
];
export default function ItemsInSelling(props) {
  const user = useSelector((state) => state.user);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const classes = useStyles();
  const listInSelling = user.listInSelling;
  const dispatch = useDispatch();
  
  const alertMsgSuccess = {
    title: "Success!",
    text: "Product deleted successfully!",
    icon: "success",
    confirmButtonText: "Nice"
  };

  const alertMsgError = {
    title: "Error!",
    text: "Something went wrong while fetch new user database!",
    icon: "error",
    confirmButtonText: "Ok!"
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (listInSelling.length === 0) {
    return <div>Post something to see your current items.</div>;
  }

  const fetchUserAgain = async() => {
    await checkToken();
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
    const reponse = await fetch(process.env.REACT_APP_SERVER + "/users/me", options);
    const data = await reponse.json();
    if (data && data.status === true) {
      dispatch({ type: "SET_USER", payload: data.data });
  } else {
      Swal.fire(alertMsgError);
  }
}

  const deleteProduct = async (type, product, id) => {
    await checkToken();
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
    const reponse = await fetch(process.env.REACT_APP_SERVER + "/category/" + type + "/products/" + product + "/" + id, options);
    if (reponse.status === 204) {
      Swal.fire(alertMsgSuccess);
      fetchUserAgain();
    } else {
      Swal.fire(alertMsgError);
    }
  };

  const toProductClicked = (t, p , c) => {
    window.open(`${window.location.origin}/category/${t}/products/${p}/${c}`, "_blank");
  }

  const htmlToSelling = listInSelling
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row) => {
      return (
        <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
          {columns.map((column) => {
            let value;
            if (row[column.id]) {
              value = row[column.id];
              return (
                <TableCell
                  key={column.id}
                  align={column.align}
                  key={column.label}
                >
                  {(typeof value === "string" && column.label !== "Color") || (typeof value === "number" && column.label !== "Color")
                    ? value
                    : (column.label === "Product" ? value.name : (column.label === "Color" ? (value === "rally" ? <span className="pointer" onClick={()=> toProductClicked(row.type.type, row.product.slug, row.slug)}><img className="color-icon" src={rally}/></span> : <span onClick={()=> toProductClicked(row.type.type, row.product.slug, row.slug)}
                    style={{ backgroundColor: value }}
                    className="color-icon pointer"
                  ></span>) : value.type))}
                </TableCell>
              );
            }
            if (column.label === "Delete") {
              return (
                <TableCell key={column.id} align={column.align}>
                  <Button
                    type="button"
                    onClick={() =>
                      deleteProduct(row.type.slug, row.product._id, row._id)
                    }
                  >
                  <div className="trashContainer">
                  <div className="trash">
                    <div className="tap">
                     <div className="tip"></div>
                     <div className="top"></div>
                    </div>
                    <div className="tap2">
                      <div className="bottom">
                       <div className="line"></div>
                       <div className="line"></div>
                       <div className="line"></div>
                      </div>
                    </div>
                  </div>
                </div>
                  </Button>
                </TableCell>
              );
            } else if (column.id === "updateRoot") {
              return (
                <TableCell key={column.id} align={column.align}>
                  <Button type="button" onClick={()=> props.handleRootUpdate(row)}>{column.label}</Button>
                </TableCell>
              );
            } else if (column.id === "price") {
              return (
                <TableCell key={column.id} align={column.align}>
                  {row.product.price}
                </TableCell>
              );
            } else if (column.id === "update") {
              return (
                <TableCell key={column.id} align={column.align}>
                  <Button type="button" onClick={()=> props.handleDetailUpdate(row)}>{column.label}</Button>
                </TableCell>
              );
            } else {
              return (
                <TableCell key={column.id} align={column.align}>
                  <Button type="button">{column.label}</Button>
                </TableCell>
              );
            }
          })}
        </TableRow>
      );
    });

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ maxWidth: column.maxWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{htmlToSelling}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={listInSelling.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}