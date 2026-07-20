import { useEffect, useState } from "react";
import { Lock, LockOpen, ShieldCheck } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import { downloadResponse, postFiles } from "../api";
import { fileKey, getPdfFiles } from "../utils/files";

interface LockUnlockPanelProps {
  files: File[];
}

export default function LockUnlockPanel({ files }: LockUnlockPanelProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [lockPassword, setLockPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState<"unlock" | "lock" | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    null
  );

  const pdfFiles = getPdfFiles(files);
  const targetFile =
    pdfFiles.find((file) => fileKey(file) === selectedKey) ?? pdfFiles[0] ?? null;

  useEffect(() => {
    if (!pdfFiles.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !pdfFiles.some((file) => fileKey(file) === selectedKey)) {
      setSelectedKey(fileKey(pdfFiles[0]));
    }
  }, [pdfFiles, selectedKey]);

  const handleUnlock = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one PDF file." });
      return;
    }

    setLoading("unlock");
    setMessage(null);

    try {
      const extra: Record<string, string> = {};
      if (unlockPassword) extra.password = unlockPassword;

      const response = await postFiles("/api/unlock", [targetFile], extra);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Unlock failed.");
      }

      await downloadResponse(response, "unlocked.pdf");
      setMessage({ type: "success", text: "PDF unlocked. Your download should start automatically." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Unlock failed.",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleLock = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one PDF file." });
      return;
    }

    if (!lockPassword.trim()) {
      setMessage({ type: "error", text: "Enter a password to lock the PDF." });
      return;
    }

    setLoading("lock");
    setMessage(null);

    try {
      const extra: Record<string, string> = { password: lockPassword };
      if (currentPassword) extra.current_password = currentPassword;

      const response = await postFiles("/api/lock", [targetFile], extra);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Lock failed.");
      }

      await downloadResponse(response, "locked.pdf");
      setMessage({ type: "success", text: "PDF locked. Your download should start automatically." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Lock failed.",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Lock &amp; Unlock</h2>
      <p className="description">
        Remove password restrictions or protect a PDF with a new password.
      </p>

      <div className="workflow-rail">
        <div className={`workflow-step ${targetFile ? "active" : ""}`}>
          <span className="workflow-step-number">1</span>
          <span>Choose PDF</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${targetFile ? "active" : ""}`}>
          <span className="workflow-step-number">2</span>
          <ShieldCheck size={16} />
          <span>Protect</span>
        </div>
      </div>

      {pdfFiles.length === 0 ? (
        <p className="file-hint muted">Upload at least one PDF file above to get started.</p>
      ) : (
        <>
          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 1 · Choose PDF</h3>
                <p>Select the document you want to lock or unlock.</p>
              </div>
              <span className={`workflow-status ${targetFile ? "done" : "pending"}`}>
                {targetFile ? "Selected" : "Required"}
              </span>
            </div>

            <PdfSelectList
              files={pdfFiles}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
              label="PDF to protect"
            />
          </section>

          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 2 · Lock or unlock</h3>
                <p>Pick the action that matches what you need for this file.</p>
              </div>
              <span className="workflow-status optional">Choose one</span>
            </div>

            <div className="convert-options">
              <div className="convert-card">
                <div className="convert-card-icon">
                  <LockOpen size={28} />
                </div>
                <h3>Unlock PDF</h3>
                <p>Remove password or printing/copy restrictions</p>
                <div className="field" style={{ marginTop: 0, textAlign: "left" }}>
                  <label htmlFor="unlock-password">Current password (optional)</label>
                  <input
                    id="unlock-password"
                    type="password"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="Leave blank to try without password"
                    autoComplete="off"
                  />
                </div>
                <IconButton
                  icon={<LockOpen size={18} />}
                  label="Unlock PDF"
                  loading={loading === "unlock"}
                  disabled={loading !== null || !targetFile}
                  onClick={handleUnlock}
                />
              </div>

              <div className="convert-card">
                <div className="convert-card-icon">
                  <Lock size={28} />
                </div>
                <h3>Lock PDF</h3>
                <p>Protect the PDF with a new password</p>
                <div className="field" style={{ marginTop: 0, textAlign: "left" }}>
                  <label htmlFor="lock-password">New password</label>
                  <input
                    id="lock-password"
                    type="password"
                    value={lockPassword}
                    onChange={(e) => setLockPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                </div>
                <div className="field" style={{ textAlign: "left" }}>
                  <label htmlFor="current-password">Current password (if already locked)</label>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Only if PDF is already protected"
                    autoComplete="off"
                  />
                </div>
                <IconButton
                  icon={<Lock size={18} />}
                  label="Lock PDF"
                  loading={loading === "lock"}
                  disabled={loading !== null || !targetFile}
                  onClick={handleLock}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
