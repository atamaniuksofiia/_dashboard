import {
  Mosaic,
  MosaicBranch,
  MosaicNode,
  MosaicWindow,
  getNodeAtPath,
  updateTree,
} from "react-mosaic-component";
import CompanyInfoWidget from "./CompanyInfo.component";
import { CompanyInfo } from "./CompanyInfo.types";
import { useState, useCallback } from "react";
import {
  ArrowsPointingOutIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import companyData from "../data/companies-lookup.json";

export type WindowID =
  | "window1"
  | "window2"
  | "window3"
  | "window4"
  | "window5";

const companies = companyData as unknown as CompanyInfo[];

const DEFAULT_TICKERS = {
  window1: "AAPL",
  window2: "NVDA",
  window3: "MSFT",
  window4: "GOOGL",
  window5: "AMZN",
};

const MAX_WINDOWS = 5;

const Dashboard = () => {
  const [selectedTickers, setSelectedTickers] = useState(DEFAULT_TICKERS);
  const [activeWindows, setActiveWindows] = useState<WindowID[]>([
    "window1",
    "window2",
    "window3",
  ]);

  const [currentLayout, setCurrentLayout] = useState<MosaicNode<WindowID>>({
    direction: "row",
    first: "window1",
    second: {
      direction: "row",
      first: "window2",
      second: "window3",
      splitPercentage: 50,
    },
    splitPercentage: 33,
  });

  const [maximizedWindow, setMaximizedWindow] = useState<WindowID | null>(null);
  const [previousLayout, setPreviousLayout] =
    useState<MosaicNode<WindowID> | null>(null);

  const handleTickerChange = (windowId: WindowID, ticker: string) => {
    setSelectedTickers((prev) => ({
      ...prev,
      [windowId]: ticker,
    }));
  };

  const countWindows = useCallback(
    (node: MosaicNode<WindowID> | null): number => {
      if (!node) return 0;
      if (typeof node === "string") return 1;
      return countWindows(node.first) + countWindows(node.second);
    },
    []
  );

  const canAddWindow = useCallback(() => {
    const currentCount = countWindows(currentLayout);
    return currentCount < MAX_WINDOWS;
  }, [currentLayout, countWindows]);

  const createNewWindowId = useCallback((): WindowID | null => {
    if (!canAddWindow()) return null;
    for (let i = 1; i <= MAX_WINDOWS; i++) {
      const windowId = `window${i}` as WindowID;
      if (!activeWindows.includes(windowId)) {
        setActiveWindows((prev) => [...prev, windowId]);
        return windowId;
      }
    }
    return null;
  }, [canAddWindow, activeWindows]);

  const handleRefresh = (windowId: WindowID) => {
    alert(`Refreshing ${selectedTickers[windowId]} data...`);
  };

  const handleAddWindow = (windowId: WindowID, path: MosaicBranch[]) => {
    if (!canAddWindow()) {
      alert(`Maximum number of windows (${MAX_WINDOWS}) reached!`);
      return;
    }
    const newWindowId = createNewWindowId();
    if (!newWindowId) return;
    setSelectedTickers((prev) => ({
      ...prev,
      [newWindowId]: DEFAULT_TICKERS[newWindowId] || "TSLA",
    }));
    const newLayout = updateTree(currentLayout, [
      {
        path,
        spec: {
          $set: {
            direction: "row",
            first: windowId,
            second: newWindowId,
            splitPercentage: 50,
          },
        },
      },
    ]);
    setCurrentLayout(newLayout);
  };

  const handleAddToTopRight = () => {
    if (!canAddWindow()) {
      alert(`Maximum number of windows (${MAX_WINDOWS}) reached!`);
      return;
    }
    const newWindowId = createNewWindowId();
    if (!newWindowId) return;
    setSelectedTickers((prev) => ({
      ...prev,
      [newWindowId]: DEFAULT_TICKERS[newWindowId] || "TSLA",
    }));
    const newLayout: MosaicNode<WindowID> = {
      direction: "row",
      first: currentLayout,
      second: newWindowId,
      splitPercentage: 80,
    };
    setCurrentLayout(newLayout);
  };

  const handleAutoArrange = () => {
    const newLayout: MosaicNode<WindowID> = {
      direction: "row",
      first: activeWindows[0],
      second:
        activeWindows.length > 1
          ? activeWindows.length > 2
            ? {
                direction: "row",
                first: activeWindows[1],
                second: activeWindows[2],
                splitPercentage: 50,
              }
            : activeWindows[1]
          : undefined,
      splitPercentage: 33,
    } as MosaicNode<WindowID>;

    setCurrentLayout(newLayout);
  };

  const handleMaximize = (windowId: WindowID) => {
    if (maximizedWindow === windowId) {
      if (previousLayout) {
        setCurrentLayout(previousLayout);
        setPreviousLayout(null);
        setMaximizedWindow(null);
      }
    } else {
      setPreviousLayout(currentLayout);
      setCurrentLayout(windowId);
      setMaximizedWindow(windowId);
    }
  };

  const handleClose = (windowId: WindowID, path: MosaicBranch[]) => {
    if (!path.length) {
      alert("Cannot close the last remaining window");
      return;
    }
    setActiveWindows((prev) => prev.filter((id) => id !== windowId));
    const parentPath = path.slice(0, -1);
    const parentNode = getNodeAtPath(currentLayout, parentPath);
    if (!parentNode || typeof parentNode === "string") return;
    const lastBranch = path[path.length - 1];
    const siblingNodeId =
      lastBranch === "first" ? parentNode.second : parentNode.first;
    const newLayout = updateTree(currentLayout, [
      {
        path: parentPath,
        spec: {
          $set: siblingNodeId,
        },
      },
    ]);
    setCurrentLayout(newLayout);
  };

  const renderWindow = (id: WindowID, path: MosaicBranch[]) => {
    const ticker = selectedTickers[id];
    return (
      <MosaicWindow<WindowID>
        path={path}
        title={ticker}
        toolbarControls={
          <div className="flex items-center">
            <select
              value={ticker}
              onChange={(e) => handleTickerChange(id, e.target.value)}
              className="text-xs border border-gray-300 bg-white rounded px-2 py-1 w-32 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mr-1"
            >
              {companies.map((company) => (
                <option key={company.ticker} value={company.ticker}>
                  {company.ticker}: {company.name}
                </option>
              ))}
            </select>
            <div className="flex border border-gray-300 rounded bg-gray-100">
              <button
                onClick={() => handleRefresh(id)}
                title="Refresh Data"
                className="p-1 hover:bg-gray-200 border-r border-gray-300"
              >
                <ArrowPathIcon className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleAddWindow(id, path)}
                title="Add Window"
                className={`p-1 border-r border-gray-300 ${
                  canAddWindow()
                    ? "hover:bg-gray-200"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!canAddWindow()}
              >
                <PlusIcon className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleMaximize(id)}
                title={maximizedWindow === id ? "Restore" : "Maximize"}
                className="p-1 hover:bg-gray-200 border-r border-gray-300"
              >
                <ArrowsPointingOutIcon className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleClose(id, path)}
                title="Close Window"
                className="p-1 hover:bg-gray-200"
              >
                <XMarkIcon className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        }
      >
        <div className="bg-gray-100 text-gray-900 p-4 space-y-4 h-full overflow-auto rounded shadow-sm">
          <CompanyInfoWidget ticker={ticker} />
        </div>
      </MosaicWindow>
    );
  };

  return (
    <div className="h-screen w-full p-2 bg-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">react-mosaic v0.10</h1>
        <div className="flex gap-2">
          <span className="text-sm">Theme: Blueprint</span>
          <button
            onClick={handleAutoArrange}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
          >
            Auto Arrange
          </button>
          <button
            className={`bg-blue-500 text-white px-2 py-1 rounded text-sm ${
              !canAddWindow() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAddToTopRight}
            disabled={!canAddWindow()}
          >
            Add Window To Top Right
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              className="h-6 w-6"
            />
          </a>
        </div>
      </div>
      <div className="h-[calc(100%-3rem)]">
        <Mosaic<WindowID>
          renderTile={(id, path) => renderWindow(id, path)}
          value={currentLayout}
          onChange={(newNode) => {
            if (newNode !== null) {
              setCurrentLayout(newNode);
            }
          }}
          className="mosaic-blueprint-theme bg-gray-900 text-gray"
        />
      </div>
    </div>
  );
};

export default Dashboard;
