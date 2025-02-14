import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  RefreshCcw,
  Home,
  HelpCircle,
  Check,
  X,
} from "lucide-react";
import { type WordSet, type GameState } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Game() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [submittedGroups, setSubmittedGroups] = useState<{
    words: string[];
    isCorrect: boolean;
    explanation?: string;
  }[]>([]);

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
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else if (selectedWords.length < 4) {
      setSelectedWords(prev => [...prev, word]);
    } else {
      toast({
        title: "Maximum words selected",
        description: "You can only select 4 words at a time. Submit or deselect words.",
      });
    }
  };

  const handleSubmit = () => {
    if (!wordSet || selectedWords.length !== 4) return;

    const correctGroup = wordSet.wordGroups.find(group =>
      selectedWords.every(word => group.words.includes(word)) &&
      group.words.every(word => selectedWords.includes(word))
    );

    const newGroup = {
      words: selectedWords,
      isCorrect: !!correctGroup,
      explanation: correctGroup?.explanation,
    };

    setSubmittedGroups(prev => [...prev, newGroup]);
    setSelectedWords([]);

    if (correctGroup) {
      toast({
        title: "Correct!",
        description: correctGroup.explanation,
      });
    } else {
      toast({
        title: "Try Again",
        description: "These words don't form a complete group. Look for words that are more closely related.",
        variant: "destructive",
      });
    }

    // Check if game is complete
    const allWords = new Set(wordSet.wordGroups.flatMap(g => g.words));
    const submittedWords = new Set([...submittedGroups, newGroup]
      .filter(g => g.isCorrect)
      .flatMap(g => g.words));

    if (Array.from(allWords).every(word => submittedWords.has(word))) {
      const score = Math.round((submittedGroups.filter(g => g.isCorrect).length /
        (submittedGroups.length + 1)) * 100);

      createGameMutation.mutate({
        wordSetId: Number(id),
        submittedGroups: [...submittedGroups, newGroup],
        score,
        completed: true,
      });

      toast({
        title: "Game Complete!",
        description: `Your final score is ${score}%. Review your results below.`,
      });
    }
  };

  const handleReset = () => {
    setSelectedWords([]);
    setSubmittedGroups([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const score = submittedGroups.length > 0
    ? Math.round((submittedGroups.filter(g => g.isCorrect).length / submittedGroups.length) * 100)
    : 0;

  const remainingWords = wordSet?.wordGroups
    .flatMap(g => g.words)
    .filter(word => !submittedGroups
      .filter(g => g.isCorrect)
      .flatMap(g => g.words)
      .includes(word)) ?? [];

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

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Selected Words ({selectedWords.length}/4)</h2>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-muted rounded-lg">
              {selectedWords.map((word) => (
                <Button
                  key={word}
                  variant="secondary"
                  onClick={() => handleWordSelect(word)}
                  className="flex items-center gap-2"
                >
                  {word}
                  <X className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Button
              className="w-full mt-4"
              disabled={selectedWords.length !== 4}
              onClick={handleSubmit}
            >
              Submit Group
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Available Words</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {remainingWords.map((word) => (
                <TooltipProvider key={word}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedWords.includes(word)
                            ? "border-primary"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => handleWordSelect(word)}
                      >
                        <CardContent className="p-4 text-center flex items-center justify-between">
                          <span>{word}</span>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{wordSet?.definitions[word]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {submittedGroups.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Submitted Groups</h2>
              <div className="space-y-4">
                {submittedGroups.map((group, index) => (
                  <Card
                    key={index}
                    className={`${
                      group.isCorrect ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {group.isCorrect ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        <div className="flex flex-wrap gap-2">
                          {group.words.map((word) => (
                            <span
                              key={word}
                              className="px-2 py-1 bg-white rounded-md text-sm"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                      {group.explanation && (
                        <p className="text-sm text-muted-foreground">
                          {group.explanation}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <Progress value={score} className="mt-8" />
      </div>
    </div>
  );
}