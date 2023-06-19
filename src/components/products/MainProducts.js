import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Product from "./Product";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../Redux/Actions/ProductActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const MainProducts = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const { error: errorDelete, success: successDelete } = productDelete;

  const [stockHistory, setStockHistory] = useState([]);

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch, successDelete]);

  useEffect(() => {
    const storedStockHistory = JSON.parse(localStorage.getItem("stockHistory"));
    if (storedStockHistory) {
      setStockHistory(storedStockHistory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stockHistory", JSON.stringify(stockHistory));
  }, [stockHistory]);

  const handleStockChange = (historyEntry) => {
    setStockHistory((prevStockHistory) => {
      const updatedStockHistory = [...prevStockHistory];
      const lastEntry = updatedStockHistory[updatedStockHistory.length - 1];

      if (
        !lastEntry ||
        lastEntry.productName !== historyEntry.productName ||
        lastEntry.timestamp !== historyEntry.timestamp ||
        lastEntry.stockChange !== historyEntry.stockChange ||
        lastEntry.updatedStock !== historyEntry.updatedStock
      ) {
        return [...updatedStockHistory, historyEntry];
      }

      return updatedStockHistory;
    });
  };

  const handleResetTable = () => {
    const confirmed = window.confirm("Are you sure? This cannot be undone.");
    if (confirmed) {
      setStockHistory([]);
      localStorage.removeItem("stockHistory");
    }
  };

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Products</h2>
      </div>

      <div className="card mb-4 shadow-sm">
        <header className="card-header bg-white">
          <div className="row gx-3 py-3">
            <div>
              <Link to="/addproduct" className="btn btn-primary">
                Create new
              </Link>
            </div>
          </div>
        </header>

        <div className="card-body">
          {errorDelete && <Message variant="alert-danger">{errorDelete}</Message>}
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : (
            <div className="row">
              {/* Products */}
              {products.map((product) => (
                <Product
                  product={product}
                  key={product._id}
                  onStockChange={handleStockChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <header className="card-header bg-white">
          <div className="row gx-3 py-3">
            <div className="col-12">
              <h3 className="mb-0"><b>Stock History</b></h3>
            </div>
          </div>
        </header>

        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Timestamp</th>
                <th>Original Stock</th>
                <th>Updated Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockHistory.map((entry, index) => (
                <tr key={index}>
                  <td><b>{entry.productName}</b></td>
                  <td>{entry.timestamp}</td>
                  <td>{entry.originalStock}</td>
                  <td>{entry.updatedStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stockHistory.length > 0 && (
            <div className="text-center">
              <button className="btn btn-danger" onClick={handleResetTable}>
                Reset Table
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainProducts;
