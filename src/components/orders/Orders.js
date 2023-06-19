import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { deleteOrder } from "../../Redux/Actions/OrderActions";

const OrderStatistics = ({ orders, orderType, startDate, endDate }) => {
  const filteredOrders = orderType === "all"
    ? orders
    : orders.filter((order) => {
        if (orderType === "dine-in" && order.user.email.includes("table")) {
          return true;
        }
        if (orderType === "online" && !order.user.email.includes("table")) {
          return true;
        }
        return false;
      });

  const filteredOrdersByDate = startDate && endDate
    ? filteredOrders.filter((order) =>
        moment(order.createdAt).isBetween(startDate, endDate, undefined, "[]")
      )
    : filteredOrders;

  const totalOrders = filteredOrdersByDate.length;

  return (
    <div className="order-statistics">
      <h4>{orderType.charAt(0).toUpperCase() + orderType.slice(1)} Orders</h4>
      <p>
        Total Orders{" "}
        {startDate && endDate
          ? `from ${moment(startDate).format("MMM Do YYYY")} to ${moment(endDate).format("MMM Do YYYY")}`
          : "on All Dates"
        }: {totalOrders}
      </p>
    </div>
  );
};

const Orders = (props) => {
  const { orders } = props;
  const [orderType, setOrderType] = useState("all"); // all, dine-in, online
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // desc (latest to oldest), asc (oldest to latest)
  const [startDate, setStartDate] = useState(null); // start date state
  const [endDate, setEndDate] = useState(null); // end date state
  const dispatch = useDispatch();

  const filteredOrders = orderType === "all"
    ? orders.filter(order => order.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : orders.filter((order) => {
        if (orderType === "dine-in" && order.user.email.includes("table")) {
          return true;
        }
        if (orderType === "online" && !order.user.email.includes("table")) {
          return true;
        }
        return false;
      }).filter(order => order.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortOrder === "desc") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const handleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const filterOrdersByDate = (orders) => {
    if (!startDate || !endDate) {
      return orders;
    }
    const selectedDayStart = moment(startDate).startOf("day");
    const selectedDayEnd = moment(endDate).endOf("day");
    return orders.filter((order) => {
      const orderDate = moment(order.createdAt);
      return orderDate.isBetween(selectedDayStart, selectedDayEnd, undefined, "[]");
    });
  };

  const filteredOrdersByDate = filterOrdersByDate(sortedOrders);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search orders by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control p-2"
        />
      </div>

      <div className="d-flex align-items-center mb-3">
        <label className="me-2">Filter by Date:</label>
        <div className="d-flex">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMM d, yyyy"
            className="form-control date-picker me-2"
            placeholderText="Select start date"
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="MMM d, yyyy"
            className="form-control date-picker"
            placeholderText="Select end date"
          />
        </div>
      </div>



      <div className="row">
        <div className="col-lg-4">
          <div className="card card-body mb-4 shadow-sm">
            <OrderStatistics orders={orders} orderType="all" startDate={startDate} endDate={endDate} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card card-body mb-4 shadow-sm">
            <OrderStatistics orders={orders} orderType="dine-in" startDate={startDate} endDate={endDate} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card card-body mb-4 shadow-sm">
            <OrderStatistics orders={orders} orderType="online" startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>

      <div className="btn-group mb-3" role="group">
        <button
          type="button"
          className="btn"
          style={{ backgroundColor: orderType === "all" ? "red" : "yellow" }}
          onClick={() => setOrderType("all")}
        >
          <b>All Orders</b>
        </button>
        <button
          type="button"
          className="btn"
          style={{ backgroundColor: orderType === "dine-in" ? "red" : "yellow" }}
          onClick={() => setOrderType("dine-in")}
        >
          <b>Dine-in Orders</b>
        </button>
        <button
          type="button"
          className="btn"
          style={{ backgroundColor: orderType === "online" ? "red" : "yellow" }}
          onClick={() => setOrderType("online")}
        >
          <b>Online Orders</b>
        </button>
      </div>

      <div className="button-container1">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSort}
        >
          <b>Sort Orders</b>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              printOrders();
            }
          }}
        >
          <b>Generate Report</b>
        </button>
      </div>

      <div id="orders-table">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">ID</th>
              <th scope="col">Email</th>
              <th scope="col">Total</th>
              <th scope="col">Payment Method</th>
              <th scope="col">Paid</th>
              <th scope="col">Date</th>
              <th>Status</th>
              <th scope="col" className="text-end">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrdersByDate.map((order) => (
              <tr key={order._id}>
                <td>
                  <b>{order.user.name}</b>
                </td>
                <td>
                  <b>{order._id}</b>
                </td>
                <td>{order.user.email}</td>
                <td>Php {Number(order.totalPrice).toFixed(2)}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  {order.isPaid ? (
                    <span className="badge rounded-pill alert-success">
                      Paid At {moment(order.paidAt).format("MMM Do YY")}
                    </span>
                  ) : (
                    <span className="badge rounded-pill alert-danger">Not Paid</span>
                  )}
                </td>
                <td>{moment(order.createdAt).format("MMM Do YY")}</td>
                <td>
                  {order.isDelivered ? (
                    <span className="badge btn-success">Delivered</span>
                  ) : (
                    <span className="badge btn-dark">Not delivered</span>
                  )}
                </td>
                <td className="d-flex align-items-center justify-content-end">
                  <Link to={`/order/${order._id}`} className="text-success">
                    <i className="fas fa-eye icon-hover"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
