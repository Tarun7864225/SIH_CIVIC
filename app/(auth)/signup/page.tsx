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
    joinTitle: "Join CivicResolve",
    joinDescription: "Create your account and start making a positive impact in your community today",
    userTypeSelection: "Select Account Type",
    regularUser: "Regular User",
    regularUserDesc: "Report civic issues and track their resolution",
    governmentAdmin: "Government Employee",
    governmentAdminDesc: "Manage and resolve reported civic issues",
    firstName: "First Name",
    firstNamePlaceholder: "John",
    lastName: "Last Name",
    lastNamePlaceholder: "Doe",
    email: "Email",
    emailPlaceholder: "john.doe@example.com",
    password: "Password",
    passwordPlaceholder: "Create a strong password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    address: "Address (Optional)",
    addressPlaceholder: "Your neighborhood or area",
    adminId: "Government Employee ID",
    adminIdPlaceholder: "Enter your official employee ID",
    department: "Department",
    departmentPlaceholder: "Municipal Corporation, PWD, etc.",
    agreeToTerms: "I agree to the",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    signInHere: "Sign in here",
    creatingAccount: "Creating Account...",
    accountCreationFailed: "Failed to create account. Please try again.",
    fieldsRequired: "Please fill in all required fields",
    passwordsDontMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    adminIdRequired: "Government Employee ID is required for admin accounts",
    governmentIdRequired: "Government ID (Aadhaar/Voter ID) is required for verification",
  },
  hi: {
    backToHome: "होम पर वापस जाएं",
    projectName: "सिविकरिज़ॉल्व",
    joinTitle: "सिविकरिज़ॉल्व में शामिल हों",
    joinDescription: "अपना खाता बनाएं और आज ही अपने समुदाय में सकारात्मक प्रभाव डालना शुरू करें",
    userTypeSelection: "खाता प्रकार चुनें",
    regularUser: "सामान्य उपयोगकर्ता",
    regularUserDesc: "नागरिक समस्याओं की रिपोर्ट करें और उनके समाधान को ट्रैक करें",
    governmentAdmin: "सरकारी कर्मचारी",
    governmentAdminDesc: "रिपोर्ट की गई नागरिक समस्याओं का प्रबंधन और समाधान करें",
    firstName: "पहला नाम",
    firstNamePlaceholder: "राम",
    lastName: "अंतिम नाम",
    lastNamePlaceholder: "शर्मा",
    email: "ईमेल",
    emailPlaceholder: "ram.sharma@example.com",
    password: "पासवर्ड",
    passwordPlaceholder: "एक मजबूत पासवर्ड बनाएं",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "अपने पासवर्ड की पुष्टि करें",
    address: "पता (वैकल्पिक)",
    addressPlaceholder: "आपका मोहल्ला या क्षेत्र",
    adminId: "सरकारी कर्मचारी आईडी",
    adminIdPlaceholder: "अपनी आधिकारिक कर्मचारी आईडी दर्ज करें",
    department: "विभाग",
    departmentPlaceholder: "नगर निगम, PWD, आदि",
    agreeToTerms: "मैं सहमत हूं",
    termsOfService: "सेवा की शर्तें",
    and: "और",
    privacyPolicy: "गोपनीयता नीति",
    createAccount: "खाता बनाएं",
    alreadyHaveAccount: "पहले से खाता है?",
    signInHere: "यहाँ साइन इन करें",
    creatingAccount: "खाता बनाया जा रहा है...",
    accountCreationFailed: "खाता बनाने में विफल। कृपया पुनः प्रयास करें।",
    fieldsRequired: "कृपया सभी आवश्यक फ़ील्ड भरें",
    passwordsDontMatch: "पासवर्ड मेल नहीं खाते",
    passwordTooShort: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
    adminIdRequired: "एडमिन खातों के लिए सरकारी कर्मचारी आईडी आवश्यक है",
    governmentIdRequired: "सरकारी आईडी (आधार/वोटर आईडी) सत्यापन के लिए आवश्यक है",
  },
}

