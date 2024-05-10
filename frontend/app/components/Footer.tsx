import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-2 text-center text-white bg-[#0A192F]">
      <p>
        © 2024 <Link href={"https://github.com/marcelrzd"}>Marcel</Link>
      </p>
    </footer>
  );
}
