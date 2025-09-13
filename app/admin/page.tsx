"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Globe,
  LogOut,
  Shield,
  Clock,
  Search,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  Eye,
  RotateCcw,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

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
    projectName: "CivicResolve Admin",
    adminDashboard: "Government Admin Dashboard",
    dashboardDescription: "Manage and resolve civic issues reported by citizens of Jharkhand",
    currentDateTime: "Current Date & Time",
    totalIssues: "Total Issues",
    pendingIssues: "Pending Issues",
    resolvedIssues: "Resolved Issues",
    urgentIssues: "Urgent Issues",
    searchPlaceholder: "Search by tracking number, title, or location...",
    filterByStatus: "Filter by Status",
    filterByPriority: "Filter by Priority",
    filterByCategory: "Filter by Category",
    allStatuses: "All Statuses",
    allPriorities: "All Priorities",
    allCategories: "All Categories",
    reported: "Reported",
    inProgress: "In Progress",
    resolved: "Resolved",
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
    infrastructure: "Infrastructure",
    safety: "Public Safety",
    environment: "Environment",
    transportation: "Transportation",
    utilities: "Utilities",
    community: "Community Services",
    other: "Other",
    trackingNumber: "Tracking #",
    reportedBy: "Reported By",
    reportedOn: "Reported On",
    location: "Location",
    priority: "Priority",
    status: "Status",
    actions: "Actions",
    viewDetails: "View Details",
    markInProgress: "Mark In Progress",
    markResolved: "Mark Resolved",
    noIssuesFound: "No issues found",
    noIssuesDescription: "No civic issues have been reported yet or match your current filters.",
    issueDetails: "Issue Details",
    description: "Description",
    contactInfo: "Contact Information",
    photoEvidence: "Photo Evidence",
    noPhotos: "No photos uploaded",
    resolvedOn: "Resolved On",
    resolvedBy: "Resolved By",
    markingInProgress: "Marking as In Progress...",
    markingResolved: "Marking as Resolved...",
    accessDenied: "Access Denied",
    adminOnly: "This page is only accessible to government employees.",
    loginAsAdmin: "Login as Admin",
  },
  hi: {
    backToHome: "होम पर वापस जाएं",
    projectName: "सिविकरिज़ॉल्व एडमिन",
    adminDashboard: "सरकारी एडमिन डैशबोर्ड",
    dashboardDescription: "झारखंड के नागरिकों द्वारा रिपोर्ट की गई नागरिक समस्याओं का प्रबंधन और समाधान करें",
    currentDateTime: "वर्तमान दिनांक और समय",
    totalIssues: "कुल समस्याएं",
    pendingIssues: "लंबित समस्याएं",
    resolvedIssues: "हल की गई समस्याएं",
    urgentIssues: "तत्काल समस्याएं",
    searchPlaceholder: "ट्रैकिंग नंबर, शीर्षक या स्थान से खोजें...",
    filterByStatus: "स्थिति के अनुसार फ़िल्टर करें",
    filterByPriority: "प्राथमिकता के अनुसार फ़िल्टर करें",
    filterByCategory: "श्रेणी के अनुसार फ़िल्टर करें",
    allStatuses: "सभी स्थितियां",
    allPriorities: "सभी प्राथमिकताएं",
    allCategories: "सभी श्रेणियां",
    reported: "रिपोर्ट की गई",
    inProgress: "प्रगति में",
    resolved: "हल हो गई",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    urgent: "तत्काल",
    infrastructure: "बुनियादी ढांचा",
    safety: "सार्वजनिक सुरक्षा",
    environment: "पर्यावरण",
    transportation: "परिवहन",
    utilities: "उपयोगिताएं",
    community: "सामुदायिक सेवाएं",
    other: "अन्य",
    trackingNumber: "ट्रैकिंग #",
    reportedBy: "द्वारा रिपोर्ट किया गया",
    reportedOn: "रिपोर्ट की तारीख",
    location: "स्थान",
    priority: "प्राथमिकता",
    status: "स्थिति",
    actions: "कार्य",
    viewDetails: "विवरण देखें",
    markInProgress: "प्रगति में चिह्नित करें",
    markResolved: "हल के रूप में चिह्नित करें",
    noIssuesFound: "कोई समस्या नहीं मिली",
    noIssuesDescription: "अभी तक कोई नागरिक समस्या रिपोर्ट नहीं की गई है या आपके वर्तमान फ़िल्टर से मेल नहीं खाती।",
    issueDetails: "समस्या विवरण",
    description: "विवरण",
    contactInfo: "संपर्क जानकारी",
    photoEvidence: "फोटो साक्ष्य",
    noPhotos: "कोई फोटो अपलोड नहीं की गई",
    resolvedOn: "हल करने की तारीख",
    resolvedBy: "द्वारा हल किया गया",
    markingInProgress: "प्रगति में चिह्नित किया जा रहा है...",
    markingResolved: "हल के रूप में चिह्नित किया जा रहा है...",
    accessDenied: "पहुंच अस्वीकृत",
    adminOnly: "यह पृष्ठ केवल सरकारी कर्मचारियों के लिए सुलभ है।",
    loginAsAdmin: "एडमिन के रूप में लॉगिन करें",
  },
}

