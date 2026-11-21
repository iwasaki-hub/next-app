import Link from "next/link";

export default function LoginButton({
  action = "login",
}: {
  action?: "login" | "signup";
}) {
  return (
    <Link
      className="login-button"
      href={action === "signup" ? "/signup" : "/login"}
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
      {action === "signup" ? "新規登録" : "ログイン"}
    </Link>
  );
}
