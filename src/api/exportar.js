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

export const getInfancia = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteInfancia?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.infancia;
};

export const getJuventud = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteJuventud?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.juventud;
};

export const getAdultez = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteAdultez?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.adultez;
};

export const getMadurez = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMadurez?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.madurez;
};

export const getSanitaryData = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMainSanitaryData?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.sanitaryData;
};

export const getPharmacy = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteFarmacia?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.pharmacy;
};

export const getNursingMedicine = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteMedicinaEnfermeria?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.nursing;
};

export const getSocialEdu = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteTOES?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.socialedu;
};

export const getSocialWork = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteTrabajoSocial?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.trabajoSocial;
};

export const getKitchenHygiene = async (id, token) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'pacienteCocinaHigiene?id='+ id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

    if (!res.ok) throw new Error("Error al obtener paciente");
    const data = await res.json()
    return data.kitchenHygiene;
};