import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteProduct, updateProduct } from "../../Redux/Actions/ProductActions";

const Product = (props) => {
  const { product, onStockChange } = props;
  const dispatch = useDispatch();

  const [stockChange, setStockChange] = useState(0);

  const decreaseCount = () => {
    if (product.countInStock + stockChange > 0) {
      const updatedStockChange = stockChange - 1;
      setStockChange(updatedStockChange);
    } else {
      alert("You cannot deduct more products.");
    }
  };

  const handleUpdate = () => {
    const updatedStock = product.countInStock + stockChange;
    const timestamp = new Date().toLocaleString();
    const historyEntry = {
      timestamp,
      originalStock: product.countInStock,
      stockChange: stockChange,
      updatedStock,
      productName: product.name,
    };

    onStockChange(historyEntry);

    dispatch(
      updateProduct({
        ...product,
        countInStock: updatedStock,
      })
    );

    let actionText =
      stockChange > 0
        ? `add ${stockChange} stock(s)`
        : `remove ${Math.abs(stockChange)} stock(s)`;
    alert(`Original Stock: ${product.countInStock}\nYou will ${actionText}`);
    alert("Stocks updated successfully");

    setStockChange(0);
  };

  useEffect(() => {
    setStockChange(0); // Reset stockChange to 0 when the product prop changes
  }, [product]);

  return (
    <div className="col-md-6 col-sm-6 col-lg-3 mb-5">
      <div className="card card-product-grid_orig shadow-sm_orig">
        <Link to="" className="img-wrap_orig">
          <img src={product.image} alt="Product" />
        </Link>
        <div className="info-wrap_orig">
          <Link to="" className="title_orig text-truncate_orig">
            <b>{product.name}</b>
          </Link>
          <div className="price_orig mb-2_orig">
            Php {product.price.toFixed(2)}
          </div>
          <div className="button-container_orig">
            <button className="btn btn-edit_orig" onClick={decreaseCount}>
              -
            </button>
            <span className="count-in-stock">
              {product.countInStock + stockChange}
            </span>
            <button className="btn btn-success" onClick={handleUpdate}>
              Update
            </button>
            <Link
              to={`/product/${product._id}/edit`}
              className="btn btn-edit_orig"
            >
              <i className="fas fa-pen"></i> Edit
            </Link>
            <Link
              to="#"
              onClick={() => deleteHandler(product._id)}
              className="btn btn-delete_orig"
            >
              <i className="fas fa-trash-alt"></i> Delete
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
