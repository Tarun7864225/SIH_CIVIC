"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Eye,
  Globe,
  LogOut,
  Shield,
  Award,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import GovernmentBanners from "@/components/government-banners"
import { useRouter } from "next/navigation"
import { IUser } from "./lib/model/user"
import { Loader } from "@/components/loader"

const content = {
  en: {
    login: "Login",
    joinUs: "Join Us",
    logout: "Logout",
    welcome: "Welcome",
    projectName: "CivicResolve Jharkhand",
    governmentPortal: "Government of Jharkhand - Civic Portal",
    heroTitle: "Help Fix Your Neighborhood",
    heroSubtitle: "See a problem? Report it. Want to help? Join in.\nTogether we can make our community better.",
    reportProblem: "🚨 Report a Problem",
    seeSolutions: "💡 See Solutions",
    loginRequired: "Please login to access this feature",
    aboutTitle: "What is CivicResolve?",
    aboutDescription:
      "It's a simple way for you to report problems in your neighborhood and work with others to fix them. No complicated forms - just easy tools to make your community better.",
    reportProblemsTitle: "Report Problems",
    reportProblemsDesc:
      "Broken streetlight? Pothole on the road? Garbage not collected? Take a photo and tell us where it is. We'll help get it fixed through your Municipal Corporation.",
    workTogetherTitle: "Work Together",
    workTogetherDesc:
      "Meet your neighbors. Share ideas. Work with Ward Councillors and RWA members. When we work together, we can solve bigger problems in our locality.",
    seeProgressTitle: "See Progress",
    seeProgressDesc:
      "Watch as problems get fixed. See what's being worked on. Get updates when Municipal Corporation takes action.",
    currentIssuesTitle: "What's Happening Now",
    needsHelp: "Needs Help",
    workingOnIt: "Working On It",
    fixed: "Fixed!",
    helpFixThis: "Help Fix This",
    joinProject: "Join This Project",
    seeHowFixed: "See How We Fixed It",
    ctaTitle: "Ready to Help Your Neighborhood?",
    ctaDescription:
      "Join thousands of people across India who are making their communities better. It's free, it's easy, and it really works!",
    getStarted: "🚀 Get Started Now",
    contactUs: "Contact Us",
    call: "Call: +91 98765 43210",
    email: "Email: help@civicresolve.in",
    visit: "Visit: 123 Community Block, Sector 15, New Delhi - 110001",
    openHours: "When We're Open",
    footerTagline: "Making neighborhoods better, one problem at a time.",
    copyright: "© 2025 CivicResolve - Building better communities across India",
    adminDashboard: "Admin Dashboard",
    trackMyIssues: "Track My Issues",
    currentDateTime: "Current Date & Time",
  },
  hi: {
    login: "लॉगिन",
    joinUs: "हमसे जुड़ें",
    logout: "लॉगआउट",
    welcome: "स्वागत",
    projectName: "सिविकरिज़ॉल्व झारखंड",
    governmentPortal: "झारखंड सरकार - नागरिक पोर्टल",
    heroTitle: "अपने मोहल्ले को बेहतर बनाएं",
    heroSubtitle: "कोई समस्या दिखी? रिपोर्ट करें। मदद करना चाहते हैं? शामिल हों।\nमिलकर हम अपने समुदाय को बेहतर बना सकते हैं।",
    reportProblem: "🚨 समस्या रिपोर्ट करें",
    seeSolutions: "💡 समाधान देखें",
    loginRequired: "इस सुविधा का उपयोग करने के लिए कृपया लॉगिन करें",
    aboutTitle: "सिविकरिज़ॉल्व क्या है?",
    aboutDescription:
      "यह आपके मोहल्ले की समस्याओं को रिपोर्ट करने और दूसरों के साथ मिलकर उन्हें हल करने का आसान तरीका है। कोई जटिल फॉर्म नहीं - बस आसान उपकरण जो आपके समुदाय को बेहतर बनाते हैं।",
    reportProblemsTitle: "समस्याएं रिपोर्ट करें",
    reportProblemsDesc:
      "टूटी स्ट्रीट लाइट? सड़क में गड्ढा? कचरा नहीं उठाया गया? फोटो लें और बताएं कि यह कहां है। हम नगर निगम के माध्यम से इसे ठीक कराने में मदद करेंगे।",
    workTogetherTitle: "मिलकर काम करें",
    workTogetherDesc:
    "अपने पड़ोसियों से मिलें। विचार साझा करें। वार्ड पार्षद और आरडब्ल्यूए सदस्यों के साथ काम करें। जब हम मिलकर काम करते हैं, तो अपने इलाके की बड़ी समस्याओं का समाधान कर सकते हैं।",
    seeProgressTitle: "प्रगति देखें",
    seeProgressDesc: "देखें कि समस्याएं कैसे ठीक हो रही हैं। देखें कि किस पर काम हो रहा है। नगर निगम की कार्रवाई पर अपडेट पाएं।",
    currentIssuesTitle: "अभी क्या हो रहा है",
    needsHelp: "मदद चाहिए",
    workingOnIt: "काम चल रहा है",
    fixed: "ठीक हो गया!",
    helpFixThis: "इसे ठीक करने में मदद करें",
    joinProject: "इस प्रोजेक्ट में शामिल हों",
    seeHowFixed: "देखें हमने इसे कैसे ठीक किया",
    ctaTitle: "अपने मोहल्ले की मदद करने के लिए तैयार हैं?",
    ctaDescription:
      "भारत भर के हजारों लोगों के साथ जुड़ें जो अपने समुदायों को बेहतर बना रहे हैं। यह मुफ्त है, आसान है, और वास्तव में काम करता है!",
    getStarted: "🚀 अभी शुरू करें",
    contactUs: "संपर्क करें",
    call: "फोन: +91 98765 43210",
    email: "ईमेल: help@civicresolve.in",
    visit: "पता: 123 कम्युनिटी ब्लॉक, सेक्टर 15, नई दिल्ली - 110001",
    openHours: "हमारा समय",
    footerTagline: "एक समय में एक समस्या, मोहल्लों को बेहतर बनाना।",
    copyright: "© 2025 सिविकरिज़ॉल्व - भारत भर में बेहतर समुदाय बनाना",
    adminDashboard: "एडमिन डैशबोर्ड",
    trackMyIssues: "मेरी समस्याओं को ट्रैक करें",
    currentDateTime: "वर्तमान दिनांक और समय",
  },
}

