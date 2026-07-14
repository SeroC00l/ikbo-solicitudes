import{t as e}from"./supabase.B-pwCiwl.js";var t=document.getElementById(`solicitud-form`),n=document.getElementById(`items-container`),r=document.getElementById(`add-item-btn`),i=document.getElementById(`error-message`),a=document.getElementById(`submit-btn`),o=[],s=[];async function c(){let{data:t}=await e.from(`productos`).select(`*`).order(`nombre`);t&&(s=t,l())}c(),r?.addEventListener(`click`,()=>{o.push({nombre:``,unidad:``,cantidad:1,especificaciones:``}),l()});function l(){if(n){if(o.length===0){n.innerHTML=`
        <div class="text-center py-8 text-gray-500">
          No hay items. Haz clic en "Agregar Item" para añadir productos a tu solicitud.
        </div>
      `;return}n.innerHTML=o.map((e,t)=>`
      <div class="bg-gray-50 p-4 rounded-lg border" data-index="${t}">
        <div class="flex justify-between items-start mb-4">
          <h4 class="font-medium text-gray-900">Item ${t+1}</h4>
          <button type="button" class="text-red-600 hover:text-red-800 remove-item" data-index="${t}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 product-select"
              data-index="${t}"
            >
              <option value="">Seleccionar producto</option>
              ${s.map(t=>`
                <option value="${t.id}" ${e.nombre===t.id?`selected`:``}>${t.nombre} (${t.unidad})</option>
              `).join(``)}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input 
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 quantity-input"
              data-index="${t}"
              value="${e.cantidad}"
              min="1"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Especificaciones</label>
            <input 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 specs-input"
              data-index="${t}"
              value="${e.especificaciones}"
              placeholder="Especificaciones adicionales..."
            />
          </div>
        </div>
      </div>
    `).join(``),document.querySelectorAll(`.remove-item`).forEach(e=>{e.addEventListener(`click`,e=>{let t=parseInt(e.currentTarget.dataset.index||`0`);o.splice(t,1),l()})}),document.querySelectorAll(`.product-select`).forEach(e=>{e.addEventListener(`change`,e=>{let t=parseInt(e.currentTarget.dataset.index||`0`),n=e.target.value;o[t].nombre=n})}),document.querySelectorAll(`.quantity-input`).forEach(e=>{e.addEventListener(`change`,e=>{let t=parseInt(e.currentTarget.dataset.index||`0`);o[t].cantidad=parseInt(e.target.value)||1})}),document.querySelectorAll(`.specs-input`).forEach(e=>{e.addEventListener(`change`,e=>{let t=parseInt(e.currentTarget.dataset.index||`0`);o[t].especificaciones=e.target.value})})}}t?.addEventListener(`submit`,async n=>{n.preventDefault();let r=new FormData(t),s=r.get(`titulo`),c=r.get(`descripcion`),l=r.get(`fecha_limite`);if(o.length===0){i&&(i.textContent=`Debe agregar al menos un item a la solicitud`,i.classList.remove(`hidden`));return}i&&i.classList.add(`hidden`),a&&a.setAttribute(`disabled`,`true`);try{let t=JSON.parse(localStorage.getItem(`user`)||`{}`),{data:n,error:r}=await e.from(`solicitudes`).insert({cliente_id:t.id,titulo:s,descripcion:c,fecha_limite:l,estado:`pendiente`}).select().single();if(r)throw r;let i=o.map(e=>({solicitud_id:n.id,producto_id:e.nombre,cantidad:e.cantidad,especificaciones:e.especificaciones})),{error:a}=await e.from(`solicitud_items`).insert(i);if(a)throw a;window.location.href=`/dashboard/solicitudes`}catch(e){i&&(i.textContent=e.message,i.classList.remove(`hidden`))}finally{a&&a.removeAttribute(`disabled`)}});