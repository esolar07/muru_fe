'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Recommendation, SymptomCategory } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, RefreshCw, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [categories, setCategories] = useState<SymptomCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [recommendationsResponse, categoriesResponse] = await Promise.all([
        apiClient.getPendingRecommendations(),
        apiClient.getCategories(),
      ]);

      if (recommendationsResponse.success) {
        setRecommendations(recommendationsResponse.data);
      } else {
        setError('Failed to load recommendations');
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (err) {
      setError('Error fetching recommendations from API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name.replace(/_/g, ' ') || `Category ${categoryId}`;
  };

  const handleUpdateStatus = async (id: number, status: 'approved' | 'denied') => {
    try {
      setUpdatingId(id);
      const response = await apiClient.updateRecommendationStatus(id, status);

      if (response.success) {
        // Remove the updated recommendation from the list
        setRecommendations((prev) => prev.filter((r) => r.id !== id));
      } else {
        setError('Failed to update recommendation status');
      }
    } catch (err) {
      setError('Error updating recommendation status');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchData} variant="outline" className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Pending Recommendations</h1>
            <p className="text-muted-foreground">
              Review and approve or deny formula recommendations
            </p>
          </div>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.length}</div>
          </CardContent>
        </Card>

        {/* Recommendations List */}
        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No pending recommendations to review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {recommendations.map((recommendation) => {
              const selectedSymptoms = recommendation.quizSession?.selectedSymptoms || [];
              const sortedSymptoms = [...selectedSymptoms].sort((a, b) => b.score - a.score);
              const winningCategoryId = recommendation.categoryId;

              return (
                <Card key={recommendation.id} className="overflow-hidden">
                  {/* Header with Selected Formula */}
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-amber-500" />
                          <CardTitle className="text-lg">Selected Formula</CardTitle>
                        </div>
                        <p className="text-xl font-bold text-green-700">
                          {recommendation.formula.name2}
                        </p>
                        <CardDescription className="text-green-600">
                          {recommendation.formula.name3}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleUpdateStatus(recommendation.id, 'approved')}
                          disabled={updatingId === recommendation.id}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleUpdateStatus(recommendation.id, 'denied')}
                          disabled={updatingId === recommendation.id}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Formula Details */}
                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                      {recommendation.formula.shortDescription && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Description</p>
                          <p className="text-sm">{recommendation.formula.shortDescription}</p>
                        </div>
                      )}
                      {recommendation.formula.supports && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Supports</p>
                          <p className="text-sm">{recommendation.formula.supports}</p>
                        </div>
                      )}
                    </div>

                    {/* All Selected Symptoms */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">All Selected Symptoms by Category</h3>
                      <div className="space-y-3">
                        {sortedSymptoms.map((symptom) => {
                          const isWinner = symptom.categoryId === winningCategoryId;
                          return (
                            <div
                              key={symptom.id}
                              className={`p-4 rounded-lg border-2 ${
                                isWinner
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {isWinner && (
                                    <span className="px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded">
                                      WINNER
                                    </span>
                                  )}
                                  <span className="font-semibold capitalize">
                                    {getCategoryName(symptom.categoryId)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-green-600 font-medium">
                                    High: {symptom.highMatchCount}
                                  </span>
                                  <span className="text-blue-600 font-medium">
                                    Low: {symptom.lowMatchCount}
                                  </span>
                                  <span className={`font-bold ${isWinner ? 'text-green-700' : 'text-gray-700'}`}>
                                    Score: {symptom.score}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">High Indications Selected:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {symptom.selectedHighSymptoms.length > 0 ? (
                                      symptom.selectedHighSymptoms.map((s, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                                        >
                                          {s.replace(/_/g, ' ')}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground text-xs">None</span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Low Indications Selected:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {symptom.selectedLowSymptoms.length > 0 ? (
                                      symptom.selectedLowSymptoms.map((s, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                        >
                                          {s.replace(/_/g, ' ')}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground text-xs">None</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Session Info */}
                    <div className="text-xs text-muted-foreground border-t pt-4 flex flex-wrap gap-4">
                      <p>
                        <span className="font-medium">Session:</span> {recommendation.sessionId}
                      </p>
                      <p>
                        <span className="font-medium">Created:</span>{' '}
                        {new Date(recommendation.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
