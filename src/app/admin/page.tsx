'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { SymptomCategory, GroupedSymptom } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const [categories, setCategories] = useState<SymptomCategory[]>([]);
  const [symptoms, setSymptoms] = useState<GroupedSymptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResponse, symptomsResponse] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getSymptoms(),
      ]);

      if (categoriesResponse.success && symptomsResponse.success) {
        setCategories(categoriesResponse.data);
        setSymptoms(symptomsResponse.data);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('Error fetching data from API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading admin data...</p>
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
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage categories and symptoms for Muru
            </p>
          </div>
          <Button onClick={fetchData} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Categories Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Categories ({categories.length})
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {category.name.replace(/_/g, ' ').toUpperCase()}
                  </CardTitle>
                  <CardDescription>ID: {category.id}</CardDescription>
                </CardHeader>
                {category.details && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.details}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Symptoms by Category ({symptoms.length} categories)
            </h2>
          </div>

          <div className="space-y-6">
            {symptoms.map((group) => (
              <Card key={group.categoryId}>
                <CardHeader>
                  <CardTitle>
                    {group.categoryName.replace(/_/g, ' ').toUpperCase()}
                  </CardTitle>
                  <CardDescription>
                    Category ID: {group.categoryId} • {group.symptoms.length} symptom{group.symptoms.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.symptoms.map((symptom, index) => (
                    <div
                      key={symptom.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Symptom #{index + 1} (ID: {symptom.id})
                        </span>
                      </div>

                      {/* High Indications */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-primary">
                          High Indications ({Array.isArray(symptom.highIndications) ? symptom.highIndications.length : 0})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(symptom.highIndications) && symptom.highIndications.length > 0 ? (
                            symptom.highIndications.map((indication, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                              >
                                {indication}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              No high indications
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Low Indications */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-blue-600">
                          Low Indications ({Array.isArray(symptom.lowIndications) ? symptom.lowIndications.length : 0})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(symptom.lowIndications) && symptom.lowIndications.length > 0 ? (
                            symptom.lowIndications.map((indication, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                              >
                                {indication}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              No low indications
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
