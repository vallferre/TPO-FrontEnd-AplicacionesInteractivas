import React from "react";
import "../components/EditProduct.css";

const EditProduct = () => {
  return (
    <div className="edit-page">
      <main className="edit-main">
        <div className="edit-container">
          <div className="edit-header">
            <h2>Edit Product</h2>
            <p>Update the details of your product below.</p>
          </div>

          <form className="edit-form">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input id="name" type="text" defaultValue="Vintage Leather Jacket" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                defaultValue="A classic vintage leather jacket in great condition. Perfect for a timeless look."
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" defaultValue="Jackets">
                <option>Apparel</option>
                <option>Jackets</option>
                <option>Accessories</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <div className="price-wrapper">
                  <span className="currency">$</span>
                  <input id="price" type="text" defaultValue="120.00" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input id="discount" type="number" defaultValue="10" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input id="quantity" type="number" defaultValue="1" />
            </div>

            <div className="form-group">
              <label>Photos</label>
              <div className="upload-box">
                <span className="upload-icon">📷</span>
                <p>
                  <label htmlFor="photo-upload" className="upload-link">
                    Upload a file
                    <input id="photo-upload" type="file" multiple hidden />
                  </label>
                  &nbsp;or drag and drop
                </p>
                <p className="upload-note">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            <div className="form-group">
              <label>Videos</label>
              <div className="upload-box">
                <span className="upload-icon">🎥</span>
                <p>
                  <label htmlFor="video-upload" className="upload-link">
                    Upload a file
                    <input id="video-upload" type="file" multiple hidden />
                  </label>
                  &nbsp;or drag and drop
                </p>
                <p className="upload-note">MP4, AVI, MOV up to 50MB</p>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn cancel">
                Cancel
              </button>
              <button type="submit" className="btn save">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
