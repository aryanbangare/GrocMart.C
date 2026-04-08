import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../services";


export default function Login() {
  const [name, setName] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !passwordHash.trim()) {
      setErrorMessage("Enter both name and password to continue.");
      return;
    }

    setIsSubmitting(true);
    const result = await ApiService.login({ name: name.trim(), passwordHash });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.message || "Invalid login details.");
      return;
    }

    const user = result.data;
    const resolvedUserId =
      user?.userId ??
      user?.id ??
      user?.userID ??
      user?.userIdValue ??
      (typeof user === "number" ? user : undefined) ??
      (typeof user === "string" ? Number(user) : undefined);

    localStorage.setItem("name", name.trim());

    if (resolvedUserId !== undefined && Number.isFinite(Number(resolvedUserId))) {
      localStorage.setItem("userId", String(resolvedUserId));
    } else {
      localStorage.removeItem("userId");
    }

    navigate("/home");
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <section className="auth-form">
          <div>
            <h2>Login</h2>
            <p>Enter your account details below.</p>
          </div>

          {errorMessage ? (
            <div className="status-banner error">{errorMessage}</div>
          ) : null}

          <div className="field">
            <label htmlFor="login-name">Name</label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={passwordHash}
              onChange={(event) => setPasswordHash(event.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="button"
            className="button-primary"
            onClick={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          <p className="auth-switch">
            New here?{" "}
            <button type="button" onClick={() => navigate("/register")}>
              Create an account
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
