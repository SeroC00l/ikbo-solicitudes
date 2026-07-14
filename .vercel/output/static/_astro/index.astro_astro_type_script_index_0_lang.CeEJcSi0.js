import{t as e}from"./supabase.B-pwCiwl.js";var t=document.getElementById(`solicitudes-container`);localStorage.getItem(`user`)?n():window.location.href=`/login`;async function n(){let n=JSON.parse(localStorage.getItem(`user`)||`{}`),i=e.from(`solicitudes`).select(`*, cliente:usuarios(*), items:solicitud_items(*, producto:productos(*))`).order(`created_at`,{ascending:!1});n.rol===`cliente`&&(i=i.eq(`cliente_id`,n.id));let{data:a,error:o}=await i;if(o){t&&(t.innerHTML=`
          <div class="p-6 text-center text-red-600">
            Error al cargar solicitudes: ${o.message}
          </div>
        `);return}if(!a||a.length===0){t&&(t.innerHTML=`
          <div class="p-6 text-center text-gray-600">
            No hay solicitudes disponibles.
          </div>
        `);return}t&&(t.innerHTML=`
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${a.map(e=>`
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${e.titulo}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${e.cliente?.full_name||`N/A`}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r(e.estado)}">
                      ${e.estado}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${e.items?.length||0} items
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(e.fecha_limite).toLocaleDateString(`es-ES`)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="/dashboard/solicitudes/${e.id}" class="text-blue-600 hover:text-blue-900">
                      Ver detalles
                    </a>
                  </td>
                </tr>
              `).join(``)}
            </tbody>
          </table>
        </div>
      `)}function r(e){return{pendiente:`bg-yellow-100 text-yellow-800`,en_proceso:`bg-blue-100 text-blue-800`,completada:`bg-green-100 text-green-800`,cancelada:`bg-red-100 text-red-800`}[e]||`bg-gray-100 text-gray-800`}