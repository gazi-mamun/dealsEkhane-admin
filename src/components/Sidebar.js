import React from "react";
import styles from "../styles/Sidebar.module.scss";
import Image from "next/image";
import {
  RiStore3Fill,
  RiNotification4Fill,
  RiDashboardFill,
  RiLogoutBoxFill,
  RiCloseFill,
  RiAdvertisementFill,
} from "react-icons/ri";
import { MdLocalOffer, MdPayment } from "react-icons/md";
import { TbReportOff } from "react-icons/tb";
import { BsReceiptCutoff } from "react-icons/bs";
import { PiUsersThreeFill } from "react-icons/pi";
import Link from "next/link";
import axios from "../axios";
import { useGlobalContext } from "@/context";
import { useRouter } from "next/router";

const Sidebar = ({ setIsSidebarOpen }) => {
  const { user, setUser, hasUnread } = useGlobalContext();
  const router = useRouter();

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.get("/users/logout");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.log(error.response);
    }
  };

  const getClass = (name) => {
    if (router.pathname === name) return `${styles.activeLink}`;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.closeBtn}>
        <RiCloseFill
          size={20}
          className={styles.closeIcon}
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>
      <div className={styles.logo}>
        <Image
          src="/images/logowhite1-2.png"
          alt="DealsEkhane"
          width={180}
          height={58}
          priority
        />
      </div>
      {/* top */}
      <div className={styles.top}>
        <ul className={styles.sideNav}>
          <Link href={"/"} passHref>
            <li onClick={handleLinkClick} className={getClass("/")}>
              <RiDashboardFill size={18} />
              <p>Dashboard</p>
            </li>
          </Link>
          <Link href={"/users"} passHref>
            <li onClick={handleLinkClick} className={getClass("/users")}>
              <PiUsersThreeFill size={19} />
              <p>Users</p>
            </li>
          </Link>
          <Link href={"/stores"} passHref>
            <li onClick={handleLinkClick} className={getClass("/stores")}>
              <RiStore3Fill size={19} />
              <p>Stores</p>
            </li>
          </Link>
          <Link href={"/offers"} passHref>
            <li onClick={handleLinkClick} className={getClass("/offers")}>
              <MdLocalOffer size={19} />
              <p>Offers</p>
            </li>
          </Link>
          {/* <Link href={"/advertisements"} passHref>
            <li onClick={handleLinkClick} className={getClass()}>
              <RiAdvertisementFill size={19} />
              <p>Advertisements</p>
            </li>
          </Link> */}
          <Link href={"/payments"} passHref className={getClass("/payments")}>
            <li onClick={handleLinkClick}>
              <MdPayment size={19} />
              <p>Payments</p>
            </li>
          </Link>
          <Link href={"/receipts"} passHref>
            <li onClick={handleLinkClick} className={getClass("/receipts")}>
              <BsReceiptCutoff size={17} />
              <p>Receipts</p>
            </li>
          </Link>
          <Link href={"/reports"} passHref>
            <li onClick={handleLinkClick} className={getClass("/reports")}>
              <TbReportOff size={20} />
              <p>Reports</p>
            </li>
          </Link>
        </ul>
      </div>
      {/* bottom */}
      <div className={styles.bottom}>
        <Link href={"/profile"} passHref>
          <div className={styles.bottomTop}>
            <Image
              src="/images/default-avatar.png"
              alt="DealsEkhane"
              width={50}
              height={50}
              priority
            />
            <div>
              <p>{user?.username}</p>
              <p>
                <span>{user?.role}</span>
              </p>
            </div>
          </div>
        </Link>
        <ul className={styles.sideNav}>
          <Link href={"/profile"} passHref>
            <li>
              <RiNotification4Fill
                size={19}
                className={hasUnread && styles.notiLight}
              />
              <p>Notifications</p>
            </li>
          </Link>
          <li onClick={handleLogout}>
            <RiLogoutBoxFill size={19} />
            <p>Logout</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
