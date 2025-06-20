import React from "react";
import { NPILookupError } from "@/types/npi";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface NPILookupErrorProps {
  error: NPILookupError;
  onRetry: () => void;
  onGoBack: () => void;
  isRetrying?: boolean;
}

export const NPILookupErrorComponent: React.FC<NPILookupErrorProps> = ({
  error,
  onRetry,
  onGoBack,
  isRetrying = false,
}) => {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black">
          {error.message}
        </h3>
        <p className="text-phase2-dark-gray font-raleway max-w-md mx-auto">
          {error.details || "Please check your NPI number and try again."}
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
        <div className="text-sm text-red-700">
          <p className="font-semibold mb-2">Try these demo NPI numbers:</p>
          <ul className="list-disc list-inside space-y-1 text-left">
            <li>1234567890 (Dr. John Smith - Family Medicine)</li>
            <li>1578714549 (Sarah Johnson - Nurse Practitioner)</li>
            <li>1234567893 (City General Hospital)</li>
            <li>1111111116 (Dr. Maria Garcia - Dentist)</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-4 max-w-md mx-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onGoBack}
          className="flex-1"
          size="lg"
          disabled={isRetrying}
        >
          Edit NPI Number
        </Button>
        <Button
          type="button"
          onClick={onRetry}
          className="flex-1"
          size="lg"
          disabled={isRetrying}
        >
          {isRetrying ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Retrying...
            </>
          ) : (
            "Try Again"
          )}
        </Button>
      </div>
    </div>
  );
};
