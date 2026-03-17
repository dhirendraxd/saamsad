"use client";

import * as React from "react";
import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { cn } from "@/lib/utils";

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
}

interface NavigateOptions {
  replace?: boolean;
}

interface NavigateProps {
  to: string;
  replace?: boolean;
}

interface NavLinkProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, replace, scroll, prefetch, ...props }, ref) => {
    return (
      <NextLink ref={ref} href={to} replace={replace} scroll={scroll} prefetch={prefetch} {...props} />
    );
  },
);

Link.displayName = "Link";

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, to, replace, scroll, prefetch, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === to;

    return (
      <NextLink
        ref={ref}
        href={to}
        replace={replace}
        scroll={scroll}
        prefetch={prefetch}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

function useNavigate() {
  const router = useRouter();

  return React.useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        if (to < 0) {
          router.back();
          return;
        }

        if (to > 0) {
          router.forward();
        }

        return;
      }

      if (options?.replace) {
        router.replace(to);
        return;
      }

      router.push(to);
    },
    [router],
  );
}

function useLocation() {
  const pathname = usePathname();

  return React.useMemo(
    () => ({ pathname, search: "", hash: "" }),
    [pathname],
  );
}

function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  const params = useNextParams();

  return React.useMemo(() => {
    return Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
    ) as T;
  }, [params]);
}

function Navigate({ to, replace }: NavigateProps) {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

export { Link, NavLink, Navigate, useLocation, useNavigate, useParams };