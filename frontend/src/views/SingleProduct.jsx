import React from "react";
import "../components/SingleProduct.css";

const ProductDetails = () => {
  return (
    <div className="app-container">
      <header className="header">
        <div className="header-inner">
          <div className="logo-nav">
            <a href="#" className="logo">
              <svg className="logo-icon" viewBox="0 0 48 48" fill="currentColor">
                <g clipPath="url(#clip0)">
                  <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <h1 className="logo-text">ColecXion</h1>
            </a>
            <nav className="nav-links">
              <a href="#">Featured</a>
              <a href="#">Men</a>
              <a href="#">Women</a>
              <a href="#">Accessories</a>
            </nav>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <input type="search" placeholder="Search..." />
              <div className="search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
            <button className="avatar-btn">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEIkpLzAMdMRsO-cBTBn7IPmNWP-pdI0Dj2vFzwwpO2SYLANJgRXmmHzvGdENwv9Tg9JlofV46h5jydxjZvaN-rml_4EjdaTuob3DRCK1dK-WlsPcNUhp9hvb7q8NOOBJmKeZqBMxTO9JsYOyY6Mgl8EfgY06GT_akRB3k_-uWXrOphhktUVsQqMNdyLqQA_RY5mpSkoqFUfBa0y5ZPpelscw2EWgIKE50nd8XsUFio624C2SqBA2ZXyHHUy_544uuENNBEDrvCxA"
                alt="User avatar"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="breadcrumb">
          <a href="#">Collectibles</a> / <a href="#">Figures</a> / <span>Action Figures</span>
        </div>

        <div className="product-grid">
          <div className="images-grid">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfpCJ7FHFK9MMYsR7aWe28faYOWvnUGvbu6J1e4WCCSbhtEMNqnvH1sw9UGgxCoZZjcfN4TfeT_D0xh9TM6OkrRbX0QX1RMhNr72XsueBoTQ_Dv2wjDyXFwaLejsIOQbotgQ5WQ3wZDdxNIn4ulONtOBcH9xVDPPIGs7ezYNnzN2hqFACiFbnkfjD5Wb6LJiiqhd6PHExMcOs3rBNagnnt3tmqOk-HhfG4EiLcNol9XpmDMQsuOTjTsuYM2orTNBCLm0pk28LD0bc" alt="Main product image" />
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe8E2jkiw6QFdu01ePJrqXYV12shjxtP63q4RumRiiTLhUvYXq8bWUKR-7vmoWKXqkBdZVTl-7h0sdKNIRHGFEaX9MHaiRmkMFOQcI9-j5rUdRWJuqo-5eg7LSvgkIIb3HzqOyV0hGgSlSnXoDpX5kHpSI5nT79P5d948uLK0YoP15vTOQTQgDWeImq3aRTHivDBOVkpyr_GySyfaHkXBD3RZhyn3V0EtcVNVbn1fxFR6HYW8GbiVQt7nD9goqHfqzjxaXwdpznKc" alt="Product image 2" />
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOly7wVfcsn3E6HE5VGr5xEGNtjAJJtcXcaC1kZLd7p8K1CIndBIzXWnGpnD6QB8NGwNq-ZTl5vw9Cyzbpf7w760jcpNgWQLFEzKRQ453ciOXAAJjkXJYpwj1QTY4B2_9a71CEKFUWMNw7FgiuJykNE9uWOlA0F5VuOVnlP6yg1hnXIDWIc3Ot0N75qLtKpQyPjbhMVek5B2-bAUIM48A9m1oOnUiM0HCgxKGCLK2gOCUl4a-I8eLKbnjd7F1p9-oe5dCqwQnYhN0" alt="Product image 3" />
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIJKtaxPj3UqiaVWERDWNFJy6OrHwUpWPNNR5Iy-1YAjpn7hTqDyFAfSNt171C52hDp595WdS2uBNuGd3VBXI_ByVr2FWNTnq4iyx0-HANoxj8NlwMUGxmSqgXHP114MIkm2T_eC_1hI9SRC2OooOvVKqVLgulSC9q8sJ5jyETURTQ6smsaVQYl8x7WLu2WSVQjIJ0ssMY38nXCH3L1PSlweOdVSq11AP0o2OmirWoQUe5LEn4jdNrOLsNMTMAXNQVm5r516G-Wis" alt="Product image 4" />
          </div>

          <div className="product-info">
            <h1 className="product-title">Limited Edition Action Figure</h1>
            <div className="product-price">$250.00</div>
            <div className="product-description">
              <h2>Description</h2>
              <p>
                This limited edition action figure is a must-have for any serious collector. Featuring intricate details and high-quality materials, it's a true representation of the character. The figure comes in its original packaging and is in mint condition, perfect for display or investment. Don't miss out on adding this rare piece to your collection.
              </p>
            </div>

            <div className="seller-info">
              <h3>Seller Information</h3>
              <div className="seller-details">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2B1y9kYhBT4T7QHchjwJCsNCW29hw36CmQekHcda7zDlXAjKgAmmznBL3Dis9QRjByWnc2Jhi3YC_yIRdUBwG6MdsaWXsJIP1JvxHI-apErTPJ6sCyOjkQUWzIXMvl4xli1-2Dl8CYbumw6zOPEtbgGvQ-MvIBi1ocdQGI-IKxMtTcj841QhYy_7i_98AgFGwQzJwWvgP53IKpICS4q4ZcZnMSWYxvhniNcQatNDGTBjjpObAJBW771Nozfg2lF5G7ARhmDp_-tQ" alt="Seller avatar" />
                <div>
                  <p>Collector's Haven</p>
                  <p>⭐ 4.8 (120 reviews)</p>
                </div>
              </div>
            </div>

            <div className="product-actions">
              <button className="buy-btn">Buy Now</button>
              <button className="cart-btn">Add to Cart</button>
            </div>
          </div>
        </div>

        <div className="related-items">
          <h2>Related Items</h2>
          <div className="related-grid">
            {[
              { title: "Vintage Action Figure", price: "$150", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqipRbBoY-oxYr11eS_1IysKzBXeoihKYXRSemCLjH70HKZ6h6VZ5ANm42UAlXDgdxNa8pu1wRXjtK0TafedD-JqHrPyMK1a36deeafJ7GZ2o1sX-5iv6Eat7e-3Gsvc4t3qyzQ8aR5A35ldaFfSog4FslIGV3xnhxUXbsXxAEHgghQ90C3L_4ZTBSAA6t1qpde8nEJ9xmoczGCsjUq4jAnMFRTy-h5-Yg8-w72bTl0i4iG4yaMGqGNKr19mz7ITS4_1JvaHKRVNc" },
              { title: "Rare Collectible Figure", price: "$300", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDThpZxxnMWHCl1-L0-mk7MncssEiEgjPjpclH_AMXbDmT2JcLFF8hLM2H4dTEkYcrVITQ51VTqcW38M86N9qkP0dZWKfy2SK6AtWnElSRvASL10_sVxtgzJ4uOU_PnjV7sFvHrbGCwD3zCYf4-D0smV-0QSugR1vMptuyk_tJdIH7ECIv02Uw5b622tgMd3PTRWiRVkg-eX_XOPhw1vpbrGKxT1OdfHT7Z0O3A7FUaA_Gpu0F29Und79qiQfngIirFrHldO0U9M1w" },
              { title: "Limited Edition Figure", price: "$200", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWYdmQJiJuY6thMbccMGFkV5wU9QKNdJqW1CHHNhz2D5Vz9kG9SAv2ay1sdOAdv--OYOJ4r1wThrr6o7Hnc7Om5VvTVeu99bMzzIriiEtnhsLEfNslCpSudWpBJnRxfH9iNba9GdmVWXS1qdMTbu_f9DpU8TqTg66151cudMVKpUv43CYo0Kg_XbI4GMD6vYush-P6C8dVOp9l7-iajuWxM_zYXxa0LLDsyPx2lYmoMnPp9IE8ULLfRoYDEeQR2gkvMIE0JlTZHk" },
              { title: "Classic TV Show Figure", price: "$175", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIJKtaxPj3UqiaVWERDWNFJy6OrHwUpWPNNR5Iy-1YAjpn7hTqDyFAfSNt171C52hDp595WdS2uBNuGd3VBXI_ByVr2FWNTnq4iyx0-HANoxj8NlwMUGxmSqgXHP114MIkm2T_eC_1hI9SRC2OooOvVKqVLgulSC9q8sJ5jyETURTQ6smsaVQYl8x7WLu2WSVQjIJ0ssMY38nXCH3L1PSlweOdVSq11AP0o2OmirWoQUe5LEn4jdNrOLsNMTMAXNQVm5r516G-Wis" },
            ].map((item, index) => (
              <div className="related-item" key={index}>
                <div className="related-img-wrapper">
                  <img src={item.src} alt={item.title} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
