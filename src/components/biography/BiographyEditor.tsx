import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Edit3 } from "lucide-react";

interface BiographyEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function BiographyEditor({
  value,
  onChange,
  placeholder = "Tell us about yourself...",
  maxLength = 2000,
  className,
}: BiographyEditorProps) {
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.9;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-raleway">
          <Edit3 className="w-5 h-5 text-phase2-blue" />
          Tell Us About Yourself
        </CardTitle>
        <p className="text-sm text-phase2-dark-gray font-raleway">
          Share personal or clinical information about yourself. This will be
          used to generate your professional biographies. Include things like
          your motivation for becoming a doctor, your approach to patient care,
          or anything that makes you unique.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="biography-input" className="sr-only">
            Personal Biography Input
          </Label>
          <Textarea
            id="biography-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px] font-raleway text-sm leading-relaxed resize-none"
            maxLength={maxLength}
          />
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-phase2-dark-gray font-raleway">
            This information will be used to generate your biographies
          </span>
          <span
            className={cn(
              "font-raleway font-medium",
              isNearLimit ? "text-orange-600" : "text-phase2-dark-gray",
            )}
          >
            {characterCount} / {maxLength} characters
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
