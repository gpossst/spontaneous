import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="https://utfs.io/f/7tcovZG9cuXOz3XntZF79TG2aYwEFusinCNXAyM8Dt1vpoxq"
        alt="Logo"
        width={60}
        height={60}
        className="rounded-lg"
        priority
      />
    </Link>
  );
}
