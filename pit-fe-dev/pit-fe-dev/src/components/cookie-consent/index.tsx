"use client";

import { Title } from "@tremor/react";
import { useEffect, useState } from "react";
import { TbX } from "react-icons/tb";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(true);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "false");
    setShowBanner(false);
  };

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (cookieConsent === "true") {
      setShowBanner(false);
    }
  }, []);

  return (
    <>
      {showBanner && (
        <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay overflow-y-auto">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="p-4 rounded-lg z-50 bg-white">
            <div className="justify-between items-center flex">
              <Title>Cookies</Title>
              <span
                className="text-xl cursor-pointer pb-4"
                onClick={() => setShowBanner(false)}
              >
                <TbX />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm">
                We use cookies to improve your experience on our site. By using
                our site, you agree to our use of cookies.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleAccept}
                  className="mr-4 bg-primaryColor hover:bg-orange-400 text-white font-bold py-2 px-4 rounded"
                >
                  Allow
                </button>
                <button
                  onClick={handleDecline}
                  className="bg-white border border-primaryColor hover:bg-primaryColor text-primaryColor hover:text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
