import { useId, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const ROLES = [
  {
    key: "admin",
    label: "Admin",
    title: "Admin sign in",
    blurb: "Review listings, approve employers and keep the portal healthy.",
    placeholder: "admin@ishraqhr.com",
    redirect: "/admin/dashboard",
    registerUrl: null,
  },
  {
    key: "employer",
    label: "Employer",
    title: "Employer sign in",
    blurb: "Post openings, shortlist candidates and track every hire.",
    placeholder: "employer@ishraqhr.com",
    redirect: "/employer/dashboard",
    registerUrl: "https://ishraqhr.com/employers/",
  },
  {
    key: "jobseeker",
    label: "Job seeker",
    title: "Job seeker sign in",
    blurb:
      "Find roles that fit, apply in one click and follow your applications.",
    placeholder: "jobseeker@ishraqhr.com",
    redirect: "/jobseeker/dashboard",
    registerUrl: "https://ishraqhr.com/jobseekers/",
  },
];

// Dummy login credentials (replace with your API later)
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

/* ------------------------------------------------------------------ */
/*  Heartbeat line (same shape as the reference image)                 */
/* ------------------------------------------------------------------ */

const PERIOD = 380;

const buildPulsePath = (beats) => {
  let d = "M0 60";
  for (let i = 0; i < beats; i++) {
    const x = i * PERIOD + 40;
    d += ` H${x} l22 -4 l30 7 l16 -53 l16 76 l15 -26 l23 -6 l15 8 l15 -8 l16 6`;
  }
  return d + ` H${beats * PERIOD}`;
};

const Pulse = ({ beats = 3, className = "" }) => {
  const id = useId().replace(/:/g, "");
  const d = buildPulsePath(beats);
  const width = beats * PERIOD;

  return (
    <svg
      className={`pulse ${className}`}
      viewBox={`0 0 ${width} 120`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* faint ghost line that is always there */}
      <path className="pulse-ghost" d={d} />
      {/* the line that draws itself */}
      <path id={id} className="pulse-line" d={d} pathLength="1" />

      {/* the dot that rides the line */}
      <g className="pulse-dot">
        <circle r="11" className="pulse-halo" />
        <circle r="5" className="pulse-core" />
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          keyPoints="0;1;1"
          keyTimes="0;0.7;1"
          calcMode="linear"
        >
          <mpath href={`#${id}`} />
        </animateMotion>
        <animate
          attributeName="opacity"
          dur="6s"
          repeatCount="indefinite"
          values="1;1;0;0"
          keyTimes="0;0.7;0.76;1"
        />
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  Small inline icons                                                 */
/* ------------------------------------------------------------------ */

const IconUser = () => (
  <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
    <rect x="4" y="10" width="16" height="10" rx="3" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const IconEye = ({ off }) => (
  <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" className="ico ico-check" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Login                                                              */
/* ------------------------------------------------------------------ */

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Roles allowed for each login URL
  const isAdminLogin = location.pathname === "/admin/login";

  const visibleRoles = isAdminLogin
    ? ROLES.filter((r) => r.key === "admin")
    : ROLES.filter((r) => r.key === "employer" || r.key === "jobseeker");

  const defaultRole = isAdminLogin ? "admin" : "employer";

  const [roleKey, setRoleKey] = useState(defaultRole);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsOn, setCapsOn] = useState(false);

  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const roleIndex = visibleRoles.findIndex((r) => r.key === roleKey);
  const role = visibleRoles[roleIndex];

  const fail = (message) => {
    setError(message);
    setStatus("idle");
    setShake(true);
  };

  const handleRoleChange = (key) => {
    setRoleKey(key);
    setError("");
  };

  const fillDemo = () => {
    const demo = dummyUsers.find((u) => u.role === roleKey);
    if (demo) {
      setUsername(demo.username);
      setPassword(demo.password);
      setError("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (status !== "idle") return;

    setError("");
    setStatus("loading");

    // Small delay so the loading state is visible (remove with a real API)
    setTimeout(() => {
      const user = dummyUsers.find(
        (item) =>
          item.username === username.trim() && item.password === password,
      );

      if (!user) {
        fail("Username or password is incorrect. Check both and try again.");
        return;
      }

      if (user.role !== roleKey) {
        const actual = ROLES.find((r) => r.key === user.role)?.label;
        fail(
          `This is a ${actual} account. Select "${actual}" above to sign in.`,
        );
        return;
      }

      const userData = {
        id: user.id,
        name: user.name,
        role: user.role,
        username: user.username,
      };

      login(userData);
      setStatus("success");

      setTimeout(() => navigate(role.redirect), 650);
    }, 700);
  };

  return (
    <div className="ish-page">
      {/* Full-width heartbeat running behind the card */}
      <Pulse beats={6} className="pulse-page" />

      <main className="ish-card" data-status={status}>
        {/* ---------------- Brand panel ---------------- */}
        <aside className="ish-panel">
          <span className="blob blob-a" />
          <span className="blob blob-b" />

          <div className="ish-brand">
            <span className="ish-logo" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path d="M2 17h7l3-9 5 17 3-8h10" />
              </svg>
            </span>
            <span className="ish-brand-name">Ishraq HR</span>
          </div>

          <div className="ish-panel-copy">
            <h2>Where hiring finds its rhythm.</h2>
            <p key={role.key} className="ish-blurb">
              {role.blurb}
            </p>
          </div>

          <Pulse beats={3} className="pulse-panel" />
        </aside>

        {/* ---------------- Form ---------------- */}
        <section className="ish-form-side">
          {visibleRoles.length > 1 && (
            <div className="ish-tabs" role="tablist" aria-label="Account type">
              <span
                className="ish-tab-thumb"
                style={{
                  transform: `translateX(${roleIndex * 100}%)`,
                }}
              />

              {visibleRoles.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  role="tab"
                  aria-selected={r.key === roleKey}
                  className={`ish-tab ${r.key === roleKey ? "is-active" : ""}`}
                  onClick={() => handleRoleChange(r.key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          <form
            className={`ish-form ${error ? "has-error" : ""} ${shake ? "shake" : ""}`}
            onSubmit={handleLogin}
            onAnimationEnd={(e) => {
              if (e.animationName === "ish-shake") setShake(false);
            }}
          >
            <header key={role.key} className="ish-form-head">
              <h1>{role.title}</h1>
              <p>Enter your details to continue.</p>
            </header>

            <label className="ish-field">
              <span className="ish-field-icon">
                <IconUser />
              </span>
              <input
                type="text"
                value={username}
                placeholder=" "
                autoComplete="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                required
              />
              <span className="ish-field-label">Email or username</span>
            </label>

            <label className="ish-field">
              <span className="ish-field-icon">
                <IconLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder=" "
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyUp={(e) => setCapsOn(e.getModifierState("CapsLock"))}
                onBlur={() => setCapsOn(false)}
                required
              />
              <span className="ish-field-label">Password</span>
              <button
                type="button"
                className="ish-eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <IconEye off={showPassword} />
              </button>
            </label>

            {capsOn && <p className="ish-hint">Caps Lock is on.</p>}

            <div className="ish-row">
              <label className="ish-check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="ish-box">
                  <IconCheck />
                </span>
                Keep me signed in
              </label>

              <Link to="/forgot-password" className="ish-link">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="ish-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className={`ish-submit ${status}`}
              disabled={status !== "idle"}
            >
              <span className="ish-submit-text">
                Sign in as {role.label.toLowerCase()}
              </span>
              <span className="ish-submit-spinner" aria-hidden="true" />
              <span className="ish-submit-done" aria-hidden="true">
                <IconCheck />
              </span>
            </button>

            <button type="button" className="ish-demo" onClick={fillDemo}>
              Fill {role.label.toLowerCase()} demo login
            </button>

            {role.registerUrl && (
              <p className="ish-register">
                New to Ishraq HR?{" "}
                <a href={role.registerUrl} target="_blank" rel="noreferrer">
                  Create a {role.label.toLowerCase()} account
                </a>
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
