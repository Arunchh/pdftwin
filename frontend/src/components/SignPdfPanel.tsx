import { useEffect, useRef, useState } from "react";
import { Eraser, PenLine, Upload } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import ClientProcessedBadge from "./ClientProcessedBadge";
import { downloadBlob } from "../api";
import { PdfClientError, signPdf, type SignaturePosition } from "../services/pdfClient";
import { fileKey, getImageFiles, getPdfFiles } from "../utils/files";

interface SignPdfPanelProps {
  files: File[];
}

function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new PdfClientError("Could not capture signature."));
        return;
      }
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, "image/png");
  });
}

export default function SignPdfPanel({ files }: SignPdfPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [signatureFileKey, setSignatureFileKey] = useState<string | null>(null);
  const [pages, setPages] = useState("all");
  const [position, setPosition] = useState<SignaturePosition>("bottom-right");
  const [loading, setLoading] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const pdfFiles = getPdfFiles(files);
  const pngFiles = getImageFiles(files).filter((file) => file.name.toLowerCase().endsWith(".png"));
  const targetFile =
    pdfFiles.find((file) => fileKey(file) === selectedKey) ?? pdfFiles[0] ?? null;
  const signatureFile =
    pngFiles.find((file) => fileKey(file) === signatureFileKey) ?? null;

  useEffect(() => {
    if (!pdfFiles.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !pdfFiles.some((file) => fileKey(file) === selectedKey)) {
      setSelectedKey(fileKey(pdfFiles[0]));
    }
  }, [pdfFiles, selectedKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#111827";
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";
  }, []);

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    const point = getCanvasPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    setHasDrawing(true);
    setSignatureFileKey(null);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const point = getCanvasPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    canvasRef.current?.releasePointerCapture(event.pointerId);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    setSignatureFileKey(null);
  };

  const resolveSignatureBytes = async (): Promise<Uint8Array> => {
    if (signatureFile) {
      return new Uint8Array(await signatureFile.arrayBuffer());
    }

    if (!hasDrawing) {
      throw new PdfClientError("Draw a signature or upload a PNG signature image.");
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      throw new PdfClientError("Signature canvas is not ready.");
    }

    return canvasToPngBytes(canvas);
  };

  const handleSign = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one PDF file above." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const signatureBytes = await resolveSignatureBytes();
      const blob = await signPdf(targetFile, signatureBytes, pages, position);
      const baseName = targetFile.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(blob, `${baseName}_signed.pdf`);
      setMessage({
        type: "success",
        text: "PDF signed successfully. Your download should start automatically.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof PdfClientError || err instanceof Error ? err.message : "Signing failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Sign PDF</h2>
      <p className="description">
        Draw your signature or upload a transparent PNG, then place it on selected PDF pages.
      </p>
      <ClientProcessedBadge />

      {pdfFiles.length === 0 ? (
        <p className="file-hint muted">Upload at least one PDF file above to get started.</p>
      ) : (
        <>
          <PdfSelectList
            files={pdfFiles}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            label="PDF to sign"
          />

          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Your signature</h3>
                <p>Draw below or pick a PNG from your workspace tray.</p>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              className="signature-canvas"
              width={640}
              height={180}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />

            <div className="actions">
              <IconButton
                icon={<Eraser size={18} />}
                label="Clear signature"
                variant="secondary"
                onClick={clearSignature}
              />
            </div>

            {pngFiles.length > 0 && (
              <div className="field">
                <label htmlFor="signature-png">
                  <Upload size={14} /> Or use PNG from workspace
                </label>
                <select
                  id="signature-png"
                  value={signatureFileKey ?? ""}
                  onChange={(e) => {
                    setSignatureFileKey(e.target.value || null);
                    if (e.target.value) setHasDrawing(false);
                  }}
                >
                  <option value="">Drawn signature</option>
                  {pngFiles.map((file) => (
                    <option key={fileKey(file)} value={fileKey(file)}>
                      {file.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

          <div className="field-row">
            <div className="field">
              <label htmlFor="sign-pages">Pages</label>
              <input
                id="sign-pages"
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="all or 1, 3-5"
              />
            </div>

            <div className="field">
              <label htmlFor="sign-position">Position</label>
              <select
                id="sign-position"
                value={position}
                onChange={(e) => setPosition(e.target.value as SignaturePosition)}
              >
                <option value="bottom-right">Bottom right</option>
                <option value="bottom-left">Bottom left</option>
                <option value="center">Center</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <IconButton
              icon={<PenLine size={18} />}
              label="Sign PDF"
              loading={loading}
              disabled={!targetFile}
              onClick={handleSign}
            />
          </div>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
