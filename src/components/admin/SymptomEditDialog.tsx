import { useState } from 'react';
import { Symptom } from '@/lib/types';
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
import { X } from 'lucide-react';

interface SymptomEditDialogProps {
  symptom: Symptom;
  categoryId: number;
  categoryName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SymptomEditDialog({
  symptom,
  categoryId,
  categoryName,
  open,
  onOpenChange,
  onSuccess,
}: SymptomEditDialogProps) {
  const [highIndications, setHighIndications] = useState<string[]>(symptom.highIndications);
  const [lowIndications, setLowIndications] = useState<string[]>(symptom.lowIndications);
  const [newHighIndication, setNewHighIndication] = useState('');
  const [newLowIndication, setNewLowIndication] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddHighIndication = () => {
    const trimmed = newHighIndication.trim();
    if (trimmed && !highIndications.includes(trimmed)) {
      setHighIndications([...highIndications, trimmed]);
      setNewHighIndication('');
    }
  };

  const handleAddLowIndication = () => {
    const trimmed = newLowIndication.trim();
    if (trimmed && !lowIndications.includes(trimmed)) {
      setLowIndications([...lowIndications, trimmed]);
      setNewLowIndication('');
    }
  };

  const handleRemoveHighIndication = (index: number) => {
    setHighIndications(highIndications.filter((_, i) => i !== index));
  };

  const handleRemoveLowIndication = (index: number) => {
    setLowIndications(lowIndications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await apiClient.updateSymptom(symptom.id, {
        highIndications,
        lowIndications,
        symptomCategoryId: categoryId,
      });

      if (response.success) {
        onSuccess();
        onOpenChange(false);
      } else {
        setError('Failed to update symptom');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the symptom');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Symptom</DialogTitle>
            <DialogDescription>
              Editing symptom for category: {categoryName.replace(/_/g, ' ').toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                {error}
              </div>
            )}

            {/* High Indications */}
            <div className="grid gap-3">
              <Label htmlFor="high-indication">High Indications (Primary Symptoms)</Label>
              <div className="flex gap-2">
                <Input
                  id="high-indication"
                  value={newHighIndication}
                  onChange={(e) => setNewHighIndication(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighIndication();
                    }
                  }}
                  placeholder="e.g., sudden_onset, nausea"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={handleAddHighIndication}
                  disabled={isSubmitting || !newHighIndication.trim()}
                  size="default"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2 bg-muted/30">
                {highIndications.length === 0 ? (
                  <span className="text-sm text-muted-foreground italic">
                    No high indications
                  </span>
                ) : (
                  highIndications.map((indication, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                    >
                      {indication}
                      <button
                        type="button"
                        onClick={() => handleRemoveHighIndication(index)}
                        disabled={isSubmitting}
                        className="hover:bg-primary/20 rounded-sm p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Low Indications */}
            <div className="grid gap-3">
              <Label htmlFor="low-indication">Low Indications (Secondary Symptoms)</Label>
              <div className="flex gap-2">
                <Input
                  id="low-indication"
                  value={newLowIndication}
                  onChange={(e) => setNewLowIndication(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLowIndication();
                    }
                  }}
                  placeholder="e.g., bloating, fatigue"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={handleAddLowIndication}
                  disabled={isSubmitting || !newLowIndication.trim()}
                  size="default"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2 bg-muted/30">
                {lowIndications.length === 0 ? (
                  <span className="text-sm text-muted-foreground italic">
                    No low indications
                  </span>
                ) : (
                  lowIndications.map((indication, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    >
                      {indication}
                      <button
                        type="button"
                        onClick={() => handleRemoveLowIndication(index)}
                        disabled={isSubmitting}
                        className="hover:bg-blue-100 rounded-sm p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
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
