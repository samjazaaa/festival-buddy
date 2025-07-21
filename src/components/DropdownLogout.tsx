import { FC } from "react";
import { DropdownMenuItem } from "./ui/DropdownMenu";
import { Power } from "lucide-react";
import { signOut } from "@/auth";

interface DropdownLogoutProps {}

const DropdownLogout: FC<DropdownLogoutProps> = ({}) => {
  return (
    <DropdownMenuItem>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="flex items-center">
          <Power className="h-[1.2rem] w-[1.2rem] mr-2" />
          <div>Sign Out</div>
        </button>
      </form>
    </DropdownMenuItem>
  );
};

export default DropdownLogout;
