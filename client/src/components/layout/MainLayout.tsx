import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full scrollbar-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-background min-h-screen scrollbar-hidden">
          <Header />

          <main className="flex-1 px-4 pt-4 pb-2 md:px-8 md:pt-8 md:pb-4 overflow-auto scrollbar-hidden">
            {/* Banner between header and dashboard content */}
            {/* <div
              className="
                mx-auto max-w-7xl
                relative overflow-hidden
                rounded-3xl border border-border/60
                bg-background/50 shadow-lg
                supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-150
                h-32 md:h-48 mb-4 md:mb-6
              "
            >
              <img
                src="/wallpaper.png"
                alt="Dashboard banner"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]" />
              <div className="relative z-10 h-full">
                <h1
                  className="absolute top-3 md:top-5 left-4 md:left-20 text-white drop-shadow-lg text-2xl md:text-7xl font-normal text-left"
                  style={{ fontFamily: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive' }}
                >
                  Behind every successful company
                </h1>
                <h1
                  className="absolute bottom-3 md:bottom-5 right-4 md:right-20 text-white drop-shadow-lg text-2xl md:text-7xl font-normal text-right"
                  style={{ fontFamily: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive' }}
                >
                  are people who feel valued.
                </h1>
              </div>
            </div> */}
            <div
              className="
                mx-auto max-w-7xl 
                relative overflow-hidden 
                rounded-3xl p-4 md:p-8 
                border border-border/60
                bg-background/50
                shadow-lg 
                supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-150
              "
            >
              {/* glossy overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent" />
              
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
