import * as React from "react";
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  Navigate as RouterNavigate,
  useLocation as useRouterLocation,
  useNavigate as useRouterNavigate,
  useParams as useRouterParams,
} from "react-router-dom";
import { cn } from "@/lib/utils";

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  replace?: boolean;
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

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, replace, ...props }, ref) => {
  return <RouterLink ref={ref} to={to} replace={replace} {...props} />;
});

Link.displayName = "Link";

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, to, replace, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        replace={replace}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

function useNavigate() {
  const navigate = useRouterNavigate();

  return React.useCallback(
    (to: string | number, options?: NavigateOptions) => {
      navigate(to as never, options as never);
    },
    [navigate],
  );
}

function useLocation() {
  return useRouterLocation();
}

function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  return useRouterParams() as T;
}

function Navigate({ to, replace }: NavigateProps) {
  return <RouterNavigate to={to} replace={replace} />;
}

export { Link, NavLink, Navigate, useLocation, useNavigate, useParams };
