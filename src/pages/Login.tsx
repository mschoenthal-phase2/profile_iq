import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormInput } from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
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
      // Handle login logic here
      console.log("Login attempt:", formData);
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
      subtitle="Sign in to your ProfileMD account"
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

        <div className="space-y-2">
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-phase2-dark-gray hover:text-phase2-blue transition-colors"
            style={{ marginTop: "1.75rem" }}
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

        <Button type="submit" className="w-full" size="lg">
          Sign In
        </Button>

        <div className="mt-8 pt-6 border-t border-phase2-net-gray">
          <div className="text-center">
            <p className="text-phase2-dark-gray font-raleway mb-4">
              New to ProfileMD?
            </p>
            <p className="text-sm text-phase2-dark-gray font-raleway mb-4">
              Join thousands of healthcare providers managing their professional
              profiles
            </p>
            <Link to="/signup">
              <Button variant="outline" className="w-full" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
