"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Users,
  Calendar,
  MapPin,
  ThumbsUp,
  Eye,
  Globe,
  LogOut,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const content = {
  en: {
    backToHome: "Back to Home",
    projectName: "CivicResolve",
    browseSuccessfulSolutions: "Browse Successful Solutions",
    discoverSolutions:
      "Discover proven solutions from communities across India and learn how similar issues were successfully resolved through Municipal Corporation initiatives",
    searchSolutions: "Search solutions...",
    category: "Category",
    impactLevel: "Impact Level",
    sortBy: "Sort by",
    all: "All",
    transportation: "Transportation",
    environment: "Environment & Sanitation",
    publicSafety: "Public Safety",
    infrastructure: "Infrastructure",
    communityServices: "Community Services",
    utilities: "Utilities",
    high: "High",
    medium: "Medium",
    low: "Low",
    newestFirst: "Newest First",
    oldestFirst: "Oldest First",
    mostPopular: "Most Popular",
    highestImpact: "Highest Impact",
    showing: "Showing",
    of: "of",
    solutions: "solutions",
    filtersActive: "Filters active:",
    impact: "Impact",
    cost: "Cost:",
    timeline: "Timeline:",
    keyStakeholders: "Key Stakeholders:",
    viewFullCaseStudy: "View Full Case Study",
    noSolutionsFound: "No solutions found",
    adjustSearchTerms: "Try adjusting your search terms or filters to find relevant solutions.",
    clearAllFilters: "Clear All Filters",
    haveSolutionToShare: "Have a Solution to Share?",
    helpOtherCommunities:
      "Help other communities across India by sharing your successful civic solutions and Municipal Corporation collaboration strategies.",
    submitYourSolution: "Submit Your Solution",
    joinCommunityDiscussions: "Join Community Discussions",
  },
  hi: {
    backToHome: "होम पर वापस जाएं",
    projectName: "सिविकरिज़ॉल्व",
    browseSuccessfulSolutions: "सफल समाधान ब्राउज़ करें",
    discoverSolutions:
      "भारत भर के समुदायों से सिद्ध समाधान खोजें और जानें कि नगर निगम की पहल के माध्यम से समान मुद्दों को कैसे सफलतापूर्वक हल किया गया",
    searchSolutions: "समाधान खोजें...",
    category: "श्रेणी",
    impactLevel: "प्रभाव स्तर",
    sortBy: "इसके अनुसार क्रमबद्ध करें",
    all: "सभी",
    transportation: "परिवहन",
    environment: "पर्यावरण और स्वच्छता",
    publicSafety: "सार्वजनिक सुरक्षा",
    infrastructure: "बुनियादी ढांचा",
    communityServices: "सामुदायिक सेवाएं",
    utilities: "उपयोगिताएं",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
    newestFirst: "नवीनतम पहले",
    oldestFirst: "पुराने पहले",
    mostPopular: "सबसे लोकप्रिय",
    highestImpact: "सर्वोच्च प्रभाव",
    showing: "दिखा रहे हैं",
    of: "में से",
    solutions: "समाधान",
    filtersActive: "सक्रिय फिल्टर:",
    impact: "प्रभाव",
    cost: "लागत:",
    timeline: "समयसीमा:",
    keyStakeholders: "मुख्य हितधारक:",
    viewFullCaseStudy: "पूरा केस स्टडी देखें",
    noSolutionsFound: "कोई समाधान नहीं मिला",
    adjustSearchTerms: "प्रासंगिक समाधान खोजने के लिए अपने खोज शब्दों या फिल्टर को समायोजित करने का प्रयास करें।",
    clearAllFilters: "सभी फिल्टर साफ़ करें",
    haveSolutionToShare: "साझा करने के लिए कोई समाधान है?",
    helpOtherCommunities:
      "अपने सफल नागरिक समाधान और नगर निगम सहयोग रणनीतियों को साझा करके भारत भर के अन्य समुदायों की मदद करें।",
    submitYourSolution: "अपना समाधान जमा करें",
    joinCommunityDiscussions: "सामुदायिक चर्चाओं में शामिल हों",
  },
}

