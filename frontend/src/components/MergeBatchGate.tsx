import { ArrowRight, Sparkles } from "lucide-react";
import { CHECKOUT_PRICE } from "../config/checkout";
import { FREE_MERGE_FILE_LIMIT } from "../config/limits";
import { useAuth } from "../hooks/useAuth";
import { loginHref, signupHref } from "../utils/authRedirect";
import { openCheckout } from "../utils/checkoutEvents";

interface MergeBatchGateProps {
  fileCount: number;
  onDismiss?: () => void;
}

export default function MergeBatchGate({ fileCount, onDismiss }: MergeBatchGateProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="upload-pro-gate panel">
      <div className="upload-pro-gate-copy">
        <h3>Pro required for large merges</h3>
        <p>
          Free accounts can merge up to {FREE_MERGE_FILE_LIMIT} PDFs at once. You have {fileCount}{" "}
          files in your merge queue. Upgrade to PDFTwin Pro to combine larger batches at{" "}
          {CHECKOUT_PRICE}/month.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="upload-pro-gate-actions">
          <a className="btn btn-primary" href={signupHref()}>
            Create account
            <ArrowRight size={16} />
          </a>
          <a className="btn btn-secondary" href={loginHref()}>
            Sign in
          </a>
        </div>
      ) : (
        <div className="upload-pro-gate-actions">
          <button type="button" className="btn btn-primary" onClick={openCheckout}>
            <Sparkles size={16} />
            Upgrade to Pro — {CHECKOUT_PRICE}/mo
          </button>
        </div>
      )}

      {onDismiss && (
        <button type="button" className="upload-pro-gate-dismiss" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );
}
