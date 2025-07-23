import Logo from "../images/mainlogo.png";
import Logo1 from "../icons/Comic.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../ContextAPI/Auth";
import toast from "react-hot-toast";
import { Link as ScrollLink } from "react-scroll";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { GiNinjaHead } from "react-icons/gi";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ProfileIcon from "../icons/profileIcon.png";
import BookmarkIcon from "../icons/newbok.png";
import Avatar1 from "../icons/spiderman.png";
import Avatar2 from "../icons/dead.png";
import Avatar3 from "../icons/mask.png";
import Avatar4 from "../icons/ironman.png";
import Avatar5 from "../icons/antman.png";
import Avatar6 from "../icons/captain.png";

const avatarIcons = {
  1: <img src={Avatar1} alt="Avatar 1" className="h-9 w-9 rounded-full object-cover" />,
  2: <img src={Avatar2} alt="Avatar 2" className="h-9 w-9 rounded-full object-cover" />,
  3: <img src={Avatar3} alt="Avatar 3" className="h-9 w-9 rounded-full object-cover" />,
  4: <img src={Avatar4} alt="Avatar 4" className="h-9 w-9 rounded-full object-cover" />,
  5: <img src={Avatar5} alt="Avatar 5" className="h-9 w-9 rounded-full object-cover" />,
  6: <img src={Avatar6} alt="Avatar 6" className="h-9 w-9 rounded-full object-cover" />,
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    const loadingToast = toast.loading("Logging out...", {
      style: {
        borderRadius: "12px",
        background: "#FFF5E1",
        color: "#333",
        border: "1px solid #FF4C4C",
      },
    });

    try {
      logout();
      toast.success("Successfully logged out!", {
        id: loadingToast,
        style: {
          borderRadius: "12px",
          background: "#FFF5E1",
          color: "#333",
          border: "1px solid #00C897",
        },
      });

      setTimeout(() => {
        navigate("/");
        setMobileMenuOpen(false);
      }, 1500);
    } catch (error) {
      toast.error("Logout failed. Please try again.", {
        id: loadingToast,
        style: {
          borderRadius: "12px",
          background: "#FFF5E1",
          color: "#333",
          border: "1px solid #FF4C4C",
        },
      });
    }
  };

  return (
    <header style={{ backgroundColor: "#FFF5E1" }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 font-montserrat">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <div className="flex items-center space-x-3">
              <img src={Logo1} className="h-10 w-auto object-contain" alt="Site Logo" />
              <span className="text-base font-semibold text-[#333333]">Comic Ninja</span>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 p-2.5 text-[#333333]"
          >
            <Bars3Icon className="size-6" />
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link to="/" className="text-base font-semibold text-[#333333] hover:text-[#FF4C4C]">Home</Link>
          <ScrollLink to="aboutus" smooth duration={600} offset={-80} className="text-base font-semibold text-[#333333] cursor-pointer hover:text-[#FF4C4C]">About Us</ScrollLink>
          <Link to="/products" className="text-base font-semibold text-[#333333] hover:text-[#FF4C4C]">Comics</Link>
          <ScrollLink to="upcoming" smooth duration={600} offset={-80} className="text-base font-semibold text-[#333333] cursor-pointer hover:text-[#FF4C4C]">Upcoming</ScrollLink>
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end gap-4">
          {user ? (
            <>
              <Link to="/bookmark">
                <img src={BookmarkIcon} alt="Bookmarks" className="h-9 w-9 hover:opacity-80 transition" />
              </Link>

              <Popover className="relative">
                <PopoverButton className="flex items-center space-x-1 text-[#333333] hover:text-[#FF4C4C] focus:outline-none">
                  <div className="relative group">
                    <div className="h-9 w-9 rounded-full border-2 border-[#333333] bg-[#FFF5E1] flex items-center justify-center">
                      {avatarIcons[user?.avatar] || <GiNinjaHead className="h-6 w-6 text-[#333333]" />}
                    </div>
                    {user?.name && (
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-[#FFF5E1] text-[#333333] text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-50">
                        {user.name}
                      </div>
                    )}
                  </div>
                  <ChevronDownIcon className="h-5 w-5 text-[#333333]" />
                </PopoverButton>
                <PopoverPanel className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-[#FFF5E1] shadow-lg ring-1 ring-black/10">
                  <div className="py-1 text-sm text-[#333333]">
                    <Link to="/updateProfile" className="block px-4 py-2 hover:bg-[#FFDD00]">Update Profile</Link>
                    <Link to="/bookmark" className="block px-4 py-2 hover:bg-[#FFDD00]">Bookmarks</Link>
                    <Link to="/rentdetails" className="block px-4 py-2 hover:bg-[#FFDD00]">Rent Details</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-[#FFDD00] transition-colors">Logout</button>
                  </div>
                </PopoverPanel>
              </Popover>
            </>
          ) : (
            <Link to="/signUp" className="text-sm font-semibold text-[#333333] hover:text-[#FF4C4C]">
              Join Us <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-[#FFF5E1] px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <div className="flex items-center space-x-2">
                <img src={Logo} className="h-8 w-auto object-contain" alt="Site Logo" />
                <span className="text-sm font-semibold text-[#333333]">Comic Zone</span>
              </div>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="-m-2.5 p-2.5 text-[#333333]">
              <XMarkIcon className="size-6" />
            </button>
          </div>

          <div className="mt-6 divide-y divide-gray-300">
            <div className="flex flex-col space-y-4 py-6">
              <Link to="/" className="block rounded-lg px-3 py-2 font-semibold text-[#333333] hover:bg-[#FFDD00]" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/bookmark" className="block rounded-lg px-3 py-2 font-semibold text-[#333333] hover:bg-[#FFDD00]" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link to="/products" className="block rounded-lg px-3 py-2 font-semibold text-[#333333] hover:bg-[#FFDD00]" onClick={() => setMobileMenuOpen(false)}>Comics</Link>
              <Link to="/productsdetails" className="block rounded-lg px-3 py-2 font-semibold text-[#333333] hover:bg-[#FFDD00]" onClick={() => setMobileMenuOpen(false)}>Upcoming</Link>
            </div>

            <div className="py-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 px-3">
                    <div className="h-8 w-8 rounded-full border-2 border-[#333333] bg-[#FFF5E1] flex items-center justify-center">
                      {avatarIcons[user?.avatar] || <GiNinjaHead className="h-5 w-5 text-[#333333]" />}
                    </div>
                    <span className="text-[#333333] font-semibold">{user.name || "User"}</span>
                  </div>
                  <Link to="/updateProfile" className="block rounded-lg px-3 py-2 font-semibold text-[#333333] hover:bg-[#FFDD00]" onClick={() => setMobileMenuOpen(false)}>Update Profile</Link>
                  <Link to="/bookmark" className="block rounded-lg px-3 py-2 font-semibold text-[#333333] hover:bg-[#FFDD00]" onClick={() => setMobileMenuOpen(false)}>Bookmarks</Link>
                  <Link to="/rentdetails" className="block rounded-lg px-3 py-2 font-semibold text-[#333333] hover:bg-[#FFDD00]" onClick={() => setMobileMenuOpen(false)}>Rent Details</Link>
                  <button onClick={handleLogout} className="w-full text-left rounded-lg px-3 py-2 font-semibold text-[#333333] hover:bg-[#FFDD00] transition-colors">Logout</button>
                </div>
              ) : (
                <Link to="/signUp" className="block rounded-lg px-3 py-2.5 font-semibold text-[#333333] hover:bg-[#FF4C4C]" onClick={() => setMobileMenuOpen(false)}>Join Us</Link>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Header;
