const form = document.querySelector('#contact-form');
const statusMessage = document.querySelector('#form-status');
const submitButton = form?.querySelector('.submit-button');

const ENDPOINT = 'https://formsubmit.co/ajax/londonovalleluisalejandro@gmail.com';

const setStatus = (message, type = 'info') => {
    if (!statusMessage) return;

    statusMessage.textContent = message;
    statusMessage.classList.remove('is-hidden', 'is-success', 'is-error');

    if (type === 'success') {
        statusMessage.classList.add('is-success');
    } else if (type === 'error') {
        statusMessage.classList.add('is-error');
    }
};

const toggleLoading = (isLoading) => {
    if (!submitButton) return;

    if (isLoading) {
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.innerHTML = '<span class="spinner"></span>Enviando…';
        submitButton.setAttribute('disabled', 'disabled');
    } else {
        submitButton.textContent = submitButton.dataset.originalText || 'Enviar briefing';
        submitButton.removeAttribute('disabled');
    }
};

const buildPayload = (formData) => ({
    name: formData.get('name')?.trim() || 'Sin nombre',
    email: formData.get('email')?.trim() || 'sin-email@dominio.com',
    projectType: formData.get('tipo') || 'No especificado',
    details: formData.get('detalle')?.trim() || 'Sin detalles',
    _subject: 'Nuevo briefing desde el portafolio',
    _captcha: 'false',
});

const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    if (!formData.get('email')) {
        setStatus('Por favor indica un correo de contacto válido.', 'error');
        return;
    }

    try {
        toggleLoading(true);
        setStatus('Enviando tu briefing…', 'info');

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(buildPayload(formData)),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        setStatus('¡Gracias! Te responderé en menos de 24 horas. Revisa tu correo para confirmar el envío.', 'success');
        form.reset();
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        setStatus('Hubo un problema al enviar tu briefing. Intenta nuevamente o escríbeme directamente a luis@backendcraft.dev.', 'error');
    } finally {
        toggleLoading(false);
    }
};

if (form && statusMessage) {
    statusMessage.dataset.originalText = statusMessage.textContent.trim();
    statusMessage.classList.add('is-hidden');
    form.addEventListener('submit', handleSubmit);
}


const repos = [
    "AlejandroLondonoValle/AlexBreaker",
    "AlejandroLondonoValle/Homes-CO",
    "AlejandroLondonoValle/Portafolio-Luis-Alejandro-Londo-o-Valle"
];

const container = document.getElementById("repos-container");

async function cargarRepos() {
    for (const repo of repos) {
        const url = `https://api.github.com/repos/${repo}`;
        const res = await fetch(url);
        const data = await res.json();

        const card = document.createElement("article");
        card.className =
            "glass-card relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_45px_90px_-30px_rgba(56,189,248,0.6)] cursor-pointer transition hover:-translate-y-1";

        card.onclick = () => window.open(data.html_url, "_blank");

        card.innerHTML = `
            <div class="absolute left-0 top-0 h-1 w-32 bg-highlight"></div>

            <h3 class="mt-6 font-heading text-2xl font-semibold text-white">
                ${data.name}
            </h3>

            <p class="mt-4 text-sm text-slate-300">
                ${data.description || "Este repositorio no tiene descripción."}
            </p>

            <div class="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-400">
                <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p>Lenguaje</p>
                    <p class="mt-2 text-lg font-semibold text-white">
                        ${data.language || "N/A"}
                    </p>
                </div>

                <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p>Última actualización</p>
                    <p class="mt-2 text-lg font-semibold text-white">
                        ${new Date(data.updated_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div class="mt-6">
                <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
                    ⭐ ${data.stargazers_count} stars
                </span>
            </div>
        `;

        container.appendChild(card);
    }
}

cargarRepos();

const pdfFolder = "src/assets/certificaciones";

const pdfFiles = [
    "Administracion de Inventario.pdf",
    "Backend Junior Riwi.pdf",
    "Certificado Smart A1.pdf",
    "Ciencia e Ingenieria de Datos @medellin.pdf",
    "Curso IA con Google.pdf",
    "Flujo de Caja.pdf",
    "Liderazgo Eficaz.pdf",
    "Mentalidad Exitosa.pdf",
    "Propuesta Unica de Valor.pdf",
    "Python Skilio.pdf",
    "Ventas en Linea.pdf"
];

const pdfCarousel = document.getElementById("pdfCarousel");

// Función para quitar ".pdf" y formatear bonito
function cleanTitle(name) {
    return name.replace(".pdf", "").replace(/_/g, " ");
}

pdfFiles.forEach(async (file) => {
    const url = `${pdfFolder}/${file}`;

    // Crear tarjeta
    const card = document.createElement("div");
    card.className =
        "glass-card min-w-[280px] max-w-xs rounded-3xl border border-white/10 bg-white/5 p-6";

    // Crear canvas donde irá la miniatura real
    const canvas = document.createElement("canvas");
    canvas.className = "rounded-xl border border-white/20 w-full";

    // Cargar PDF y renderizar miniatura
    try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.4 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport: viewport,
        }).promise;

    } catch (err) {
        console.error("Error cargando miniatura del PDF:", file, err);
        canvas.insertAdjacentHTML("beforebegin", "<div>Sin vista previa</div>");
    }

    // Estructura dentro de la tarjeta
    card.innerHTML = `
        <div class="mt-3 text-sm font-medium text-white truncate">${cleanTitle(file)}</div>

        <div class="flex justify-between mt-4 text-sm">
            <a href="${url}" target="_blank" class="text-highlight hover:underline">Ver</a>
            <a href="${url}" download class="text-slate-300 hover:underline">Descargar</a>
        </div>
    `;

    // Poner el canvas encima del contenido
    card.prepend(canvas);

    pdfCarousel.appendChild(card);
});

// Botones carrusel
document.getElementById("pdfNext").onclick = () => {
    pdfCarousel.scrollBy({ left: 300, behavior: "smooth" });
};

document.getElementById("pdfPrev").onclick = () => {
    pdfCarousel.scrollBy({ left: -300, behavior: "smooth" });
};

canvas.className = "rounded-xl border border-white/20 w-full pdf-thumb";
