
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import Pet from "@/components/Pet";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import PetGallery from "@/components/PetGallery";

const PetGalleryLog: React.FC = () => {
  return (
    <Layout>
      <Tabs defaultValue="gallery">
        <TabsContent value="tasks" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-8">
              <Pet />
            </div>
            <div className="space-y-8">
              <TaskForm />
            </div>
          </div>
          <TaskList />
        </TabsContent>
        <TabsContent value="gallery">
          <PetGallery />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default PetGalleryLog;