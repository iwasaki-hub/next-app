const setupSteps = [
  {
    number: "01",
    title: "開発環境を起動",
    description: "npm install → npm run dev で、ローカルの画面を確認します。",
  },
  {
    number: "02",
    title: "開発ルールを整える",
    description: "AGENTS.md と Codex Tips を使い、作業を小さなPRに分けます。",
  },
  {
    number: "03",
    title: "最初の機能をつくる",
    description: "仕様と完成条件を決め、画面・データ・テストを少しずつ追加します。",
  },
] as const;

const resources = [
  {
    label: "Next.js 公式ドキュメント",
    href: "https://nextjs.org/docs/app",
  },
  {
    label: "Codex Tips",
    href: "https://github.com/iwasaki-hub/codex-tips",
  },
  {
    label: "GitHub リポジトリ",
    href: "https://github.com/iwasaki-hub/next-app",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white"
            >
              N
            </span>
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">
                next-app
              </p>
              <p className="text-xs text-slate-500">Development starter</p>
            </div>
          </div>
          <a
            href="https://github.com/iwasaki-hub/next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            GitHubを開く ↗
          </a>
        </header>

        <section className="relative mt-10 overflow-hidden rounded-3xl bg-slate-950 px-7 py-12 text-white shadow-xl shadow-slate-200 sm:mt-14 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 size-80 rounded-full bg-blue-500/25 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <p className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest text-sky-200">
              NEXT.JS × TYPESCRIPT × CODEX
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-tight">
              ここから、
              <span className="block text-sky-300">新しいWebアプリを。</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              プロジェクトの土台ができました。小さく作って、確かめて、
              ひとつずつ育てていくためのスタートページです。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://nextjs.org/docs/app"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              >
                Next.jsを学ぶ ↗
              </a>
              <a
                href="https://github.com/iwasaki-hub/codex-tips"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              >
                Codex Tipsを見る ↗
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="next-steps-title" className="mt-14">
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest text-blue-700">
              GET STARTED
            </p>
            <h2
              id="next-steps-title"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-900"
            >
              次に進める3つのステップ
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              はじめに開発基盤を確かめてから、機能開発を始めましょう。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {setupSteps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-sm font-bold text-blue-600">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="resources-title"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <h2 id="resources-title" className="text-lg font-bold text-slate-900">
            開発に役立つリンク
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {resources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {resource.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <footer className="py-10 text-center text-xs text-slate-500">
          Built with Next.js · TypeScript · Tailwind CSS
        </footer>
      </div>
    </main>
  );
}
