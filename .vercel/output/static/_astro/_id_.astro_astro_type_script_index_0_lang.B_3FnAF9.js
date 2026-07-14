import{t as e}from"./supabase.B-pwCiwl.js";var t=document.getElementById(`solicitud-detail`),n=window.location.pathname.split(`/`),r=n[n.length-1];r?i():window.location.href=`/dashboard/solicitudes`;async function i(){let{data:n,error:i}=await e.from(`solicitudes`).select(`*, cliente:usuarios(*), items:solicitud_items(*, producto:productos(*), ofertas(*, proveedor:usuarios(*), contraofertas(*, cliente:usuarios(*))))`).eq(`id`,r).single();if(i||!n){t&&(t.innerHTML=`
          <div class="text-center py-8 text-red-600">
            Error al cargar la solicitud: ${i?.message||`No encontrada`}
          </div>
        `);return}let l=JSON.parse(localStorage.getItem(`user`)||`{}`),u=l.id===n.cliente_id,d=l.rol===`proveedor`||l.rol===`ambos`;t&&(t.innerHTML=`
        <div class="space-y-6">
          <div class="border-b pb-4">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">${n.titulo}</h2>
                <p class="text-gray-600 mt-1">Creada por: ${n.cliente?.full_name||`N/A`}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-sm font-medium ${c(n.estado)}">
                ${n.estado.replace(`_`,` `).toUpperCase()}
              </span>
            </div>
            <p class="text-gray-700 mt-4">${n.descripcion}</p>
            <p class="text-sm text-gray-500 mt-2">
              Fecha límite: ${new Date(n.fecha_limite).toLocaleDateString(`es-ES`)}
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Items</h3>
            <div class="space-y-4">
              ${n.items?.map(e=>`
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">${e.producto?.nombre||`Producto no encontrado`}</h4>
                      <p class="text-sm text-gray-600">${e.especificaciones||`Sin especificaciones`}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-semibold text-gray-900">${e.cantidad} ${e.producto?.unidad||``}</p>
                    </div>
                  </div>
                  
                  ${e.ofertas&&e.ofertas.length>0?`
                    <div class="mt-4 border-t pt-4">
                      <h5 class="text-sm font-medium text-gray-700 mb-2">Ofertas recibidas:</h5>
                      <div class="space-y-2">
                        ${e.ofertas.map(t=>`
                          <div class="bg-white p-3 rounded border">
                            <div class="flex justify-between items-center">
                              <div>
                                <p class="font-medium text-gray-900">${t.proveedor?.full_name||`Proveedor`}</p>
                                <p class="text-sm text-gray-600">$${t.precio_unitario} x ${e.producto?.unidad||`unidad`} = $${t.precio_total}</p>
                                <p class="text-xs text-gray-500">Entrega en ${t.tiempo_entrega_dias} días</p>
                              </div>
                              <span class="px-2 py-1 text-xs font-medium rounded-full ${c(t.estado)}">
                                ${t.estado}
                              </span>
                            </div>
                            ${t.condiciones?`<p class="text-sm text-gray-600 mt-2">${t.condiciones}</p>`:``}
                            
                            ${u&&t.estado===`pendiente`?`
                              <div class="mt-3 flex gap-2">
                                <button class="aceptar-oferta px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700" data-id="${t.id}">
                                  Aceptar
                                </button>
                                <button class="rechazar-oferta px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700" data-id="${t.id}">
                                  Rechazar
                                </button>
                                <button class="contraoferta-btn px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700" data-id="${t.id}" data-item-id="${e.id}">
                                  Contraofertar
                                </button>
                              </div>
                            `:``}
                          </div>
                        `).join(``)}
                      </div>
                    </div>
                  `:``}
                  
                  ${d&&!e.ofertas?.some(e=>e.proveedor_id===l.id)?`
                    <div class="mt-4">
                      <button class="crear-oferta-btn px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" data-item-id="${e.id}">
                        Crear Oferta
                      </button>
                    </div>
                  `:``}
                </div>
              `).join(``)||`<p class="text-gray-500">No hay items</p>`}
            </div>
          </div>
        </div>
      `,document.querySelectorAll(`.aceptar-oferta`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.id;await s(t,`aceptada`)})}),document.querySelectorAll(`.rechazar-oferta`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.id;await s(t,`rechazada`)})}),document.querySelectorAll(`.contraoferta-btn`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.id,n=e.currentTarget.dataset.itemId;o(t,n)})}),document.querySelectorAll(`.crear-oferta-btn`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.itemId;a(t)})}))}function a(t){let n=document.createElement(`div`);n.className=`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`,n.innerHTML=`
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Crear Oferta</h3>
        <form id="oferta-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Precio Unitario</label>
            <input type="number" name="precio_unitario" step="0.01" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tiempo de Entrega (días)</label>
            <input type="number" name="tiempo_entrega" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Condiciones</label>
            <textarea name="condiciones" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" class="cancelar-modal px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Enviar Oferta</button>
          </div>
        </form>
      </div>
    `,document.body.appendChild(n),n.querySelector(`.cancelar-modal`)?.addEventListener(`click`,()=>n.remove()),n.querySelector(`#oferta-form`)?.addEventListener(`submit`,async r=>{r.preventDefault();let a=new FormData(r.target),o=JSON.parse(localStorage.getItem(`user`)||`{}`);await e.from(`ofertas`).insert({solicitud_item_id:t,proveedor_id:o.id,precio_unitario:parseFloat(a.get(`precio_unitario`)),precio_total:parseFloat(a.get(`precio_unitario`)),tiempo_entrega_dias:parseInt(a.get(`tiempo_entrega`)),condiciones:a.get(`condiciones`),estado:`pendiente`}),n.remove(),i()})}function o(t,n){let r=document.createElement(`div`);r.className=`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`,r.innerHTML=`
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
    `,document.body.appendChild(r),r.querySelector(`.cancelar-modal`)?.addEventListener(`click`,()=>r.remove()),r.querySelector(`#contraoferta-form`)?.addEventListener(`submit`,async n=>{n.preventDefault();let a=new FormData(n.target),o=JSON.parse(localStorage.getItem(`user`)||`{}`);await e.from(`contraofertas`).insert({oferta_id:t,cliente_id:o.id,precio_unitario:parseFloat(a.get(`precio_unitario`)),mensaje:a.get(`mensaje`),estado:`pendiente`}),await e.from(`ofertas`).update({estado:`contraoferta`}).eq(`id`,t),r.remove(),i()})}async function s(t,n){await e.from(`ofertas`).update({estado:n}).eq(`id`,t),i()}function c(e){return{pendiente:`bg-yellow-100 text-yellow-800`,en_proceso:`bg-blue-100 text-blue-800`,completada:`bg-green-100 text-green-800`,cancelada:`bg-red-100 text-red-800`,aceptada:`bg-green-100 text-green-800`,rechazada:`bg-red-100 text-red-800`,contraoferta:`bg-purple-100 text-purple-800`}[e]||`bg-gray-100 text-gray-800`}