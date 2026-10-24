
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("Please sign in with Google.");

  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setMessage("");
        }
      })
      .catch(() => setMessage("Could not connect to the server."));
  }, []);

  const handleLogin = async (response) => {
    try {
      const res = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (!res.ok) {
        setMessage(data.message || data.error || "Login failed.");
        return;
      }

      setUser(data.user);
      setMessage("");
    } catch {
      setMessage("Could not connect to the server.");
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setMessage("You have logged out.");
  };

  return (
    <div style={{
      maxWidth: "420px",
      margin: "80px auto",
      padding: "25px",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      border: "1px solid #ddd",
      borderRadius: "12px"
    }}>
      <h1>Google Login</h1>

      {user ? (
        <>
          {user.picture && (
            <img
              src={user.picture}
              alt="Profile"
              width="90"
              height="90"
              style={{ borderRadius: "50%" }}
            />
          )}

          <h2>Welcome, {user.name || "User"}!</h2>
          <p>Email: {user.email}</p>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <p>{message}</p>

          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => setMessage("Google login failed.")}
          />
        </>
      )}
    </div>
  );
}

export default App;
