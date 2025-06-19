import React from "react";
import { NPIProvider } from "@/types/npi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  MapPin,
  Phone,
  Building,
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface NPIConfirmationProps {
  provider: NPIProvider;
  onConfirm: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export const NPIConfirmation: React.FC<NPIConfirmationProps> = ({
  provider,
  onConfirm,
  onReject,
  isLoading = false,
}) => {
  const formatDate = (epochTime: number) => {
    return new Date(epochTime * 1000).toLocaleDateString();
  };

  const getProviderName = () => {
    if (provider.basic.name) {
      // Organization
      return provider.basic.name;
    } else {
      // Individual
      const parts = [
        provider.basic.name_prefix,
        provider.basic.first_name,
        provider.basic.middle_name,
        provider.basic.last_name,
        provider.basic.name_suffix,
        provider.basic.credential,
      ].filter(Boolean);
      return parts.join(" ");
    }
  };

  const getMailingAddress = () => {
    return (
      provider.addresses.find((addr) => addr.address_purpose === "MAILING") ||
      provider.addresses[0]
    );
  };

  const getPrimaryTaxonomy = () => {
    return (
      provider.taxonomies.find((tax) => tax.primary) || provider.taxonomies[0]
    );
  };

  const mailingAddress = getMailingAddress();
  const primaryTaxonomy = getPrimaryTaxonomy();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black">
          Provider Information Found
        </h3>
        <p className="text-phase2-dark-gray font-raleway">
          Please confirm this is your information in the NPI Registry
        </p>
      </div>

      <Card className="border-2 border-phase2-net-gray">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-raleway text-phase2-soft-black">
                {getProviderName()}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <FileText className="w-4 h-4" />
                NPI: {provider.number}
              </CardDescription>
            </div>
            <Badge
              variant={
                provider.basic.status === "A" ? "default" : "destructive"
              }
              className="ml-4"
            >
              {provider.basic.status === "A" ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Provider Type */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-phase2-blue/10 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-phase2-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-phase2-soft-black">
                Provider Type
              </p>
              <p className="text-sm text-phase2-dark-gray">
                {provider.enumeration_type === "NPI-1"
                  ? "Individual"
                  : "Organization"}
              </p>
            </div>
          </div>

          {/* Gender (for individuals) */}
          {provider.basic.gender && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-phase2-blue/10 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-phase2-blue" />
              </div>
              <div>
                <p className="text-sm font-semibold text-phase2-soft-black">
                  Gender
                </p>
                <p className="text-sm text-phase2-dark-gray">
                  {provider.basic.gender === "M" ? "Male" : "Female"}
                </p>
              </div>
            </div>
          )}

          {/* Primary Specialty */}
          {primaryTaxonomy && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-phase2-blue/10 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-phase2-blue" />
              </div>
              <div>
                <p className="text-sm font-semibold text-phase2-soft-black">
                  Primary Specialty
                </p>
                <p className="text-sm text-phase2-dark-gray">
                  {primaryTaxonomy.desc}
                </p>
                {primaryTaxonomy.state && primaryTaxonomy.license && (
                  <p className="text-xs text-phase2-dark-gray">
                    License: {primaryTaxonomy.license} ({primaryTaxonomy.state})
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mailing Address */}
          {mailingAddress && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-phase2-blue/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-phase2-blue" />
              </div>
              <div>
                <p className="text-sm font-semibold text-phase2-soft-black">
                  Mailing Address
                </p>
                <div className="text-sm text-phase2-dark-gray">
                  <p>{mailingAddress.address_1}</p>
                  {mailingAddress.address_2 && (
                    <p>{mailingAddress.address_2}</p>
                  )}
                  <p>
                    {mailingAddress.city}, {mailingAddress.state}{" "}
                    {mailingAddress.postal_code}
                  </p>
                  {mailingAddress.telephone_number && (
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      <span>{mailingAddress.telephone_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Enumeration Date */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-phase2-blue/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-phase2-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-phase2-soft-black">
                Enumeration Date
              </p>
              <p className="text-sm text-phase2-dark-gray">
                {formatDate(provider.created_epoch)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-800">Important</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Please verify that this information matches your official provider
              credentials. If this is not your information, please go back and
              re-enter your NPI number.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onReject}
          className="flex-1"
          size="lg"
          disabled={isLoading}
        >
          This is not me
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className="flex-1"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Confirm & Continue"}
        </Button>
      </div>
    </div>
  );
};
