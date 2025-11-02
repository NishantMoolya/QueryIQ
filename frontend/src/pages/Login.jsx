import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
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
  const auth = useSelector(state => state.user.auth);

  useEffect(() => {
    if(auth) navigate('/dashboard', {replace:true});
  },[auth]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      window.alert("Email and password are required");
      return;
    }
    setloading(true);

    try {
      const payload = { email, password };
      const res = await axiosInstance.post("/user/login", payload, { validateStatus: (status) => (status) => status >= 200 && status < 500});
      console.log(res, res.status);
      if (res.status === 200) {
        dispatch(login(res.data.user_token));
        navigate("/dashboard");
      } else if(res.status === 401) {
        window.alert("Invalid Credentials.");
      }
    } catch (err) {
      console.log("SERVER NOT RESPONDING PROPERLY", err);
      window.alert("Server error");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-2 sm:p-6 lg:p-8">
      {/* DarkVeil Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Login Card */}
      <Card className="sm:max-w-md md:max-w-lg lg:max-w-xl sm:min-w-96 max-w-full bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-2xl rounded-2xl p-1 sm:p-4 z-10">
        <CardHeader className="text-center space-y-2 sm:pb-6">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Login
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm sm:text-base">
            Access your account to query your databases and documents.
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

        <CardFooter className="flex flex-col pt-3 sm:pt-6">
          <Button
            onClick={handleLogin}
            variant="default"
            size="lg"
            className="w-full bg-[#ffffff] hover:bg-[#FF6500] text-black text-sm sm:text-base font-semibold rounded-xl py-2.5 sm:py-3 mb-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(255,101,0,0.5)] shadow-lg"
          >
            {isloading ? <Spinner /> : " Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
