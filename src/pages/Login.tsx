import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoggingIn(true);

      try {
        // Simulate login API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // For demo purposes, create mock user data
        const mockSignupData = {
          fullName: "Justin Dimick",
          email: formData.email,
          jobTitle: "Professor and Chair of Surgery",
          organization: "University of Michigan",
        };

        const mockNpiProvider = {
          number: "1578714549",
          enumeration_type: "NPI-1",
          basic: {
            first_name: "Justin",
            last_name: "Dimick",
            credential: "MD",
            gender: "M",
            enumeration_date: "2008-05-23",
            last_updated: "2023-10-15",
            status: "A",
          },
          addresses: [
            {
              address_1: "1500 E Medical Center Dr",
              city: "Ann Arbor",
              state: "MI",
              postal_code: "48109",
              country_code: "US",
              country_name: "United States",
              address_purpose: "MAILING",
              address_type: "DOM",
              telephone_number: "(734) 936-5738",
            },
          ],
          taxonomies: [
            {
              code: "208600000X",
              desc: "Surgery",
              primary: true,
              state: "MI",
              license: "4301082842",
            },
          ],
          created_epoch: 1211515200,
          last_updated_epoch: 1697356800,
        };

        // Navigate to dashboard with mock data
        navigate("/dashboard", {
          state: {
            signupData: mockSignupData,
            npiProvider: mockNpiProvider,
          },
        });
      } catch (error) {
        console.error("Login failed:", error);
        setErrors({ password: "Invalid email or password" });
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your ProfileIQ account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Enter your password"
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
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-phase2-blue bg-white border-2 border-phase2-net-gray rounded focus:ring-phase2-blue focus:ring-2"
            />
            <span className="text-sm font-raleway text-phase2-dark-gray">
              Remember me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-raleway text-phase2-blue hover:text-phase2-blue/80 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "Signing In..." : "Sign In"}
        </Button>

        <div className="mt-8 pt-6 border-t border-phase2-net-gray">
          <div className="text-center space-y-4">
            <p className="text-phase2-dark-gray font-raleway mb-4">
              New to ProfileIQ?
            </p>
            <p className="text-sm text-phase2-dark-gray font-raleway mb-4">
              Join thousands of healthcare providers leveraging intelligent
              profile management
            </p>
            <Link to="/signup">
              <Button variant="outline" className="w-full" size="lg">
                Create Account
              </Button>
            </Link>

            {/* Temporary Admin Access */}
            <div className="pt-4 border-t border-phase2-net-gray/50">
              <Link to="/system-admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-phase2-dark-gray/60 hover:text-phase2-blue"
                >
                  System Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
