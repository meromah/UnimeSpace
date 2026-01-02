import React, { useState } from "react";
import { useLoginMutation } from "../../services/authApi";
import SuccessModal from "./components/SuccessModal";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../app/authSlice";
import Toast from "../../components/Toast";
import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState({ hasError: false, message: null });
  const [login, { isLoading, isError }] = useLoginMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        email,
        password,
      }).unwrap();
      dispatch(setIsAuthenticated(true))
      setShowSuccessModal(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError({ hasError: true, message: err.data.message });
    }
  };
  return (
    <main className="px-4 py-16 max-w-md mx-auto">
      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          header={"Welcome to UnimeSpace!"}
          message={
            "Your logged in to your account successfully. Redirecting..."
          }
          path={sessionStorage.getItem("last-visit") || "/home"}
        />
      )}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-black text-neutral-900 mb-2">
          Welcome back
        </h1>
        <p className="text-neutral-700">
          Sign in to post, not to spy — your info stays private.
        </p>
      </header>

      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-white rounded-2xl p-6 sm:p-8 shadow"
      >
        <div className="grid gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-medium text-neutral-800">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-2 pt-1 pb-1.5 focus:outline-1 text-primary-blue rounded-md border border-gray-200 focus:outline-primary-yellow"
              required
            />
          </label>
          <div className="space-y-2">
            <label className="flex flex-col gap-2">
              <span className="font-medium text-neutral-800">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`px-2 pt-1 pb-1.5 focus:outline-1 text-primary-blue rounded-md border border-gray-200 focus:outline-primary-yellow`}
                required
              />
            </label>
            {isError&&<p className="flex items-center gap-2 text-neutral-700 text-xs">
              <span>Forgot your password?</span>
              <Link to="/reset-password" className="text-primary-blue underline">
                Reset
              </Link>
            </p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 justify-center bg-primary-blue py-2 rounded-lg uppercase cursor-pointer hover:scale-105 transition-all duration-200 text-white font-semibold hover:bg-primary-blue/90 w-full"
          >
            <span>{isLoading ? "Logging in..." : "Log In"}</span>
            {isLoading && (
              <Loader2 className="animate-spin text-white text-lg" />
            )}
          </button>
        </div>
      </form>

      <p className="flex items-center gap-2 justify-center text-center text-neutral-700 mt-4">
        <span>New here?</span>
        <Link to="/register" className="text-primary-blue underline">
          Create an account
        </Link>
      </p>
      {error.hasError && (
        <Toast
          message={error.message}
          onClose={() => setError({ hasError: false, message: null })}
          time={10000}
          type="error"
          key={"login-error"}
        />
      )}
    </main>
  );
};

export default Login;
