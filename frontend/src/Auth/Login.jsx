import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../../utils/BaseUrl";

const Login = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Signup failed");
      } else {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#040459] via-[#3b3bc6] to-[#040459] h-screen w-screen flex justify-center items-center">
      <form
        onSubmit={handleOnSubmit}
        className="flex flex-col w-full max-w-sm p-14 bg-black/30 rounded-2xl shadow-lg"
      >
        <h2 className="text-white text-3xl mb-5">Chat Application</h2>
        <div className="email mb-8">
          <label htmlFor="email" className="block mb-2 text-white">
            Email
          </label>
          <input
            className="w-full p-2 rounded bg-white text-black"
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="password mb-8">
          <label htmlFor="password" className="block mb-2 text-white">
            Password
          </label>
          <input
            className="w-full p-2 rounded bg-white text-black"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className="text-red-500 font-semibold mb-4">{error}</div>
        )}
        <div className="submit">
          <button
            type="submit"
            className="cursor-pointer p-3 bg-[#f4a3a3] opacity-80 hover:opacity-100 text-black rounded-2xl"
          >
            Login
          </button>
        </div>
        <div className="flex text-white font-bold mt-3">
          <span>New User? </span>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-200 underline ml-1"
          >
            click here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
