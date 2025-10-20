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
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-background min-h-screen">
          <Header />

          <main className="flex-1 px-4 pt-4 pb-2 md:px-8 md:pt-8 md:pb-4 overflow-auto">
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
