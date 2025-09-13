"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import CommunityFeed from "@/components/community-feed"
import { IUser } from "./lib/model/user"//

const content = {
  en: {
    backToHome: "Back to Home",
    projectName: "CivicResolve",
    communityTitle: "Community Feed",
    communityDescription: "Connect with your neighbors, report issues, and work together to improve your locality",
    loginRequired: "Please login to access the community feed",
  },
  hi: {
    backToHome: "होम पर वापस जाएं",
    projectName: "सिविकरिज़ॉल्व",
    communityTitle: "कम्युनिटी फीड",
    communityDescription: "अपने पड़ोसियों से जुड़ें, समस्याओं की रिपोर्ट करें, और अपने इलाके को बेहतर बनाने के लिए मिलकर काम करें",
    loginRequired: "कम्युनिटी फीड का उपयोग करने के लिए कृपया लॉगिन करें",
  },
}

export default function CommunityPage() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  //const { user } = useAuth()
  const router = useRouter()
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

  const t = content[language]

  return (
    <div className="min-h-screen bg-background">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t.communityTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.communityDescription}</p>
        </div>
          <CommunityFeed />
        {user ? (
          <CommunityFeed />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-6">{t.loginRequired}</p>
            <div className="space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
