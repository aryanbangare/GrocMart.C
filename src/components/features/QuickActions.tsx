import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  statusMessage?: string;
  errorMessage?: string;
  onClearFilters: () => void;
}

export default function QuickActions({
  statusMessage,
  errorMessage,
  onClearFilters,
}: QuickActionsProps) {
  const navigate = useNavigate();

  return (
    <section className="panel section-panel">
      <div className="section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p className="panel-subtitle">
            Use these buttons to manage your shopping easily.
          </p>
        </div>

        <div className="toolbar">
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate("/cart")}
          >
            View cart
          </button>
          <button
            type="button"
            className="button-ghost"
            onClick={onClearFilters}
          >
            Clear filters
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="status-banner" role="status" aria-live="polite">
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="status-banner error" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </section>
  );
}
