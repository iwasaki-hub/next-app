// This guide describes the repository's workflow, not live CI or deployment status.
const verificationCommands = [
  "npm ci",
  "npm run lint",
  "npm run typecheck",
  "npm run build",
];

export default function DeliveryFlow() {
  return (
    <section className="delivery-flow" aria-label="コード更新からデプロイまでの流れ">
      <div className="delivery-overview" aria-label="開発から公開までの3つの段階">
        <span>CODE</span>
        <span className="delivery-overview-arrow" aria-hidden="true">→</span>
        <span>CHECK</span>
        <span className="delivery-overview-arrow" aria-hidden="true">→</span>
        <span>LIVE</span>
      </div>

      <ol className="delivery-stages">
        <li className="delivery-stage">
          <span className="delivery-stage-number" aria-hidden="true">01</span>
          <div className="delivery-stage-body">
            <p className="delivery-stage-label">FEATURE BRANCH</p>
            <h3>コードを更新してPRを作成</h3>
            <p>
              <code>feature/*</code> ブランチで変更し、GitHubにPush。
              Pull Request（PR）で差分を確認できるようにします。
            </p>
            <a
              className="delivery-link"
              href="https://github.com/iwasaki-hub/next-app/pulls"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pull Requestsを見る <span aria-hidden="true">↗</span>
            </a>
          </div>
        </li>

        <li className="delivery-stage">
          <span className="delivery-stage-number" aria-hidden="true">02</span>
          <div className="delivery-stage-body">
            <p className="delivery-stage-label">PR CHECKS</p>
            <h3>CIとPreviewを確認</h3>
            <p>
              PRでGitHub ActionsのCIが動きます。VercelはPreviewを別にビルドし、
              画面の動作を確認できます。
            </p>
            <p className="delivery-parallel-label">
              <span className="delivery-parallel-icon" aria-hidden="true" />
              2つの処理は独立して進みます
            </p>
            <div className="delivery-check-grid">
              <div className="delivery-check-card">
                <div className="delivery-check-heading">
                  <span className="delivery-check-symbol" aria-hidden="true">✓</span>
                  <span>GitHub Actions</span>
                </div>
                <h4>CI / 自動テスト</h4>
                <p>Node.js 24で依存関係の固定インストールと品質チェックを実行。</p>
                <ul className="delivery-commands">
                  {verificationCommands.map((command) => (
                    <li key={command}><code>{command}</code></li>
                  ))}
                </ul>
                <a
                  className="delivery-link"
                  href="https://github.com/iwasaki-hub/next-app/actions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Actionsを見る <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="delivery-check-card">
                <div className="delivery-check-heading">
                  <span className="delivery-check-symbol" aria-hidden="true">↗</span>
                  <span>Vercel</span>
                </div>
                <h4>Preview / 表示確認</h4>
                <p>
                  featureブランチのプレビューで、レイアウトやタブ操作を確認。
                  CIの成功とは別の確認です。
                </p>
                <a
                  className="delivery-link"
                  href="https://github.com/iwasaki-hub/next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  リポジトリを見る <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </li>

        <li className="delivery-stage">
          <span className="delivery-stage-number" aria-hidden="true">03</span>
          <div className="delivery-stage-body">
            <p className="delivery-stage-label">REVIEW &amp; MERGE</p>
            <h3>差分をレビューしてマージ</h3>
            <p>
              CIの結果とPreviewを確認したうえで、明示的な指示を受けて
              PRを<code>main</code>へマージします。PR作成だけではマージしません。
            </p>
          </div>
        </li>

        <li className="delivery-stage">
          <span className="delivery-stage-number" aria-hidden="true">04</span>
          <div className="delivery-stage-body">
            <p className="delivery-stage-label">MAIN BRANCH</p>
            <h3>CIと本番デプロイが動く</h3>
            <p>
              <code>main</code>へのPushでもGitHub ActionsのCIが実行され、
              GitHub連携したVercelがProductionデプロイを開始します。
            </p>
            <div className="delivery-info">
              CIとデプロイは別の処理です。CIの成功だけで本番公開が完了したことにはなりません。
            </div>
          </div>
        </li>

        <li className="delivery-stage">
          <span className="delivery-stage-number" aria-hidden="true">05</span>
          <div className="delivery-stage-body">
            <p className="delivery-stage-label">PRODUCTION</p>
            <h3>READYと本番画面を確認</h3>
            <p>
              Vercelのデプロイが<code>READY</code>になったことを確認し、
              公開サイトを開いて動作を検証します。iPhone実機の確認は別途必要です。
            </p>
            <a
              className="delivery-link"
              href="https://next-app-dun-six-88.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              本番サイトを開く <span aria-hidden="true">↗</span>
            </a>
          </div>
        </li>
      </ol>
      <p className="delivery-disclaimer">
        これは開発・公開手順の説明です。CIやデプロイの現在の実行状況を表示するものではありません。
      </p>
    </section>
  );
}
