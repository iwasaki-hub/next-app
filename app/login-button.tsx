"use client";

import { useRef, useState, type KeyboardEvent } from "react";

export default function LoginButton() {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleEscape(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setIsNoticeOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div className="login-control">
      <button
        ref={buttonRef}
        type="button"
        className="login-button"
        aria-controls="login-notice"
        aria-expanded={isNoticeOpen}
        onKeyDown={handleEscape}
        onClick={() => setIsNoticeOpen((open) => !open)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
        </svg>
        ログイン
      </button>
      <div
        id="login-notice"
        className="login-notice"
        role="status"
        hidden={!isNoticeOpen}
      >
        <p>ログイン機能は準備中です。現在、アカウントへのログインはできません。</p>
        <button
          className="login-notice-close"
          type="button"
          onKeyDown={handleEscape}
          onClick={() => {
            setIsNoticeOpen(false);
            buttonRef.current?.focus();
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