export default function CivicPlatform() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [currentDateTime, setCurrentDateTime] = useState("")
  const { logout } = useAuth()
  const [user,setUser] = useState<IUser | null>(null)
  const [loading,setLoading] = useState(false);

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
    setLoading(true)
    const savedLanguage = localStorage.getItem("civic-language") as "en" | "hi"
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(true)
    const updateDateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      setCurrentDateTime(formatted)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    setLoading(false)
    return () => clearInterval(interval)
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("civic-language", newLanguage)
  }
  
  const t = content[language]
  const router = useRouter();
  if(loading) return <Loader/>

  return (
    <div className="min-h-screen bg-background">
      <div className="government-header py-2 px-4 bg-gradient-to-r from-blue-900 via-blue-800 to-green-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">{t.governmentPortal}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{currentDateTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Digital India Initiative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b-2 border-primary/20 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side - Project Name */}
            <div className="flex items-center">
              <div className="w-10 h-10 government-emblem rounded-xl flex items-center justify-center mr-3 official-seal">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-primary">{t.projectName}</h1>
            </div>

            {/* Center - Main Navigation */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/community">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg font-medium border-2 bg-transparent flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-300"
                    >
                      <Users className="w-5 h-5" />
                      <span>Community</span>
                    </Button>
                  </Link>

                  {user.userType === "user" && (
                    <Link href="/track-progress">
                      <Button
                        variant="outline"
                        size="lg"
                        className="text-lg font-medium border-2 bg-transparent flex items-center space-x-2 hover:bg-green-50 hover:border-green-300"
                      >
                        <Eye className="w-5 h-5" />
                        <span>{t.trackMyIssues}</span>
                      </Button>
                    </Link>
                  )}

                  {user.userType === "admin" && (
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        size="lg"
                        className="text-lg font-medium border-2 bg-transparent flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Settings className="w-5 h-5" />
                        <span>{t.adminDashboard}</span>
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/community">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg font-medium border-2 bg-transparent flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-300"
                    >
                      <Users className="w-5 h-5" />
                      <span>Community</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={() => router.push("/track-progress")}
                    variant="outline"
                    size="lg"
                    className="text-lg font-medium border-2 bg-transparent flex items-center space-x-2 hover:bg-green-50 hover:border-green-300"
                  >
                    <Eye className="w-5 h-5" />
                    <span>{t.trackMyIssues}</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Right side - User Actions and Language Toggle */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium text-gray-700">
                    {t.welcome}, {user.name}
                  </span>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={logout}
                    className="text-lg font-medium border-2 bg-transparent flex items-center space-x-2 hover:bg-red-50 hover:border-red-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t.logout}</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg font-medium border-2 bg-transparent hover:bg-blue-50 hover:border-blue-300"
                    >
                      {t.login}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="lg" className="bg-primary text-white hover:bg-primary/90 text-lg font-medium px-6">
                      {t.joinUs}
                    </Button>
                  </Link>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-2 border-2 hover:bg-primary/10 bg-transparent"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{language === "en" ? "हिंदी" : "English"}</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Government Banners Section */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto">
          <GovernmentBanners language={language} />
        </div>
      </section>

      <section
        className="py-16 px-4 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: "url(/jharkhand-government-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "600px",
        }}
        role="img"
        aria-label="Jharkhand Government Building - Official Government Portal Background"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/80"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">{t.heroTitle}</h2>
          <p className="text-2xl text-gray-700 mb-10 leading-relaxed whitespace-pre-line">{t.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
            <Button
              onClick={() => router.push("/report-issue")}
              size="lg"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xl py-6 px-8 rounded-xl shadow-lg font-semibold border-2 border-red-500 hover:border-red-600 transition-all duration-200 min-w-[200px] hover:shadow-xl transform hover:scale-105"
            >
              {t.reportProblem}
            </Button>
            <Button
              onClick={() => router.push("/track-progress")}
              size="lg"
              variant="outline"
              className="flex-1 border-2 border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800 text-xl py-6 px-8 rounded-xl bg-white font-semibold hover:border-green-600 transition-all duration-200 min-w-[200px] shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t.seeSolutions}
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: "url(/jharkhand-government-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">{t.aboutTitle}</h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">{t.aboutDescription}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-20">
            <Card
              className="border-2 border-red-200 bg-red-50 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 hover:border-red-300"
              onClick={() => router.push("/report-issue")}
            >
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-4">{t.reportProblemsTitle}</CardTitle>
                <CardDescription className="text-lg text-gray-700 leading-relaxed">
                  {t.reportProblemsDesc}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 hover:border-blue-300"
              onClick={() => router.push("/track-progress")}
            >
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-4">{t.workTogetherTitle}</CardTitle>
                <CardDescription className="text-lg text-gray-700 leading-relaxed">
                  {t.workTogetherDesc}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="border-2 border-green-200 bg-green-50 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 hover:border-green-300"
              onClick={() => router.push("/track-progress")}
            >
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-4">{t.seeProgressTitle}</CardTitle>
                <CardDescription className="text-lg text-gray-700 leading-relaxed">{t.seeProgressDesc}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Current Issues */}
          <div className="mb-20">
            <h4 className="text-3xl font-bold text-gray-900 mb-10 text-center">{t.currentIssuesTitle}</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 border-red-300 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-red-500 text-white text-sm px-3 py-1">{t.needsHelp}</Badge>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900 mb-3">Broken Street Light</CardTitle>
                  <CardDescription className="text-base text-gray-700 leading-relaxed">
                    The street light near the bus stop is not working. It's unsafe for people walking at night.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-base text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    MG Road & Sector 18 Metro Station
                  </div>
                  <Button
                    onClick={() => router.push("/report-issue")}
                    size="lg"
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                  >
                    {t.helpFixThis}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-300 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-blue-500 text-white text-sm px-3 py-1">{t.workingOnIt}</Badge>
                    <span className="text-sm text-gray-500">1 week ago</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900 mb-3">Community Garden</CardTitle>
                  <CardDescription className="text-base text-gray-700 leading-relaxed">
                    We want to convert the empty plot into a community garden where residents can grow vegetables and
                    flowers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-base text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    Block C, Pocket A, Sector 12, Dwarka
                  </div>
                  <Button
                    onClick={() => router.push("/track-progress")}
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent font-semibold py-3 rounded-lg transition-colors duration-200"
                  >
                    {t.joinProject}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-300 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-green-500 text-white text-sm px-3 py-1">{t.fixed}</Badge>
                    <span className="text-sm text-gray-500">3 weeks ago</span>
                  </div>
                  <CardTitle className="text-xl text-gray-900 mb-3">Road Pothole Fixed</CardTitle>
                  <CardDescription className="text-base text-gray-700 leading-relaxed">
                    The large pothole that was causing vehicle damage has been filled by PWD after community complaints.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-base text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-green-500" />
                    Nehru Place Main Road, Near Metro Station
                  </div>
                  <Button
                    onClick={() => router.push("/track-progress")}
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 bg-transparent font-semibold py-3 rounded-lg transition-colors duration-200"
                  >
                    {t.seeHowFixed}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-100/90 to-green-100/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/50">
            <h4 className="text-3xl font-bold text-gray-900 mb-6">{t.ctaTitle}</h4>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">{t.ctaDescription}</p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white text-xl py-4 px-10 rounded-xl shadow-lg font-semibold border-2 border-green-500 hover:border-green-600 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
              >
                {t.getStarted}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer
        className="relative border-t-2 border-gray-300 py-16 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url(/jharkhand-government-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-800/85 to-gray-700/80"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 government-emblem rounded-xl flex items-center justify-center mr-4 official-seal">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h5 className="text-2xl font-bold text-white">{t.projectName}</h5>
              </div>
              <p className="text-lg text-gray-200 leading-relaxed">{t.footerTagline}</p>
            </div>

            <div>
              <h6 className="text-xl font-bold text-white mb-6">{t.contactUs}</h6>
              <div className="space-y-4">
                <div className="flex items-center text-lg text-gray-200 hover:text-yellow-300 transition-colors cursor-pointer">
                  <Phone className="w-6 h-6 mr-3 text-yellow-300" />
                  {t.call}
                </div>
                <div className="flex items-center text-lg text-gray-200 hover:text-yellow-300 transition-colors cursor-pointer">
                  <Mail className="w-6 h-6 mr-3 text-yellow-300" />
                  {t.email}
                </div>
                <div className="flex items-center text-lg text-gray-200 hover:text-yellow-300 transition-colors cursor-pointer">
                  <MapPin className="w-6 h-6 mr-3 text-yellow-300" />
                  {t.visit}
                </div>
              </div>
            </div>

            <div>
              <h6 className="text-xl font-bold text-white mb-6">{t.openHours}</h6>
              <div className="space-y-3 text-lg text-gray-200">
                <div className="flex items-start">
                  <Clock className="w-6 h-6 mr-3 text-yellow-300 mt-1" />
                  <div>
                    <div>Monday-Friday: 9 AM - 6 PM</div>
                    <div>Saturday: 10 AM - 2 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-500 mt-12 pt-8 text-center">
            <p className="text-lg text-gray-300">{t.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
