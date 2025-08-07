import ThemeSwitch from "./ThemeSwitch";
import ColorSwitch from "./ColorSwitch";
import LanguageSwitch from "./Language";
import LoginDialog from "./Login";
import { IconButton, Separator } from "@radix-ui/themes";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { usePublicInfo } from "@/contexts/PublicInfoContext";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { DrawerMenuContext } from "@/contexts/DrawerMenuContext";
import { useState } from "react";
const NavBar = () => {
  const { publicInfo } = usePublicInfo();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <>
      <nav className="nav-bar flex rounded-b-2xl items-center gap-4 max-h-16 justify-end min-w-full p-3 px-6 sticky top-0 z-50 backdrop-blur-xl bg-background/95 shadow-lg border-b border-border/20">
        <div className="mr-auto flex items-center">
          {/* <img src="/assets/logo.png" alt="Komari Logo" className="w-10 object-cover mr-2 self-center"/> */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              {publicInfo?.sitename}
            </span>
          </Link>
          <div className="hidden flex-row items-end md:flex ml-2">
            <Separator orientation="vertical" size="2" className="mx-2 h-6" />
            <span
              className="text-base font-medium"
              style={{ color: "var(--accent-9)" }}
            >
              Komari Monitor
            </span>
          </div>
        </div>

        {/* Desktop menu - only show on desktop */}
        {!isMobile && (
          <div className="flex items-center gap-3">
            <IconButton
              variant="soft"
              radius="full"
              className="transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => {
                window.open("https://github.com/komari-monitor", "_blank");
              }}
            >
              <GitHubLogoIcon />
            </IconButton>

            <DrawerMenuContext.Provider value={{ openMenu, setOpenMenu }}>
              <div className="flex items-center gap-2">
                <ThemeSwitch />
                <ColorSwitch />
                <LanguageSwitch />
              </div>
            </DrawerMenuContext.Provider>

            {publicInfo?.private_site ? (
              <LoginDialog
                autoOpen={publicInfo?.private_site}
                info={t('common.private_site')}
                onLoginSuccess={() => { window.location.reload(); }}
              />
            ) : (
              <LoginDialog />
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default NavBar;
