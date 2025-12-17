
import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="overlay"></div>
        <div className="hero-content text-center">

          <h1 className="display-4 fw-bold mb-4 text-white hero-title">StartupNest</h1>

          <div className="hero-desc-wrapper">
            <p className="lead mb-0 hero-desc">
              Welcome to <strong>StartupNest</strong>, your gateway to innovation and collaboration. Our platform connects aspiring entrepreneurs with experienced mentors ready to support and fund the next big idea. Whether you're crafting a pitch or evaluating submissions, <strong>StartupNest</strong> is where startup journeys begin.
            </p>
          </div>

        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container my-2">
          <div className="contact-card p-3 text-center">
            <h2 className="mb-3">Contact Us</h2>
            <p>
              <strong>Phone:</strong> +91 98765 43210
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:incubate@startupnest.com" className="text-white text-decoration-underline">
                incubate@startupnest.com
              </a>
            </p>
            <p>
              <strong>Address:</strong> 2/5 Innovation Road, Tech City, IN
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center py-4 bg-light">
        <p className="text-muted mb-0 footer-text">
          <i>Empowering ideas, one startup at a time.</i>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;