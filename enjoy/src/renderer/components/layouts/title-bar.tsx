import {
  AppSettingsProviderContext,
  CopilotProviderContext,
} from "@/renderer/context";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@renderer/components/ui";
import { IpcRendererEvent } from "electron/renderer";
import { t } from "i18next";
import {
  ExternalLinkIcon,
  HelpCircleIcon,
  LightbulbIcon,
  LightbulbOffIcon,
  MaximizeIcon,
  MenuIcon,
  MinimizeIcon,
  MinusIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

export const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [platform, setPlatform] = useState<"darwin" | "win32" | "linux">();

  const { EnjoyApp, setDisplayPreferences, initialized } = useContext(
    AppSettingsProviderContext
  );
  const { active, setActive } = useContext(CopilotProviderContext);

  const onWindowChange = (
    _event: IpcRendererEvent,
    state: { event: string }
  ) => {
    if (state.event === "maximize") {
      setIsMaximized(true);
    } else if (state.event === "unmaximize") {
      setIsMaximized(false);
    } else if (state.event === "enter-full-screen") {
      setIsFullScreen(true);
    } else if (state.event === "leave-full-screen") {
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    EnjoyApp.window.onChange(onWindowChange);
    EnjoyApp.app.getPlatformInfo().then((info) => {
      setPlatform(info.platform as "darwin" | "win32" | "linux");
    });

    return () => {
      EnjoyApp.window.removeListener(onWindowChange);
    };
  }, []);

  return (
    <div className="z-[100] h-8 w-full bg-muted draggable-region flex items-center justify-between border-b">
      <div className="flex items-center px-2">
        {platform === "darwin" && !isFullScreen && <div className="w-16"></div>}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-none non-draggable-region hover:bg-primary/10"
            >
              <img src="./assets/icon.png" alt="Enjoy" className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom">
            <DropdownMenuItem
              onClick={() => EnjoyApp.app.reload()}
              className="cursor-pointer"
            >
              <span className="capitalize">{t("reloadApp")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => EnjoyApp.window.close()}
              className="cursor-pointer"
            >
              <span className="capitalize">{t("exit")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {initialized && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-none non-draggable-region hover:bg-primary/10"
            onClick={() => setDisplayPreferences(true)}
          >
            <SettingsIcon className="size-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-none non-draggable-region hover:bg-primary/10"
            >
              <HelpCircleIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
            side="top"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() =>
                  EnjoyApp.shell.openExternal("https://1000h.org/enjoy-app/")
                }
                className="flex justify-between space-x-4"
              >
                <span className="min-w-fit capitalize">{t("userGuide")}</span>
                <ExternalLinkIcon className="size-4" />
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="non-draggable-region">
                  <span className="capitalize">{t("feedback")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() =>
                        EnjoyApp.shell.openExternal(
                          "https://mixin.one/codes/f6ff96b8-54fb-4ad8-a6d4-5a5bdb1df13e"
                        )
                      }
                      className="flex justify-between space-x-4"
                    >
                      <span>Mixin</span>
                      <ExternalLinkIcon className="size-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        EnjoyApp.shell.openExternal(
                          "https://github.com/zuodaotech/everyone-can-use-english/discussions"
                        )
                      }
                      className="flex justify-between space-x-4"
                    >
                      <span>Github</span>
                      <ExternalLinkIcon className="size-4" />
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                EnjoyApp.shell.openExternal(
                  "https://1000h.org/enjoy-app/install.html"
                )
              }
              className="cursor-pointer"
            >
              <span className="capitalize">{t("checkUpdate")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {initialized && (
            <Button
              variant="ghost"
              size="icon"
              className={`size-8 rounded-none non-draggable-region hover:bg-primary/10 ${
                active ? "bg-primary/10" : ""
              }`}
              onClick={() => setActive(!active)}
            >
              {active ? (
                <LightbulbIcon className="size-4" />
              ) : (
                <LightbulbOffIcon className="size-4" />
              )}
            </Button>
          )}
        </div>

        {platform !== "darwin" && (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-none non-draggable-region hover:bg-primary/10"
              onClick={() => EnjoyApp.window.minimize()}
            >
              <MinusIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-none non-draggable-region hover:bg-primary/10"
              onClick={() => EnjoyApp.window.toggleMaximized()}
            >
              {isMaximized ? (
                <MinimizeIcon className="size-4" />
              ) : (
                <MaximizeIcon className="size-4" />
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-none non-draggable-region hover:bg-destructive"
                >
                  <XIcon className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("quitApp")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("quitAppDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => EnjoyApp.window.close()}
                  >
                    {t("quit")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};
