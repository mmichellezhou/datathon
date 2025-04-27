
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppProvider } from "@/contexts/AppContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Critter World</h1>
        </div>
      </header>
      <main className="container py-6">{children}</main>
      <footer className="bg-white border-t border-border">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Critter World
        </div>
      </footer>
    </div>
  );
};

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <Layout>
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tasks">Tasks & Pet</TabsTrigger>
            <TabsTrigger value="history">Task History</TabsTrigger>
            <TabsTrigger value="gallery">Pet Gallery</TabsTrigger>
          </TabsList>
          {children}
        </Tabs>
      </Layout>
    </AppProvider>
  );
};

export default AppLayout;
