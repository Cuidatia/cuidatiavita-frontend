// API route to proxy health data requests and avoid CORS issues
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { endpoint, token } = req.body;

    if (!endpoint || !token) {
        return res.status(400).json({ error: 'Missing endpoint or token' });
    }

    const baseUrl = 'https://api.hcgateway.shuchir.dev/api/v2/fetch';
    
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                // You can add date filters here if needed
                // startDate: req.body.startDate,
                // endDate: req.body.endDate
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} - ${errorText}`);
            return res.status(response.status).json({ 
                error: `API request failed: ${response.status}`,
                details: errorText 
            });
        }

        const data = await response.json();
        return res.status(200).json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
}
