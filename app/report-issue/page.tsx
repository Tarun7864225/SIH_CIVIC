"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Camera,
  AlertTriangle,
  Upload,
  CheckCircle,
  Globe,
  LogOut,
  Shield,
  Clock,
  X,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/loader"
import { randomUUID } from "crypto"
import { IUser } from "../lib/model/user"

interface ReportedIssue {
  id: string
  trackingNumber: string
  title: string
  description: string
  category: string
  location: string
  gpsCoordinates?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  priority: string
  contactEmail: string
  contactPhone: string
  images: string[]
  reportedBy: string
  reportedAt: string
  status: "reported" | "in-progress" | "resolved"
  userType: "user" | "admin"
}

const content = {
  en: {
    backToHome: "Back to Home",
    projectName: "CivicResolve",
    reportCommunityIssue: "Report a Community Issue",
    reportDescription:
      "Help improve your community by reporting issues that need attention from Municipal Corporation and local authorities",
    issueReportedSuccess: "Issue Reported Successfully!",
    thankYouMessage: "Thank you for reporting this issue. We've assigned it tracking number",
    reviewShortly: "and will forward it to the concerned Municipal Corporation department shortly.",
    trackProgress: "Track Progress",
    returnHome: "Return Home",
    issueDetails: "Issue Details",
    issueDetailsDesc:
      "Please provide as much detail as possible to help Municipal Corporation and local authorities understand and address the issue effectively.",
    issueTitle: "Issue Title *",
    issueTitlePlaceholder: "Brief description of the issue (e.g., Broken streetlight on MG Road)",
    category: "Category *",
    selectCategory: "Select category",
    infrastructure: "Infrastructure (Roads, Bridges)",
    publicSafety: "Public Safety",
    environment: "Environment & Sanitation",
    transportation: "Transportation",
    utilities: "Utilities (Water, Electricity)",
    communityServices: "Community Services",
    other: "Other",
    priorityLevel: "Priority Level",
    selectPriority: "Select priority",
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
    location: "Location *",
    locationPlaceholder: "Complete address with landmark (e.g., Near Metro Station, Sector 18, Noida)",
    detailedDescription: "Detailed Description *",
    descriptionPlaceholder:
      "Provide detailed description including when you first noticed it, how it affects residents, and any safety concerns. Mention Ward number if known...",
    photoEvidence: "Photo Evidence",
    uploadPhotos: "Upload photos to help Municipal Corporation understand the issue better",
    chooseFiles: "Choose Files",
    contactEmail: "Contact Email *",
    emailPlaceholder: "your.email@gmail.com",
    contactPhone: "Contact Phone (Optional)",
    phonePlaceholder: "+91 98765 43210",
    submitIssueReport: "Submit Issue Report",
    reportingGuidelines: "Reporting Guidelines",
    guideline1: "Be specific about location - include Ward number, nearby landmarks",
    guideline2: "Include clear photos showing the problem from different angles",
    guideline3: "Mention how the issue affects daily life of residents",
    guideline4: "Check with your RWA if the issue has already been reported",
    responseTimes: "Expected Response Times",
    hours24: "24 hours",
    days35: "3-5 days",
    weeks12: "1-2 weeks",
    weeks24: "2-4 weeks",
    currentDateTime: "Current Date & Time",
    removeImage: "Remove image",
    maxImages: "Maximum 5 images allowed",
    submitting: "Submitting Report...",
    gettingLocation: "Getting Location...",
    useCurrentGpsLocation: "Use Current GPS Location",
    gpsLocationCaptured: "GPS Location Captured",
  },
  hi: {
    backToHome: "होम पर वापस जाएं",
    projectName: "सिविकरिज़ॉल्व",
    reportCommunityIssue: "समुदायिक समस्या रिपोर्ट करें",
    reportDescription:
      "नगर निगम और स्थानीय अधिकारियों का ध्यान चाहने वाली समस्याओं की रिपोर्ट करके अपने समुदाय को बेहतर बनाने में मदद करें",
    issueReportedSuccess: "समस्या सफलतापूर्वक रिपोर्ट की गई!",
    thankYouMessage: "इस समस्या की रिपोर्ट करने के लिए धन्यवाद। हमने इसे ट्रैकिंग नंबर",
    reviewShortly: "दिया है और जल्द ही इसे संबंधित नगर निगम विभाग को भेज देंगे।",
    trackProgress: "प्रगति ट्रैक करें",
    returnHome: "होम पर वापस जाएं",
    issueDetails: "समस्या विवरण",
    issueDetailsDesc:
      "कृपया नगर निगम और स्थानीय अधिकारियों को समस्या समझने और प्रभावी रूप से हल करने में मदद के लिए जितना संभव हो उतना विवरण प्रदान करें।",
    issueTitle: "समस्या शीर्षक *",
    issueTitlePlaceholder: "समस्या का संक्षिप्त विवरण (जैसे: एमजी रोड पर टूटी स्ट्रीट लाइट)",
    category: "श्रेणी *",
    selectCategory: "श्रेणी चुनें",
    infrastructure: "बुनियादी ढांचा (सड़क, पुल)",
    publicSafety: "सार्वजनिक सुरक्षा",
    environment: "पर्यावरण और स्वच्छता",
    transportation: "परिवहन",
    utilities: "उपयोगिताएं (पानी, बिजली)",
    communityServices: "सामुदायिक सेवाएं",
    other: "अन्य",
    priorityLevel: "प्राथमिकता स्तर",
    selectPriority: "प्राथमिकता चुनें",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    urgent: "तत्काल",
    location: "स्थान *",
    locationPlaceholder: "मील के पत्थर के साथ पूरा पता (जैसे: मेट्रो स्टेशन के पास, सेक्टर 18, नोएडा)",
    detailedDescription: "विस्तृत विवरण *",
    descriptionPlaceholder:
      "विस्तृत विवरण प्रदान करें जिसमें आपने इसे पहली बार कब देखा, यह निवासियों को कैसे प्रभावित करता है, और कोई सुरक्षा चिंताएं। यदि पता हो तो वार्ड नंबर का उल्लेख करें...",
    photoEvidence: "फोटो साक्ष्य",
    uploadPhotos: "नगर निगम को समस्या बेहतर समझने में मदद के लिए फोटो अपलोड करें",
    chooseFiles: "फाइलें चुनें",
    contactEmail: "संपर्क ईमेल *",
    emailPlaceholder: "आपका.ईमेल@gmail.com",
    contactPhone: "संपर्क फोन (वैकल्पिक)",
    phonePlaceholder: "+91 98765 43210",
    submitIssueReport: "समस्या रिपोर्ट जमा करें",
    reportingGuidelines: "रिपोर्टिंग दिशानिर्देश",
    guideline1: "स्थान के बारे में विशिष्ट रहें - वार्ड नंबर, पास के मील के पत्थर शामिल करें",
    guideline2: "समस्या को अलग-अलग कोणों से दिखाने वाली स्पष्ट तस्वीरें शामिल करें",
    guideline3: "बताएं कि समस्या निवासियों के दैनिक जीवन को कैसे प्रभावित करती है",
    guideline4: "अपने आरडब्ल्यूए से जांच लें कि समस्या पहले से रिपोर्ट तो नहीं की गई है",
    responseTimes: "अपेक्षित प्रतिक्रिया समय",
    hours24: "24 घंटे",
    days35: "3-5 दिन",
    weeks12: "1-2 सप्ताह",
    weeks24: "2-4 सप्ताह",
    currentDateTime: "वर्तमान दिनांक और समय",
    removeImage: "छवि हटाएं",
    maxImages: "अधिकतम 5 छवियों की अनुमति है",
    submitting: "रिपोर्ट जमा की जा रही है...",
    gettingLocation: "स्थान प्राप्त कर रहे हैं...",
    useCurrentGpsLocation: "वर्तमान GPS स्थान का उपयोग करें",
    gpsLocationCaptured: "GPS स्थान कैप्चर किया गया",
  },
}

