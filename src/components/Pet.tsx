import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPetStage, getPetEmoji } from "@/lib/petData";
import { useAppContext } from "@/contexts/AppContext";
import { Award, Star, Sprout } from "lucide-react";

const Pet: React.FC = () => {
  const { currentPet, setCurrentPetName, resetCurrentPet } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [petName, setPetName] = useState(currentPet.name);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Update pet name state when current pet changes
  useEffect(() => {
    setPetName(currentPet.name);
  }, [currentPet.name]);
  
  // Show animation when happiness increases
  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPet.happiness]);

  const handleNameSubmit = () => {
    setCurrentPetName(petName);
    setIsEditing(false);
  };

  const petStage = getPetStage(currentPet.growth);
  const petEmoji = getPetEmoji(currentPet.type, petStage);
  
  const happinessColor = 
    currentPet.happiness < 30 ? 'bg-red-400' :
    currentPet.happiness < 70 ? 'bg-amber-400' : 'bg-green-400';

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Pet</h2>
          {currentPet.growth >= 100 && (
            <Button 
              onClick={resetCurrentPet}
              className="gap-2"
              variant="outline"
            >
              <Award className="h-4 w-4" /> 
              Get New Pet
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="pet-container min-h-[200px] relative">
          <div 
            className={`text-7xl md:text-8xl mt-[15px] ${showAnimation ? 'animate-pet-grow' : 'animate-pet-bounce'}`}
          >
            {petEmoji}
          </div>
          <div className="mt-4 text-center">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="text-center"
                  maxLength={15}
                  autoFocus
                />
                <Button size="sm" onClick={handleNameSubmit}>Save</Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-lg font-medium">{currentPet.name}</h3>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ✏️
                </button>
              </div>
            )}
            <p className="text-sm text-muted-foreground capitalize">
              {currentPet.type} • {petStage}
            </p>
          </div>

          {currentPet.growth >= 100 && (
            <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
              Ready to evolve!
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium">Happiness</span>
            </div>
            <span className="text-sm font-medium">{currentPet.happiness}%</span>
          </div>
          <Progress value={currentPet.happiness} className={happinessColor} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Growth</span>
            </div>
            <span className="text-sm font-medium">{Math.round(currentPet.growth)}%</span>
          </div>
          <Progress value={currentPet.growth} className="bg-primary/20" />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground">
        Complete tasks to increase happiness and grow your pet!
      </CardFooter>
    </Card>
  );
};

export default Pet;
