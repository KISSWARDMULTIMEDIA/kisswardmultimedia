// Simple visitor tracking with location
(async function() {
    // Get visitor location from IP
    async function getLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                country: data.country_name,
                city: data.city,
                region: data.region,
                ip: data.ip
            };
        } catch (error) {
            console.log('Location tracking failed');
            return null;
        }
    }

    // Track page visit
    async function trackVisit() {
        const location = await getLocation();
        const visitData = {
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            location: location,
            sessionId: sessionStorage.getItem('sessionId') || generateSessionId()
        };

        // Store session ID
        sessionStorage.setItem('sessionId', visitData.sessionId);

        // Send to your server or analytics service
        console.log('Visitor tracked:', visitData);
        
        // Example: Send to Google Sheets or your backend
        // await sendToServer(visitData);
    }

    function generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }

    // Track when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisit);
    } else {
        trackVisit();
    }
})();
