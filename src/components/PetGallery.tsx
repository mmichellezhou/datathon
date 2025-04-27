
import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Star, Award } from "lucide-react";
import { getPetEmoji } from "@/lib/petData";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const PetGallery: React.FC = () => {
  const { completedPets } = useAppContext();

  // Sort pets by completedAt (most recent first)
  const sortedPets = [...completedPets].sort(
    (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
  );

  return (
    <Tabs defaultValue="gallery">
      <TabsContent value="gallery">
        <div className="container mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Pet Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedPets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-4">🏆</div>
                  <p>Complete tasks to grow your current pet and add it to your gallery!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedPets.map((pet) => (
                    <Card key={pet.id} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
                      <div className="bg-gradient-to-br from-pet-light to-pet-background p-6 flex flex-col items-center justify-center">
                        <div className="text-6xl mb-2">{getPetEmoji(pet.type, 'adult')}</div>
                        <h3 className="text-lg font-medium">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{pet.type}</p>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-primary" />
                            <span className="font-medium">Score</span>
                          </div>
                          <span>{pet.score} points</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-400" />
                            <span className="font-medium">Happiness</span>
                          </div>
                          <span>{pet.happiness}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Tasks Completed</span>
                          <span>{pet.tasks.length}</span>
                        </div>
                        <div className="pt-2 text-xs text-muted-foreground">
                          Graduated {format(pet.completedAt, "MMM d, yyyy")}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PetGallery;