export default function AdminDashboard() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [currentDateTime, setCurrentDateTime] = useState("")
  const [issues, setIssues] = useState<ReportedIssue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<ReportedIssue[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<ReportedIssue | null>(null)
  const [updatingIssue, setUpdatingIssue] = useState<string | null>(null)

  const { Usera, logout, isLoading } = useAuth()
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

  // Live date/time update
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

  // Load issues from localStorage
  useEffect(() => {
    const loadIssues = () => {
      const storedIssues = JSON.parse(localStorage.getItem("civic-issues") || "[]")
      setIssues(storedIssues)
    }

    loadIssues()
    // Refresh issues every 5 seconds to catch new reports
    const interval = setInterval(loadIssues, 5000)
    return () => clearInterval(interval)
  }, [])

  // Filter issues based on search and filters
  useEffect(() => {
    let filtered = issues

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((issue) => issue.category === categoryFilter)
    }

    setFilteredIssues(filtered)
  }, [issues, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("civic-language", newLanguage)
  }

  const updateIssueStatus = async (issueId: string, newStatus: "in-progress" | "resolved") => {
    setUpdatingIssue(issueId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedIssues = issues.map((issue) => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: newStatus,
          ...(newStatus === "resolved" && {
            resolvedAt: new Date().toISOString(),
            resolvedBy: user?.adminId || user?.name || "Admin",
          }),
        }
      }
      return issue
    })

    setIssues(updatedIssues)
    localStorage.setItem("civic-issues", JSON.stringify(updatedIssues))
    setUpdatingIssue(null)
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

  const t = content[language]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.userType !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">{t.accessDenied}</CardTitle>
            <CardDescription>{t.adminOnly}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/login">
              <Button className="w-full">{t.loginAsAdmin}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status !== "resolved").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    urgent: issues.filter((i) => i.priority === "urgent" && i.status !== "resolved").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Government Header */}
      <div className="government-header py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">
              {language === "en" ? "Government of Jharkhand - Admin Portal" : "झारखंड सरकार - एडमिन पोर्टल"}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{currentDateTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>
                {user.name} ({user.adminId})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
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

      {/* Dashboard Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">{t.adminDashboard}</h2>
            <p className="text-lg text-muted-foreground">{t.dashboardDescription}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.totalIssues}</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.pendingIssues}</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.resolvedIssues}</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.urgentIssues}</p>
                    <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Issues Management */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.filterByStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allStatuses}</SelectItem>
                    <SelectItem value="reported">{t.reported}</SelectItem>
                    <SelectItem value="in-progress">{t.inProgress}</SelectItem>
                    <SelectItem value="resolved">{t.resolved}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.filterByPriority} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allPriorities}</SelectItem>
                    <SelectItem value="urgent">{t.urgent}</SelectItem>
                    <SelectItem value="high">{t.high}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="low">{t.low}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.filterByCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allCategories}</SelectItem>
                    <SelectItem value="infrastructure">{t.infrastructure}</SelectItem>
                    <SelectItem value="safety">{t.safety}</SelectItem>
                    <SelectItem value="environment">{t.environment}</SelectItem>
                    <SelectItem value="transportation">{t.transportation}</SelectItem>
                    <SelectItem value="utilities">{t.utilities}</SelectItem>
                    <SelectItem value="community">{t.community}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Issues List */}
          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{t.noIssuesFound}</h3>
                <p className="text-muted-foreground">{t.noIssuesDescription}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      <div className="lg:col-span-3">
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{issue.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {t.trackingNumber}: {issue.trackingNumber}
                          </p>
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{issue.location}</span>
                        </div>
                      </div>

                      <div className="lg:col-span-1">{getPriorityBadge(issue.priority)}</div>

                      <div className="lg:col-span-1">{getStatusBadge(issue.status)}</div>

                      <div className="lg:col-span-2">
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-3">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedIssue(issue)}>
                            <Eye className="w-4 h-4 mr-1" />
                            {t.viewDetails}
                          </Button>

                          {issue.status === "reported" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateIssueStatus(issue.id, "in-progress")}
                              disabled={updatingIssue === issue.id}
                            >
                              {updatingIssue === issue.id ? (
                                <RotateCcw className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Clock className="w-4 h-4 mr-1" />
                              )}
                              {updatingIssue === issue.id ? t.markingInProgress : t.markInProgress}
                            </Button>
                          )}

                          {issue.status !== "resolved" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => updateIssueStatus(issue.id, "resolved")}
                              disabled={updatingIssue === issue.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {updatingIssue === issue.id ? (
                                <RotateCcw className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-1" />
                              )}
                              {updatingIssue === issue.id ? t.markingResolved : t.markResolved}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.issueDetails}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIssue(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">{selectedIssue.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.trackingNumber}: {selectedIssue.trackingNumber}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium">{t.priority}</Label>
                    <div className="mt-1">{getPriorityBadge(selectedIssue.priority)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t.status}</Label>
                    <div className="mt-1">{getStatusBadge(selectedIssue.status)}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium">{t.location}</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedIssue.location}</p>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium">{t.description}</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedIssue.description}</p>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium">{t.contactInfo}</Label>
                  <div className="text-sm text-muted-foreground mt-1">
                    <p>Email: {selectedIssue.contactEmail}</p>
                    {selectedIssue.contactPhone && <p>Phone: {selectedIssue.contactPhone}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium">{t.reportedOn}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedIssue.reportedAt).toLocaleString()}
                  </p>
                </div>

                {selectedIssue.status === "resolved" && selectedIssue.resolvedAt && (
                  <div className="mb-4">
                    <Label className="text-sm font-medium">{t.resolvedOn}</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedIssue.resolvedAt).toLocaleString()}
                    </p>
                    {selectedIssue.resolvedBy && (
                      <p className="text-sm text-muted-foreground">
                        {t.resolvedBy}: {selectedIssue.resolvedBy}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">{t.photoEvidence}</Label>
                  {selectedIssue.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedIssue.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{t.noPhotos}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
