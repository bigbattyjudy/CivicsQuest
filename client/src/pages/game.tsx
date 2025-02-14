import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  RefreshCcw,
  Home,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { type WordSet, type GameState } from "@shared/schema";
import { calculateScore, checkCategoryComplete } from "@/lib/game";
import { apiRequest } from "@/lib/queryClient";

export default function Game() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedWords, setSelectedWords] = useState<
    { word: string; category: string }[]
  >([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const { data: wordSet, isLoading } = useQuery<WordSet>({
    queryKey: [`/api/word-sets/${id}`],
  });

  const createGameMutation = useMutation({
    mutationFn: async (gameState: Omit<GameState, "id">) => {
      const res = await apiRequest("POST", "/api/game-states", gameState);
      return res.json();
    },
  });

  const handleWordSelect = (word: string) => {
    if (!currentCategory) {
      toast({
        title: "Select a category first",
        description: "Please select a category before grouping words",
      });
      return;
    }

    const newSelection = { word, category: currentCategory };
    setSelectedWords((prev) => [...prev, newSelection]);

    const score = calculateScore([...selectedWords, newSelection], wordSet!);
    if (selectedWords.length + 1 === wordSet!.words.length) {
      createGameMutation.mutate({
        wordSetId: wordSet!.id,
        selectedWords: [...selectedWords, newSelection],
        score,
        completed: true,
      });
      toast({
        title: "Game Complete!",
        description: `Your final score is ${score}%`,
      });
    }
  };

  const handleReset = () => {
    setSelectedWords([]);
    setCurrentCategory("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const score = wordSet ? calculateScore(selectedWords, wordSet) : 0;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-semibold">{score}%</span>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            {wordSet?.categories.map((category) => {
              const isComplete = checkCategoryComplete(
                category,
                selectedWords,
                wordSet
              );
              return (
                <Button
                  key={category}
                  variant={currentCategory === category ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => setCurrentCategory(category)}
                >
                  {category}
                  {isComplete && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </Button>
              );
            })}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Words</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wordSet?.words.map(({ word }) => {
                const isSelected = selectedWords.some((sw) => sw.word === word);
                return (
                  <Card
                    key={word}
                    className={`cursor-pointer transition-all ${
                      isSelected ? "opacity-50" : "hover:shadow-md"
                    }`}
                    onClick={() => !isSelected && handleWordSelect(word)}
                  >
                    <CardContent className="p-4 text-center">
                      {word}
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <Progress value={score} className="mt-8" />
      </div>
    </div>
  );
}
