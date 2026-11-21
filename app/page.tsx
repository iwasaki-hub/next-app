import Image from "next/image";
import appIcon from "./icon.svg";
import GuideTabs from "./guide-tabs";

// Resource icons from Octicons, Simple Icons, and Feather.
const githubIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="currentColor"
  >
    <path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656" />
  </svg>
);
const nextIcon = (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    aria-hidden="true"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
  </svg>
);
const codeIcon = (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const externalArrow = (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="resource-arrow"
    aria-hidden="true"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const resources = [
  {
    title: "GitHubリポジトリ",
    url: "https://github.com/iwasaki-hub/next-app",
    icon: githubIcon,
  },
  {
    title: "Next.js公式ドキュメント",
    url: "https://nextjs.org/docs/app",
    icon: nextIcon,
  },
  {
    title: "Codex Tips",
    url: "https://github.com/iwasaki-hub/codex-tips",
    icon: codeIcon,
  },
];

const steps = [
  {
    title: "開発環境のセットアップ",
    description: (
      <>
        Node.js 24 LTS を用意し、リポジトリ内で <code>npm ci</code>、
        <code>npm run dev</code> の順に実行します。
      </>
    ),
  },
  {
    title: "開発ルールの確認",
    description: (
      <>AGENTS.md や Codex Tips で、開発ルールと作業の進め方を確認します。</>
    ),
  },
  {
    title: "最初の機能の実装",
    description: (
      <>小さな機能から実装し、動作確認とPRレビューを経てマージします。</>
    ),
  },
];

export default function Home() {
  return (
    <main className="guide">
      <header className="brand">
        <Image src={appIcon} width={32} height={32} alt="" />
        <span>next-app</span>
      </header>

      <h1>開発ガイド</h1>
      <p className="intro">開発に使うリンクをまとめました。</p>
      <GuideTabs
        links={
          <nav aria-label="開発に使うリンク">
            <ul className="resources">
              {resources.map(({ title, url, icon }) => (
                <li key={url}>
                  <a
                    className="resource"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="resource-icon">{icon}</span>
                    <span>{title}</span>
                    {externalArrow}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
        workflow={
          <section className="workflow" aria-labelledby="workflow-title">
            <h2 id="workflow-title">開発の流れ</h2>
            <ol className="steps" role="list">
              {steps.map(({ title, description }, index) => (
                <li key={title}>
                  <span className="step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        }
      />
    </main>
  );
}