const getSolutions = (language: "en" | "hi") => [
  {
    id: 1,
    title: language === "en" ? "Smart Traffic Management System in Pune" : "पुणे में स्मार्ट ट्रैफिक प्रबंधन प्रणाली",
    description:
      language === "en"
        ? "Reduced traffic congestion by 45% through AI-powered traffic signals and real-time monitoring at major junctions like FC Road and JM Road."
        : "FC रोड और JM रोड जैसे प्रमुख चौराहों पर AI-संचालित ट्रैफिक सिग्नल और रियल-टाइम मॉनिटरिंग के माध्यम से ट्रैफिक जाम में 45% की कमी।",
    category: language === "en" ? "Transportation" : "परिवहन",
    location: language === "en" ? "Pune, Maharashtra" : "पुणे, महाराष्ट्र",
    dateResolved: "2024-01-15",
    likes: 127,
    views: 1543,
    impact: language === "en" ? "High" : "उच्च",
    cost: "₹65 Lakh",
    timeline: language === "en" ? "8 months" : "8 महीने",
    stakeholders:
      language === "en"
        ? ["Pune Municipal Corporation", "Traffic Police", "Smart City Mission", "Local RWAs"]
        : ["पुणे नगर निगम", "ट्रैफिक पुलिस", "स्मार्ट सिटी मिशन", "स्थानीय आरडब्ल्यूए"],
    tags:
      language === "en"
        ? ["Smart City", "Traffic Management", "AI Technology"]
        : ["स्मार्ट सिटी", "ट्रैफिक प्रबंधन", "AI तकनीक"],
  },
  {
    id: 2,
    title: language === "en" ? "Waste Segregation Initiative in Indore" : "इंदौर में कचरा पृथक्करण पहल",
    description:
      language === "en"
        ? "Achieved 95% waste segregation compliance through door-to-door collection and community awareness programs, making Indore India's cleanest city."
        : "घर-घर संग्रह और सामुदायिक जागरूकता कार्यक्रमों के माध्यम से 95% कचरा पृथक्करण अनुपालन प्राप्त किया, जिससे इंदौर भारत का सबसे स्वच्छ शहर बना।",
    category: language === "en" ? "Environment & Sanitation" : "पर्यावरण और स्वच्छता",
    location: language === "en" ? "Indore, Madhya Pradesh" : "इंदौर, मध्य प्रदेश",
    dateResolved: "2023-11-20",
    likes: 189,
    views: 2892,
    impact: language === "en" ? "High" : "उच्च",
    cost: "₹12 Crore",
    timeline: language === "en" ? "2 years" : "2 साल",
    stakeholders:
      language === "en"
        ? ["Indore Municipal Corporation", "Swachh Bharat Mission", "NGOs", "Resident Associations"]
        : ["इंदौर नगर निगम", "स्वच्छ भारत मिशन", "एनजीओ", "निवासी संघ"],
    tags:
      language === "en"
        ? ["Swachh Bharat", "Waste Management", "Community Participation"]
        : ["स्वच्छ भारत", "कचरा प्रबंधन", "सामुदायिक भागीदारी"],
  },
  {
    id: 3,
    title: language === "en" ? "Digital Governance Platform in Hyderabad" : "हैदराबाद में डिजिटल गवर्नेंस प्लेटफॉर्म",
    description:
      language === "en"
        ? "Launched 'HydConnect' app enabling citizens to report civic issues, track complaints, and access 200+ municipal services online, reducing response time by 70%."
        : "'हैदकनेक्ट' ऐप लॉन्च किया जो नागरिकों को नागरिक समस्याओं की रिपोर्ट करने, शिकायतों को ट्रैक करने और 200+ नगरपालिका सेवाओं तक ऑनलाइन पहुंच प्रदान करता है, जिससे प्रतिक्रिया समय में 70% की कमी आई।",
    category: language === "en" ? "Community Services" : "सामुदायिक सेवाएं",
    location: language === "en" ? "Hyderabad, Telangana" : "हैदराबाद, तेलंगाना",
    dateResolved: "2024-02-10",
    likes: 164,
    views: 1721,
    impact: language === "en" ? "High" : "उच्च",
    cost: "₹8.5 Crore",
    timeline: language === "en" ? "1 year" : "1 साल",
    stakeholders:
      language === "en"
        ? ["GHMC", "IT Department", "Digital India Initiative", "Citizens"]
        : ["जीएचएमसी", "आईटी विभाग", "डिजिटल इंडिया पहल", "नागरिक"],
    tags:
      language === "en"
        ? ["Digital Governance", "E-Services", "Citizen Engagement"]
        : ["डिजिटल गवर्नेंस", "ई-सेवाएं", "नागरिक सहभागिता"],
  },
  {
    id: 4,
    title: language === "en" ? "Solar Street Lighting in Surat" : "सूरत में सोलर स्ट्रीट लाइटिंग",
    description:
      language === "en"
        ? "Installed 15,000 solar-powered LED street lights across the city, reducing electricity costs by ₹2.5 crore annually and improving safety in residential areas."
        : "शहर भर में 15,000 सोलर-संचालित LED स्ट्रीट लाइट स्थापित कीं, जिससे सालाना ₹2.5 करोड़ की बिजली लागत में कमी आई और आवासीय क्षेत्रों में सुरक्षा में सुधार हुआ।",
    category: language === "en" ? "Infrastructure" : "बुनियादी ढांचा",
    location: language === "en" ? "Surat, Gujarat" : "सूरत, गुजरात",
    dateResolved: "2023-09-15",
    likes: 98,
    views: 1234,
    impact: language === "en" ? "Medium" : "मध्यम",
    cost: "₹45 Crore",
    timeline: language === "en" ? "18 months" : "18 महीने",
    stakeholders:
      language === "en"
        ? ["Surat Municipal Corporation", "Gujarat Energy Development Agency", "Local Contractors"]
        : ["सूरत नगर निगम", "गुजरात ऊर्जा विकास एजेंसी", "स्थानीय ठेकेदार"],
    tags:
      language === "en"
        ? ["Solar Energy", "Street Lighting", "Energy Efficiency"]
        : ["सौर ऊर्जा", "स्ट्रीट लाइटिंग", "ऊर्जा दक्षता"],
  },
  {
    id: 5,
    title: language === "en" ? "Water ATM Network in Chennai" : "चेन्नई में वाटर एटीएम नेटवर्क",
    description:
      language === "en"
        ? "Deployed 500 water ATMs providing 24/7 access to purified drinking water at ₹5 per 20 liters, serving 2 lakh people daily in water-scarce areas."
        : "500 वाटर एटीएम तैनात किए जो ₹5 प्रति 20 लीटर की दर से शुद्ध पेयजल तक 24/7 पहुंच प्रदान करते हैं, जो पानी की कमी वाले क्षेत्रों में दैनिक 2 लाख लोगों की सेवा करते हैं।",
    category: language === "en" ? "Utilities" : "उपयोगिताएं",
    location: language === "en" ? "Chennai, Tamil Nadu" : "चेन्नई, तमिलनाडु",
    dateResolved: "2024-03-05",
    likes: 142,
    views: 1876,
    impact: language === "en" ? "High" : "उच्च",
    cost: "₹25 Crore",
    timeline: language === "en" ? "10 months" : "10 महीने",
    stakeholders:
      language === "en"
        ? ["Chennai Metro Water", "Tamil Nadu Water Board", "Private Partners", "Community Groups"]
        : ["चेन्नई मेट्रो वाटर", "तमिलनाडु जल बोर्ड", "निजी भागीदार", "सामुदायिक समूह"],
    tags:
      language === "en"
        ? ["Water Security", "Public-Private Partnership", "Affordable Access"]
        : ["जल सुरक्षा", "सार्वजनिक-निजी भागीदारी", "किफायती पहुंच"],
  },
]

