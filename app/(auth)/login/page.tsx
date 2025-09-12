"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, ArrowLeft, Globe, Shield, User } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/loader"
import { IUser } from "@/app/lib/model/user"

const content = {
  en: {
    backToHome: "Back to Home",
    projectName: "CivicResolve",
    welcomeBack: "Welcome Back",
    signInDescription: "Sign in to your CivicResolve account to continue making a difference in your community",
    userTypeSelection: "Login As",
    regularUser: "Regular User",
    governmentAdmin: "Government Employee",
    email: "Email",
    emailPlaceholder: "Enter your email",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signIn: "Sign In",
    noAccount: "Don't have an account?",
    signUpHere: "Sign up here",
  },
  hi: {
    backToHome: "होम पर वापस जाएं",
    projectName: "सिविकरिज़ॉल्व",
    welcomeBack: "वापस स्वागत है",
    signInDescription: "अपने समुदाय में बदलाव लाना जारी रखने के लिए अपने सिविकरिज़ॉल्व खाते में साइन इन करें",
    userTypeSelection: "लॉगिन करें",
    regularUser: "सामान्य उपयोगकर्ता",
    governmentAdmin: "सरकारी कर्मचारी",
    email: "ईमेल",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    signIn: "साइन इन करें",
    noAccount: "खाता नहीं है?",
    signUpHere: "यहाँ साइन अप करें",
  },
}

export default function LoginPage() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"user" | "admin">("user")
  const [error, setError] = useState("")
  const [message,setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [user,setUser] = useState<IUser | null>(null)  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      const res = await fetch("/api/cookie");
      const data = await res.json();
      setUser(data.user);
      setLoading(false)
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("civic-language") as "en" | "hi"
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("civic-language", newLanguage)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError(language === "en" ? "Please fill in all fields" : "कृपया सभी फ़ील्ड भरें")
      return
    }
    try {
      setLoading(true)
      const result = await login(email, password, userType)
      setLoading(false)
      if (result.success){
        setMessage(result.message)
        router.push("/")
      }
      else  setError(language === "en" ? "Invalid email or password" : "गलत ईमेल या पासवर्ड")
    
    } catch (error) {
      setLoading(false)
      setError("Error signing up")
      console.log(error)
    }
   
  }
  if (loading) return <Loader/>
  const t = content[language]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backToHome}</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-2 border-2 hover:bg-primary/10 bg-transparent"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{language === "en" ? "हिंदी" : "English"}</span>
              </Button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-foreground">{t.projectName}</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <Card className="border-gray-200 bg-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-card-foreground">{t.welcomeBack}</CardTitle>
              <CardDescription>{t.signInDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}
                {message && (
                  <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">{message}</div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">{t.userTypeSelection}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                        userType === "user" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setUserType("user")}
                    >
                      <User className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="text-sm font-medium text-foreground">{t.regularUser}</div>
                    </div>
                    <div
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                        userType === "admin" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setUserType("admin")}
                    >
                      <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="text-sm font-medium text-foreground">{t.governmentAdmin}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.password}
                  </Label>

                  {/* Wrap input + button in relative container */}
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t.passwordPlaceholder}
                      className="w-full pr-16" // padding so text doesn't overlap button
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-muted-foreground">
                    <input type="checkbox" className="rounded border-gray-200" />
                    <span>{t.rememberMe}</span>
                  </label>
                  <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                    {t.forgotPassword}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (language === "en" ? "Signing in..." : "साइन इन हो रहा है...") : t.signIn}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                {t.noAccount}{" "}
                <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  {t.signUpHere}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
