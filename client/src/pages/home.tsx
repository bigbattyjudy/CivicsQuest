import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Trophy } from "lucide-react";
import { type WordSet } from "@shared/schema";

export default function Home() {
  const { data: wordSets, isLoading } = useQuery<WordSet[]>({
    queryKey: ["/api/word-sets"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Civics Word Quest
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn about civics by grouping related words together!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {wordSets?.map((wordSet) => (
            <Card key={wordSet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {wordSet.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  Difficulty: {wordSet.difficulty}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {wordSet.categories.length} Categories
                    </span>
                  </div>
                  <Link href={`/game/${wordSet.id}`}>
                    <Button>Play Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
