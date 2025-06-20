import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { ProgressStepper } from "@/components/auth/ProgressStepper";
import { NPIConfirmation } from "@/components/auth/NPIConfirmation";
import { NPILookupLoading } from "@/components/auth/NPILookupLoading";
import { NPILookupErrorComponent } from "@/components/auth/NPILookupError";
import { Button } from "@/components/ui/button";
import { NPIApiClient } from "@/lib/npi-api";
import { NPIProvider, NPILookupError } from "@/types/npi";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  FileText,
  Building,
  Eye,
  EyeOff,
} from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  jobTitle: string;
  npiNumber: string;
  organization: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

const jobTitles = [
  "Doctor (MD/DO)",
  "Nurse Practitioner",
  "Physician Assistant",
  "Registered Nurse",
  "Dentist",
  "Pharmacist",
  "Physical Therapist",
  "Other",
];

const healthSystems = [
  "Advent Health",
  "BJC Healthcare",
  "Children's Hospital of Philadelphia",
  "Community Health Network",
  "Gundersen Health System",
  "HealthFirst",
  "Inova",
  "Memorial Sloan Kettering Cancer Center",
  "Michigan Medicine",
  "Northwell Health",
  "Ochsner Health",
  "Sutter Health",
  "TuftsMedicine",
  "UVM Health Network",
];

