import type { RouteObject } from "react-router-dom";
import { ComponentRegistry } from "@/app/router/component-registry";
import NotImplementedPage from "@/app/pages/not-implemented-page";
import type { Menu } from "@/app/types";

function createRoute(menu: Menu): RouteObject[] {
    const routes: RouteObject[] = [];
    if (menu.type === "item" && menu.route) {
        const Component =
            ComponentRegistry[
                menu.component as keyof typeof ComponentRegistry
            ] ?? NotImplementedPage;

        routes.push({
            path: menu.route.replace(/^\//, ""),
            element: (
                <Component
                    menu={menu}
                />
            ),
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