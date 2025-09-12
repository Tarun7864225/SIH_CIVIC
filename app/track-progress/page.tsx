"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Globe,
  LogOut,
  Shield,
  User,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { IUser } from "../lib/model/user"
import { connectDB } from "../lib/db/db"

interface ReportedIssue {
  id: string
  trackingNumber: string
  title: string
  description: string
  category: string
  location: string
  priority: string
  contactEmail: string
  contactPhone: string
  images: string[]
  reportedBy: string
  reportedAt: string
  status: "reported" | "in-progress" | "resolved"
  userType: "user" | "admin"
  resolvedAt?: string
  resolvedBy?: string
}

const content = {
  en: {
    backToHome: "Back to Home",
    projectName: "CivicResolve",
    trackProgress: "Track Your Issues",
    progressDescription:
      "Monitor the status of issues you've reported and see how Municipal Corporation is addressing your concerns",
    myIssues: "My Issues",
    totalReported: "Total Reported",
    inProgress: "In Progress",
    resolved: "Resolved",
    avgResponseTime: "Avg. Response Time",
    searchPlaceholder: "Search by tracking number or title...",
    allStatuses: "All Statuses",
    allCategories: "All Categories",
    reported: "Reported",
    underReview: "Under Review",
    planning: "Planning",
    approved: "Approved",
    completed: "Completed",
    infrastructure: "Infrastructure",
    environment: "Environment & Sanitation",
    publicSafety: "Public Safety",
    transportation: "Transportation",
    utilities: "Utilities",
    community: "Community Services",
    other: "Other",
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
    issues: "issues",
    listView: "List View",
    timelineView: "Timeline View",
    viewDetails: "View Details",
    hideDetails: "Hide Details",
    progress: "Progress",
    lastUpdate: "Last Update:",
    estCompletion: "Est. Completion:",
    reportedOn: "Reported On",
    updateTimeline: "Update Timeline",
    complete: "complete",
    lastUpdated: "Last updated",
    stayInformed: "Stay Informed",
    stayInformedDescription:
      "Get notifications about updates to your reported issues and stay engaged with Municipal Corporation's response to your concerns.",
    reportNewIssue: "Report New Issue",
    joinDiscussions: "Join Discussions",
    noIssuesFound: "No Issues Found",
    noIssuesDescription: "You haven't reported any issues yet. Start by reporting a civic issue in your area.",
    loginRequired: "Login Required",
    loginDescription: "Please login to track your reported issues.",
    loginNow: "Login Now",
    trackingNumber: "Tracking #",
    description: "Description",
    contactInfo: "Contact Information",
    photoEvidence: "Photo Evidence",
    noPhotos: "No photos uploaded",
    resolvedOn: "Resolved On",
    resolvedBy: "Resolved By",
    currentDateTime: "Current Date & Time",
    statusUpdated: "Status Updated",
    issueReported: "Issue Reported",
    workStarted: "Work Started",
    issueResolved: "Issue Resolved",
  },
  hi: {
    backToHome: "होम पर वापस जाएं",
    projectName: "सिविकरिज़ॉल्व",
    trackProgress: "अपनी समस्याओं को ट्रैक करें",
    progressDescription:
      "आपके द्वारा रिपोर्ट की गई समस्याओं की स्थिति की निगरानी करें और देखें कि नगर निगम आपकी चिंताओं का समाधान कैसे कर रहा है",
    myIssues: "मेरी समस्याएं",
    totalReported: "कुल रिपोर्ट की गई",
    inProgress: "प्रगति में",
    resolved: "हल हो गई",
    avgResponseTime: "औसत प्रतिक्रिया समय",
    searchPlaceholder: "ट्रैकिंग नंबर या शीर्षक से खोजें...",
    allStatuses: "सभी स्थितियां",
    allCategories: "सभी श्रेणियां",
    reported: "रिपोर्ट की गई",
    underReview: "समीक्षाधीन",
    planning: "योजना",
    approved: "अनुमोदित",
    completed: "पूर्ण",
    infrastructure: "बुनियादी ढांचा",
    environment: "पर्यावरण और स्वच्छता",
    publicSafety: "सार्वजनिक सुरक्षा",
    transportation: "परिवहन",
    utilities: "उपयोगिताएं",
    community: "सामुदायिक सेवाएं",
    other: "अन्य",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    urgent: "तत्काल",
    issues: "समस्याएं",
    listView: "सूची दृश्य",
    timelineView: "समयरेखा दृश्य",
    viewDetails: "विवरण देखें",
    hideDetails: "विवरण छुपाएं",
    progress: "प्रगति",
    lastUpdate: "अंतिम अपडेट:",
    estCompletion: "अनुमानित पूर्णता:",
    reportedOn: "रिपोर्ट की तारीख",
    updateTimeline: "अपडेट समयरेखा",
    complete: "पूर्ण",
    lastUpdated: "अंतिम अपडेट",
    stayInformed: "सूचित रहें",
    stayInformedDescription:
      "अपनी रिपोर्ट की गई समस्याओं के अपडेट के बारे में सूचनाएं प्राप्त करें और आपकी चिंताओं के लिए नगर निगम की प्रतिक्रिया के साथ जुड़े रहें।",
    reportNewIssue: "नई समस्या रिपोर्ट करें",
    joinDiscussions: "चर्चाओं में शामिल हों",
    noIssuesFound: "कोई समस्या नहीं मिली",
    noIssuesDescription: "आपने अभी तक कोई समस्या रिपोर्ट नहीं की है। अपने क्षेत्र में एक नागरिक समस्या रिपोर्ट करके शुरुआत करें।",
    loginRequired: "लॉगिन आवश्यक",
    loginDescription: "अपनी रिपोर्ट की गई समस्याओं को ट्रैक करने के लिए कृपया लॉगिन करें।",
    loginNow: "अभी लॉगिन करें",
    trackingNumber: "ट्रैकिंग #",
    description: "विवरण",
    contactInfo: "संपर्क जानकारी",
    photoEvidence: "फोटो साक्ष्य",
    noPhotos: "कोई फोटो अपलोड नहीं की गई",
    resolvedOn: "हल करने की तारीख",
    resolvedBy: "द्वारा हल किया गया",
    currentDateTime: "वर्तमान दिनांक और समय",
    statusUpdated: "स्थिति अपडेट की गई",
    issueReported: "समस्या रिपोर्ट की गई",
    workStarted: "काम शुरू हुआ",
    issueResolved: "समस्या हल हो गई",
  },
}

