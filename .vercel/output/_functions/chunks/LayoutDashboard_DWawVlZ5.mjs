import { t as createComponent } from "./compiler_D_oLQE2V.mjs";
import { S as createAstro, _ as createRenderInstruction, g as addAttribute, h as renderHead, i as renderComponent, m as maybeRenderHead, s as renderSlot, u as renderTemplate } from "./server_BrzI6bOa.mjs";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/lib/constants.ts
var APP_NAME = "IKBO Solicitudes";
var ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/registro",
	DASHBOARD: "/dashboard",
	SOLICITUDES: "/dashboard/solicitudes",
	NUEVA_SOLICITUD: "/dashboard/solicitudes/nueva",
	SOLICITUD_DETAIL: "/dashboard/solicitudes/",
	OFERTAS: "/dashboard/ofertas",
	OFERTA_DETAIL: "/dashboard/ofertas/"
};
//#endregion
//#region src/layouts/LayoutPrincipal.astro
createAstro("https://astro.build");
var $$LayoutPrincipal = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LayoutPrincipal;
	const { title = APP_NAME, description = "Sistema de Solicitudes de Producto y Ofertas de Proveedores" } = Astro.props;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>${title}</title>${renderHead($$result)}</head><body class="bg-gray-50 min-h-screen">${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/home/sero/Codigo/prueba-tecnica/ikbo-solicitudes/src/layouts/LayoutPrincipal.astro", void 0);
//#endregion
//#region src/components/auth/Sidebar.astro
var $$Sidebar = createComponent(($$result, $$props, $$slots) => {
	const menuItems = [
		{
			label: "Dashboard",
			href: ROUTES.DASHBOARD,
			icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
		},
		{
			label: "Solicitudes",
			href: ROUTES.SOLICITUDES,
			icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
		},
		{
			label: "Ofertas",
			href: ROUTES.OFERTAS,
			icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<aside class="w-64 bg-gray-900 text-white min-h-screen p-4"><div class="mb-8"><h2 class="text-xl font-bold">${APP_NAME}</h2></div><nav class="space-y-2">${menuItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(item.icon, "d")}></path></svg><span>${item.label}</span></a>`)}</nav><div class="absolute bottom-4 left-4 right-4"><button id="logout-btn" class="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-red-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg><span>Cerrar Sesión</span></button></div></aside>${renderScript($$result, "/home/sero/Codigo/prueba-tecnica/ikbo-solicitudes/src/components/auth/Sidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/sero/Codigo/prueba-tecnica/ikbo-solicitudes/src/components/auth/Sidebar.astro", void 0);
//#endregion
//#region src/layouts/LayoutDashboard.astro
createAstro("https://astro.build");
var $$LayoutDashboard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LayoutDashboard;
	const { title } = Astro.props;
	return renderTemplate`${renderComponent($$result, "LayoutPrincipal", $$LayoutPrincipal, { "title": title }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="min-h-screen flex">${renderComponent($$result, "Sidebar", $$Sidebar, {})}<main class="flex-1 p-8">${renderSlot($$result, $$slots["default"])}</main></div>` })}`;
}, "/home/sero/Codigo/prueba-tecnica/ikbo-solicitudes/src/layouts/LayoutDashboard.astro", void 0);
//#endregion
export { renderScript as n, $$LayoutDashboard as t };
