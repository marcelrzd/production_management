import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Logo from "../img/logo.png";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between w-full bg-[#0A192F]">
      <div className="flex items-center ml-6">
        <FontAwesomeIcon icon={faBars} className="w-8 h-8 mr-3 text-white" />
        <Link href={"/"} className="ml-6 text-2xl text-white">
          <Image color="white" src={Logo} alt="logo" height={100} width={100} />
        </Link>
      </div>
      <ul className="flex items-center gap-8 mr-6">
        <li>
          <div className="flex items-center justify-center w-12 h-12 text-[#0A192F] bg-white rounded-full">
            MR
          </div>
        </li>
      </ul>
    </nav>
  );
}
