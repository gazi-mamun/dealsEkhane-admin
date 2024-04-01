import React from "react";
import styles from "../styles/CountCard.module.scss";
import { useRouter } from "next/router";

const CountCard = ({ title, count, linkText, icon }) => {
  const router = useRouter();

  const handleClick = () => {
    if (linkText === "See all users") router.push("/users");
    if (linkText === "See all stores") router.push("/stores");
    if (linkText === "See all offers" || linkText === "See all offers")
      router.push("/offers");
    if (linkText === "View net earning") router.push("/receipts");
    if (linkText === "See all reports") router.push("/reports");
  };

  return (
    <div className={styles.countCard}>
      <h6 className="boxTitle">{title}</h6>
      <h2>{count}</h2>
      <div className={styles.cardBottom}>
        <p onClick={handleClick}>{linkText}</p>
        {icon}
      </div>
    </div>
  );
};

export default CountCard;
