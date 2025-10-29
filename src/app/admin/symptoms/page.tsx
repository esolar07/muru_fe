'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { GroupedSymptom, Symptom } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SymptomEditDialog } from '@/components/admin/SymptomEditDialog';
import { Pencil, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<GroupedSymptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSymptom, setEditingSymptom] = useState<{ symptom: Symptom; categoryId: number; categoryName: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const symptomsResponse = await apiClient.getSymptoms();

      if (symptomsResponse.success) {
        setSymptoms(symptomsResponse.data);
      } else {
        setError('Failed to load symptoms');
      }
    } catch (err) {
      setError('Error fetching symptoms from API');
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
          <p className="text-muted-foreground">Loading symptoms...</p>
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
            <h1 className="text-4xl font-bold tracking-tight">Symptoms Management</h1>
            <p className="text-muted-foreground">
              Manage symptom indications for each category
            </p>
          </div>
          <Button onClick={fetchData} variant="outline">
            Refresh
          </Button>
        </div>

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
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditingSymptom({
                            symptom,
                            categoryId: group.categoryId,
                            categoryName: group.categoryName,
                          })}
                          className="shrink-0"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit symptom {symptom.id}</span>
                        </Button>
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

      {/* Edit Symptom Dialog */}
      {editingSymptom && (
        <SymptomEditDialog
          symptom={editingSymptom.symptom}
          categoryId={editingSymptom.categoryId}
          categoryName={editingSymptom.categoryName}
          open={!!editingSymptom}
          onOpenChange={(open) => !open && setEditingSymptom(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
