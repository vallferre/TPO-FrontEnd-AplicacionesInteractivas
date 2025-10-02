import React from "react";
import "../components/Favorites.css";

const Favorites = () => {
  const products = [
    {
      name: "Vintage Action Figure",
      price: "$150",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsijP0OeDtSmdBgUDagRq32doY70VIHbyR96qzUOqCazE0apCConjBXYhU8EACTXxWub9ikbwo3oEiSB6iwi2rChA8Ov8_TFKQ4m8e1BAFEFiAK1KqjqKCwItaiKBqLzCrLVpPCSRyi81Yu0caLQxahnjgUq7uPNfw0Gk7gvlsHA2u3aob-GecqFnlk9Y-B-U6BsdJA4I965S3s3_AtCjBROBhjCwaBTWBmiekHvlxSu3bJJch1f5_giq0pDcue2Sb9KwqWw7rwQc",
    },
    {
      name: "Limited Edition Sneakers",
      price: "$250",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAch3tanChRz4fWik_4srloh2xvWFf1sFXVXjD1QWMNTuKkG3TA0fowZUY5ik5qgpYz7XSRr0knEE6NbemhAMMbfhX8CVr9gNHzS_iBLE2TA1CXyPyGW3lnaCfyfjwKEWLgHqaUDLOc2tQF1rX1qCQ_ntmaBixvwfQjChZ52D6_UZPSzly0SluZqUTJzT3XyfRzCpq0s7nZkGFr9MRoYtmr4W1vipsbHNrt1c7jK0FCrb0GGopq8Wv4nnH6gn13kQ9heU-ZKGToCRc",
    },
    {
      name: "Collectible Art Toy",
      price: "$80",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_Jkp63aT4KSODvyetWn8bYyFGtaNmLQwncIb0Yr7Adzqd0yrkcUtGygF8tLqo0brTnHfVtmEmJ9KPlaQdUdbE-g4BwLKcmafUb4FTTnnsqYXTKjBhkSFziFJtwAa-Zgpyia7P86BeWRoXTYQfLZEmK27vx7_lnAr4HOkTmeWCmFAoPBwrEN9rl-DDsX8K7b64HZ3CUzi5Q7lbyBmNa0U1qgki9l3y80In5ZedgT7FxY_oO82kR30z66XU1K2ihW_XEhAJTNsmI0I",
    },
    {
      name: "Rare Comic Book",
      price: "$120",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbnIoz8NxNjj6sQGy6EnNpgHFPY7gF5pOqtCYOmmMnrkd_-EskcR6VMayZxX0fNNqK6YmozfVsShnqa1DjfBQYLOae_YLtCVK1KL7AkYBiekf1Jhu0QmciKL9ucH4tocMJ784vFL1fN-qE8yCSq5r9JbL068c2HXhDvzqsQuP4N9mKn6kIYdXWuI6vc2H72zv6c-QyKMykiAmzR4biQziK8P0WP8dgmoQlkmoR42Tx0p8ys_zjFZCRbgkfuaf0_9-nHcDx5wiA3LI",
    },
  ];

  return (
    <div className="favorites-page">
      <main className="content">
        <h1>Your Favorites</h1>
        <p>Items you've saved for later.</p>
        <div className="grid">
          {products.map((p, i) => (
            <div className="card" key={i}>
              <div className="card-img">
                <img src={p.img} alt={p.name} />
                <button className="fav-btn">♡</button>
              </div>
              <div className="card-info">
                <h3>{p.name}</h3>
                <p>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
