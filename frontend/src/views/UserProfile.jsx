import React from "react";
import "../components/UserProfile.css";

const UserProfile = () => {
  return (
    <div className="app-container">
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
