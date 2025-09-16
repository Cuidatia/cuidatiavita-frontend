/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',          
        destination: '/login',  
        permanent: true,    
      },
    ];
  },

  images: {
    domains: [
      'historiavidacuidatia.s3.eu-west-1.amazonaws.com',
    ],
  },
};

export default nextConfig;
