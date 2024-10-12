

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="flex justify-between items-center p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <Image src="/code-lab.png" alt="Logo" height={35} width={35} />
        <p className="font-bold text-2xl hidden sm:block">CodeKepper</p>
      </div>
      <div className="flex items-center gap-2">
      <Link href="/new" className="ml-4 text-lg">
          <Button>
          <div className="flex items-center gap-2">
            <Plus/> new snippet
          </div>
          </Button>
        </Link>
        <UserButton/>
      </div>
      
    </header>
  );
};

export default DashboardHeader;