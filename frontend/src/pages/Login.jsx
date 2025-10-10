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
import axiosInstance from "@/api/axios";
import { useDispatch } from "react-redux";
import { login } from "@/redux/reducers/userReducer";
import { Spinner } from "@/components/ui/spinner";
import DarkVeil from "@/components/ui/DarkVeil/DarkVeil"; // import your background component

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [isloading, setloading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      window.alert("Email and password are required");
      return;
    }
    setloading(true);

    try {
      const payload = { email, password };
      const res = await axiosInstance.post("/user/login", payload);
      console.log(res, res.status);
      if (res.status === 200) {
        dispatch(login(res.data.user_token));
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("SERVER NOT RESPONDING PROPERLY", err);
      window.alert("Server error");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* DarkVeil Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Sign Up Button - Top Right */}
      <Button
        onClick={() => navigate("/signup")}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 bg-[#ffffff] hover:bg-[#FF6500] text-black px-4 py-2 sm:px-5 sm:py-2 text-sm sm:text-base rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
      >
        Sign Up
      </Button>

      {/* Login Card */}
      <Card className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8 z-10">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Login
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm sm:text-base">
            Access your account to query your databases.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:gap-5">
          <div className="space-y-2">
            <label className="text-gray-300 text-xs sm:text-sm font-medium block">
              Email
            </label>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-black/40 border border-gray-700 text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] placeholder-gray-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-300 text-xs sm:text-sm font-medium block">
              Password
            </label>
            <div className="relative">
              <Input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-black/40 border border-gray-700 text-white text-sm sm:text-base focus:ring-2 focus:ring-[#FF6500] focus:border-[#FF6500] placeholder-gray-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 pr-10 sm:pr-12 transition-all duration-200"
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
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6">
          <Button
            onClick={handleLogin}
            variant="default"
            size="lg"
            className="w-full bg-[#ffffff] hover:bg-[#FF6500] text-black text-sm sm:text-base font-semibold rounded-xl py-2.5 sm:py-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,101,0,0.5)] shadow-lg"
          >
            {isloading ? <Spinner /> : " Login"}
          </Button>

          <button
            type="button"
            className="text-gray-400 hover:text-[#FF6500] text-xs sm:text-sm transition-colors duration-200 underline-offset-2 hover:underline"
          >
            Forgot Password?
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
