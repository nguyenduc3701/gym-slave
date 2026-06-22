"use client";
import React, { useEffect, useState } from "react";

const SecurityHeader: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Chỉ gọi localStorage ở phía client (trình duyệt)
    setAccessToken(localStorage.getItem("RGS_ADMIN_TOKEN"));
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h1>Security Header</h1>
      {accessToken !== null && (
        <iframe
          src={`https://nova-admin-portal-dev.private-cloud1n.equator-dev.ascendtechnology.io/nova-admin-portal/#/login?accessToken=${accessToken}`}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Security Header"
          referrerPolicy="unsafe-url"
        />
      )}
    </div>
  );
};

export default SecurityHeader;
