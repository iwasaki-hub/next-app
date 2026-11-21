"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type TabId = "links" | "workflow" | "delivery";

const tabs = [
  { id: "links", label: "便利なリンク", panelId: "guide-panel-links" },
  { id: "workflow", label: "開発の流れ", panelId: "guide-panel-workflow" },
  { id: "delivery", label: "公開フロー", panelId: "guide-panel-delivery" },
] as const;

const tabCopy: Record<TabId, { title: string; description: string }> = {
  links: {
    title: "必要なものは、ここに。",
    description: "よく使う開発リソースをひとつにまとめました。",
  },
  workflow: {
    title: "一歩ずつ、進めよう。",
    description: "セットアップから実装まで、順番に確認できます。",
  },
  delivery: {
    title: "コードが届くまで。",
    description: "更新からCI、GitHub Actions、デプロイまでの道のり。",
  },
};

export default function GuideTabs({
  links,
  workflow,
  delivery,
}: {
  links: ReactNode;
  workflow: ReactNode;
  delivery: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("links");
  const { title, description } = tabCopy[activeTab];
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="guide-tab-container" id="guide-content">
      <div className="guide-card-intro">
        <span className="guide-card-kicker">AT A GLANCE</span>
        <h2 className="guide-card-title">{title}</h2>
        <p>{description}</p>
      </div>
      <div className="guide-tab-bar">
        <div
          className="guide-tab-list"
          role="tablist"
          aria-label="開発ガイドの表示切り替え"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`guide-tab-${tab.id}`}
              className="guide-tab"
              type="button"
              role="tab"
              aria-controls={tab.panelId}
              aria-selected={activeTab === tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id="guide-panel-links"
        className="guide-tab-panel"
        role="tabpanel"
        aria-labelledby="guide-tab-links"
        tabIndex={0}
        hidden={activeTab !== "links"}
      >
        {links}
      </div>
      <div
        id="guide-panel-workflow"
        className="guide-tab-panel"
        role="tabpanel"
        aria-labelledby="guide-tab-workflow"
        tabIndex={0}
        hidden={activeTab !== "workflow"}
      >
        {workflow}
      </div>
      <div
        id="guide-panel-delivery"
        className="guide-tab-panel"
        role="tabpanel"
        aria-labelledby="guide-tab-delivery"
        tabIndex={0}
        hidden={activeTab !== "delivery"}
      >
        {delivery}
      </div>
    </div>
  );
}