const getCategories = (language: "en" | "hi") => [
  language === "en" ? "All" : "सभी",
  language === "en" ? "Transportation" : "परिवहन",
  language === "en" ? "Environment & Sanitation" : "पर्यावरण और स्वच्छता",
  language === "en" ? "Public Safety" : "सार्वजनिक सुरक्षा",
  language === "en" ? "Infrastructure" : "बुनियादी ढांचा",
  language === "en" ? "Community Services" : "सामुदायिक सेवाएं",
  language === "en" ? "Utilities" : "उपयोगिताएं",
]

const getImpactLevels = (language: "en" | "hi") => [
  language === "en" ? "All" : "सभी",
  language === "en" ? "High" : "उच्च",
  language === "en" ? "Medium" : "मध्यम",
  language === "en" ? "Low" : "कम",
]

export default function BrowseSolutionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImpact, setSelectedImpact] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("civic-language") as "en" | "hi"
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)
    localStorage.setItem("civic-language", newLanguage)
    setSelectedCategory(newLanguage === "en" ? "All" : "सभी")
    setSelectedImpact(newLanguage === "en" ? "All" : "सभी")
  }

  const t = content[language]
  const solutions = getSolutions(language)
  const categories = getCategories(language)
  const impactLevels = getImpactLevels(language)

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

  if (!user) {
    return null
  }

  const filteredSolutions = solutions
    .filter((solution) => {
      const matchesSearch =
        solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory =
        selectedCategory === (language === "en" ? "All" : "सभी") || solution.category === selectedCategory
      const matchesImpact = selectedImpact === (language === "en" ? "All" : "सभी") || solution.impact === selectedImpact
      return matchesSearch && matchesCategory && matchesImpact
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateResolved).getTime() - new Date(a.dateResolved).getTime()
        case "oldest":
          return new Date(a.dateResolved).getTime() - new Date(b.dateResolved).getTime()
        case "popular":
          return b.likes - a.likes
        case "impact":
          const impactOrder = language === "en" ? { High: 3, Medium: 2, Low: 1 } : { उच्च: 3, मध्यम: 2, कम: 1 }
          return impactOrder[b.impact as keyof typeof impactOrder] - impactOrder[a.impact as keyof typeof impactOrder]
        default:
          return 0
      }
    })

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
            <span>Welcome, {user.name}</span>
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">{t.browseSuccessfulSolutions}</h2>
            <p className="text-xl text-muted-foreground mb-8">{t.discoverSolutions}</p>
          </div>

          <div className="bg-card border border-gray-200 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t.searchSolutions}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t.category} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger>
                  <SelectValue placeholder={t.impactLevel} />
                </SelectTrigger>
                <SelectContent>
                  {impactLevels.map((impact) => (
                    <SelectItem key={impact} value={impact}>
                      {impact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder={t.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t.newestFirst}</SelectItem>
                  <SelectItem value="oldest">{t.oldestFirst}</SelectItem>
                  <SelectItem value="popular">{t.mostPopular}</SelectItem>
                  <SelectItem value="impact">{t.highestImpact}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {t.showing} {filteredSolutions.length} {t.of} {solutions.length} {t.solutions}
              </span>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>
                  {t.filtersActive}{" "}
                  {
                    [
                      selectedCategory !== (language === "en" ? "All" : "सभी") ? selectedCategory : null,
                      selectedImpact !== (language === "en" ? "All" : "सभी") ? selectedImpact : null,
                    ].filter(Boolean).length
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredSolutions.map((solution) => (
              <Card key={solution.id} className="border-gray-200 bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{solution.category}</Badge>
                      <Badge
                        className={
                          solution.impact === (language === "en" ? "High" : "उच्च")
                            ? "bg-primary text-primary-foreground"
                            : solution.impact === (language === "en" ? "Medium" : "मध्यम")
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {solution.impact} {t.impact}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{solution.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{solution.views}</span>
                      </div>
                    </div>
                  </div>

                  <CardTitle className="text-xl text-card-foreground mb-2">{solution.title}</CardTitle>
                  <CardDescription className="text-base">{solution.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {solution.location}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(solution.dateResolved).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-medium">{t.cost}</span> {solution.cost}
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-medium">{t.timeline}</span> {solution.timeline}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="font-medium">{t.keyStakeholders}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {solution.stakeholders.map((stakeholder, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {stakeholder}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {solution.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                          {t.viewFullCaseStudy}
                        </Button>
                        <Button size="sm" variant="outline">
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSolutions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{t.noSolutionsFound}</h3>
              <p className="text-muted-foreground mb-4">{t.adjustSearchTerms}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory(language === "en" ? "All" : "सभी")
                  setSelectedImpact(language === "en" ? "All" : "सभी")
                }}
              >
                {t.clearAllFilters}
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">{t.haveSolutionToShare}</h3>
          <p className="text-lg text-muted-foreground mb-8">{t.helpOtherCommunities}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t.submitYourSolution}
            </Button>
            <Link href="/community-collaboration">
              <Button size="lg" variant="outline">
                {t.joinCommunityDiscussions}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
