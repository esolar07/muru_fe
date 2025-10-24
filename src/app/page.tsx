import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <main className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Muru
          </h1>
          <p className="text-xl text-muted-foreground">
            Your Herbal Matchmaker
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Discover personalized herbal formula recommendations through our interactive quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Muru provides warm, educational guidance to help you find herbal formulas that match your needs.
              Our system asks one question at a time with adaptive branching to understand your symptoms.
            </p>
            <Button size="lg" className="w-full sm:w-auto">
              Start Quiz
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get recommendations tailored to your specific symptoms and needs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Educational</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn about herbal formulas with clear, concise explanations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Safety First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Red flags and contraindications are promptly identified
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
