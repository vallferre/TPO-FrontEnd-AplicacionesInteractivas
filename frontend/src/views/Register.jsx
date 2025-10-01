import React from "react";
import "../components/Register.css";

export default function CreateAccount() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <a href="#" className="logo">
            <svg
              className="logo-icon"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>ColecXion</span>
          </a>

          <nav className="nav">
            <a href="#">Browse</a>
            <a href="#">Sell</a>
            <a href="#">Help</a>
          </nav>

          <a href="#" className="signin-btn">
            Sign In
          </a>

          <button className="menu-btn">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      <main className="main">
        <div className="form-wrapper">
          <div>
            <h2 className="form-title">Create an account</h2>
            <p className="form-subtitle">
              Already have an account?{" "}
              <a href="#" className="link">
                Sign in
              </a>
            </p>
          </div>

          <div className="form-card">
            <form className="form" method="POST">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-grid">
              <a href="#" className="social-btn google">
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </a>

              <a href="#" className="social-btn facebook">
                <svg viewBox="0 0 24 24" className="social-icon">
                  <path
                    fill="#1877F2"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89H8.078v-2.89h2.359v-2.18c0-2.325 1.37-3.626 3.522-3.626 1.006 0 1.87.074 2.122.108v2.585h-1.51c-1.13 0-1.35.536-1.35 1.325v1.73h2.867l-.372 2.89H14.71V21.88C18.343 21.128 22 16.991 22 12z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <p className="form-footer">
            By creating an account, you agree to our <br />
            <a href="#" className="link">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="link">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
