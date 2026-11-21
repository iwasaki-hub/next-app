"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type TabId = "links" | "workflow";

const tabs = [
  { id: "links", label: "便利なリンク", panelId: "guide-panel-links" },
  { id: "workflow", label: "開発の流れ", panelId: "guide-panel-workflow" },
] as const;

export default function GuideTabs({
  links,
  workflow,
}: {
  links: ReactNode;
  workflow: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("links");
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
    </div>
  );
}
