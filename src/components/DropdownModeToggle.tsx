"use client";

import { FC } from "react";
import { DropdownMenuItem } from "./ui/DropdownMenu";
import { Moon, Sun, Wallpaper } from "lucide-react";
import { useTheme } from "next-themes";

interface DropdownModeToggleProps {}

const DropdownModeToggle: FC<DropdownModeToggleProps> = ({}) => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuItem
      onClick={() =>
        setTheme(
          theme === "system" ? "dark" : theme === "dark" ? "light" : "system"
        )
      }
    >
      {theme === "system" ? (
        <Wallpaper className="mr-2 h-[1.2rem] w-[1.2rem]" />
      ) : theme === "dark" ? (
        <Moon className="mr-2 h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="mr-2 h-[1.2rem] w-[1.2rem]" />
      )}

      <span>{theme}</span>
    </DropdownMenuItem>
  );
};

export default DropdownModeToggle;
