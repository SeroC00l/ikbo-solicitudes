import{t as e}from"./supabase.B-pwCiwl.js";var t=document.getElementById(`oferta-detail`),n=window.location.pathname.split(`/`),r=n[n.length-1];r?i():window.location.href=`/dashboard/ofertas`;async function i(){let{data:n,error:i}=await e.from(`ofertas`).select(`*, proveedor:usuarios(*), solicitud_item:solicitud_items(*, solicitud:solicitudes(*), producto:productos(*)), contraofertas(*, cliente:usuarios(*))`).eq(`id`,r).single();if(i||!n){t&&(t.innerHTML=`
          <div class="text-center py-8 text-red-600">
            Error al cargar la oferta: ${i?.message||`No encontrada`}
          </div>
        `);return}let l=JSON.parse(localStorage.getItem(`user`)||`{}`),u=l.id===n.proveedor_id,d=l.id===n.solicitud_item?.solicitud?.cliente_id;t&&(t.innerHTML=`
        <div class="space-y-6">
          <div class="border-b pb-4">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">${n.solicitud_item?.producto?.nombre||`Producto`}</h2>
                <p class="text-gray-600 mt-1">Solicitud: ${n.solicitud_item?.solicitud?.titulo||`N/A`}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-sm font-medium ${c(n.estado)}">
                ${n.estado.toUpperCase()}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Información del Proveedor</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-900">${n.proveedor?.full_name||`N/A`}</p>
                <p class="text-gray-600">${n.proveedor?.empresa||`N/A`}</p>
                <p class="text-gray-600">${n.proveedor?.email||`N/A`}</p>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Detalles de la Oferta</h3>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span class="font-medium">Precio Unitario:</span> $${n.precio_unitario}</p>
                <p><span class="font-medium">Precio Total:</span> $${n.precio_total}</p>
                <p><span class="font-medium">Tiempo de Entrega:</span> ${n.tiempo_entrega_dias} días</p>
                <p><span class="font-medium">Condiciones:</span> ${n.condiciones||`Sin condiciones`}</p>
              </div>
            </div>
          </div>

          ${n.contraofertas&&n.contraofertas.length>0?`
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Contraofertas Recibidas</h3>
              <div class="space-y-4">
                ${n.contraofertas.map(e=>`
                  <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="font-medium text-gray-900">${e.cliente?.full_name||`Cliente`}</p>
                        <p class="text-lg font-semibold text-purple-700">$${e.precio_unitario}</p>
                      </div>
                      <span class="px-2 py-1 text-xs font-medium rounded-full ${c(e.estado)}">
                        ${e.estado}
                      </span>
                    </div>
                    ${e.mensaje?`<p class="text-gray-700 mt-2">${e.mensaje}</p>`:``}
                    
                    ${u&&e.estado===`pendiente`?`
                      <div class="mt-3 flex gap-2">
                        <button class="aceptar-contraoferta px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700" data-id="${e.id}">
                          Aceptar
                        </button>
                        <button class="rechazar-contraoferta px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700" data-id="${e.id}">
                          Rechazar
                        </button>
                      </div>
                    `:``}
                  </div>
                `).join(``)}
              </div>
            </div>
          `:``}

          ${d&&n.estado===`pendiente`?`
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones del Cliente</h3>
              <div class="flex gap-4">
                <button class="aceptar-oferta px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Aceptar Oferta
                </button>
                <button class="rechazar-oferta px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Rechazar Oferta
                </button>
                <button class="contraofertar-btn px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Contraofertar
                </button>
              </div>
            </div>
          `:``}
        </div>
      `,document.querySelector(`.aceptar-oferta`)?.addEventListener(`click`,async()=>{await o(`aceptada`)}),document.querySelector(`.rechazar-oferta`)?.addEventListener(`click`,async()=>{await o(`rechazada`)}),document.querySelector(`.contraofertar-btn`)?.addEventListener(`click`,()=>{a()}),document.querySelectorAll(`.aceptar-contraoferta`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.id;await s(t,`aceptada`)})}),document.querySelectorAll(`.rechazar-contraoferta`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.id;await s(t,`rechazada`)})}))}function a(){let t=document.createElement(`div`);t.className=`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`,t.innerHTML=`
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Contraofertar</h3>
        <form id="contraoferta-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tu precio propuesto</label>
            <input type="number" name="precio_unitario" step="0.01" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Mensaje</label>
            <textarea name="mensaje" rows="3" class="w-full px-3 py-2 border rounded-lg" placeholder="Explica tu contraoferta..."></textarea>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" class="cancelar-modal px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded-lg">Enviar Contraoferta</button>
          </div>
        </form>
      </div>
    `,document.body.appendChild(t),t.querySelector(`.cancelar-modal`)?.addEventListener(`click`,()=>t.remove()),t.querySelector(`#contraoferta-form`)?.addEventListener(`submit`,async n=>{n.preventDefault();let a=new FormData(n.target),o=JSON.parse(localStorage.getItem(`user`)||`{}`);await e.from(`contraofertas`).insert({oferta_id:r,cliente_id:o.id,precio_unitario:parseFloat(a.get(`precio_unitario`)),mensaje:a.get(`mensaje`),estado:`pendiente`}),await e.from(`ofertas`).update({estado:`contraoferta`}).eq(`id`,r),t.remove(),i()})}async function o(t){await e.from(`ofertas`).update({estado:t}).eq(`id`,r),i()}async function s(t,n){await e.from(`contraofertas`).update({estado:n}).eq(`id`,t),i()}function c(e){return{pendiente:`bg-yellow-100 text-yellow-800`,aceptada:`bg-green-100 text-green-800`,rechazada:`bg-red-100 text-red-800`,contraoferta:`bg-purple-100 text-purple-800`}[e]||`bg-gray-100 text-gray-800`}