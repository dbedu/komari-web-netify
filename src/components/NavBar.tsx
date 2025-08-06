import ThemeSwitch from "./ThemeSwitch";
import ColorSwitch from "./ColorSwitch";
import LanguageSwitch from "./Language";
import LoginDialog from "./Login";
import { IconButton, Flex, Box, Separator } from "@radix-ui/themes";
import { GitHubLogoIcon, HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { usePublicInfo } from "@/contexts/PublicInfoContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const NavBar = () => {
  const { publicInfo } = usePublicInfo();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
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

            <div className="flex items-center gap-2">
              <ThemeSwitch />
              <ColorSwitch />
              <LanguageSwitch />
            </div>
            
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
        
        {/* Mobile menu button - only show on mobile */}
        {isMobile && (
          <button 
            data-accent-color="" 
            className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-ghost rt-IconButton transition-all duration-200 hover:scale-105 hover:shadow-md rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
          </button>
        )}
      </nav>
      
      {/* Mobile menu dropdown - only show on mobile */}
      {isMobile && mobileMenuOpen && (
        <Box className="fixed top-16 right-0 left-0 z-40 bg-background/98 backdrop-blur-xl shadow-2xl p-6 border-t border-border/30 rounded-t-3xl animate-in slide-in-from-top duration-300">
          <Flex direction="column" gap="4" align="center">
            <Flex gap="3" className="w-full justify-center">
              <ThemeSwitch />
              <ColorSwitch />
              <LanguageSwitch />
            </Flex>
            
            <div className="w-full h-px bg-border/20 my-1"></div>
            
            <Flex gap="3" className="w-full justify-center">
              <IconButton
                variant="soft"
                radius="full"
                className="transition-all duration-200 hover:scale-105 hover:shadow-md"
                onClick={() => {
                  window.open("https://github.com/komari-monitor", "_blank");
                  setMobileMenuOpen(false);
                }}
              >
                <GitHubLogoIcon />
              </IconButton>
              
              {publicInfo?.private_site ? (
                <LoginDialog
                  autoOpen={publicInfo?.private_site}
                  info={t('common.private_site')}
                  onLoginSuccess={() => { window.location.reload(); }}
                />
              ) : (
                <LoginDialog />
              )}
            </Flex>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default NavBar;
