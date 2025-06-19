import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIBiographyGeneratorProps {
  onGenerate: () => void;
  isGenerating?: boolean;
  hasInput?: boolean;
  className?: string;
}

export function AIBiographyGenerator({
  onGenerate,
  isGenerating = false,
  hasInput = false,
  className,
}: AIBiographyGeneratorProps) {
  return (
    <Card
      className={cn(
        "bg-gradient-to-r from-phase2-blue to-blue-600 text-white",
        className,
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-raleway">
          <Sparkles className="w-5 h-5" />
          AI Biography Generator
        </CardTitle>
        <p className="text-blue-100 font-raleway text-sm">
          Generate two professional biographies: one for medical professionals
          and one for patients. Each will be tailored to its specific audience
          using your profile information.
        </p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onGenerate}
          disabled={!hasInput || isGenerating}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-raleway font-semibold px-6 py-2 transition-colors"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating Biographies...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate Biographies
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
