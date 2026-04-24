// constants/navigation.js
import { LayoutDashboard, Car, MapPin, Home, Map, History, User, Settings, CarIcon, BarChart2, Users} from 'lucide-react';

export const ADMIN_MENU = [
 { id: "dashboard", label: "Dashboard", Icon: Home },
  { id: "fleet", label: "Fleet Inventory", Icon: CarIcon },
  { id: "health", label: "Maintainence and Health", Icon: BarChart2 },
  { id: "settings", label: "Settings", Icon: Settings},
  { id: "users", label: "User Management", Icon: Users },
];



export const USER_MENU = [
{ id: 'dashboard', label: 'Dashboard', Icon: Home },
  { id: 'booktrip', label: 'Book Trip', Icon: Map },
  { id: 'mytrip', label: 'My Trips', Icon: History },
  { id: 'profile', label: 'Profile', Icon: User },
];


