"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, MapPin, Clock, Send, TrendingUp, AlertTriangle, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface CommunityPost {
  id: string
  userId: string
  userName: string
  userType: "user" | "admin"
  content: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  category: "complaint" | "suggestion" | "discussion" | "update"
  priority: "low" | "medium" | "high" | "urgent"
  likes: string[] // user IDs who liked
  comments: Comment[]
  createdAt: string
  images?: string[]
  status?: "open" | "in-progress" | "resolved"
}

interface Comment {
  id: string
  userId: string
  userName: string
  userType: "user" | "admin"
  content: string
  createdAt: string
  likes: string[]
}

interface HotspotArea {
  area: string
  complaintCount: number
  recentComplaints: string[]
}

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Rajesh Kumar",
    userType: "user",
    content:
      "Street light near bus stop has been broken for 3 days. It's getting dangerous for people walking at night. Can someone from PWD please look into this?",
    location: {
      latitude: 23.3441,
      longitude: 85.3096,
      address: "MG Road, Ranchi",
    },
    category: "complaint",
    priority: "high",
    likes: ["user2", "user3"],
    comments: [
      {
        id: "c1",
        userId: "admin1",
        userName: "PWD Officer",
        userType: "admin",
        content:
          "Thank you for reporting this. We have noted the complaint and will send a team to fix it within 48 hours.",
        createdAt: "2025-01-09T10:30:00Z",
        likes: ["user1"],
      },
    ],
    createdAt: "2025-01-09T08:00:00Z",
    status: "in-progress",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Priya Singh",
    userType: "user",
    content:
      "Garbage collection hasn't happened in our area for the past week. The bins are overflowing and it's creating hygiene issues. Sector 12, Block A needs immediate attention.",
    location: {
      latitude: 23.3521,
      longitude: 85.324,
      address: "Sector 12, Block A, Ranchi",
    },
    category: "complaint",
    priority: "urgent",
    likes: ["user1", "user3", "user4"],
    comments: [],
    createdAt: "2025-01-09T06:15:00Z",
    status: "open",
  },
]

const HOTSPOT_AREAS: HotspotArea[] = [
  {
    area: "MG Road Area",
    complaintCount: 12,
    recentComplaints: ["Street lights", "Road potholes", "Traffic signals"],
  },
  {
    area: "Sector 12",
    complaintCount: 8,
    recentComplaints: ["Garbage collection", "Water supply", "Drainage"],
  },
  {
    area: "Lalpur",
    complaintCount: 6,
    recentComplaints: ["Road maintenance", "Street cleaning"],
  },
]

export default function CommunityFeed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS)
  const [newPost, setNewPost] = useState("")
  const [newPostCategory, setNewPostCategory] = useState<"complaint" | "suggestion" | "discussion">("complaint")
  const [newPostPriority, setNewPostPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({})
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(
    null,
  )

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Current Location", // In real app, reverse geocode this
          })
        },
        (error) => {
          console.log("Location access denied")
          setUserLocation({
            latitude: 23.3441,
            longitude: 85.3096,
            address: "Ranchi, Jharkhand",
          })
        },
      )
    }
  }, [])

  const handleLike = (postId: string) => {
    if (!user) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(user.id)
          return {
            ...post,
            likes: isLiked ? post.likes.filter((id) => id !== user.id) : [...post.likes, user.id],
          }
        }
        return post
      }),
    )
  }

  const handleComment = (postId: string) => {
    if (!user || !commentInputs[postId]?.trim()) return

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userType: user.userType,
      content: commentInputs[postId].trim(),
      createdAt: new Date().toISOString(),
      likes: [],
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
  }

  const handleNewPost = () => {
    if (!user || !newPost.trim() || !userLocation) return

    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userType: user.userType,
      content: newPost.trim(),
      location: userLocation,
      category: newPostCategory,
      priority: newPostPriority,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      status: "open",
    }

    setPosts((prev) => [post, ...prev])
    setNewPost("")
  }

  const getDistanceFromUser = (postLocation: { latitude: number; longitude: number }) => {
    if (!userLocation) return "Unknown distance"
    const distance =
      Math.sqrt(
        Math.pow(postLocation.latitude - userLocation.latitude, 2) +
          Math.pow(postLocation.longitude - userLocation.longitude, 2),
      ) * 111
    return distance < 1 ? `${Math.round(distance * 1000)}m away` : `${distance.toFixed(1)}km away`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "complaint":
        return <AlertTriangle className="w-4 h-4" />
      case "suggestion":
        return <TrendingUp className="w-4 h-4" />
      case "discussion":
        return <MessageCircle className="w-4 h-4" />
      case "update":
        return <Eye className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">Please login to access the community feed</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hotspot Areas */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <TrendingUp className="w-5 h-5" />
            <span>Hotspot Areas (High Complaint Zones)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {HOTSPOT_AREAS.map((area, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{area.area}</h4>
                  <Badge className="bg-red-500 text-white">{area.complaintCount} issues</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">Recent complaints:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {area.recentComplaints.map((complaint, i) => (
                      <li key={i}>{complaint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Post Form */}
      <Card>
        <CardHeader>
          <CardTitle>Share with your community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
              <option value="discussion">Discussion</option>
            </select>
            <select
              value={newPostPriority}
              onChange={(e) => setNewPostPriority(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <Textarea
            placeholder="What's happening in your area? Report issues, share suggestions, or start a discussion..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {userLocation?.address || "Getting location..."}
            </div>
            <Button onClick={handleNewPost} disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback
                      className={post.userType === "admin" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}
                    >
                      {post.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{post.userName}</h4>
                      {post.userType === "admin" && <Badge className="bg-blue-500 text-white text-xs">Official</Badge>}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span>{getDistanceFromUser(post.location)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPriorityColor(post.priority)} text-white`}>
                    {post.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    {getCategoryIcon(post.category)}
                    <span>{post.category}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{post.content}</p>

              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{post.location.address}</span>
              </div>

              {post.status && (
                <Badge
                  className={
                    post.status === "resolved"
                      ? "bg-green-500 text-white"
                      : post.status === "in-progress"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-500 text-white"
                  }
                >
                  {post.status.replace("-", " ").toUpperCase()}
                </Badge>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 ${
                      post.likes.includes(user.id) ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likes.includes(user.id) ? "fill-current" : ""}`} />
                    <span>{post.likes.length}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </Button>
                </div>
              </div>

              {/* Comments */}
              {post.comments.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className={
                            comment.userType === "admin"
                              ? "bg-blue-500 text-white text-xs"
                              : "bg-gray-500 text-white text-xs"
                          }
                        >
                          {comment.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{comment.userName}</span>
                          {comment.userType === "admin" && (
                            <Badge className="bg-blue-500 text-white text-xs">Official</Badge>
                          )}
                          <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Input */}
              <div className="flex space-x-2 pt-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyPress={(e) => e.key === "Enter" && handleComment(post.id)}
                />
                <Button size="sm" onClick={() => handleComment(post.id)} disabled={!commentInputs[post.id]?.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
