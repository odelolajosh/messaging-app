export type NavObjectMap = { [Key: string]: { url: string, icon: string, label: string } }

export const NavLinks: NavObjectMap = {
    // home: { url: "/in/feeds", icon: "home", label: "home"  },
    chat: { url: "/in/chats", icon: "message-square", label: "chat" },
    notification: { url: "/in/bell", icon: "bell", label: "notification" },
    setting: { url: "/in/settings", icon: "settings", label: "settings" }
}