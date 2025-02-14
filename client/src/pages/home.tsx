import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Trophy, ExternalLink, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Civics Word Quest
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn about civics by grouping related words together!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-16">
          {wordSets?.map((wordSet) => (
            <Card 
              key={wordSet.id} 
              className="hover:shadow-lg transition-all hover:-translate-y-0.5 border-blue-100/50"
            >
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
                      {wordSet.wordGroups.length} Word Groups
                    </span>
                  </div>
                  <Link href={`/game/${wordSet.id}`}>
                    <Button className="hover:bg-primary/90 transition-colors">Play Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-blue-100">
          <h2 className="text-lg font-semibold mb-4 text-center">Sources</h2>
          <div className="grid gap-4 text-sm text-muted-foreground">
            <a 
              href="https://www.usa.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              USA.gov - Official Guide to Government Information and Services
            </a>
            <a 
              href="https://www.usa.gov/branches-of-government" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Branches of Government - USA.gov
            </a>
            <a 
              href="https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Federal Holidays - Office of Personnel Management
            </a>
            <a 
              href="https://www.uscis.gov/citizenship/learn-about-citizenship/rights-and-responsibilities-of-citizens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Rights and Responsibilities of U.S. Citizens - USCIS
            </a>
          </div>

          <div className="mt-8 p-6 bg-amber-50/50 rounded-lg border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
              <div className="space-y-4">
                <h3 className="font-semibold text-amber-900">Disclaimer:</h3>
                <p className="text-sm text-amber-900/90">
                  Due to current administrative policy changes and ongoing reviews, certain government resources related to U.S. citizenship rights and federal holidays are currently unavailable to the public. These resources, which have been longstanding pillars of civic education, are temporarily inaccessible. We encourage citizens to continue advocating for access to these essential educational materials, which have long been considered vital to understanding civic rights and responsibilities in the United States.
                </p>
                <p className="text-sm text-amber-900/90">
                  While the information for the Branches of Government remains accessible, we urge you to verify it through official channels. Please note that we remain committed to providing accurate and up-to-date information for your civic knowledge and engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}