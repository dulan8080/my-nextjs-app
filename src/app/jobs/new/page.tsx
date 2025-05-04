"use client";

import { Card } from "@/components/ui/card";
import { PrinterIcon, PaletteIcon } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  const jobTypes = [
    {
      id: "offset",
      name: "Offset Print",
      icon: PrinterIcon,
      description: "Traditional printing method for high-volume jobs",
      href: "/jobs/new/offset"
    },
    {
      id: "digital",
      name: "Digital Print",
      icon: PrinterIcon,
      description: "Modern printing for quick turnaround and variable data",
      href: "/jobs/new/digital"
    },
    {
      id: "sublimation",
      name: "Sublimation",
      icon: PaletteIcon,
      description: "Specialized printing for fabrics and hard surfaces",
      href: "/jobs/new/sublimation"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Select Job Type</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Link key={type.id} href={type.href}>
              <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{type.name}</h2>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 