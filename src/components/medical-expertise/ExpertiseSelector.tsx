import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  AlertCircle,
  Heart,
  Scissors,
  Users,
} from "lucide-react";
import {
  ClinicalExpertise,
  SelectedExpertise,
  ExpertiseFilters,
} from "@/types/medical-expertise";
import { cn } from "@/lib/utils";

interface ExpertiseSelectorProps {
  availableItems: {
    conditions: ClinicalExpertise[];
    procedures: ClinicalExpertise[];
    reasonsForVisit: ClinicalExpertise[];
  };
  selectedItems: SelectedExpertise;
  onSelectionChange: (
    itemType: keyof SelectedExpertise,
    termId: string,
    isSelected: boolean,
  ) => void;
  loading: boolean;
  isEditing: boolean;
}

export function ExpertiseSelector({
  availableItems,
  selectedItems,
  onSelectionChange,
  loading,
  isEditing,
}: ExpertiseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "conditions" | "procedures" | "reasonsForVisit"
  >("conditions");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    const filterItems = (
      items: ClinicalExpertise[],
      selectedTermIds: string[],
    ) => {
      let filtered = items;

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter((item) =>
          item.term.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      // Apply selected filter
      if (showSelectedOnly) {
        filtered = filtered.filter((item) =>
          selectedTermIds.includes(item.term_id),
        );
      }

      return filtered;
    };

    return {
      conditions: filterItems(
        availableItems.conditions,
        selectedItems.conditions,
      ),
      procedures: filterItems(
        availableItems.procedures,
        selectedItems.procedures,
      ),
      reasonsForVisit: filterItems(
        availableItems.reasonsForVisit,
        selectedItems.reasonsForVisit,
      ),
    };
  }, [availableItems, selectedItems, searchQuery, showSelectedOnly]);

  // Get statistics for each category
  const getStats = (category: keyof SelectedExpertise) => {
    const selected = selectedItems[category].length;
    const total = availableItems[category].length;

    // In edit mode, use filtered items count, in view mode just show selected count
    const displayed = isEditing ? filteredItems[category].length : selected;

    return { selected, total, displayed };
  };

  const handleItemToggle = (
    category: keyof SelectedExpertise,
    termId: string,
    isSelected: boolean,
  ) => {
    onSelectionChange(category, termId, isSelected);
  };

  const renderViewModeList = (category: keyof SelectedExpertise) => {
    const selectedTermIds = selectedItems[category];
    const selectedItemsForCategory = availableItems[category].filter((item) =>
      selectedTermIds.includes(item.term_id),
    );

    if (selectedItemsForCategory.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No items selected</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {selectedItemsForCategory.map((item) => (
          <div
            key={item.term_id}
            className="flex items-center space-x-3 p-3 rounded-md border bg-accent/30"
          >
            <CheckSquare className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">{item.term}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderEditModeList = (
    items: ClinicalExpertise[],
    category: keyof SelectedExpertise,
  ) => {
    const selectedTermIds = selectedItems[category];

    if (loading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-12 bg-gray-200 animate-pulse rounded-md"
            />
          ))}
        </div>
      );
    }

    if (items.length === 0) {
      const noItemsMessage = searchQuery
        ? `No items found matching "${searchQuery}"`
        : showSelectedOnly
          ? "No selected items"
          : "No items available";

      return (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{noItemsMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {items.map((item) => {
          const isSelected = selectedTermIds.includes(item.term_id);
          return (
            <div
              key={item.term_id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-md border transition-all duration-200",
                isSelected
                  ? "bg-primary/5 border-primary/20"
                  : "bg-background border-border hover:bg-accent/50",
              )}
            >
              <Checkbox
                id={item.term_id}
                checked={isSelected}
                onCheckedChange={(checked) =>
                  handleItemToggle(category, item.term_id, !!checked)
                }
                className="flex-shrink-0"
              />
              <label
                htmlFor={item.term_id}
                className="flex-1 text-sm font-medium cursor-pointer"
              >
                {item.term}
              </label>
              {isSelected && (
                <Badge variant="secondary" className="text-xs">
                  Selected
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const totalSelected =
    selectedItems.conditions.length +
    selectedItems.procedures.length +
    selectedItems.reasonsForVisit.length;

  return (
    <Card>
      <CardHeader>
        <p className="text-sm text-muted-foreground">
          Select the conditions you treat, procedures you perform, and common
          reasons patients visit you
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing && (
          <>
            {/* Search and Filter Controls - Only in edit mode */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search conditions, procedures, or reasons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showSelectedOnly ? "default" : "outline"}
                onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showSelectedOnly ? "Show All" : "Selected Only"}
              </Button>
            </div>

            {/* Selection Summary - Only in edit mode */}
            {totalSelected > 30 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You have selected {totalSelected} items. Consider focusing on
                  your primary areas of expertise.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Expertise Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conditions" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Conditions
              <Badge variant="secondary" className="ml-1">
                {getStats("conditions").selected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="procedures" className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Procedures
              <Badge variant="secondary" className="ml-1">
                {getStats("procedures").selected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="reasonsForVisit"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Reasons for Visit
              <Badge variant="secondary" className="ml-1">
                {getStats("reasonsForVisit").selected}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conditions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Conditions You Treat</h3>
              <div className="text-sm text-muted-foreground">
                {isEditing ? (
                  <>
                    {getStats("conditions").selected} of{" "}
                    {getStats("conditions").total} selected
                    {searchQuery && (
                      <span> • {getStats("conditions").displayed} shown</span>
                    )}
                  </>
                ) : (
                  `${getStats("conditions").selected} selected`
                )}
              </div>
            </div>
            <ScrollArea className="h-96 pr-4">
              {isEditing
                ? renderEditModeList(filteredItems.conditions, "conditions")
                : renderViewModeList("conditions")}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="procedures" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Procedures You Perform</h3>
              <div className="text-sm text-muted-foreground">
                {isEditing ? (
                  <>
                    {getStats("procedures").selected} of{" "}
                    {getStats("procedures").total} selected
                    {searchQuery && (
                      <span> • {getStats("procedures").displayed} shown</span>
                    )}
                  </>
                ) : (
                  `${getStats("procedures").selected} selected`
                )}
              </div>
            </div>
            <ScrollArea className="h-96 pr-4">
              {isEditing
                ? renderEditModeList(filteredItems.procedures, "procedures")
                : renderViewModeList("procedures")}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="reasonsForVisit" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Reasons for Patient Visits
              </h3>
              <div className="text-sm text-muted-foreground">
                {isEditing ? (
                  <>
                    {getStats("reasonsForVisit").selected} of{" "}
                    {getStats("reasonsForVisit").total} selected
                    {searchQuery && (
                      <span>
                        {" "}
                        • {getStats("reasonsForVisit").displayed} shown
                      </span>
                    )}
                  </>
                ) : (
                  `${getStats("reasonsForVisit").selected} selected`
                )}
              </div>
            </div>
            <ScrollArea className="h-96 pr-4">
              {isEditing
                ? renderEditModeList(
                    filteredItems.reasonsForVisit,
                    "reasonsForVisit",
                  )
                : renderViewModeList("reasonsForVisit")}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
