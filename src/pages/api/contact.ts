// src/pages/api/contact.ts
import type { APIRoute } from "astro";

// Función para añadir/actualizar el contacto en Brevo con todos sus atributos
async function addContactToList(email: string, attributes: { [key: string]: any }) {
    const brevoApiKey = import.meta.env.BREVO_API_KEY;
    const listId = Number(import.meta.env.BREVO_CONTACT_LIST_ID);

    if (!listId) {
        console.warn("ADVERTENCIA: BREVO_CONTACT_LIST_ID no está configurado. El contacto no será añadido a ninguna lista.");
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
            console.error("Error al añadir contacto a la lista de Brevo:", await response.json());
        }
    } catch (error) {
        console.error("Error de red al intentar añadir contacto a la lista de Brevo:", error);
    }
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;
        const token = formData.get("recaptcha-token") as string;

        if (!name || !email || !subject || !message || !token) {
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

        await addContactToList(email, {
            NOMBRE: name,
            ASUNTO: subject,
            MENSAJE: message
        });

        const brevoApiKey = import.meta.env.BREVO_API_KEY;
        const recipientEmail = import.meta.env.BREVO_RECIPIENT_EMAIL;
        const emailSubject = `Nuevo Mensaje de Contacto: ${subject}`;
        const htmlContent = `
            <h1>Nuevo Mensaje desde el Sitio Web</h1>
            <p>Has recibido un nuevo mensaje a través del formulario de contacto.</p>
            <hr>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Asunto:</strong> ${subject}</p>
            <hr>
            <h2>Mensaje:</h2>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        `;
        
        const brevoEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'api-key': brevoApiKey },
            body: JSON.stringify({
                sender: { name: "Nuevo Contacto (comprende.me)", email: "noreply@comprende.me" },
                to: [{ email: recipientEmail }],
                replyTo: { email: email, name: name },
                subject: emailSubject,
                htmlContent: htmlContent,
            }),
        });

        if (!brevoEmailResponse.ok) {
            throw new Error("El servicio de correo no pudo enviar la notificación.");
        }

        return new Response(JSON.stringify({ message: "¡Mensaje enviado con éxito!" }), { status: 200 });
    } catch (error) {
        console.error("Error en el endpoint /api/contact:", error);
        return new Response(JSON.stringify({ message: "Hubo un problema interno al procesar tu solicitud." }), { status: 500 });
    }
};