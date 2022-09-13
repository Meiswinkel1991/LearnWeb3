import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NavListItems = (props) => {
  const router = useRouter();

  return (
    <>
      <Link href={props.path}>
        <li
          className={`cursor-pointer text-lg ${
            router.pathname === props.path ? "active-nav-btn" : ""
          }  `}
        >
          {props.name}
        </li>
      </Link>
    </>
  );
};

export default NavListItems;
