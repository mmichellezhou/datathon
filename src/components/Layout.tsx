
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppProvider } from "@/contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
    <div className="container py-4 flex items-center justify-between">
      <h1 className="text-4xl font-extrabold text-purple-800">
        PetPals
      </h1>
    </div>
  </header>
      <main className="container py-6">{children}</main>
      <footer className="bg-white border-t border-border">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PetPals
        </div>
      </footer>
    </div>
  );
};

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map path to tab value
  const getTabValue = () => {
    if (location.pathname.startsWith("/gallery")) return "gallery";
    return "tasks"; // default
  };

  const handleTabChange = (value: string) => {
    if (value === "tasks") navigate("/tasks");
    if (value === "gallery") navigate("/gallery");
  };

  return (
    <AppProvider>
      <Layout>
        <Tabs value={getTabValue()} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="tasks">Tasks & Pet</TabsTrigger>
            <TabsTrigger value="gallery">Pet Gallery</TabsTrigger>
          </TabsList>
          {children}
        </Tabs>
      </Layout>
    </AppProvider>
  );
};

export default AppLayout;
