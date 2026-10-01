import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Login form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Login / Register toggle
  const [isRegister, setIsRegister] = useState(false);

  // Error message
  const [error, setError] = useState("");

  // Dummy login credentials
  const dummyUsers = [
    {
      id: 1,
      username: "admin@ishraqhr.com",
      password: "Admin@123",
      name: "Admin",
      role: "admin",
    },
    
    {
      id: 2,
      username: "jobseeker@ishraqhr.com",
      password: "Job@123",
      name: "Jobseeker",
      role: "jobseeker",
    },
    {
      id: 3,
      username: "employer@ishraqhr.com",
      password: "Employer@123",
      name: "employer",
      role: "employer",
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    // Find matching user
    const user = dummyUsers.find(
      (item) =>
        item.username === username &&
        item.password === password
    );

    // Invalid credentials
    if (!user) {
      setError("Invalid username or password.");
      return;
    }

    // User data for AuthContext
    const userData = {
      id: user.id,
      name: user.name,
      role: user.role,
      username: user.username,
    };

    // Save login
    login(userData);

    // Redirect according to role
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    }

    if (user.role === "jobseeker") {
      navigate("/jobseeker/dashboard");
    }

    if (user.role === "employer") {
      navigate("/employer/dashboard");
    }
  };

  return (
    <div className="login-body">
      <div className={`container2 ${isRegister ? "active" : ""}`}>

        {/* ================= LOGIN FORM ================= */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>

            <h1>Login</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div className="forget-link">
              <Link
  to="/forgot-password"
  className="text-[#2f6b8a] hover:underline"
>
  Forgot Password?
</Link>
            </div>

            {/* Error message */}
            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button type="submit" className="btn">
              Login
            </button>

          </form>
        </div>


        {/* ================= REGISTER FORM ================= */}
        <div className="form-box register">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h1>Registration</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
              />
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="btn">
              Register
            </button>

            <p>or register with social platforms</p>
          </form>
        </div>


        {/* ================= TOGGLE BOX ================= */}
        <div className="toggle-box">

          {/* Toggle Left */}
          <div className="toggle-panel toggle-left">

            <h1>Hello, Welcome!</h1>

            <p>Don't have an account?</p>
            <Link href={"https://ishraqhr.com/jobseekers/"}>
              <button
                type="button"
                className="btn register-btn"
              >
                Register
              </button>
          </Link>

          </div>


          {/* Toggle Right */}
          <div className="toggle-panel toggle-right">

            <h1>Welcome Back!</h1>

            <p>Already have an account?</p>

            <button
              type="button"
              className="btn login-btn"
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
            >
              Login
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;