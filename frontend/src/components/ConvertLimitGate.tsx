import { CHECKOUT_PRICE } from "../config/checkout";
import { FREE_DAILY_DOC_CONVERT_LIMIT } from "../config/limits";
import { useAuth } from "../hooks/useAuth";
import { signupHref } from "../utils/authRedirect";
import { openCheckout } from "../utils/checkoutEvents";

interface ConvertLimitGateProps {
  onDismiss?: () => void;
}

export default function ConvertLimitGate({ onDismiss }: ConvertLimitGateProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="upload-pro-gate panel panel-soft">
      <div className="upload-pro-gate-copy">
        <h3>Daily export limit reached</h3>
        <p>
          Free accounts include {FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word or Excel exports per day.
          Upgrade to PDFTwin Pro for unlimited document conversions at {CHECKOUT_PRICE}/month.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="upload-pro-gate-actions">
          <a className="btn btn-primary" href={signupHref()}>
            Create account
          </a>
        </div>
      ) : (
        <div className="upload-pro-gate-actions">
          <button type="button" className="btn btn-primary" onClick={openCheckout}>
            Upgrade to Pro — {CHECKOUT_PRICE}/mo
          </button>
        </div>
      )}

      {onDismiss && (
        <button type="button" className="upload-pro-gate-dismiss" onClick={onDismiss}>
          Wait until tomorrow
        </button>
      )}
    </div>
  );
}