export default function Signup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    jobTitle: "",
    npiNumber: "",
    organization: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // NPI lookup states
  const [npiProvider, setNpiProvider] = useState<NPIProvider | null>(null);
  const [npiLookupError, setNpiLookupError] = useState<NPILookupError | null>(
    null,
  );
  const [isLookingUpNPI, setIsLookingUpNPI] = useState(false);
  const [isConfirmingNPI, setIsConfirmingNPI] = useState(false);
  const [isFromMockData, setIsFromMockData] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Personal",
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      id: 2,
      title: "Professional",
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    { id: 3, title: "Complete", completed: false, active: currentStep >= 3 },
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.npiNumber.trim()) {
      newErrors.npiNumber = "NPI number is required";
    } else if (!/^\d{10}$/.test(formData.npiNumber.replace(/\s/g, ""))) {
      newErrors.npiNumber = "NPI number must be 10 digits";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms of service";
    }

    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = "You must agree to the privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const performNPILookup = async () => {
    setIsLookingUpNPI(true);
    setNpiLookupError(null);
    setNpiProvider(null);
    setIsFromMockData(false);

    try {
      const npiApiClient = NPIApiClient.getInstance();
      const provider = await npiApiClient.searchByNPI(formData.npiNumber);

      if (provider) {
        setNpiProvider(provider);
        setIsFromMockData(false);
        setCurrentStep(2.5); // NPI confirmation step
      } else {
        setNpiLookupError({
          message: "No provider found",
          details:
            "No provider found with this NPI number. Please verify the number and try again.",
        });
      }
    } catch (error) {
      setNpiLookupError({
        message: "Lookup failed",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLookingUpNPI(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      // Perform NPI lookup
      await performNPILookup();
    }
  };

  const handleBack = () => {
    if (currentStep === 2.5) {
      // From NPI confirmation back to Professional step
      setCurrentStep(2);
      setNpiProvider(null);
      setNpiLookupError(null);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNPIConfirm = async () => {
    setIsConfirmingNPI(true);
    try {
      // Simulate account creation process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to dashboard with signup data
      navigate("/dashboard", {
        state: {
          signupData: formData,
          npiProvider: npiProvider,
        },
      });
    } catch (error) {
      console.error("Account creation failed:", error);
      setCurrentStep(3); // Show error completion step
    } finally {
      setIsConfirmingNPI(false);
    }
  };

  const handleNPIReject = () => {
    setCurrentStep(2);
    setNpiProvider(null);
    setNpiLookupError(null);
  };

  const handleNPIRetry = async () => {
    await performNPILookup();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join ProfileIQ to intelligently manage your professional profile"
    >
      <div className="space-y-8">
        <ProgressStepper steps={steps} />

        <form className="space-y-6">
          {currentStep === 1 && (
            <>
              <div className="space-y-6">
                <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black">
                  Personal Information
                </h3>

                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  icon={<User size={20} />}
                  error={errors.fullName}
                  required
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  icon={<Mail size={20} />}
                  error={errors.email}
                  required
                />

                <div className="relative">
                  <FormInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    icon={<Lock size={20} />}
                    error={errors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-phase2-dark-gray hover:text-phase2-blue transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>

                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 w-full rounded ${
                              level <= passwordStrength
                                ? level <= 2
                                  ? "bg-phase2-karma-coral"
                                  : level <= 4
                                    ? "bg-yellow-400"
                                    : "bg-green-500"
                                : "bg-phase2-net-gray"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-phase2-dark-gray mt-1">
                        Password strength:{" "}
                        {passwordStrength <= 2
                          ? "Weak"
                          : passwordStrength <= 4
                            ? "Medium"
                            : "Strong"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <FormInput
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    icon={<Lock size={20} />}
                    error={errors.confirmPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-10 text-phase2-dark-gray hover:text-phase2-blue transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-6">
                <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black">
                  Professional Information
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-raleway font-semibold text-phase2-soft-black">
                    Job Title{" "}
                    <span className="text-phase2-karma-coral ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-phase2-dark-gray"
                    />
                    <select
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 rounded-lg font-raleway text-phase2-soft-black border-phase2-net-gray hover:border-phase2-dark-gray focus:outline-none focus:border-phase2-blue focus:ring-2 focus:ring-phase2-blue/20 transition-all duration-200"
                    >
                      <option value="">Select your job title</option>
                      {jobTitles.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.jobTitle && (
                    <p className="text-sm text-phase2-karma-coral font-raleway">
                      {errors.jobTitle}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <FormInput
                    label="NPI Number"
                    name="npiNumber"
                    value={formData.npiNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your 10-digit NPI number"
                    icon={<FileText size={20} />}
                    error={errors.npiNumber}
                    required
                  />
                  <p className="text-xs text-phase2-dark-gray">
                    For testing: Try 1578714549, 1234567890, 9876543210, or
                    5555666677
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-raleway font-semibold text-phase2-soft-black">
                    Organization/Health System
                  </label>
                  <div className="relative">
                    <Building
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-phase2-dark-gray"
                    />
                    <select
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 rounded-lg font-raleway text-phase2-soft-black border-phase2-net-gray hover:border-phase2-dark-gray focus:outline-none focus:border-phase2-blue focus:ring-2 focus:ring-phase2-blue/20 transition-all duration-200"
                    >
                      <option value="">
                        Select your organization (optional)
                      </option>
                      {healthSystems.map((system) => (
                        <option key={system} value={system}>
                          {system}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-1 text-phase2-blue bg-white border-2 border-phase2-net-gray rounded focus:ring-phase2-blue focus:ring-2"
                    />
                    <span className="text-sm font-raleway text-phase2-dark-gray">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-phase2-blue hover:text-phase2-blue/80"
                      >
                        Terms of Service
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-phase2-karma-coral font-raleway ml-7">
                      {errors.agreeToTerms}
                    </p>
                  )}

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-1 text-phase2-blue bg-white border-2 border-phase2-net-gray rounded focus:ring-phase2-blue focus:ring-2"
                    />
                    <span className="text-sm font-raleway text-phase2-dark-gray">
                      I agree to the{" "}
                      <Link
                        to="/privacy"
                        className="text-phase2-blue hover:text-phase2-blue/80"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToPrivacy && (
                    <p className="text-sm text-phase2-karma-coral font-raleway ml-7">
                      {errors.agreeToPrivacy}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* NPI Lookup Loading */}
          {currentStep === 2.5 && isLookingUpNPI && <NPILookupLoading />}

          {/* NPI Lookup Error */}
          {currentStep === 2.5 && npiLookupError && (
            <NPILookupErrorComponent
              error={npiLookupError}
              onRetry={handleNPIRetry}
              onGoBack={handleBack}
              isRetrying={isLookingUpNPI}
            />
          )}

          {/* NPI Confirmation */}
          {currentStep === 2.5 && npiProvider && (
            <div className="space-y-4">
              {isFromMockData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">i</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800">
                        Development Mode
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This is demo data for development and testing. In
                        production, this would connect to the real NPPES NPI
                        Registry through a backend API.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <NPIConfirmation
                provider={npiProvider}
                onConfirm={handleNPIConfirm}
                onReject={handleNPIReject}
                isLoading={isConfirmingNPI}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-phase2-blue rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-raleway font-bold text-phase2-soft-black">
                Account Created Successfully!
              </h3>
              <p className="text-phase2-dark-gray font-raleway">
                Welcome to ProfileIQ! Your account has been created
                successfully.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() =>
                    navigate("/dashboard", {
                      state: {
                        signupData: formData,
                        npiProvider: npiProvider,
                      },
                    })
                  }
                  className="w-full"
                  size="lg"
                >
                  Go to Dashboard
                </Button>
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    Sign In Later
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {currentStep < 3 && currentStep !== 2.5 && (
            <div className="flex space-x-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  size="lg"
                  disabled={isLookingUpNPI}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1"
                size="lg"
                disabled={isLookingUpNPI}
              >
                {isLookingUpNPI
                  ? "Looking up NPI..."
                  : currentStep === 1
                    ? "Next"
                    : "Verify NPI"}
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="text-center pt-4">
              <p className="text-sm text-phase2-dark-gray font-raleway">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-phase2-blue hover:text-phase2-blue/80 font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </AuthLayout>
  );
}
