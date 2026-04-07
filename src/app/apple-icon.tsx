import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#021C24",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        <svg width="120" height="82" viewBox="0 0 29 19.8" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="apple-g1" x1="14.5" x2="14.5" y1="0" y2="19.8" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#26C8B8" />
              <stop offset="1" stopColor="#07638C" />
            </linearGradient>
          </defs>
          <path
            d="M0 10.2L5.2 19.8L10.8 9.6H23.8L29 0H5.6L0 10.2Z"
            fill="url(#apple-g1)"
          />
        </svg>
      </div>
    ),
    size,
  );
}
