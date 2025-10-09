import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import DarkVeil from "@/components/ui/DarkVeil/DarkVeil";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate password match on blur
  const handleConfirmPasswordBlur = () => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
    console.log("Signup data:", formData);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Login Button - Top Right - Responsive positioning */}

      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>
      <Button
        onClick={() => navigate("/login")}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 bg-[#ffffff] hover:bg-[#FF6500] text-black px-4 py-2 sm:px-5 sm:py-2 text-sm sm:text-base rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
      >
        Login
      </Button>

      {/* Signup Card - Fully Responsive */}
      <Card className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Sign Up
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm sm:text-base">
            Create your account to start querying your databases.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4 sm:gap-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-gray-300 text-xs sm:text-sm font-medium block">
                Username
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full bg-black/40 border border-gray-700 text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] placeholder-gray-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-gray-300 text-xs sm:text-sm font-medium block">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-black/40 border border-gray-700 text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] placeholder-gray-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200"
                required
              />
            </div>

            {/* Password Field with Toggle */}
            <div className="space-y-2">
              <label className="text-gray-300 text-xs sm:text-sm font-medium block">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full bg-black/40 border border-gray-700 text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] placeholder-gray-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 pr-10 sm:pr-12 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6500] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF6500] rounded p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field with Toggle */}
            <div className="space-y-2">
              <label className="text-gray-300 text-xs sm:text-sm font-medium block">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleConfirmPasswordBlur}
                  placeholder="Confirm your password"
                  className={`w-full bg-black/40 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-700"
                  } text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] placeholder-gray-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 pr-10 sm:pr-12 transition-all duration-200`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6500] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF6500] rounded p-1"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs sm:text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-6">
            {/* Sign Up Button */}
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full bg-[#f7f7f7] hover:bg-[#FF6500] text-black text-sm sm:text-base font-semibold rounded-xl py-2.5 sm:py-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,101,0,0.5)] shadow-lg"
            >
              Sign Up
            </Button>

            {/* Already have account link */}
            <div className="text-center">
              <span className="text-gray-400 text-xs sm:text-sm">
                Already have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#FF6500] hover:text-[#FF8534] text-xs sm:text-sm transition-colors duration-200 underline-offset-2 hover:underline font-medium"
              >
                Signup here
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
