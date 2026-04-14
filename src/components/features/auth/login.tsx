import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../services/api";



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

    try {
    setIsSubmitting(true);


    const user = await post<any>("Users/login", {
        name: name.trim(),
        passwordHash,
    });

    setIsSubmitting(false);

    if (!user) {
        setErrorMessage("Invalid login details.");
        return;
    }


    const resolvedUserId =
        user?.userId ??
        user?.id ??
        user?.userID ??
        (typeof user === "number" ? user : undefined);


    localStorage.setItem("name", name.trim());

    if (resolvedUserId !== undefined) {
        localStorage.setItem("userId", String(resolvedUserId));
    }
    

    navigate("/home");

    } catch (error) {
    setIsSubmitting(false);
    setErrorMessage("Something went wrong. Try again.");
    console.error(error);
    }
};

return (
    <div className="auth-shell">
    <div className="auth-card">
   <form className="auth-form" onSubmit={handleLogin}>
        <div>
            <h2>Login</h2>
            <p>Enter your account details below.</p>
        </div>

        {errorMessage && (
            <div className="status-banner error">{errorMessage}</div>
        )}

        <div className="field">
            <label>Name</label>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            />
        </div>

        <div className="field">
            <label>Password</label>
            <input
            type="password"
            value={passwordHash}
            onChange={(e) => setPasswordHash(e.target.value)}
            placeholder="Enter your password"
            />
        </div>

        <button
            type="submit"
            className="button-primary"
            disabled={isSubmitting}
        >
            {isSubmitting ? "logging..." : "Login"}
        </button>

        <p className="auth-switch">
            New here?{" "}
            <button type="button" onClick={() => navigate("/register")}>
            Create an account
            </button>
        </p>
        </form>
    </div>
    </div>
);
}