import { Monitor } from "lucide-react";

export default function ClientProcessedBadge() {
  return (
    <p className="client-processed-badge" role="status">
      <Monitor size={14} aria-hidden />
      Processed on your device — this file is not uploaded to our servers.
    </p>
  );
}
