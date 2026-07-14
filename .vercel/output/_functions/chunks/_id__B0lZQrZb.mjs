import { n as __exportAll, t as createComponent } from "./compiler_D_oLQE2V.mjs";
import { S as createAstro, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_BrzI6bOa.mjs";
import { n as renderScript, t as $$LayoutDashboard } from "./LayoutDashboard_DWawVlZ5.mjs";
//#region src/pages/dashboard/solicitudes/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	return renderTemplate`${renderComponent($$result, "LayoutDashboard", $$LayoutDashboard, { "title": "Detalle de Solicitud" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="max-w-4xl mx-auto space-y-6"><div class="flex justify-between items-center"><div><a href="/dashboard/solicitudes" class="text-blue-600 hover:text-blue-800 text-sm">← Volver a solicitudes</a><h1 class="text-3xl font-bold text-gray-900 mt-2">Detalle de Solicitud</h1></div></div><div id="solicitud-detail" class="bg-white rounded-lg shadow-md p-6"><p class="text-gray-600">Cargando detalles...</p></div></div>` })}${renderScript($$result, "/home/sero/Codigo/prueba-tecnica/ikbo-solicitudes/src/pages/dashboard/solicitudes/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/sero/Codigo/prueba-tecnica/ikbo-solicitudes/src/pages/dashboard/solicitudes/[id].astro", void 0);
var $$file = "/home/sero/Codigo/prueba-tecnica/ikbo-solicitudes/src/pages/dashboard/solicitudes/[id].astro";
var $$url = "/dashboard/solicitudes/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/dashboard/solicitudes/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
