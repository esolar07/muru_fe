'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage categories, symptoms, and formulas for Muru
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/categories">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Categories
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Manage symptom categories and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to manage categories
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/symptoms">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Symptoms
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Manage symptom indications by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to manage symptoms
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/formulas">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Formulas
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Manage herbal formulas and descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to manage formulas
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/recommendations">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recommendations
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Review pending formula recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Approve or deny recommendations
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Muru Admin</CardTitle>
            <CardDescription>
              Use the cards above to navigate to different management sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Categories:</strong> Define symptom categories for organizing formulas
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Symptoms:</strong> Manage high and low indication symptoms for each category
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Formulas:</strong> Edit herbal formula details, names, and descriptions
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Recommendations:</strong> Review and approve/deny pending formula recommendations
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
