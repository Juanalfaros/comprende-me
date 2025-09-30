// src/pages/api/testimonial.ts
import type { APIRoute } from "astro";

async function addTestimonialContactToList(email: string, attributes: { [key: string]: any }) {
    const brevoApiKey = import.meta.env.BREVO_API_KEY;
    const listId = Number(import.meta.env.BREVO_TESTIMONIAL_LIST_ID);

    if (!listId || !email) {
        if(!listId) console.warn("ADVERTENCIA: BREVO_TESTIMONIAL_LIST_ID no está configurado.");
        return;
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': brevoApiKey,
            },
            body: JSON.stringify({
                email,
                attributes,
                listIds: [listId],
                updateEnabled: true
            }),
        });
        if (!response.ok) {
            console.error("Error al añadir contacto de testimonio a Brevo:", await response.json());
        }
    } catch (error) {
        console.error("Error de red al intentar añadir contacto de testimonio a Brevo:", error);
    }
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const testimonio = formData.get("testimonio") as string;
        const privacy = formData.get("privacy") as string;
        const nombre = formData.get("nombre") as string;
        const email = formData.get("email") as string;
        const token = formData.get("recaptcha-token") as string;

        if (!testimonio || !privacy || !token) {
            return new Response(JSON.stringify({ message: "Faltan campos requeridos." }), { status: 400 });
        }
    
        const recaptchaSecretKey = import.meta.env.RECAPTCHA_SECRET_KEY;
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${recaptchaSecretKey}&response=${token}`
        });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success || recaptchaData.score < 0.5) {
            return new Response(JSON.stringify({ message: "Verificación de reCAPTCHA fallida." }), { status: 403 });
        }

        const nombreAutor = privacy === 'real_name' && nombre ? nombre : 'Anónimo';

        if (email) {
            await addTestimonialContactToList(email, {
                NOMBRE: nombreAutor,
                TESTIMONIO: testimonio,
                PRIVACIDAD_TESTIMONIO: privacy
            });
        }

        const brevoApiKey = import.meta.env.BREVO_API_KEY;
        const recipientEmail = import.meta.env.BREVO_RECIPIENT_EMAIL;
        const subject = `Nuevo Testimonio Recibido de: ${nombreAutor}`;
        const htmlContent = `
            <h1>Nuevo Testimonio para Comprende.me</h1>
            <p><strong>Autor:</strong> ${nombreAutor}</p>
            <p><strong>Email de Contacto (opcional):</strong> ${email || 'No proporcionado'}</p>
            <p><strong>Preferencia de Privacidad:</strong> ${privacy}</p>
            <hr>
            <h2>Testimonio:</h2>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${testimonio}</p>
        `;

        const brevoEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'api-key': brevoApiKey },
            body: JSON.stringify({
                sender: { name: "Nuevo Testimonio (comprende.me)", email: "noreply@comprende.me" },
                to: [{ email: recipientEmail }],
                subject: subject,
                htmlContent: htmlContent,
            }),
        });

        if (!brevoEmailResponse.ok) {
            throw new Error("El servicio de correo no pudo enviar la notificación del testimonio.");
        }

        return new Response(JSON.stringify({ message: "¡Testimonio enviado con éxito!" }), { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint /api/testimonial:", error);
        return new Response(JSON.stringify({ message: "Hubo un problema interno al procesar tu solicitud." }), { status: 500 });
    }
};