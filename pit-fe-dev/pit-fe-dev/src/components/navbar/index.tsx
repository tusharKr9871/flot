"use client";

import { useAuth } from "@/context/AuthContextProvider";
import { useFetchCustomer } from "@/hooks/customer-api";
import Link from "next/link";
import { useState } from "react";
import { IoCloseOutline, IoMenu } from "react-icons/io5";
import Image from "next/image";
import { getCustomerInitials } from "@/utils/util-functions";
import { TbUser } from "react-icons/tb";
import { useRouter } from "next/navigation";
import LogoImage from "../../../public/logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { customerData, isFetchingCustomerData } = useFetchCustomer({
    userToken: user?.token || "",
  });

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();

  return (
    <div className="flex items-center justify-between sm:flex-row flex-col fixed bg-white w-full py-3 md:px-24 px-6 z-40 shadow-md">
      <div className="flex flex-row items-center">
        <Link href="/" aria-label="logo-image">
          <span className={"lg:inline-flex items-center hidden"}>
            <Image
              src={LogoImage}
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "60%", height: "60%" }}
            />
          </span>
        </Link>
{/*         <Link
          href="/"
          className="text-3xl text-primaryColor font-medium sm:flex hidden"
        >
          paisaintime
        </Link> */}
      </div>
     <div className="sm:hidden w-full flex items-center justify-between">
        <Link href="/">
          <span className="flex items-center cursor-pointer">
            <Image
              src={LogoImage}
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "60%",
                height: "60%",
              }}
            />
          </span>
        </Link>
        <button
          onClick={toggleNavbar}
          className="text-white focus:outline-none mb-1"
          aria-label="menu-button"
        >
          {isOpen ? (
            <IoCloseOutline className="text-primaryColor w-8 h-8" />
          ) : (
            <IoMenu className="text-primaryColor w-8 h-8" />
          )}
        </button>
      </div>

      <nav
        className={`${
          isOpen ? "flex-1 w-full" : "hidden"
        } sm:flex sm:items-center sm:w-auto`}
      >
        <ul className="navbar flex sm:items-center items-end text-base font-medium text-gray-800 sm:flex-grow sm:flex-row flex-col w-full">
          <li className="sm:mr-5 sm:mb-0 mb-2">
            <Link href="/">Home</Link>
          </li>
          <li className="sm:mr-5 sm:mb-0 mb-2">
            <Link href="/repay">Repay Loan</Link>
          </li>
          <li className="sm:mr-5 sm:mb-0 mb-2">
            <Link href="/blogs">Blogs</Link>
          </li>
          <li className="sm:mr-5 sm:mb-0 mb-4">
            <Link href="/grievance">Grievance</Link>
          </li>
          <li className="">
            {isFetchingCustomerData ? (
              <div className="animate-pulse">
                <div className="h-10 w-10 rounded-full b-2 border-black bg-gray-400 flex items-center justify-center">
                  <span className="text-2xl">
                    <TbUser />
                  </span>
                </div>
              </div>
            ) : user?.token ? (
              <div className="flex flex-col text-sm md:items-end items-start cursor-pointer relative">
                <div
                  className="h-10 w-10"
                  onClick={() => setMenuIsOpen((prev) => !prev)}
                >
                  {customerData?.customerPicture ? (
                    <div className="rounded-full b-2 border-black h-full w-full flex items-center justify-center">
                      <Image
                        src={customerData.customerPicture}
                        alt="customer-profile-picture"
                        height={0}
                        width={0}
                        sizes="100vw"
                        style={{ width: "100%", borderRadius: "100%" }}
                      />
                    </div>
                  ) : (
                    <div className="rounded-full b-2 border-black  h-full w-full bg-gray-600 flex items-center justify-center">
                      <p className="text-white font-bold text-base">
                        {getCustomerInitials(customerData?.customerName || "")}
                      </p>
                    </div>
                  )}
                </div>
                {menuIsOpen && (
                  <div className="absolute top-10 -left-36">
                    <ul className="w-48 text-sm font-normal text-gray-900 bg-white border border-gray-200 rounded-lg">
                      <li
                        className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg flex flex-row items-center"
                        onClick={() => {
                          router.push(`/customer_profile/${user.id}`);
                          setMenuIsOpen(false);
                        }}
                      >
                        Profile
                      </li>
                      <li
                        className="w-full px-4 py-2 rounded-b-lg flex flex-row items-center"
                        onClick={logout}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/apply">
                <div className="text-white md:py-2 py-1 md:w-32 w-24 md:text-base text-sm font-medium rounded-full flex items-center justify-center bg-primaryColor cursor-pointer">
                  Apply Now
                </div>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
