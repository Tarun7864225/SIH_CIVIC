"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Search,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Star,
  Globe,
} from "lucide-react"
import Link from "next/link"

const content = {
  en: {
    backToHome: "Back to Home",
    projectName: "CivicResolve",
    communityCollaboration: "Community Collaboration",
    collaborationDescription:
      "Connect with neighbors, join RWA discussions, and work together with Ward Councillors to create positive change in your community",
    startNewDiscussion: "Start New Discussion",
    joinAGroup: "Join a Group",
    discussions: "Discussions",
    groups: "Groups",
    events: "Events",
    searchPlaceholder: "Search discussions, groups, events...",
    activeDiscussions: "Active Discussions",
    newDiscussion: "New Discussion",
    by: "by",
    replies: "replies",
    likes: "likes",
    participants: "participants",
    joinDiscussion: "Join Discussion",
    communityGroups: "Community Groups",
    createGroup: "Create Group",
    members: "members",
    joined: "Joined",
    joinGroup: "Join Group",
    upcomingEvents: "Upcoming Events",
    createEvent: "Create Event",
    attending: "attending",
    rsvp: "RSVP",
    communityImpact: "Community Impact",
    activeMembers: "Active Members",
    activeDiscussionsCount: "Active Discussions",
    communityGroupsCount: "Community Groups",
    issuesResolved: "Issues Resolved",
    transportation: "Transportation",
    environment: "Environment & Sanitation",
    publicSafety: "Public Safety",
    technology: "Technology",
    government: "Municipal Corporation",
    education: "Education",
    active: "Active",
    planning: "Planning",
  },
  hi: {
    backToHome: "होम पर वापस जाएं",
    projectName: "सिविकरिज़ॉल्व",
    communityCollaboration: "सामुदायिक सहयोग",
    collaborationDescription:
      "पड़ोसियों से जुड़ें, आरडब्ल्यूए चर्चाओं में भाग लें, और अपने समुदाय में सकारात्मक बदलाव लाने के लिए वार्ड पार्षदों के साथ मिलकर काम करें",
    startNewDiscussion: "नई चर्चा शुरू करें",
    joinAGroup: "एक समूह में शामिल हों",
    discussions: "चर्चाएं",
    groups: "समूह",
    events: "कार्यक्रम",
    searchPlaceholder: "चर्चाएं, समूह, कार्यक्रम खोजें...",
    activeDiscussions: "सक्रिय चर्चाएं",
    newDiscussion: "नई चर्चा",
    by: "द्वारा",
    replies: "उत्तर",
    likes: "पसंद",
    participants: "प्रतिभागी",
    joinDiscussion: "चर्चा में शामिल हों",
    communityGroups: "सामुदायिक समूह",
    createGroup: "समूह बनाएं",
    members: "सदस्य",
    joined: "शामिल हो गए",
    joinGroup: "समूह में शामिल हों",
    upcomingEvents: "आगामी कार्यक्रम",
    createEvent: "कार्यक्रम बनाएं",
    attending: "उपस्थित होने वाले",
    rsvp: "RSVP",
    communityImpact: "सामुदायिक प्रभाव",
    activeMembers: "सक्रिय सदस्य",
    activeDiscussionsCount: "सक्रिय चर्चाएं",
    communityGroupsCount: "सामुदायिक समूह",
    issuesResolved: "हल की गई समस्याएं",
    transportation: "परिवहन",
    environment: "पर्यावरण और स्वच्छता",
    publicSafety: "सार्वजनिक सुरक्षा",
    technology: "प्रौद्योगिकी",
    government: "नगर निगम",
    education: "शिक्षा",
    active: "सक्रिय",
    planning: "योजना",
  },
}

