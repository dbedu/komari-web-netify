import * as React from "react";
import {
  Dialog,
  Flex,
  Text,
  TextField,
  Button,
  Box,
  IconButton,
} from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { TablerSettings } from "./Icones/Tabler";
import { AccountProvider, useAccount } from "@/contexts/AccountContext";
import { usePublicInfo } from "@/contexts/PublicInfoContext";

type LoginDialogProps = {
  trigger?: React.ReactNode | string;
  autoOpen?: boolean;
  showSettings?: boolean;
  info?: string | React.ReactNode;
  onLoginSuccess?: () => void;
};

const LoginDialog = ({ trigger, autoOpen = false, showSettings = true, info, onLoginSuccess }: LoginDialogProps) => {
  const InnerLayout = () => {
    const { account, loading, error, refresh } = useAccount();
    const [t] = useTranslation();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [twoFac, setTwoFac] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [require2FA, setRequire2FA] = React.useState(false);
    const [open, setOpen] = React.useState(autoOpen || false);
    const {publicInfo} = usePublicInfo();
    // Validate inputs
    const isFormValid = username.trim() !== "" && password.trim() !== "";
    console.log(autoOpen, open);
    React.useEffect(() => {
      if (autoOpen) {
        setOpen(true);
      }
    }, [autoOpen]);
    // Handle login
    const handleLogin = async () => {
      if (!isFormValid) {
        setErrorMsg("Username and password are required");
        return;
      }

      setErrorMsg("");
      setIsLoading(true);
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            ...(twoFac && !account?.["2fa_enabled"] ? { "2fa_code": twoFac } : {}),
          }),
        });
        const data = await res.json();
        if (res.status === 200) {
          refresh();
          if (typeof onLoginSuccess === "function") {
            onLoginSuccess();
            return
          }
          window.open("/admin", "_self");
        } else {
          if (data.message === "2FA code is required") {
            setRequire2FA(true);
            return;
          }
          setErrorMsg(data.message || "Login failed");
        }
      } catch (err) {
        setErrorMsg("Network error");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading && isFormValid) {
        e.preventDefault(); // Prevent form submission issues
        handleLogin();
      }
    };

    if (loading) {
      return <Button disabled>{t("loading")}</Button>;
    }
    if (error || !account) {
      return (
        <Button disabled color="red">
          Error
        </Button>
      );
    }
    if (account.logged_in) {
      if (!showSettings) {
        return null;
      }
      return (
        <a href="/admin" target="_blank">
          <IconButton>
            <TablerSettings></TablerSettings>
          </IconButton>
        </a>
      );
    }
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          {trigger ? trigger : <Button>{t("login.title")}</Button>}
        </Dialog.Trigger>
        <Dialog.Content 
          maxWidth="480px" 
          className="backdrop-blur-xl bg-background/95 border border-border/20 shadow-2xl rounded-2xl p-8"
        >
          <div className="text-center mb-6">
            <Dialog.Title className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent mb-2">
              {t("login.title")}
            </Dialog.Title>
            <Dialog.Description size="2" className="text-muted-foreground/80">
              <div className="flex justify-center flex-col gap-2">
                <span>{t("login.desc")}</span>
                {info && (
                  <span className="text-sm bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 mt-2">
                    {info}
                  </span>
                )}
              </div>
            </Dialog.Description>
          </div>

          <Box
            onSubmit={(e) => {
              e.preventDefault(); // Prevent native form submission
              if (isFormValid && !isLoading) {
                handleLogin();
              }
            }}
          >
            <Flex direction="column" gap="5">
              <div className="space-y-4">
                <label className="block">
                  <Text as="div" size="2" mb="2" weight="medium" className="text-foreground/90">
                    {t("login.username")}
                  </Text>
                  <TextField.Root
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="admin"
                    disabled={isLoading}
                    autoFocus // Focus on username by default
                    className="w-full"
                  />
                </label>
                
                <label className="block">
                  <Text as="div" size="2" mb="2" weight="medium" className="text-foreground/90">
                    {t("login.password")}
                  </Text>
                  <TextField.Root
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="password"
                    placeholder={t("login.password_placeholder")}
                    disabled={isLoading}
                    className="w-full"
                  />
                </label>
                
                <label className={`block transition-all duration-200 ${!require2FA ? 'hidden opacity-0' : 'opacity-100'}`}>
                  <Text as="div" size="2" mb="2" weight="medium" className="text-foreground/90">
                    {t("login.two_factor")}
                  </Text>
                  <TextField.Root
                    value={twoFac}
                    onChange={(e) => setTwoFac(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="000000"
                    disabled={isLoading}
                    className="w-full font-mono text-center tracking-widest"
                  />
                </label>
              </div>

              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 animate-in slide-in-from-top duration-200">
                  <Text as="div" size="2" className="text-destructive font-medium text-center">
                    {errorMsg}
                  </Text>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  onClick={handleLogin}
                  className="w-full"
                  size="3"
                >
                  {isLoading ? "Logging in..." : t("login.title")}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground/60">or</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    window.location.href = "/api/oauth";
                  }}
                  variant="outline"
                  disabled={isLoading}
                  type="button"
                  className="w-full"
                  size="3"
                >
                  {t(
                    "login.login_with",
                    {
                      provider:
                        publicInfo?.oauth_provider === "generic"
                          ? "OAuth"
                          : publicInfo?.oauth_provider
                            ? publicInfo.oauth_provider.charAt(0).toUpperCase() + publicInfo.oauth_provider.slice(1)
                            : ""
                    }
                  )}
                </Button>
              </div>
            </Flex>
          </Box>
        </Dialog.Content>
      </Dialog.Root>
    );
  };
  return (
    <AccountProvider>
      <InnerLayout />
    </AccountProvider>
  );
};

export default LoginDialog;
