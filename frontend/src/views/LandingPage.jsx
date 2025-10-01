import React from "react";
import "../components/LandingPage.css";

export default function LandingPage() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <a href="./" className="logo">
            <svg
              className="logo-icon"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 0.757L47.243 24 24 47.243 0.757 24 24 0.757ZM21 35.757V12.243L9.243 24 21 35.757Z"
                fill="currentColor"
              />
            </svg>
            <span>ColecXion</span>
          </a>
          <nav className="nav">
            <a href="#">Featured</a>
            <a href="#">New Arrivals</a>
            <a href="#">Figures</a>
            <a href="#">Shoes</a>
            <a href="#">Vintage</a>
          </nav>
          <div className="header-actions">
            <button className="icon-btn">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="icon-btn">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="icon-btn">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
            <button className="profile-btn">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBaTsKRVIvCahzr9M3KsusOGKT2BvLMbZee-jkK1P7OPWNfWFM9b2nS2yMMsX-alJGES8YLdV3ijzIsE7GEYZKb2W0GK0ydmXrKqXcVmJkcGaaJqGd_zHxXQv5GxbvnQQH4TCiQiAHDokR-pZQ9h1EojFL5p8blcGn4V1Fptp5RZWBEA-78HFsEBaPeuae3tzKDrKMttWZA7QxGGM9LLDNrF_gzrc436KakDSecADDhqSoWd5HedyuGQQ4EoJ_ewShuw-kavWztcQ"
                alt="User"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main container">
        {/* Big Search */}
        <div className="big-search">
          <span className="material-symbols-outlined">search</span>
          <input type="search" placeholder="Search for collectibles..." />
        </div>

        {/* Featured */}
        <section className="section">
          <h2>Featured Collections</h2>
          <div className="grid grid-4">
            <a href="#" className="card">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcP5halEuTRH_7ZFEtaSdQl-aCJl9G3W8lCm21jtJt62n5PzCCjBsLuw5sBxKOmQ1JiMBg6GoHZnu2fFjSSmvd1OWIhPnIuNGS2HLbPUUuNZC7rAPi2gEaUIP3_QFSqmBK9n1pDwPHOS_uiVdhHQgrkOOAN-6BiMl44ozc-TVuODjQkdBwL0Zx3ZxX1rzAQKEVALYyHXnrsn6hdQpvNQokgGJkrV2MwzJbjqteN1gIi9ALqwR1x-aHVUNT0r2tscg6Lvli2wi4JPY"
                alt="Streetwear Sneakers"
              />
              <p>Streetwear Sneakers</p>
            </a>

            <a href="#" className="card">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuPLzkANs0DE_SNMQcnfAaEVZzKYLVceAflkIhYDifX2GL1czcLjHzdiv2QvG75VucxQN7yXm97kehOxQprkxRn-VNCAIQOG9HlRfe2K0tSSJjfxdmkL1WQ7accDhKnI_3Ft4QovYIh9DQQBHhrJ-c9e9y9H5aPlvEnK_nuJtcqv2tWiWJtVoGmHGHZ_iwfPyqtx8yHqB7g0FLRBIgWXqxIXHlsMp-1c2SDDI621Q22YJSMLrOw_GyWCWDZ9X1e4cOhooUnokelCU"
                alt="Vintage Action Figures"
              />
              <p>Vintage Action Figures</p>
            </a>

            <a href="#" className="card">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAmSBESZoZcdKEJWeQ0tWC2t_FDIQ6HN_iOCg-qPqP2rezJprRcFXXKgEhXInMDiYmHYhDR25BbIpS8ExfuecAmu21zdPDELqrEjxak4ogVlDUtk_y66ik81mQOpj0o9PO1KZRB2Hdiv6mpx1KDeAkziX4SHA5ntLi2-68_KBCqj0encq4fgkR1ZqnT6CrIOqbuEY0q2Fy6Eiu5CQpDk-X8cwkEZ0e3c8VeOJf-0q4hdMRtGoswTCTZWrafeEor3BVQlUTQdAf58U"
                alt="Rare Collectible Shoes"
              />
              <p>Rare Collectible Shoes</p>
            </a>

            <a href="#" className="card">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzShP52l15UQNgArsHI6My0_R58ronAXjqT-YZIsHmsvFQ2nnL-pot2IKOyfgFngBtV5K0TIn1PBuTJsdnxk9oaRfAT50jhAfw8rTfgySwXW26jWT66A-swwEBbHhMXQ1omY38_43DvpK83z5H90f9QS2YW6qVQQnwPLpc_GM7c8qNmPkiqh04YkOKR7edSUlUa6A6HotcjSi4jiNqNAmxrbKYhjOJzgF16pvLqPEnu4j7Fq0cLDFhckvjIfmgZK1hU8FaBN5vpcA"
                alt="Limited Edition Art Toys"
              />
              <p>Limited Edition Art Toys</p>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
