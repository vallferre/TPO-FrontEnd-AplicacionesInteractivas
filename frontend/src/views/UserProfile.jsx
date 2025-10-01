import React from "react";
import "../components/UserProfile.css";

const UserProfile = () => {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <a href="#" className="logo">
              <svg
                className="logo-icon"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    clipRule="evenodd"
                    d="M24 0.757L47.243 24 24 47.243 0.757 24 24 0.757ZM21 35.757V12.243L9.243 24 21 35.757Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
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
              <a href="#">Home</a>
              <a href="#">Shop</a>
              <a href="#">Sell</a>
              <a href="#">News</a>
            </nav>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
              />
            </div>
            <button className="icon-btn">
              <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256">
                <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
              </svg>
            </button>
            <div
              className="avatar"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBKEO4nhJ26IDvmPQnZ8gHy8pn5ckjd_N0nLq91dDRzAJd9F-x9It63JVOfSNo5q_-8lwNMbQwf9lxqOex2cQ1NX_uHdcpWbUu2eDViADT1fKJF4k9hLtVh0JTuytkYIu2i5teBgORGNOjJWE02i59q26QdY9RHEPNwk1sJQ3fG8FZAjgVz5iFxGVQB2Gfh81O0y-XtGXm-YoxiT3D8DrRWLqAdjuTOMx9qrJ1WRZSLAaY17ARx674uQCJKdPvMgaptHPbTxrkyk3I")',
              }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="main">
        <div className="profile-container">
          <div className="profile-header">
            <div
              className="profile-avatar"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_djH1uVQH-GccCSPjvaglwwG7GwisbjPZ7jH01uPXlNkJdwhrWBuAIVXfrjNHz69hSQyBgH-g3RQx6uNrtOT7qcE4ywE2Ihm4hbf8Z8C43CzdD2BZVfk4c5Avs9xEdpCCmQLZn9pBUDwBrF_3SaHWTwRlNWXoQcvNazeMdO9lcJMeEvvBzNXUTFYrOCGR8HdtVXCsz5dgJBZhegFEUUQaBS-U2baFwOJLhZEt5dBAHp7lZKrEJ6M8jMUrNOril6yyws86c0Nzg2Y")',
              }}
            />
            <div className="profile-info">
              <h2>Sophia Carter</h2>
              <p className="username">@sophia.carter</p>
              <p className="joined">Joined in 2021</p>
              <button className="edit-btn">Edit Profile</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <a href="#" className="tab active">Overview</a>
            <a href="#" className="tab">Orders</a>
            <a href="#" className="tab">Listings</a>
            <a href="#" className="tab">Wish List</a>
            <a href="#" className="tab">Saved Searches</a>
          </div>

          {/* Sections */}
          <div className="profile-sections">
            {/* About */}
            <section>
              <h3>About</h3>
              <p>A passionate collector of vintage toys and rare sneakers. Always on the lookout for the next great find!</p>
            </section>

            {/* Stats */}
            <section>
              <h3>Stats</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-number">120</p>
                  <p className="stat-label">Items Collected</p>
                </div>
                <div className="stat-card">
                  <p className="stat-number">50</p>
                  <p className="stat-label">Items Sold</p>
                </div>
                <div className="stat-card">
                  <p className="stat-number">25</p>
                  <p className="stat-label">Items Listed</p>
                </div>
              </div>
            </section>

            {/* Collection Highlights */}
            <section>
              <h3>Collection Highlights</h3>
              <div className="collection-grid">
                <div className="collection-item" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCESCO1gUZJVRgpnsRoBtsG9JpRk8Ha5armDot-9eqi1tPUsusugV0tZTIYwb2i0HALjV69wp5XHKe13WDO837JUJj58sR1vUjY7091K-8jENtXQt5coHwbE5MZKOuoUZ-Ajoapg2ShmDnjxbDAAKNwqoVOt7dlIGQP_dQuXuVoDmEpfjcPq_J59GsrVvdV4iy930YuXmyaovBhLCqF4HvBgbm8b8KdjkmUuztVLV52q28uWfP5Q-sxAd2kzT9SzCT8UPmuOUBHaCY")'}} />
                <div className="collection-item" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4njy2YncNqZX-siHKEfi4KfDxYTVt1XRyEMxb9yuxLCuJRg7g0zW_7ybPtUh8rMXwrNu9NOuyKd0xZnx8V08BKc2Xsg6XAF-4SEWwCkBt45EjI4kv2mlRVGaGjYrNAcrC7VdZHPbOQvz6XnOdidvSHogE7RrWuAfPCMR8nLEhyKL7tyWYa_fhy6o1E2A9qPh4IS43iQ75mo1eCAHiiH7bO0zHBhhS956dqYeO7zcOndBAGAjuIkfpFIxJslQ4dMpQRu3Mhgkuf50")'}} />
                <div className="collection-item" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpqwrWioz4ejwTlYvxSDD8HO79UkO5NNyVSvwCe-xo4G0Y7CFcDA2aF1jPLRQTO_JxU9tWKiOJ8KlWcK6HrZs9CfkdL9Q51EweFnREKxOYZXLD-l7wEc9nI0uZ9vfzZcSC9JChSAUOflIQnlosazeAw6Gc9bQfmN6hryANO_Opw1dJZdiMDc9y8kJRhCRa1EOgp6Vzo06GxIBAGfFdNJR_Q7jXaqMkrlDRWBdpdpSANpGXx0T3DPasrRJ66-UxIUiYrkHy1srLIrQ")'}} />
                <div className="collection-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
                  </svg>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h3>Recent Activity</h3>
              <ul className="activity-timeline">
                <li>
                  <div className="activity-icon bg-primary-light">
                    <svg fill="currentColor" width="20" height="20" viewBox="0 0 256 256">
                      <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path>
                    </svg>
                  </div>
                  <div className="activity-text">
                    <span>Listed 'Limited Edition Sneaker' for sale</span>
                    <span>2 weeks ago</span>
                  </div>
                </li>
                {/* Puedes repetir más items siguiendo el mismo patrón */}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
