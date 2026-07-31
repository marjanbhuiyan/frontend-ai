import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas";
import { Link } from "react-router-dom";
import { useRegister } from "@/features/auth/hooks/use-auth";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type React from "react";

export default function MantisRegister(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registerUser = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      avatar: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  const getStrength = (
    pwd: string,
  ): { label: string; width: string; color: string } => {
    if (!pwd) return { label: "Poor", width: "30%", color: "bg-red-500" };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const score = [hasUpper, hasLower, hasNumber].filter(Boolean).length;
    if (pwd.length < 8 || score < 2)
      return { label: "Poor", width: "30%", color: "bg-red-500" };
    if (pwd.length < 10 || score < 3)
      return { label: "Fair", width: "60%", color: "bg-yellow-400" };
    return { label: "Strong", width: "100%", color: "bg-green-500" };
  };

  const strength = getStrength(passwordValue);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  function onSubmit(values: RegisterFormData): void {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName || "");
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);
    formData.append("phone", values.phone);
    if (values.avatar) formData.append("avatar", values.avatar);
    console.log("formData", formData);
    registerUser.mutate(formData as unknown as RegisterFormData);
  }

  return (
    <div className="relative min-h-screen bg-[#f5f5f5] overflow-hidden font-sans">
      {/* ── Navbar ── */}
      <header className="absolute top-0 left-0 w-full z-10 px-6 py-4 flex items-center">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 8.5L12 15L20 8.5L12 2Z" fill="#1976d2" />
            <path
              d="M4 8.5L12 22L20 8.5L12 15L4 8.5Z"
              fill="#42a5f5"
              opacity="0.7"
            />
          </svg>
          <span className="text-[1.1rem] font-semibold text-gray-800 tracking-wide">
            Mantis
          </span>
        </div>
      </header>

      {/* ── Blurred background shapes (left) ── */}
      <div className="absolute left-0 top-0 h-full w-[340px] pointer-events-none select-none overflow-hidden">
        <div
          className="absolute"
          style={{
            left: "-80px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "320px",
            height: "320px",
            filter: "blur(38px)",
            opacity: 0.72,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, #1565c0 0%, #42a5f5 60%, #90caf9 100%)",
              clipPath:
                "polygon(0% 0%, 60% 0%, 100% 50%, 60% 100%, 0% 100%, 40% 50%)",
              borderRadius: "8px",
            }}
          />
        </div>
        <div
          className="absolute"
          style={{
            left: "-60px",
            top: "50%",
            transform: "translateY(-42%)",
            width: "270px",
            height: "270px",
            filter: "blur(36px)",
            opacity: 0.55,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, #43a047 0%, #a5d6a7 70%, #e8f5e9 100%)",
              clipPath:
                "polygon(0% 0%, 60% 0%, 100% 50%, 60% 100%, 0% 100%, 40% 50%)",
              borderRadius: "8px",
            }}
          />
        </div>
        <div
          className="absolute"
          style={{
            left: "30px",
            top: "50%",
            transform: "translateY(-35%)",
            width: "160px",
            height: "140px",
            filter: "blur(32px)",
            opacity: 0.38,
            background: "linear-gradient(135deg, #ef9a9a 0%, #f8bbd0 100%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-16 pb-28">
        {/* Sign Up Card */}
        <div className="bg-white rounded-xl shadow-md w-full max-w-[390px] px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[1.6rem] font-semibold text-gray-900 tracking-tight">
              Sign up
            </h1>
            <Link
              to="/login"
              className="text-[0.85rem] text-blue-600 hover:underline font-normal"
            >
              Already have an account?
            </Link>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Avatar */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel className="block text-center">
                      Profile Avatar
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors bg-gray-50 flex items-center justify-center group cursor-pointer"
                        >
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className="text-gray-400 group-hover:text-blue-500 transition-colors"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                            </svg>
                          )}
                          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                            const preview = URL.createObjectURL(file);
                            setAvatarPreview(preview);
                            onChange(file);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* First Name + Last Name row */}
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        First Name<span className="text-gray-700">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Address */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email Address<span className="text-gray-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="demo@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone<span className="text-gray-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="017xxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password<span className="text-gray-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {/* Password Strength */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <span
                        className={`text-[0.78rem] font-medium ${strength.label === "Poor" ? "text-red-500" : strength.label === "Fair" ? "text-yellow-500" : "text-green-500"}`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password<span className="text-gray-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms */}
              <p className="text-[0.8rem] text-gray-600">
                By Signing up, you agree to our{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Privacy Policy
                </a>
              </p>

              {/* Create Account button */}
              <button
                type="submit"
                disabled={registerUser.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-md text-[0.95rem] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                {registerUser.isPending ? "Loading..." : "Create Account"}
              </button>
            </form>
          </Form>
        </div>

        {/* Check other login views */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-[0.8rem] text-gray-500">Check other login views</p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3.5 py-1.5 text-[0.8rem] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.8 24.6l.17-.237 7.43-13.04.008-.014-.003-.012-3.16-6.109c-.261-.5-.95-.5-1.21 0L5.8 24.6z"
                  fill="#FFA000"
                />
                <path
                  d="M13.7 8.714l-.008.014 7.43 13.04.17.237-8.07-14.15.478.859z"
                  fill="#F57F17"
                />
                <path
                  d="M26.2 24.6l-2.26-14.06c-.13-.8-1.1-1.14-1.69-.57L5.8 24.6l8.38 4.7a1.73 1.73 0 001.64 0l8.38-4.7z"
                  fill="#FFCA28"
                />
                <path
                  d="M19.47 10.2l-1.57-1.49-4.65-4.38c-.58-.55-1.57-.2-1.69.57l-.6 3.71 8.51 1.59z"
                  fill="#FFA000"
                />
              </svg>
              Firebase
            </button>

            <button className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3.5 py-1.5 text-[0.8rem] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="16" fill="#EB5424" />
                <path d="M16 6l-6.5 9.5h13L16 6z" fill="white" opacity="0.9" />
                <path
                  d="M9.5 15.5L7 24l7.5-2.5L9.5 15.5z"
                  fill="white"
                  opacity="0.7"
                />
                <path
                  d="M22.5 15.5L25 24l-7.5-2.5 5-6z"
                  fill="white"
                  opacity="0.7"
                />
                <path d="M14.5 21.5L16 27l1.5-5.5-3 0z" fill="white" />
              </svg>
              Auth0
            </button>

            <button className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3.5 py-1.5 text-[0.8rem] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
              <svg
                width="20"
                height="12"
                viewBox="0 0 60 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="0"
                  y="28"
                  fontFamily="Arial"
                  fontSize="28"
                  fontWeight="bold"
                  fill="#FF9900"
                >
                  aws
                </text>
              </svg>
              Aws
            </button>

            <button className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3.5 py-1.5 text-[0.8rem] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="sb2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3ecf8e" />
                    <stop offset="100%" stopColor="#29a372" />
                  </linearGradient>
                </defs>
                <path
                  d="M8 4h16a2 2 0 012 2v20a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
                  fill="url(#sb2)"
                />
                <path d="M16 8l-6 8h5v8l6-8h-5V8z" fill="white" />
              </svg>
              Supabase
            </button>
          </div>
        </div>
      </main>

      {/* ── Banner ── */}
      {showBanner && (
        <div className="absolute bottom-0 left-0 w-full z-20 bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
          <p className="text-[0.82rem]">
            <span className="font-semibold">Mantis Free</span> — Download the
            free version of Mantis React Admin Dashboard
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-[0.82rem] text-blue-400 hover:underline"
            >
              Download Free
            </a>
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
