"use client";

import { FC } from "react";
import { DropdownMenuItem } from "./ui/DropdownMenu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface DropdownModeToggleProps {}

const DropdownModeToggle: FC<DropdownModeToggleProps> = ({}) => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuItem
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span>{theme}</span>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </DropdownMenuItem>
  );
};

export default DropdownModeToggle;
