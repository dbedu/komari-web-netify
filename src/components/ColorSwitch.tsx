import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";
import { useContext, type ReactNode } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { BlendingModeIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

interface ColorSwitchProps {
  icon?: ReactNode;
}

const ColorSwitch = ({
  icon = (
    <IconButton
      variant="soft"
      radius="full"
      className="transition-all duration-200 hover:scale-105 hover:shadow-md backdrop-blur-sm"
    >
      <BlendingModeIcon />
    </IconButton>
  ),
}: ColorSwitchProps = {}) => {
  const { setColor } = useContext(ThemeContext);
  const { t } = useTranslation();

  const colorItems = [
    "gray", "gold", "bronze", "brown", "yellow", "amber", "orange", "tomato",
    "red", "ruby", "crimson", "pink", "plum", "purple", "violet", "iris",
    "indigo", "blue", "cyan", "teal", "jade", "green", "grass", "lime", "mint", "sky"
  ] as const;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
          {icon}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="backdrop-blur-xl bg-background/95 border border-border/20 shadow-2xl rounded-2xl p-2 min-w-[160px] max-h-[320px] overflow-y-auto z-"
        sideOffset={8}
      >
        {colorItems.map((color) => (
          <DropdownMenu.Item
            key={color}
            onSelect={() => setColor(color)}
            className="rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:text-accent-foreground cursor-pointer focus:bg-accent/10 focus:text-accent-foreground outline-none flex items-center gap-2"
          >
            <div
              className={`w-3 h-3 rounded-full border border-border/30 flex-shrink-0`}
              style={{ backgroundColor: `var(--${color}-9)` }}
            />
            <Text color={color} className="flex-1">
              {t(`color.${color}`)}
            </Text>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ColorSwitch;
