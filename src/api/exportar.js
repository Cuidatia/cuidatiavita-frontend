export const getPersonalData = async (id, token) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}getPaciente?id=${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.paciente
};

export const getPersonality = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacientePersonality?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.personality;
};

export const getContactData = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteDatosContacto?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.contactdata;
};