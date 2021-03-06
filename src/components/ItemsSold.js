import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import rally from "../assets/img/color/rally.png";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
}));

const columns = [
  { id: "_id", label: "Order ID", minWidth: 100 },
  { id: "products", label: "Products", minWidth: 170 },
  { id: "shipping", label: "Shipping Info", minWidth: 170, align: "right" },
  {
    id: "total",
    label: "Total ($)",
    minWidth: 170,
    align: "right",
  },
];
export default function ItemsSold() {
  const user = useSelector((state) => state.user);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const classes = useStyles();
  const listSold = user.listSold;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (listSold.length === 0) {
    return <div>Waiting for some users buy your current in selling items.</div>;
  }

  const htmllistSold = listSold
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row) => {
      return (
        <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
        {columns.map((column) => {
          if (row[column.id]) {
           const value = row[column.id];
            return (
              <TableCell
              key={column.id}
              align={column.align}
              key={column.label}
            >
              {column.id === "products" ? (
                value.map((el) => {
                  return (
                    <div
                      key={el._id}
                      className="d-flex justify-content-start align-items-center"
                    >
                      {el.product} - Color:{" "}
                      {el.color !== "rally" ? (
                        <span
                          style={{ backgroundColor: el.color }}
                          className="color-icon"
                        ></span>
                      ) : (
                        <span className="color-icon">
                          <img src={rally} width="15px" height="15px" />
                        </span>
                      )} x Quantity: {el.quantity}
                    </div>
                  );
                })
              ) : column.id === "shipping" ? (
                <div>
                  <div>Name: {value.fullname}</div>
                  <div>Address: {value.addressLine1}</div>
                  <div>
                    {value.addressLine2
                      ? "Address2: " + value.addressLine2
                      : null}</div><div>
                    {`${value.city}, ${
                      value.region
                        ? value.region + ", "
                        : null
                    } ${value.zipCode}, ${value.country}`}
                  </div>{" "}
                  <div>Tel: {value.telephone}</div>
                </div>
              ) : (
                value
              )}
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
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{htmllistSold}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={listSold.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
