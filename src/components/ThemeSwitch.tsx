import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useContext, type ReactNode } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { SunIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

interface ThemeSwitchProps {
  icon?: ReactNode;
  content?: {
    light?: ReactNode;
    dark?: ReactNode;
    system?: ReactNode;
  };
}

const ThemeSwitch = ({
  icon = (
    <IconButton
      variant="soft"
      radius="full"
      className="transition-all duration-200 hover:scale-105 hover:shadow-md backdrop-blur-sm"
    >
      <SunIcon />
    </IconButton>
  ),
}: ThemeSwitchProps = {}) => {
  const { setAppearance } = useContext(ThemeContext);
  const [t] = useTranslation();
  return (
    <DropdownMenu.Root modal={true}>
      <DropdownMenu.Trigger>{icon}</DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="backdrop-blur-xl bg-background/95 border border-border/20 shadow-2xl rounded-2xl p-2 min-w-[140px] z-[51]"
        sideOffset={4}
      >
        <DropdownMenu.Item
          onSelect={() => setAppearance("light")}
          className="rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:text-accent-foreground cursor-pointer focus:bg-accent/10 focus:text-accent-foreground outline-none"
        >
          {t("theme.light", "Light")}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onSelect={() => setAppearance("dark")}
          className="rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:text-accent-foreground cursor-pointer focus:bg-accent/10 focus:text-accent-foreground outline-none"
        >
          {t("theme.dark", "Dark")}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onSelect={() => setAppearance("system")}
          className="rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:text-accent-foreground cursor-pointer focus:bg-accent/10 focus:text-accent-foreground outline-none"
        >
          {t("theme.system", "System")}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ThemeSwitch;
