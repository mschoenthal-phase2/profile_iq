import React from "react";
import { Loader2, Search } from "lucide-react";

export const NPILookupLoading: React.FC = () => {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-16 h-16 bg-phase2-blue/10 rounded-full flex items-center justify-center mx-auto">
        <div className="relative">
          <Search className="w-6 h-6 text-phase2-blue" />
          <Loader2 className="w-4 h-4 text-phase2-blue animate-spin absolute -top-1 -right-1" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black">
          Looking up your NPI information
        </h3>
        <p className="text-phase2-dark-gray font-raleway">
          We're searching the NPI Registry to verify your provider
          information...
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-phase2-blue rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-phase2-blue rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-phase2-blue rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