const getDiscussions = (language: "en" | "hi") => [
  {
    id: 1,
    title: language === "en" ? "Metro Connectivity to Gurgaon Sector 18" : "गुड़गांव सेक्टर 18 में मेट्रो कनेक्टिविटी",
    author: "Priya Sharma",
    avatar: "/diverse-woman-portrait.png",
    category: language === "en" ? "Transportation" : "परिवहन",
    replies: 34,
    likes: 67,
    lastActivity: language === "en" ? "2 hours ago" : "2 घंटे पहले",
    participants: 18,
    status: language === "en" ? "Active" : "सक्रिय",
    preview:
      language === "en"
        ? "We need to discuss extending metro line to Sector 18. Current auto-rickshaw dependency is causing traffic issues..."
        : "हमें सेक्टर 18 तक मेट्रो लाइन बढ़ाने पर चर्चा करनी होगी। वर्तमान ऑटो-रिक्शा निर्भरता से ट्रैफिक की समस्या हो रही है...",
  },
  {
    id: 2,
    title:
      language === "en" ? "RWA Initiative: Waste Segregation in DLF Phase 2" : "आरडब्ल्यूए पहल: डीएलएफ फेज 2 में कचरा पृथक्करण",
    author: "Rajesh Kumar",
    avatar: "/thoughtful-man.png",
    category: language === "en" ? "Environment & Sanitation" : "पर्यावरण और स्वच्छता",
    replies: 28,
    likes: 45,
    lastActivity: language === "en" ? "4 hours ago" : "4 घंटे पहले",
    participants: 12,
    status: language === "en" ? "Planning" : "योजना",
    preview:
      language === "en"
        ? "Our RWA is planning door-to-door waste collection with proper segregation. Need volunteers and Municipal Corporation support..."
        : "हमारा आरडब्ल्यूए उचित पृथक्करण के साथ घर-घर कचरा संग्रह की योजना बना रहा है। स्वयंसेवकों और नगर निगम के समर्थन की आवश्यकता है...",
  },
  {
    id: 3,
    title: language === "en" ? "Women's Safety Initiative in Koramangala" : "कोरमंगला में महिला सुरक्षा पहल",
    author: "Dr. Meera Reddy",
    avatar: "/caring-doctor.png",
    category: language === "en" ? "Public Safety" : "सार्वजनिक सुरक्षा",
    replies: 42,
    likes: 89,
    lastActivity: language === "en" ? "6 hours ago" : "6 घंटे पहले",
    participants: 25,
    status: language === "en" ? "Active" : "सक्रिय",
    preview:
      language === "en"
        ? "Discussing installation of CCTV cameras and better street lighting with Ward Councillor. Community patrol groups needed..."
        : "वार्ड पार्षद के साथ सीसीटीवी कैमरे और बेहतर स्ट्रीट लाइटिंग की स्थापना पर चर्चा। सामुदायिक गश्ती समूहों की आवश्यकता है...",
  },
]

const getGroups = (language: "en" | "hi") => [
  {
    id: 1,
    name: language === "en" ? "Swachh Bharat Community" : "स्वच्छ भारत समुदाय",
    description:
      language === "en"
        ? "Working towards cleaner neighborhoods through waste management and sanitation initiatives across Indian cities"
        : "भारतीय शहरों में कचरा प्रबंधन और स्वच्छता पहल के माध्यम से स्वच्छ पड़ोस की दिशा में काम करना",
    members: 234,
    category: language === "en" ? "Environment & Sanitation" : "पर्यावरण और स्वच्छता",
    image: "/green-city.jpg",
    recentActivity: language === "en" ? "New cleanliness drive planned" : "नई सफाई अभियान की योजना",
    isJoined: false,
  },
  {
    id: 2,
    name: language === "en" ? "Digital India Volunteers" : "डिजिटल इंडिया स्वयंसेवक",
    description:
      language === "en"
        ? "Helping citizens access government e-services and promoting digital literacy in local communities"
        : "नागरिकों को सरकारी ई-सेवाओं तक पहुंचने में मदद करना और स्थानीय समुदायों में डिजिटल साक्षरता को बढ़ावा देना",
    members: 156,
    category: language === "en" ? "Technology" : "प्रौद्योगिकी",
    image: "/interconnected-technology.png",
    recentActivity: language === "en" ? "Aadhaar camp scheduled" : "आधार कैंप निर्धारित",
    isJoined: true,
  },
  {
    id: 3,
    name: language === "en" ? "Resident Welfare Association Network" : "निवासी कल्याण संघ नेटवर्क",
    description:
      language === "en"
        ? "Connecting RWAs across the city to share best practices and coordinate with Municipal Corporation"
        : "शहर भर के आरडब्ल्यूए को जोड़ना ताकि सर्वोत्तम प्रथाओं को साझा किया जा सके और नगर निगम के साथ समन्वय किया जा सके",
    members: 189,
    category: language === "en" ? "Municipal Corporation" : "नगर निगम",
    image: "/safety-symbols.png",
    recentActivity: language === "en" ? "Ward meeting minutes shared" : "वार्ड बैठक कार्यवृत्त साझा किया गया",
    isJoined: false,
  },
]

