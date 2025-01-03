import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Store, User, LogIn, LogOut } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/MobileMenu";
import ProfileMenu from "./navigation/ProfileMenu";
import VendorMenu from "./navigation/VendorMenu";
import AuthButtons from "./navigation/AuthButtons";
import type { MenuItem, SubMenuItem } from "./navigation/types";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "CRM", path: "/crm" },
    { name: "Blogs", path: "/blogs" },
    { name: "Streaming", path: "/streaming" },
    { name: "Contact", path: "/contact" },
  ];

  const vendorSubmenu: SubMenuItem[] = [
    { name: "All Vendors", path: "/vendors", icon: <Store className="h-4 w-4 mr-2" /> },
    { name: "Vendor Profile", path: "/vendors/profile", icon: <User className="h-4 w-4 mr-2" /> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const profileSubmenu: SubMenuItem[] = [
    { name: "Profile", path: "/profile", icon: <User className="h-4 w-4 mr-2" /> },
    { 
      name: "Logout", 
      path: "#", 
      icon: <LogOut className="h-4 w-4 mr-2" />,
      onClick: handleLogout 
    },
  ];

  const authItems: SubMenuItem[] = [
    { name: "Login", path: "/login", icon: <LogIn className="h-4 w-4" /> },
    { name: "Register", path: "/register", icon: <User className="h-4 w-4" /> },
  ];

  const renderAuthItems = () => {
    if (session) {
      return <ProfileMenu profileSubmenu={profileSubmenu} />;
    }
    return <AuthButtons authItems={authItems} />;
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-heading font-bold text-primary">Bmarchai</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <VendorMenu vendorSubmenu={vendorSubmenu} />
            {renderAuthItems()}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isOpen}
        menuItems={menuItems}
        vendorSubmenu={vendorSubmenu}
        profileSubmenu={profileSubmenu}
        authItems={authItems}
        onClose={() => setIsOpen(false)}
        session={!!session}
      />
    </nav>
  );
};

export default Navigation;