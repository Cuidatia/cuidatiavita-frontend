import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        
        const response = await fetch('http://127.0.0.1:5000/auth/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            })
        })

        const data = await response.json()

        if(!response.ok) {
          throw new Error(data.error)
        }
        
        if (data.usuario) {
          const user = {
            id: data.usuario.id,
            name: data.usuario.nombre,
            email: data.usuario.email,
            idOrganizacion: data.usuario.idOrganizacion,
            roles: data.usuario.roles,
            token: data.token
          }
          return user
        } else {
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.roles = user.roles;
        token.idOrganizacion = user.idOrganizacion;
        token.token = user.token; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.roles = token.roles;
      session.user.idOrganizacion = token.idOrganizacion;
      session.user.token = token.token;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
})