const getEvents = (language: "en" | "hi") => [
  {
    id: 1,
    title: language === "en" ? "Ward Committee Meeting: Budget Discussion" : "वार्ड समिति बैठक: बजट चर्चा",
    date: "2024-03-15",
    time: "7:00 PM",
    location: language === "en" ? "Ward Office, Sector 15, Noida" : "वार्ड कार्यालय, सेक्टर 15, नोएडा",
    attendees: 67,
    category: language === "en" ? "Municipal Corporation" : "नगर निगम",
    organizer: language === "en" ? "Ward Councillor Office" : "वार्ड पार्षद कार्यालय",
  },
  {
    id: 2,
    title: language === "en" ? "Swachh Bharat Abhiyan: Community Clean-up" : "स्वच्छ भारत अभियान: सामुदायिक सफाई",
    date: "2024-03-20",
    time: "6:00 AM",
    location: language === "en" ? "Lodi Gardens, New Delhi" : "लोधी गार्डन, नई दिल्ली",
    attendees: 145,
    category: language === "en" ? "Environment & Sanitation" : "पर्यावरण और स्वच्छता",
    organizer: language === "en" ? "Swachh Bharat Community" : "स्वच्छ भारत समुदाय",
  },
  {
    id: 3,
    title:
      language === "en"
        ? "Digital Literacy Workshop for Senior Citizens"
        : "वरिष्ठ नागरिकों के लिए डिजिटल साक्षरता कार्यशाला",
    date: "2024-03-25",
    time: "10:00 AM",
    location: language === "en" ? "Community Hall, Indiranagar" : "सामुदायिक हॉल, इंदिरानगर",
    attendees: 38,
    category: language === "en" ? "Education" : "शिक्षा",
    organizer: language === "en" ? "Digital India Volunteers" : "डिजिटल इंडिया स्वयंसेवक",
  },
]

export default function CommunityCollaborationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("discussions")
  const [language, setLanguage] = useState<"en" | "hi">("en")

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
  const discussions = getDiscussions(language)
  const groups = getGroups(language)
  const events = getEvents(language)

  return (
    <div className="min-h-screen bg-background">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">{t.communityCollaboration}</h2>
            <p className="text-xl text-muted-foreground mb-8">{t.collaborationDescription}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                {t.startNewDiscussion}
              </Button>
              <Button size="lg" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                {t.joinAGroup}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="discussions">{t.discussions}</TabsTrigger>
                <TabsTrigger value="groups">{t.groups}</TabsTrigger>
                <TabsTrigger value="events">{t.events}</TabsTrigger>
              </TabsList>

              <div className="relative w-80">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t.searchPlaceholder}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="discussions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">{t.activeDiscussions}</h3>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.newDiscussion}
                </Button>
              </div>

              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="border-gray-200 bg-card hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={discussion.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {discussion.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-lg font-semibold text-card-foreground">{discussion.title}</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>
                                {t.by} {discussion.author}
                              </span>
                              <span>•</span>
                              <span>{discussion.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{discussion.category}</Badge>
                          <Badge
                            className={
                              discussion.status === (language === "en" ? "Active" : "सक्रिय")
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground"
                            }
                          >
                            {discussion.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{discussion.preview}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>
                              {discussion.replies} {t.replies}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>
                              {discussion.likes} {t.likes}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {discussion.participants} {t.participants}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {t.joinDiscussion}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">{t.communityGroups}</h3>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.createGroup}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <Card key={group.id} className="border-gray-200 bg-card hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-card-foreground">{group.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {group.category}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {group.members} {t.members}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{group.recentActivity}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className={
                            group.isJoined
                              ? "w-full bg-muted text-muted-foreground"
                              : "w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          }
                          disabled={group.isJoined}
                        >
                          {group.isJoined ? t.joined : t.joinGroup}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">{t.upcomingEvents}</h3>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.createEvent}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="border-gray-200 bg-card hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-card-foreground mb-2">{event.title}</h4>
                          <Badge variant="secondary">{event.category}</Badge>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>
                                {event.attendees} {t.attending}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>
                                {t.by} {event.organizer}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {t.rsvp}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">{t.communityImpact}</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2,847</div>
              <div className="text-muted-foreground">{t.activeMembers}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">127</div>
              <div className="text-muted-foreground">{t.activeDiscussionsCount}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">45</div>
              <div className="text-muted-foreground">{t.communityGroupsCount}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">312</div>
              <div className="text-muted-foreground">{t.issuesResolved}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
