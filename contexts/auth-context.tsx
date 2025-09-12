"use client"

import { IUser } from "@/app/lib/model/user"
import { useRouter } from "next/navigation";
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface IssueFormatted {
  id: string;
  trackingNumber: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  contactEmail: string;
  contactPhone: string;
  images: string[];
  reportedBy: string;
  reportedAt: string;
  status: "reported" | "in-progress" | "resolved";
  userType: "user" | "admin";
  resolvedAt: string;
  resolvedBy: string;
}

export interface progress {
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
  status: string
  userType: string
  resolvedAt: string
  resolvedBy: string 
}

export interface Issue {
    user: User
    id:string,
    issue: string,
    category: string,
    priority: string,
    location: string,
    image?: string,
    description: string,
    email: string,
    phone?: string,
    status?:string,
}

interface User {
  id: string
  name: string
  email: string
  phone?: string
  userType: "user" | "admin"
  adminId?: string
  department?: string
  governmentId?: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
}

interface AuthContextType {
  Usera:User | null
  login: (email: string, password: string, userType?: "user" | "admin") => Promise<{ success: boolean; message: string }>
  signup: (
    name: string,
    email: string,
    password: string,
    userType: "user" | "admin",
    phone?: string,
    adminId?: string,
    department?: string,
    governmentId?: string,
    location?: { latitude: number; longitude: number; address: string },
  ) => Promise<{ success: boolean; message: string }> 
  logout: () => void
  isLoading: boolean
  reportIssue: (
        issue: string,
        category: string,
        priority: string,
        location: string,
        description: string,
        email: string,
        image?: string,
        phone?: string,
        status?:string,
  ) => Promise<{ success: boolean; message: string }>
        trackProgress: (email: string) => Promise<{
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
      status: "reported" | "in-progress" | "resolved",
      userType: "user" | "admin"
      resolvedAt: string
      resolvedBy: string
    }[]>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const VALID_ADMIN_IDS = [
  "JH0001", // Municipal Corporation
  "JH0002", // Municipal Corporation
  "JH0003", // Municipal Corporation
  "JH0004", // Municipal Corporation
  "JH0005", // Municipal Corporation
  "JH1001", // Public Works Department
  "JH1002", // Public Works Department
  "JH1003", // Public Works Department
  "JH2001", // Health Department
  "JH2002", // Health Department
  "JH3001", // Environment Department
  "JH3002", // Environment Department
  "JH4001", // Transportation Department
  "JH4002", // Transportation Department
]

const ADMIN_DEPARTMENTS = {
  JH00: "Municipal Corporation",
  JH10: "Public Works Department",
  JH20: "Health Department",
  JH30: "Environment Department",
  JH40: "Transportation Department",
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [Usera,setUser] = useState<IUser | null>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/cookie");
      const data = await res.json();
      setUser(data.user);
    };
    fetchUser();
  }, []);


  const login = async ( email: string, password: string, userType: "user" | "admin" = "user" ): 
  Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)
    if (userType === "admin") {
      const adminIdMatch = email.match(/JH\d{4}/)
      const adminId = adminIdMatch ? adminIdMatch[0] : null

      if (!adminId || !VALID_ADMIN_IDS.includes(adminId)) {
          setIsLoading(false)
          return { success: false, message:"Invalid Email"}
      }
      const prefix = adminId.substring(0, 4)
      const department = ADMIN_DEPARTMENTS[prefix as keyof typeof ADMIN_DEPARTMENTS] || "Municipal Corporation"

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, userType, adminId, department }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (!res.ok) {
          return { success: false, message: data.message || "Something went wrong" };
        }
        return { success: true, message: data.message || "Login Successfull"};

      } catch (error:any) {
        setIsLoading(false);
        console.log(error) //remove
        return { success: false, message: error.message};
      }
    } else {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, userType }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (!res.ok) {
          return { success: false, message: data.message || "Something went wrong" };
        }
        return { success: true, message: data.message || "Login Successfull"};

      } catch (error:any) {
        setIsLoading(false);
        console.log(error) //remove
        return { success: false, message: error.message};
      }
    }
  }


  const signup = async (
    name: string,
    email: string,
    password: string,
    userType: "user" | "admin",
    phone?: string,
    adminId?: string,
    department?: string,
    governmentId?: string,
    location?: { latitude: number; longitude: number; address: string },
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    if (userType === "admin") {
      const adminIdMatch = email.match(/JH\d{4}/);
      const derivedAdminId = adminIdMatch ? adminIdMatch[0] : null;

      if (!derivedAdminId || !VALID_ADMIN_IDS.includes(derivedAdminId)) {
        setIsLoading(false);
        return { success: false, message: "Invalid Email" };
      }

      if (!adminId || adminId !== derivedAdminId) {
        setIsLoading(false);
        return { success: false, message: "Invalid admin ID" };
      }

      const prefix = derivedAdminId.substring(0, 4) as keyof typeof ADMIN_DEPARTMENTS;
      const expectedDepartment = ADMIN_DEPARTMENTS[prefix];
      if (!department || department !== expectedDepartment) {
        setIsLoading(false);
        return { success: false, message: `Department must be "${expectedDepartment}" for this admin ID` };
      }

      if (password.length < 8) {
        setIsLoading(false);
        return { success: false, message: "Admin password must be at least 8 characters" };
      }
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          userType, 
          phone, 
          adminId,
          department, 
          governmentId, 
          location }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        return { success: false, message: data.message || "Something went wrong" };
      }
      return { success: true, message: data.message || "Signup Successfull"};

    } catch (err: any) {
      setIsLoading(false);
      console.log(err) //remove
      return { success: false, message: err.message};
    }
  };
  const logout:() => Promise<void> = async() => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null); 
      window.location.href = "/"
    } catch (error:any) {
      console.log(error)
    }
  }

  const reportIssue = async (
    issue: string,
    category: string,
    priority: string,
    location: string,
    description: string,
    email: string,
    image?: string,
    phone?: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
       if (!Usera?._id) {
        return { success: false, message: "User not loaded properly" };
      }
      const res = await fetch("/api/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user:Usera._id , 
          id:crypto.randomUUID(), 
          issue, 
          category, 
          priority, 
          location, 
          description, 
          email, 
          image,
          phone ,
          status:"in-progress"
        })
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return { success: false, message: data.message || "Failed to report issue" };
      }
      return { success: true, message: data.message || "Issue reported successfully" };
    } catch (err: any) {
      setIsLoading(false)
      console.log(err)
      return { success: false, message: err.message };
    }
  };



const trackProgress = async (email: string): Promise<IssueFormatted[]> => {
  try {
    const res = await fetch("/api/track-issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!data.issues) return [];

    const formatted: IssueFormatted[] = data.issues.map((issue: any) => ({
      id: issue.id,
      trackingNumber: issue.trackingNumber,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      location: issue.location,
      priority: issue.priority,
      contactEmail: issue.contactEmail,
      contactPhone: issue.contactPhone,
      images: Array.isArray(issue.images) ? issue.images : [issue.images],
      reportedBy: issue.reportedBy,
      reportedAt: issue.reportedAt,
      status: issue.status as "reported" | "in-progress" | "resolved",
      userType: issue.userType as "user" | "admin",
      resolvedAt: issue.resolvedAt,
      resolvedBy: issue.resolvedBy,
    }));
    return formatted;
    
  } catch (err) {
    console.error(err);
    return [];
  }
};



  return <AuthContext.Provider value={{ Usera, login, signup, logout,isLoading, reportIssue, trackProgress }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}