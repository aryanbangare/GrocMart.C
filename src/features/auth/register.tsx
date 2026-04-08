import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../services";


export default function Register() {
  const [name, setName] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setStatusMessage("");
    setErrorMessage("");

    if (!name.trim() || !passwordHash.trim()) {
      setErrorMessage("Enter a name and password to create your account.");
      return;
    }

    setIsSubmitting(true);
    const result = await ApiService.register({ name: name.trim(), passwordHash });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.message || "Registration failed.");
      return;
    }

    setStatusMessage("Account created successfully. You can sign in now.");
    setTimeout(() => navigate("/"), 800);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <section className="auth-promo">
          
        </section>

        <section className="auth-form">
          <div>
            <h2>Register</h2>
            <p>Fill the form to create a new account.</p>
          </div>

          {statusMessage ? <div className="status-banner">{statusMessage}</div> : null}
          {errorMessage ? (
            <div className="status-banner error">{errorMessage}</div>
          ) : null}

          <div className="field">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Choose a username"
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={passwordHash}
              onChange={(event) => setPasswordHash(event.target.value)}
              placeholder="Create a secure password"
            />
          </div>

          <button
            type="button"
            className="button-primary"
            onClick={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          <p className="auth-switch">
            Already registered?{" "}
            <button type="button" onClick={() => navigate("/")}>
              Back to login
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
