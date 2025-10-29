import { useState } from 'react';
import { Formula, SymptomCategory } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormulaEditDialogProps {
  formula: Formula;
  categories: SymptomCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function FormulaEditDialog({
  formula,
  categories,
  open,
  onOpenChange,
  onSuccess,
}: FormulaEditDialogProps) {
  const [name, setName] = useState(formula.name);
  const [name2, setName2] = useState(formula.name2);
  const [name3, setName3] = useState(formula.name3);
  const [name4, setName4] = useState(formula.name4 || '');
  const [shortDescription, setShortDescription] = useState(formula.shortDescription || '');
  const [supports, setSupports] = useState(formula.supports || '');
  const [specialDetails, setSpecialDetails] = useState(formula.specialDetails || '');
  const [extraDetails, setExtraDetails] = useState(formula.extraDetails || '');
  const [symptomCategoryId, setSymptomCategoryId] = useState(formula.symptomCategoryId.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await apiClient.updateFormula(formula.id, {
        name,
        name2,
        name3,
        name4,
        shortDescription,
        supports,
        specialDetails,
        extraDetails,
        symptomCategoryId: parseInt(symptomCategoryId),
      });

      if (response.success) {
        onSuccess();
        onOpenChange(false);
      } else {
        setError('Failed to update formula');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the formula');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Formula</DialogTitle>
            <DialogDescription>
              Update the formula details and descriptions
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                {error}
              </div>
            )}

            {/* Name (Identifier) */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name (Identifier) *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., agastache_tummy_syrup"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Internal identifier (lowercase with underscores)
              </p>
            </div>

            {/* English Name */}
            <div className="grid gap-2">
              <Label htmlFor="name2">English Name *</Label>
              <Input
                id="name2"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="e.g., Agastache Tummy Syrup"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Chinese/Pinyin Name */}
            <div className="grid gap-2">
              <Label htmlFor="name3">Chinese/Pinyin Name *</Label>
              <Input
                id="name3"
                value={name3}
                onChange={(e) => setName3(e.target.value)}
                placeholder="e.g., Huo Xiang Zheng Qi Gao"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Alternative Name */}
            <div className="grid gap-2">
              <Label htmlFor="name4">Alternative Name</Label>
              <Input
                id="name4"
                value={name4}
                onChange={(e) => setName4(e.target.value)}
                placeholder="Optional alternative name"
                disabled={isSubmitting}
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={symptomCategoryId}
                onValueChange={setSymptomCategoryId}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name.replace(/_/g, ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Short Description */}
            <div className="grid gap-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief description..."
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            {/* Supports */}
            <div className="grid gap-2">
              <Label htmlFor="supports">Supports</Label>
              <Textarea
                id="supports"
                value={supports}
                onChange={(e) => setSupports(e.target.value)}
                placeholder="What this formula supports..."
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            {/* Special Details */}
            <div className="grid gap-2">
              <Label htmlFor="specialDetails">Special Details</Label>
              <Textarea
                id="specialDetails"
                value={specialDetails}
                onChange={(e) => setSpecialDetails(e.target.value)}
                placeholder="Special considerations..."
                disabled={isSubmitting}
                rows={2}
              />
            </div>

            {/* Extra Details */}
            <div className="grid gap-2">
              <Label htmlFor="extraDetails">Extra Details</Label>
              <Textarea
                id="extraDetails"
                value={extraDetails}
                onChange={(e) => setExtraDetails(e.target.value)}
                placeholder="Additional information..."
                disabled={isSubmitting}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
