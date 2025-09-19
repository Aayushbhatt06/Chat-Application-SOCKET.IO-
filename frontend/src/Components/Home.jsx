import React, { useEffect, useState } from "react";
import SearchUser from "./SearchUser";
import ChatSection from "./ChatSection";
import { URL } from "../../utils/BaseUrl";

const Home = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("authToken");
  const [fusers, setFusers] = useState([]);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (connections.length > 0) {
      setSelected(connections[0]._id);
    }
  }, []);

  const requestsfetch = async () => {
    try {
      const res = await fetch(`${URL}/connections/getconreq`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Error fetching requests");
      else setRequests(data.conReq || []);
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

  const requestCon = async (reqId) => {
    try {
      const res = await fetch(`${URL}/connections/reqcon`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reqId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error sending request");
        return;
      }
      setError("");
      requestsfetch();
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

  const acceptRequest = async (reqId) => {
    try {
      const res = await fetch(`${URL}/connections/acceptcon`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reqId }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Error accepting request");
      else {
        setError("");
        requestsfetch();
        fetchConnections();
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

  const removeCon = async (conId) => {
    let answer = confirm("Do you want Remove this connection?");
    if (answer) {
      const res = await fetch(`${URL}/connections/removecon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conId }),
      });

      const data = await res.json();

      if (res.ok) {
      } else {
        alert("Error removing the connection");
      }
      window.location.reload();
    }
  };

  const rejectRequest = async (reqId) => {
    try {
      const res = await fetch(`${URL}/connections/rejectcon`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reqId }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Error rejecting request");
      else {
        setError("");
        requestsfetch();
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch(`${URL}/connections/getcon`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Error fetching connections");
      else setConnections(data.connections || []);
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    requestsfetch();
    fetchConnections();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen text-black">
      <div className="navbar w-full p-3 sm:p-5 bg-gray-900 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="heading text-lg sm:text-xl font-semibold text-white">
          Chatting Application
        </div>

        <div className="relative w-full sm:w-64">
          <SearchUser setFusers={setFusers} />
          {fusers.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
              {fusers.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between px-4 py-2 hover:bg-gray-200"
                >
                  <div>{user.name}</div>
                  <button
                    onClick={() => requestCon(user._id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                  >
                    Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="logout flex">
          <div className="loggedinUser mx-4 text-white text-lg font-bold">{`Hello ${currentUser.name}`}</div>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.reload();
            }}
            className="bg-red-400 rounded-lg px-3 py-1 text-white mt-2 sm:mt-0"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="main flex flex-col sm:flex-row h-full w-full overflow-hidden">
        <div className="connections w-full sm:w-1/3 p-2 sm:p-4 bg-black/10 overflow-y-auto">
          {/* Requests */}
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex flex-col sm:flex-row justify-between items-center p-2 m-2 rounded-lg bg-yellow-200"
            >
              <div className="mx-2 font-medium">{request.user.name}</div>
              <div className="flex gap-2 mt-1 sm:mt-0">
                <button
                  onClick={() => acceptRequest(request.user._id)}
                  className="px-3 py-1 rounded-lg bg-green-500 text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(request.user._id)}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}

          {/* Connections */}
          {connections.length > 0 ? (
            connections.map((connection) => (
              <div
                key={connection._id}
                onClick={() => {
                  setSelected(connection._id);
                }}
                className={`flex justify-between items-center p-2 m-2 rounded-lg cursor-pointer ${
                  selected === connection._id
                    ? "bg-blue-500 text-white"
                    : "bg-blue-200"
                }`}
              >
                <div className="mx-1">{connection.name}</div>
                <button
                  onClick={() => {
                    removeCon(connection._id);
                  }}
                  className="px-2 text-white cursor-pointer py-1 rounded-lg bg-red-600"
                >
                  Remove Connection
                </button>
              </div>
            ))
          ) : (
            <p className="text-black m-2">No connections found</p>
          )}
        </div>
        <ChatSection selected={selected} connections={connections} />
      </div>
    </div>
  );
};

export default Home;
