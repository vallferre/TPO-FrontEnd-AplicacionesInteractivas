import React from "react";
import "../components/Login.css";

export default function Login() {
  return (
    <div className="app bg-light dark:bg-dark font-display text-slate-800 dark:text-slate-200">
      <div className="flex flex-col min-h-screen">
        {/* Main */}
        <main className="main">
          <div className="login-box">
            <div>
              <h2 className="welcome">Welcome back</h2>
              <p className="subtitle">Log in to your ColecXion account</p>
            </div>

            <form className="form">
              <div className="form-group">
                <input
                  type="text"
                  id="email-address"
                  name="email"
                  placeholder="Email or Username"
                  required
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember">
                  <input type="checkbox" id="remember-me" name="remember-me" />
                  Remember me
                </label>
                <a href="#" className="forgot">
                  Forgot your password?
                </a>
              </div>

              <button type="submit" className="btn-submit">
                Log In
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="socials">
              <a href="#" className="social google">
                <svg
                  className="icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                </svg>
                Google
              </a>

              <a href="#" className="social facebook">
                <svg
                  className="icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  ></path>
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
