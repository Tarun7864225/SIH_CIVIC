// // Local Storage

// function getDepartmentFromAdminId(adminId: string): string {
//   const prefix = adminId.substring(0, 4)
//   return ADMIN_DEPARTMENTS[prefix as keyof typeof ADMIN_DEPARTMENTS] || "Municipal Corporation"
// }

// const getRegisteredUsers = (): User[] => {
//   const users = localStorage.getItem("civic-registered-users")
//   return users ? JSON.parse(users) : []
// }

// const saveRegisteredUser = (user: User) => {
//   const users = getRegisteredUsers()
//   users.push(user)
//   localStorage.setItem("civic-registered-users", JSON.stringify(users))
// }

// const isEmailTaken = (email: string): boolean => {
//   const users = getRegisteredUsers()
//   return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
// }

// const isGovernmentIdTaken = (govId: string): boolean => {
//   const users = getRegisteredUsers()
//   return users.some((user) => user.governmentId === govId)
// }

// //

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const savedUser = localStorage.getItem("civic-user")
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//     setIsLoading(false)
//   }, [])