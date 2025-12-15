"use client";

import QRCode from "react-qr-code";

interface SiteQrCodeProps {
  url?: string;
}

export default function SiteQrCode({
  url = "http://localhost:3000", // change this later to your real domain
}: SiteQrCodeProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-700">
      <p className="text-sm text-zinc-300 text-center">
        Scan this QR code to open our website:
      </p>
      <div className="bg-white p-3 rounded-lg">
        <QRCode value={url} size={160} />
      </div>
      <p className="text-xs text-zinc-400 text-center break-all">
        {url}
      </p>
    </div>
  );
}
