'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Formula, SymptomCategory } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormulaEditDialog } from '@/components/admin/FormulaEditDialog';
import { Pencil, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FormulasPage() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [categories, setCategories] = useState<SymptomCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [formulasResponse, categoriesResponse] = await Promise.all([
        apiClient.getFormulas(),
        apiClient.getCategories(),
      ]);

      if (formulasResponse.success && categoriesResponse.success) {
        setFormulas(formulasResponse.data);
        setCategories(categoriesResponse.data);
      } else {
        setError('Failed to load formulas');
      }
    } catch (err) {
      setError('Error fetching formulas from API');
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
          <p className="text-muted-foreground">Loading formulas...</p>
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

  // Group formulas by category
  const formulasByCategory = formulas.reduce((acc, formula) => {
    const categoryName = formula.symptomCategory?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(formula);
    return acc;
  }, {} as Record<string, Formula[]>);

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
            <h1 className="text-4xl font-bold tracking-tight">Formulas Management</h1>
            <p className="text-muted-foreground">
              Manage herbal formulas and their details
            </p>
          </div>
          <Button onClick={fetchData} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Formulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formulas.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(formulasByCategory).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg per Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(formulasByCategory).length > 0
                  ? Math.round(formulas.length / Object.keys(formulasByCategory).length)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulas by Category */}
        <section className="space-y-6">
          {Object.entries(formulasByCategory)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([categoryName, categoryFormulas]) => (
              <Card key={categoryName}>
                <CardHeader>
                  <CardTitle>
                    {categoryName.replace(/_/g, ' ').toUpperCase()}
                  </CardTitle>
                  <CardDescription>
                    {categoryFormulas.length} formula{categoryFormulas.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categoryFormulas.map((formula) => (
                      <Card key={formula.id} className="relative">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-1">
                              <CardTitle className="text-base">{formula.name2}</CardTitle>
                              <CardDescription className="text-xs">
                                {formula.name3}
                              </CardDescription>
                              <p className="text-xs text-muted-foreground">
                                ID: {formula.id} • {formula.name}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setEditingFormula(formula)}
                              className="shrink-0"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit {formula.name2}</span>
                            </Button>
                          </div>
                        </CardHeader>
                        {(formula.shortDescription || formula.supports) && (
                          <CardContent className="pt-0 space-y-2">
                            {formula.shortDescription && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                  Description:
                                </p>
                                <p className="text-sm">{formula.shortDescription}</p>
                              </div>
                            )}
                            {formula.supports && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                  Supports:
                                </p>
                                <p className="text-sm">{formula.supports}</p>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </section>
      </div>

      {/* Edit Formula Dialog */}
      {editingFormula && (
        <FormulaEditDialog
          formula={editingFormula}
          categories={categories}
          open={!!editingFormula}
          onOpenChange={(open) => !open && setEditingFormula(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
