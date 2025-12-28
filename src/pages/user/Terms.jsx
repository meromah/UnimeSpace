import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.DEV
  ? "/api/terms"
  : import.meta.env.VITE_API_BASE_URL || "/api/terms";

const Terms = () => {
  const { hash } = useLocation();
  const [html, setHtml] = useState("");
  const iframeRef = useRef(null);

  // Fetch HTML
  useEffect(() => {
    fetch(API_BASE_URL)
      .then((res) => res.text())
      .then(setHtml);
  }, []);

  // Scroll inside iframe after load + hash change
  useEffect(() => {
    if (!hash || !iframeRef.current) return;

    const iframe = iframeRef.current;

    const scrollToHash = () => {
      const id = hash.slice(1);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const el = doc.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };

    iframe.addEventListener("load", scrollToHash);
    scrollToHash();

    return () => iframe.removeEventListener("load", scrollToHash);
  }, [hash, html]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      title="Terms and Conditions"
      className="w-full h-screen border-none"
    />
  );
};

export default Terms;
