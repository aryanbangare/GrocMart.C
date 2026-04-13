import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../services/api";

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

    try {
      setIsSubmitting(true);

      const result = await post<any>("Users/register", {
        name: name.trim(),
        passwordHash,
      });

      setIsSubmitting(false);

      if (!result) {
        setErrorMessage("Registration failed.");
        return;
      }

      setStatusMessage("Account created successfully. You can sign in now.");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage("Something went wrong. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <section className="auth-form">
          <div>
            <h2>Register</h2>
            <p>Fill the form to create a new account.</p>
          </div>

          {statusMessage && (
            <div className="status-banner">{statusMessage}</div>
          )}

          {errorMessage && (
            <div className="status-banner error">{errorMessage}</div>
          )}

          <div className="field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Choose a username"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={passwordHash}
              onChange={(e) => setPasswordHash(e.target.value)}
              placeholder="Create a secure password"
            />
          </div>

          <button
            className="button-primary"
            onClick={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          <p className="auth-switch">
            Already registered?{" "}
            <button onClick={() => navigate("/")}>Back to login</button>
          </p>
        </section>
      </div>
    </div>
  );
}
