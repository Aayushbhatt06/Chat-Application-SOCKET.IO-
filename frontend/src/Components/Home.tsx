import React, { useEffect, useState } from "react";
import SearchUser from "./SearchUser";
import ChatSection from "./ChatSection";

interface User {
  _id: string;
  name: string;
  email?: string;
}

interface ConnectionRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
}

interface Connection {
  _id: string;
  name: string;
}

const Home: React.FC = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("authToken");
  const [fusers, setFusers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (connections.length > 0) {
      setSelected(connections[0]._id);
    }
  }, []);

  const requestsfetch = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/connections/getconreq`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Error fetching requests");
      else setRequests(data.conReq || []);
    } catch (error) {
      setError((error as Error).message || "Something went wrong");
    }
  };

  const requestCon = async (reqId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/connections/reqcon`, {
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
      setError((error as Error).message || "Something went wrong");
    }
  };

  const acceptRequest = async (reqId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/connections/acceptcon`, {
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
      setError((error as Error).message || "Something went wrong");
    }
  };

  const removeCon = async (conId: string) => {
    let answer = confirm("Do you want Remove this connection?");
    if (answer) {
      const res = await fetch(`${BACKEND_URL}/connections/removecon`, {
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

  const rejectRequest = async (reqId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/connections/rejectcon`, {
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
      setError((error as Error).message || "Something went wrong");
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/connections/getcon`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Error fetching connections");
      else setConnections(data.connections || []);
    } catch (error) {
      setError((error as Error).message || "Something went wrong");
    }
  };

  useEffect(() => {
    requestsfetch();
    fetchConnections();
  }, []);

  const handleSelectConnection = (connectionId: string) => {
    setSelected(connectionId);
    setShowSidebar(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex flex-col h-screen w-screen text-black">
      <div className="navbar w-full p-3 sm:p-5 bg-gray-900 flex justify-between items-center gap-2">
        {/* Menu Button (Mobile/Tablet) */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-md"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="heading text-lg sm:text-xl font-semibold text-white">
          Chatting Application
        </div>

        <div className="relative w-full sm:w-64 hidden sm:block">
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

        <div className="logout flex items-center">
          <div className="loggedinUser mx-2 sm:mx-4 text-white text-sm sm:text-lg font-bold hidden sm:block">
            {`Hello ${currentUser.name}`}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.reload();
            }}
            className="bg-red-400 rounded-lg px-2 sm:px-3 py-1 text-white text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="main flex h-full w-full overflow-hidden relative">
        {/* Sidebar - Desktop */}
        <div className="connections hidden lg:block w-1/3 p-4 bg-black/10 overflow-y-auto">
          {/* Requests */}
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex justify-between items-center p-2 m-2 rounded-lg bg-yellow-200"
            >
              <div className="mx-2 font-medium">{request.user.name}</div>
              <div className="flex gap-2">
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
                onClick={() => setSelected(connection._id)}
                className={`flex justify-between items-center p-2 m-2 rounded-lg cursor-pointer ${
                  selected === connection._id
                    ? "bg-blue-500 text-white"
                    : "bg-blue-200"
                }`}
              >
                <div className="mx-1">{connection.name}</div>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    removeCon(connection._id);
                  }}
                  className="px-2 text-white cursor-pointer py-1 rounded-lg bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-black m-2">No connections found</p>
          )}
        </div>

        {/* Sidebar - Mobile/Tablet (Overlay) */}
        {showSidebar && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowSidebar(false)}
            />
            <div className="lg:hidden fixed left-0 top-0 h-full w-4/5 max-w-sm bg-white z-50 overflow-y-auto shadow-xl">
              <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
                <h2 className="text-lg font-semibold">Connections</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-white p-1 hover:bg-gray-800 rounded"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                {/* Search on mobile */}
                <div className="mb-4">
                  <SearchUser setFusers={setFusers} />
                  {fusers.length > 0 && (
                    <div className="mt-2 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto">
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

                {/* Requests */}
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className="flex flex-col justify-between items-start p-3 mb-2 rounded-lg bg-yellow-200"
                  >
                    <div className="font-medium mb-2">{request.user.name}</div>
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => acceptRequest(request.user._id)}
                        className="flex-1 px-3 py-1 rounded-lg bg-green-500 text-white"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(request.user._id)}
                        className="flex-1 px-3 py-1 rounded-lg bg-red-500 text-white"
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
                      onClick={() => handleSelectConnection(connection._id)}
                      className={`flex flex-col justify-between items-start p-3 mb-2 rounded-lg cursor-pointer ${
                        selected === connection._id
                          ? "bg-blue-500 text-white"
                          : "bg-blue-200"
                      }`}
                    >
                      <div className="font-medium mb-2">{connection.name}</div>
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          removeCon(connection._id);
                        }}
                        className="w-full px-2 text-white cursor-pointer py-1 rounded-lg bg-red-600"
                      >
                        Remove Connection
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-black m-2">No connections found</p>
                )}
              </div>
            </div>
          </>
        )}

        <ChatSection selected={selected} connections={connections} />
      </div>
    </div>
  );
};

export default Home;
