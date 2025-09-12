"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Megaphone,
  Zap,
  Leaf,
  Heart,
  GraduationCap,
  Building,
  Shield,
  ChevronRight,
  ExternalLink,
  Calendar,
  MapPin,
} from "lucide-react"

interface Banner {
  id: number
  type: "announcement" | "scheme" | "initiative" | "alert"
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
  link?: string
  date?: string
  location?: string
  isNew?: boolean
  priority?: "high" | "medium" | "low"
}

const getBanners = (language: "en" | "hi"): Banner[] => [
  {
    id: 1,
    type: "announcement",
    title: language === "en" ? "Digital Jharkhand Initiative Launched" : "डिजिटल झारखंड पहल शुरू",
    description:
      language === "en"
        ? "New online services for birth certificates, property registration, and utility bill payments now available"
        : "जन्म प्रमाण पत्र, संपत्ति पंजीकरण और उपयोगिता बिल भुगतान के लिए नई ऑनलाइन सेवाएं अब उपलब्ध",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    isNew: true,
    priority: "high",
    date: "Jan 15, 2025",
    link: "https://jharkhand.gov.in/digital-services",
  },
  {
    id: 2,
    type: "scheme",
    title: language === "en" ? "Mukhyamantri Krishi Ashirwad Yojana" : "मुख्यमंत्री कृषि आशीर्वाद योजना",
    description:
      language === "en"
        ? "₹5,000 per acre financial assistance for farmers. Registration open until March 31st"
        : "किसानों के लिए ₹5,000 प्रति एकड़ वित्तीय सहायता। 31 मार्च तक पंजीकरण खुला",
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-50",
    priority: "high",
    date: "Deadline: Mar 31",
    link: "https://jharkhand.gov.in/krishi-ashirwad-yojana",
  },
  {
    id: 3,
    type: "initiative",
    title: language === "en" ? "Swachh Jharkhand Mission 2025" : "स्वच्छ झारखंड मिशन 2025",
    description:
      language === "en"
        ? "Join the state-wide cleanliness drive. Volunteer registration and waste segregation training programs"
        : "राज्यव्यापी स्वच्छता अभियान में शामिल हों। स्वयंसेवक पंजीकरण और कचरा पृथक्करण प्रशिक्षण कार्यक्रम",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    priority: "medium",
    location: "All Districts",
    link: "https://swachhbharatmission.gov.in/sbmcms/jharkhand.htm",
  },
  {
    id: 4,
    type: "alert",
    title: language === "en" ? "Monsoon Preparedness Alert" : "मानसून तैयारी अलर्ट",
    description:
      language === "en"
        ? "Emergency helpline numbers and flood safety guidelines. Download the JH Emergency app"
        : "आपातकालीन हेल्पलाइन नंबर और बाढ़ सुरक्षा दिशानिर्देश। JH Emergency ऐप डाउनलोड करें",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    priority: "high",
    date: "Active Alert",
    link: "https://jharkhand.gov.in/disaster-management",
  },
  {
    id: 5,
    type: "scheme",
    title: language === "en" ? "Skill Development Program" : "कौशल विकास कार्यक्रम",
    description:
      language === "en"
        ? "Free training in IT, healthcare, and manufacturing. Placement assistance guaranteed"
        : "आईटी, स्वास्थ्य सेवा और विनिर्माण में मुफ्त प्रशिक्षण। प्लेसमेंट सहायता की गारंटी",
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    priority: "medium",
    date: "Ongoing",
    link: "https://www.skilldevelopment.gov.in/",
  },
  {
    id: 6,
    type: "initiative",
    title: language === "en" ? "Smart City Development" : "स्मार्ट सिटी विकास",
    description:
      language === "en"
        ? "WiFi hotspots, smart traffic lights, and digital payment systems being deployed across major cities"
        : "प्रमुख शहरों में WiFi हॉटस्पॉट, स्मार्ट ट्रैफिक लाइट और डिजिटल पेमेंट सिस्टम तैनात किए जा रहे हैं",
    icon: Building,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    priority: "medium",
    location: "Ranchi, Jamshedpur, Dhanbad",
    link: "https://smartcities.gov.in/",
  },
]

export default function GovernmentBanners({ language }: { language: "en" | "hi" }) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [banners] = useState(getBanners(language))
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  const priorityBanners = banners.filter((banner) => banner.priority === "high")
  const regularBanners = banners.filter((banner) => banner.priority !== "high")
  const currentBannerData = banners[currentBanner]

  if (!isVisible) return null

  return (
    <div className="space-y-4">
      {/* Scrolling Priority Banner */}
      <div className="government-banner overflow-hidden relative" role="banner" aria-live="polite">
        <div className="flex motion-safe:animate-pulse">
          <div className="flex items-center space-x-8 py-3 px-6 whitespace-nowrap">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <Megaphone className="w-5 h-5" aria-hidden="true" />
              <span>{language === "en" ? "LATEST UPDATES" : "नवीनतम अपडेट"}</span>
            </div>
            <div className="flex items-center space-x-8">
              {priorityBanners.map((banner, index) => (
                <div key={banner.id} className="flex items-center space-x-3">
                  <banner.icon className={`w-4 h-4 text-yellow-300`} aria-hidden="true" />
                  <span className="text-white font-medium">{banner.title}</span>
                  {banner.isNew && (
                    <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                      {language === "en" ? "NEW" : "नया"}
                    </Badge>
                  )}
                  {index < priorityBanners.length - 1 && (
                    <div className="w-2 h-2 bg-yellow-300 rounded-full" aria-hidden="true"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rotating Feature Banner */}
      <Card
        className="border-2 border-primary/20 shadow-lg overflow-hidden"
        role="region"
        aria-label="Featured Government Initiative"
        onClick={() => window.open(currentBannerData.link, "_blank", "noopener,noreferrer")}
      >
        <CardContent className="p-0">
          <div className={`${currentBannerData.bgColor} transition-all duration-500`}>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`p-3 rounded-full ${currentBannerData.bgColor} border-2 border-white shadow-sm`}>
                  <currentBannerData.icon className={`w-6 h-6 ${currentBannerData.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{currentBannerData.title}</h3>
                    {currentBannerData.isNew && (
                      <Badge className="bg-red-500 text-white text-xs">{language === "en" ? "NEW" : "नया"}</Badge>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{currentBannerData.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {currentBannerData.date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{currentBannerData.date}</span>
                      </div>
                    )}
                    {currentBannerData.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{currentBannerData.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2"
                  aria-label={`Learn more about ${currentBannerData.title}`}
                >
                  <span>{language === "en" ? "Learn More" : "और जानें"}</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </Button>
                <div className="flex space-x-1" role="tablist" aria-label="Banner navigation">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentBanner ? "bg-primary" : "bg-gray-300"
                      }`}
                      role="tab"
                      aria-selected={index === currentBanner}
                      aria-label={`Go to banner ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Government Schemes */}
      <div className="grid md:grid-cols-3 gap-4">
        {regularBanners.slice(0, 3).map((banner) => (
          <Card
            key={banner.id}
            className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.open(banner.link, "_blank", "noopener,noreferrer")}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${banner.bgColor}`}>
                  <banner.icon className={`w-5 h-5 ${banner.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">{banner.title}</h4>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{banner.description}</p>
                  <div className="flex items-center justify-between">
                    {banner.date && <span className="text-xs text-gray-500">{banner.date}</span>}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
