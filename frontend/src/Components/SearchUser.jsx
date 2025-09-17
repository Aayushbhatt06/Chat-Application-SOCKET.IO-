import { useState, useEffect } from "react";

const SearchUser = ({ setFusers }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  const fetchUsersByName = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/connections/finduser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError("No user found");
        setFusers([]);
      } else {
        setError("");
        setFusers(data);
      }
    } catch (err) {
      setError("Something went wrong");
      setFusers([]);
    }
  };

  useEffect(() => {
    if (name.length > 1) {
      fetchUsersByName();
    } else {
      setFusers([]);
    }
  }, [name]);

  return (
    <div className="search bg-white/50 px-8 py-1 text-black rounded-lg">
      <input
        className="w-full outline-none bg-transparent"
        type="text"
        placeholder="Search User"
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

export default SearchUser;
