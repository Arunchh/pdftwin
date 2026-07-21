import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { CHECKOUT_PRICE } from "../config/checkout";
import { formatBytes, formatFileLimit, FREE_FILE_LIMIT_MB } from "../config/limits";
import { useAuth } from "../hooks/useAuth";
import { loginHref, signupHref } from "../utils/authRedirect";
import { openCheckout } from "../utils/checkoutEvents";

interface UploadProGateProps {
  fileName: string;
  fileSize: number;
  onDismiss: () => void;
}

export default function UploadProGate({ fileName, fileSize, onDismiss }: UploadProGateProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="upload-pro-gate panel">
      <div className="upload-pro-gate-icon">
        <Lock size={22} />
      </div>
      <div className="upload-pro-gate-copy">
        <h3>Pro required for larger files</h3>
        <p>
          <strong>{fileName}</strong> is {formatBytes(fileSize)}. Free uploads work without an
          account up to {formatFileLimit(FREE_FILE_LIMIT_MB)}. Larger files need PDFTwin Pro at{" "}
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

      <button type="button" className="upload-pro-gate-dismiss" onClick={onDismiss}>
        Choose a smaller file
      </button>
    </div>
  );
}
