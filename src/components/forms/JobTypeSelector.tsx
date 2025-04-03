"use client";

import { Button } from "@/components/ui/button";

interface JobTypeSelectorProps {
  onSelect: (jobType: string) => void;
}

export const JobTypeSelector = ({ onSelect }: JobTypeSelectorProps) => {
  return (
    <div className="bg-card rounded-lg border p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Select Job Type</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          variant="outline"
          onClick={() => onSelect("Offset Print")}
          className="flex flex-col items-center justify-center p-6 h-auto hover:bg-primary/5"
        >
          <div className="text-4xl mb-4">🖨️</div>
          <h2 className="text-lg font-medium">Offset Print</h2>
          <p className="text-sm text-muted-foreground mt-2">Traditional printing method for high-volume jobs</p>
        </Button>

        <Button
          variant="outline"
          onClick={() => onSelect("Digital Print")}
          className="flex flex-col items-center justify-center p-6 h-auto hover:bg-primary/5"
        >
          <div className="text-4xl mb-4">🖨️</div>
          <h2 className="text-lg font-medium">Digital Print</h2>
          <p className="text-sm text-muted-foreground mt-2">Modern printing for quick turnaround and variable data</p>
        </Button>

        <Button
          variant="outline"
          onClick={() => onSelect("Sublimation")}
          className="flex flex-col items-center justify-center p-6 h-auto hover:bg-primary/5"
        >
          <div className="text-4xl mb-4">🎨</div>
          <h2 className="text-lg font-medium">Sublimation</h2>
          <p className="text-sm text-muted-foreground mt-2">Specialized printing for fabrics and hard surfaces</p>
        </Button>
      </div>
    </div>
  );
}; 