export default function SignupPage() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const { signup } = useAuth()
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [address, setAddress] = useState("")
  const [userType, setUserType] = useState<"user" | "admin">("user")
  const [adminId, setAdminId] = useState("")
  const [department, setDepartment] = useState("")
  const [governmentId, setGovernmentId] = useState("")
  const [error, setError] = useState("")
  const [message,setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("civic-language", newLanguage)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError(content[language].fieldsRequired)
      return
    }

    if (userType === "admin" && !adminId) {
      setError(content[language].adminIdRequired)
      return
    }

    if (userType === "user" && !governmentId) {
      setError(content[language].governmentIdRequired)
      return
    }

    if (password !== confirmPassword) {
      setError(content[language].passwordsDontMatch)
      return
    }

    if (password.length < 6) {
      setError(content[language].passwordTooShort)
      return
    }

    let userLocation = undefined
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: address || "Current Location",
        }
      } catch (error) {
        userLocation = {
          latitude: 23.3441,
          longitude: 85.3096,
          address: address || "Ranchi, Jharkhand",
        }
      }
    }

    try {
      setLoading(true)
      const fullName = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ");
      const result = await signup(
        fullName,
        email,
        password,
        userType,
        address,
        adminId,
        department,
        governmentId,
        userLocation,
      )
      
      if (result.success) {
        setLoading(false)
        setMessage(result.message)
      } else {
        setLoading(false)
        setError(result.message || content[language].accountCreationFailed)
      }
    } catch (error) {
      setLoading(false)
      setError("Error signing up")
      console.log(error)
    }
  }
  if(loading) return <Loader/>
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
              <CardTitle className="text-2xl font-bold text-card-foreground">{t.joinTitle}</CardTitle>
              <CardDescription>{t.joinDescription}</CardDescription>
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
                  <div className="grid grid-cols-1 gap-3">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        userType === "user" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setUserType("user")}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-foreground">{t.regularUser}</div>
                          <div className="text-sm text-muted-foreground">{t.regularUserDesc}</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        userType === "admin" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setUserType("admin")}
                    >
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-foreground">{t.governmentAdmin}</div>
                          <div className="text-sm text-muted-foreground">{t.governmentAdminDesc}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      {t.firstName}
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t.firstNamePlaceholder}
                      className="w-full"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      {t.lastName}
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t.lastNamePlaceholder}
                      className="w-full"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
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
                  <Label htmlFor="governmentId" className="text-sm font-medium text-foreground">
                    Government ID (Aadhaar/Voter ID) *
                  </Label>
                  <Input
                    id="governmentId"
                    type="text"
                    placeholder="Enter your Aadhaar or Voter ID number"
                    className="w-full"
                    value={governmentId}
                    onChange={(e) => setGovernmentId(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Required for identity verification and preventing duplicate accounts
                  </p>
                </div>

                {userType === "admin" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="adminId" className="text-sm font-medium text-foreground">
                        {t.adminId} *
                      </Label>
                      <Input
                        id="adminId"
                        type="text"
                        placeholder={t.adminIdPlaceholder}
                        className="w-full"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium text-foreground">
                        {t.department}
                      </Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder={t.departmentPlaceholder}
                        className="w-full"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2 relative">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    {t.password}
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pr-16"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[70%] transform -translate-y-1/2 text-sm text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    {t.confirmPassword}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t.confirmPasswordPlaceholder}
                    className="w-full pr-16"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[70%] transform -translate-y-1/2 text-sm text-muted-foreground"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {userType === "user" && (
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground">
                      {t.address}
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder={t.addressPlaceholder}
                      className="w-full"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-start space-x-2 text-sm">
                  <input type="checkbox" className="rounded border-gray-200 mt-0.5" required />
                  <span className="text-muted-foreground">
                    {t.agreeToTerms}{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      {t.termsOfService}
                    </Link>{" "}
                    {t.and}{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      {t.privacyPolicy}
                    </Link>
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? t.creatingAccount : t.createAccount}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                {t.alreadyHaveAccount}{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  {t.signInHere}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
