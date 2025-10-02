import React from "react";
import "../components/LandingPage.css";

export default function LandingPage() {
  return (
    <div className="app">
      {/* Main */}
      <main className="main container">
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
