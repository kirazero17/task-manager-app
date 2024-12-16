import { Link } from "react-router-dom";
import {
  Target,
  BriefcaseBusiness,
  Search,
  Settings,
  ChevronUp,
} from "lucide-react";

// Import components
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "src/components/ui/sidebar";
import { NavUser } from "./nav-user";

// Menu items.
const items = [
  {
    title: "Your tasks",
    url: "/tasks",
    icon: BriefcaseBusiness,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="/logo.svg" />
            <AvatarFallback className="rounded-lg">App</AvatarFallback>
          </Avatar>
          <div className="truncate grid flex-1 text-left text-sm leading-tight">
            <h1 className="font-bold">Task Manager</h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Accessibles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
