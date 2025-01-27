"use client";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { button as buttonStyles, link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { Link as NextLink } from "@/i18n/routing";

export const Navbar = () => {
  const pathname = usePathname();

  console.log(pathname);

  const t = useTranslations("Navigation");

  return (
    <HeroUINavbar
      className="bg-transparent backdrop-saturate-100 backdrop-blur-none dark:bg-transparent"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1 text-foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">Health AI</p>
          </Link>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  item.href === pathname && "text-secondary font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {t(item.label)}
              </NextLink>
            </NavbarItem>
          ))}
          <Link
            isExternal
            className="text-foreground"
            href="http://www.vaccinesupport.co"
          >
            VaxSupport
          </Link>
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          {/*<Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>*/}
          {/*  <TwitterIcon className="text-default-500" />*/}
          {/*</Link>*/}
          {/*<Link isExternal aria-label="Discord" href={siteConfig.links.discord}>*/}
          {/*  <DiscordIcon className="text-default-500" />*/}
          {/*</Link>*/}

          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-2">
          <NextLink
            className={buttonStyles({
              color: "secondary",
              radius: "full",
              variant: "shadow",
            })}
            href="/sign-in"
          >
            {t("signIn")}
          </NextLink>
        </NavbarItem>
        {/*<NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>*/}
        {/*<NavbarItem className="hidden md:flex">*/}
        {/*  <Button*/}
        {/*    isExternal*/}
        {/*    as={Link}*/}
        {/*    className="text-sm font-normal text-default-600 bg-default-100"*/}
        {/*    href={siteConfig.links.sponsor}*/}
        {/*    startContent={<HeartFilledIcon className="text-danger" />}*/}
        {/*    variant="flat"*/}
        {/*  >*/}
        {/*    Sponsor*/}
        {/*  </Button>*/}
        {/*</NavbarItem>*/}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/*<Link isExternal aria-label="Github" href={siteConfig.links.github}>*/}
        {/*  <GithubIcon className="text-default-500" />*/}
        {/*</Link>*/}
        <ThemeSwitch />
        <NextLink
          className={buttonStyles({
            color: "secondary",
            radius: "full",
            variant: "shadow",
          })}
          href="/sign-in"
        >
          {t("signIn")}
        </NextLink>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/*{searchInput}*/}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                color={item.href === pathname ? "secondary" : "foreground"}
                href={item.href}
              >
                {t(item.label)}
              </NextLink>
            </NavbarMenuItem>
          ))}
          <Link
            isExternal
            className="text-foreground"
            href="http://www.vaccinesupport.co"
          >
            VaxSupport
          </Link>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