export default function TrackProgressPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [userIssues, setUserIssues] = useState<ReportedIssue[]>([])
  const [currentDateTime, setCurrentDateTime] = useState("")
  const [user,setUser] = useState<IUser | null>(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/cookie");
      const data = await res.json();
      if(data.user===null) router.push("/login")
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const {logout,trackProgress,Usera } = useAuth()
  const router = useRouter()


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

useEffect(() => {
    if (!Usera) return;

    const fetchUserIssues = async () => {
      try {
          const issues = await trackProgress(Usera.email);
          setUserIssues(issues);
          console.log(issues)
      
        console.log("Here")
      } catch (err) {
        console.log("Error fetching user issues:", err);
        setUserIssues([]); 
      }
    };

    fetchUserIssues();

    // refresh every 60 seconds
    const interval = setInterval(fetchUserIssues, 60000);
    return () => clearInterval(interval);
  }, [User, trackProgress]);



  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("civic-language", newLanguage)
  }

  const t = content[language]

  const filteredIssues = userIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: userIssues.length,
    inProgress: userIssues.filter((i) => i.status === "in-progress").length,
    resolved: userIssues.filter((i) => i.status === "resolved").length,
    avgResponseTime:
      userIssues.length > 0
        ? Math.round(
            userIssues
              .filter((i) => i.resolvedAt)
              .reduce((acc, issue) => {
                const reported = new Date(issue.reportedAt)
                const resolved = new Date(issue.resolvedAt!)
                return acc + (resolved.getTime() - reported.getTime()) / (1000 * 60 * 60 * 24)
              }, 0) / userIssues.filter((i) => i.resolvedAt).length,
          )
        : 0,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return <Badge variant="destructive">{t.reported}</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500 text-white">{t.inProgress}</Badge>
      case "resolved":
        return <Badge className="bg-green-500 text-white">{t.resolved}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">{t.urgent}</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-white">{t.high}</Badge>
      case "medium":
        return <Badge variant="secondary">{t.medium}</Badge>
      case "low":
        return <Badge variant="outline">{t.low}</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      infrastructure: t.infrastructure,
      safety: t.publicSafety,
      environment: t.environment,
      transportation: t.transportation,
      utilities: t.utilities,
      community: t.community,
      other: t.other,
    }
    return categoryMap[category] || category
  }

  const getStatusIcon = (status: string) => {
    if (status === "resolved") {
      return <CheckCircle className="w-4 h-4" />
    } else if (status === "in-progress") {
      return <Clock className="w-4 h-4" />
    } else {
      return <AlertCircle className="w-4 h-4" />
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "reported":
        return 25
      case "in-progress":
        return 75
      case "resolved":
        return 100
      default:
        return 0
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Government Header */}
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

        {/* Navigation */}
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <User className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>{t.loginRequired}</CardTitle>
              <p className="text-muted-foreground">{t.loginDescription}</p>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/login">
                <Button className="w-full">{t.loginNow}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Government Header */}
      <div className="government-header py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">
              {language === "en" ? "Government of Jharkhand - Civic Portal" : "झारखंड सरकार - नागरिक पोर्टल"}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{currentDateTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{user.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">{t.trackProgress}</h2>
            <p className="text-xl text-muted-foreground mb-8">{t.progressDescription}</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.total}</div>
                <div className="text-sm text-muted-foreground">{t.totalReported}</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.inProgress}</div>
                <div className="text-sm text-muted-foreground">{t.inProgress}</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.resolved}</div>
                <div className="text-sm text-muted-foreground">{t.resolved}</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-muted-foreground mb-2">{stats.avgResponseTime || "N/A"}</div>
                <div className="text-sm text-muted-foreground">{t.avgResponseTime}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t.searchPlaceholder}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.allStatuses} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  <SelectItem value="reported">{t.reported}</SelectItem>
                  <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                  <SelectItem value="resolved">{t.resolved}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.allCategories} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allCategories}</SelectItem>
                  <SelectItem value="infrastructure">{t.infrastructure}</SelectItem>
                  <SelectItem value="environment">{t.environment}</SelectItem>
                  <SelectItem value="safety">{t.publicSafety}</SelectItem>
                  <SelectItem value="transportation">{t.transportation}</SelectItem>
                  <SelectItem value="utilities">{t.utilities}</SelectItem>
                  <SelectItem value="community">{t.community}</SelectItem>
                  <SelectItem value="other">{t.other}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-muted-foreground">
                <Filter className="w-4 h-4 mr-2" />
                {filteredIssues.length} of {userIssues.length} {t.issues}
              </div>
            </div>
          </div>

          {/* Issues List */}
          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{t.noIssuesFound}</h3>
                <p className="text-muted-foreground mb-6">{t.noIssuesDescription}</p>
                <Link href="/report-issue">
                  <Button>{t.reportNewIssue}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <Card key={issue.id} className="border-border bg-card hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {issue.trackingNumber}
                          </Badge>
                          {getStatusBadge(issue.status)}
                          {getPriorityBadge(issue.priority)}
                        </div>
                        <h3 className="text-xl font-semibold text-card-foreground">{issue.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{issue.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {t.reportedOn} {new Date(issue.reportedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                      >
                        {selectedIssue === issue.id ? t.hideDetails : t.viewDetails}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{t.progress}</span>
                          <span className="text-sm text-muted-foreground">{getProgressPercentage(issue.status)}%</span>
                        </div>
                        <Progress value={getProgressPercentage(issue.status)} className="h-2" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-foreground">{t.lastUpdate}</span>
                          <div className="text-muted-foreground">
                            {issue.resolvedAt
                              ? new Date(issue.resolvedAt).toLocaleDateString()
                              : new Date(issue.reportedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Category:</span>
                          <div className="text-muted-foreground">{getCategoryName(issue.category)}</div>
                        </div>
                      </div>

                      {selectedIssue === issue.id && (
                        <div className="border-t border-border pt-4 mt-4 space-y-4">
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">{t.description}</h4>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-2">{t.contactInfo}</h4>
                            <div className="text-sm text-muted-foreground">
                              <p>Email: {issue.contactEmail}</p>
                              {issue.contactPhone && <p>Phone: {issue.contactPhone}</p>}
                            </div>
                          </div>

                          {issue.images.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">{t.photoEvidence}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {issue.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image || "/placeholder.svg"}
                                    alt={`Evidence ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {issue.status === "resolved" && issue.resolvedAt && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">{t.resolvedOn}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(issue.resolvedAt).toLocaleString()}
                              </p>
                              {issue.resolvedBy && (
                                <p className="text-sm text-muted-foreground">
                                  {t.resolvedBy}: {issue.resolvedBy}
                                </p>
                              )}
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold text-foreground mb-3">{t.updateTimeline}</h4>
                            <div className="space-y-3">
                              {issue.status === "resolved" && issue.resolvedAt && (
                                <div className="flex items-start space-x-3">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-medium text-foreground">{t.issueResolved}</span>
                                      <span className="text-sm text-muted-foreground">
                                        {new Date(issue.resolvedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Issue has been successfully resolved by Municipal Corporation
                                    </p>
                                  </div>
                                </div>
                              )}

                              {issue.status === "in-progress" && (
                                <div className="flex items-start space-x-3">
                                  <Clock className="w-4 h-4 text-blue-500 mt-1" />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-medium text-foreground">{t.workStarted}</span>
                                      <span className="text-sm text-muted-foreground">Recently</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Municipal Corporation has started working on this issue
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-start space-x-3">
                                <AlertCircle className="w-4 h-4 text-primary mt-1" />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-foreground">{t.issueReported}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(issue.reportedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Issue reported through CivicResolve platform
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">{t.stayInformed}</h3>
          <p className="text-lg text-muted-foreground mb-8">{t.stayInformedDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report-issue">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t.reportNewIssue}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
