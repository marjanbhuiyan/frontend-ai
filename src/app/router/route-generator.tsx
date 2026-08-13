import type { RouteObject } from "react-router-dom";
import { ComponentRegistry } from "@/app/router/component-registry";
import NotImplementedPage from "@/app/pages/not-implemented-page";
import type { Menu } from "@/app/types";

function resolveMenuComponent(menu: Menu) {
    const candidates = [menu.component, menu.componentName];

    for (const name of candidates) {
        if (!name) continue;
        const exact =
            ComponentRegistry[name as keyof typeof ComponentRegistry];
        if (exact) return exact;
    }

    // 2) case-insensitive / suffix-tolerant match
    const normalized = candidates
        .filter((n): n is string => !!n)
        .map((n) => n.replace(/page$/i, "").toLowerCase());

    const matchKey = Object.keys(ComponentRegistry).find((key) => {
        const keyNorm = key.replace(/page$/i, "").toLowerCase();
        return normalized.includes(keyNorm);
    });

    if (matchKey) return ComponentRegistry[matchKey];

    return null;
}


function normalizeMenuPath(api: string): string {
    const p = api.trim().replace(/^\/+/, "").replace(/\/+$/, "");
    if (!p) return "/";
    return "/" + p.replace(/\/{2,}/g, "/");
}

function createRoute(menu: Menu): RouteObject[] {
    const routes: RouteObject[] = [];
    if (menu.type === "item" && menu.api) {

        console.log("menu component", menu.component, "componentName", menu.componentName);
        /* Use the tolerant resolver so registered pages are matched from
           either `component` or `componentName` (any casing) instead of
           always falling back to NotImplementedPage. */
        const Component = resolveMenuComponent(menu) ?? NotImplementedPage;

        routes.push({
            /* Absolute path (matches sidebar `item.path` navigation) — valid now
               that the dashboard layout is a pathless parent route. */
            path: normalizeMenuPath(menu.api),
            element: <Component menu={menu} />,
        });
    }

    if (menu.children?.length) {
        menu.children.forEach(child => {
            routes.push(...createRoute(child));
        });

    }

    return routes;
}

export function generateRoutesFromMenus(menus: Menu[]): RouteObject[] {
    return menus.flatMap(createRoute);
}