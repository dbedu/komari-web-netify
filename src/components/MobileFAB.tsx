import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePublicInfo } from "@/contexts/PublicInfoContext";
import { IconButton, Flex, Separator } from "@radix-ui/themes";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import ThemeSwitch from "./ThemeSwitch";
import ColorSwitch from "./ColorSwitch";
import LanguageSwitch from "./Language";
import LoginDialog from "./Login";
import { useTranslation } from "react-i18next";

const MobileFAB = () => {
  const isMobile = useIsMobile();
  const { publicInfo } = usePublicInfo();
  const { t } = useTranslation();

  if (!isMobile) {
    return null;
  }

  return (
    <Drawer modal={false}>
      <DrawerTrigger asChild>
        <IconButton
          size="3"
          className="rounded-full shadow-lg"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
          }}
        >
          <HamburgerMenuIcon width="24" height="24" />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent className="p-6 max-h-[15vh]">
        <Flex gap="4" align="center" justify="center" className="w-full">
          <ThemeSwitch />
          <ColorSwitch />
          <LanguageSwitch />
          <Separator orientation="vertical" size="2" className="h-6" />
          <IconButton
            variant="soft"
            radius="full"
            onClick={() => {
              window.open("https://github.com/komari-monitor", "_blank");
            }}
          >
            <GitHubLogoIcon />
          </IconButton>
          {publicInfo?.private_site ? (
            <LoginDialog
              autoOpen={publicInfo?.private_site}
              info={t('common.private_site')}
              onLoginSuccess={() => {
                window.location.reload();
              }}
            />
          ) : (
            <LoginDialog />
          )}
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFAB;