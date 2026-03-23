import React, { useState, useEffect, useRef } from "react";
import SidebarContent from "./Sidebarcontent";

interface AppShellProps {
  children: React.ReactNode;
  dashboard?: boolean;
}

const AppShell = ({ children, dashboard = false }: AppShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const curr = el.scrollTop;
      const diff = curr - lastScrollY.current;
      if (diff > 4) setNavVisible(false);
      else if (diff < -4) setNavVisible(true);
      lastScrollY.current = curr;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const lastInner = new WeakMap<Element, number>();
    const onCapture = (e: Event) => {

      if (!(e.target instanceof Element)) return;
      const t = e.target as Element;
      if (
        !t ||
        t === mainRef.current ||
        t === document.documentElement ||
        t === document.body
      )
        return;
      const curr = (t as HTMLElement).scrollTop ?? 0;
      const prev = lastInner.get(t) ?? curr;
      const diff = curr - prev;
      if (diff > 4) setNavVisible(false);
      else if (diff < -4) setNavVisible(true);
      lastInner.set(t, curr);
    };
    document.addEventListener("scroll", onCapture, {
      passive: true,
      capture: true,
    });
    return () =>
      document.removeEventListener("scroll", onCapture, { capture: true });
  }, []);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);


  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <>
      <style>{`
        .appshell-nav {
          transform: translateY(0);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.3s ease;
        }
        .appshell-nav.nav-hidden {
          transform: translateY(-110%);
        }
        @keyframes appshell-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes appshell-slide-in {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">

        <aside className="hidden lg:flex w-[220px] min-w-[220px] bg-white border-r border-gray-100 flex-col py-6 shadow-sm z-30">
          <SidebarContent />
        </aside>

        {/* ── Mobile Drawer ── */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              style={{ animation: "appshell-fade-in 0.2s ease" }}
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className="relative z-50 w-[260px] bg-white flex flex-col py-6 h-full shadow-2xl"
              style={{ animation: "appshell-slide-in 0.25s ease" }}
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}


        <main
          ref={mainRef}
          className={`flex-1 min-w-0 flex flex-col bg-white ${
            dashboard ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {/* ── Mobile Navbar ── */}
          <div
            className={`appshell-nav lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm ${
              navVisible ? "" : "nav-hidden"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#6E83B2] rounded-full flex items-center justify-center">
                <svg
                  width="75%"
                  viewBox="0 0 680 500"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon points="340,60 120,245 560,245" fill="white" />
                  <rect x="430" y="98" width="72" height="95" fill="white" />
                  <rect x="428" y="88" width="82" height="22" fill="white" />
                  <rect x="158" y="235" width="364" height="205" fill="white" />
                  <rect
                    x="270"
                    y="330"
                    width="140"
                    height="120"
                    fill="#6E83B2"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-bold text-gray-800">
                NivasIQ
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5 text-gray-600"
              >
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            </button>
          </div>


          {!dashboard && <div className="lg:hidden h-[57px] flex-shrink-0" />}


          {children}
        </main>
      </div>
    </>
  );
};

export default AppShell;