export default function ReportIssuePage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [currentDateTime, setCurrentDateTime] = useState("")
  const { logout, isLoading, reportIssue } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "medium",
    contactEmail: "",
    contactPhone: "",
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number
    longitude: number
    accuracy: number
  } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  
  const [user,setUser] = useState<IUser | null>(null)
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/cookie");
      const data = await res.json();
      if(data.user === null) router.push("/login")
      setUser(data.user);
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
    return () => clearInterval(interval)
  }, [])

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push("/login")
  //   }
  // }, [user, isLoading, router])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("civic-language", newLanguage)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    if (uploadedImages.length + files.length > 5) {
      alert(t.maxImages)
      return
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setUploadedImages((prev) => [...prev, result])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const generateTrackingNumber = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")

    return `CR-JH-${year}${month}${day}-${hours}${minutes}${random}`
  }

  const getCurrentLocation = () => {
    setLocationLoading(true)

    if (!navigator.geolocation) {
      alert(
        language === "en" ? "Geolocation is not supported by this browser." : "यह ब्राउज़र जियोलोकेशन का समर्थन नहीं करता।",
      )
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setGpsLocation({ latitude, longitude, accuracy })

        // Reverse geocoding to get address (simplified version)
        const locationText = `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`
        handleInputChange("location", formData.location ? `${formData.location} | ${locationText}` : locationText)

        setLocationLoading(false)
      },
      (error) => {
        let errorMessage = ""
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              language === "en"
                ? "Location access denied. Please enable location services."
                : "स्थान पहुंच अस्वीकृत। कृपया स्थान सेवाएं सक्षम करें।"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = language === "en" ? "Location information unavailable." : "स्थान जानकारी अनुपलब्ध।"
            break
          case error.TIMEOUT:
            errorMessage = language === "en" ? "Location request timed out." : "स्थान अनुरोध समय समाप्त।"
            break
        }
        alert(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const t = content[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await reportIssue(
      formData.title,
      formData.category,
      formData.priority,
      formData.location,
      formData.description,
      formData.contactEmail,
      uploadedImages[0],
      formData.contactPhone
    )

    if (!result.success) {
      alert(result.message)
      setIsSubmitting(false)
      return
    }

    const tracking = generateTrackingNumber()
    const now = new Date()

    // const issueData: ReportedIssue = {
    //   id: `issue_${Date.now()}`,
    //   trackingNumber: tracking,
    //   title: formData.title,
    //   description: formData.description,
    //   category: formData.category,
    //   location: formData.location,
    //   gpsCoordinates: gpsLocation,
    //   priority: formData.priority,
    //   contactEmail: formData.contactEmail,
    //   contactPhone: formData.contactPhone,
    //   images: uploadedImages,
    //   reportedBy: user?.id || "",
    //   reportedAt: now.toISOString(),
    //   status: "reported",
    //   userType: user?.userType || "user",
    // }

    // const existingIssues = JSON.parse(localStorage.getItem("civic-issues") || "[]")
    // existingIssues.push(issueData)
    // localStorage.setItem("civic-issues", JSON.stringify(existingIssues))

    setTrackingNumber(tracking)
    setIsSubmitting(false)
    setIsSubmitted(true)
  }


  if (isLoading) {
    return <Loader/>
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="government-header py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">
                {language === "en" ? "Government of Jharkhand - Civic Portal" : "झारखंड सरकार - नागरिक पोर्टल"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{currentDateTime}</span>
            </div>
          </div>
        </div>

        <nav className="border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.backToHome}
                  </Button>
                </Link>
              </div>
              <div className="flex-1 flex justify-center">
                <h1 className="text-xl font-bold text-foreground">{t.projectName}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center space-x-2 border-2 hover:bg-primary/10 bg-transparent"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">{language === "en" ? "हिंदी" : "English"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === "en" ? "Logout" : "लॉगआउट"}</span>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">{t.issueReportedSuccess}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t.thankYouMessage} <strong>#{trackingNumber}</strong> {t.reviewShortly}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/track-progress">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t.trackProgress}
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  {t.returnHome}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="government-header py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">
              {language === "en" ? "Government of Jharkhand - Civic Portal" : "झारखंड सरकार - नागरिक पोर्टल"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{currentDateTime}</span>
          </div>
        </div>
      </div>

      <nav className="border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.backToHome}
                </Button>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <h1 className="text-xl font-bold text-foreground">{t.projectName}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-2 border-2 hover:bg-primary/10 bg-transparent"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{language === "en" ? "हिंदी" : "English"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === "en" ? "Logout" : "लॉगआउट"}</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">{t.reportCommunityIssue}</h2>
          <p className="text-xl text-muted-foreground mb-8">{t.reportDescription}</p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-gray-200 bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{t.issueDetails}</CardTitle>
                  <CardDescription>{t.issueDetailsDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">{t.issueTitle}</Label>
                      <Input
                        id="title"
                        placeholder={t.issueTitlePlaceholder}
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">{t.category}</Label>
                        <Select onValueChange={(value) => handleInputChange("category", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectCategory} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="infrastructure">{t.infrastructure}</SelectItem>
                            <SelectItem value="safety">{t.publicSafety}</SelectItem>
                            <SelectItem value="environment">{t.environment}</SelectItem>
                            <SelectItem value="transportation">{t.transportation}</SelectItem>
                            <SelectItem value="utilities">{t.utilities}</SelectItem>
                            <SelectItem value="community">{t.communityServices}</SelectItem>
                            <SelectItem value="other">{t.other}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">{t.priorityLevel}</Label>
                        <Select onValueChange={(value) => handleInputChange("priority", value)} defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectPriority} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">{t.low}</SelectItem>
                            <SelectItem value="medium">{t.medium}</SelectItem>
                            <SelectItem value="high">{t.high}</SelectItem>
                            <SelectItem value="urgent">{t.urgent}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{t.location}</Label>
                      <div className="space-y-2">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder={t.locationPlaceholder}
                            className="pl-10"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={getCurrentLocation}
                          disabled={locationLoading}
                          className="w-full bg-transparent"
                        >
                          {locationLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                              {t.gettingLocation}
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 mr-2" />
                              {t.useCurrentGpsLocation}
                            </>
                          )}
                        </Button>
                        {gpsLocation && (
                          <div className="text-xs text-green-600 bg-green-50 p-2 rounded border">
                            {t.gpsLocationCaptured}:{gpsLocation.latitude.toFixed(6)},{" "}
                            {gpsLocation.longitude.toFixed(6)}
                            (±{Math.round(gpsLocation.accuracy)}m)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{t.detailedDescription}</Label>
                      <Textarea
                        id="description"
                        placeholder={t.descriptionPlaceholder}
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t.photoEvidence}</Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">{t.uploadPhotos}</p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t.chooseFiles}
                        </Button>
                      </div>

                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.contactEmail}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t.emailPlaceholder}
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t.contactPhone}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t.phonePlaceholder}
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t.submitting : t.submitIssueReport}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-gray-200 bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{t.currentDateTime}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-mono text-center text-primary">{currentDateTime}</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{t.reportingGuidelines}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">{t.guideline1}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">{t.guideline2}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">{t.guideline3}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-muted-foreground">{t.guideline4}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{t.responseTimes}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="destructive">{t.urgent}</Badge>
                    <span className="text-sm text-muted-foreground">{t.hours24}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-accent text-accent-foreground">{t.high}</Badge>
                    <span className="text-sm text-muted-foreground">{t.days35}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{t.medium}</Badge>
                    <span className="text-sm text-muted-foreground">{t.weeks12}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{t.low}</Badge>
                    <span className="text-sm text-muted-foreground">{t.weeks24}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
