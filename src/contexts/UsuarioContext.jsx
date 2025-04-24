import { createContext } from "react";

/* Creating a context for the user. */
export const UsuarioContext = createContext({
    id: null,
    name: null,
    email:null,
    idOrganizacion:null,
    roles:null,
});