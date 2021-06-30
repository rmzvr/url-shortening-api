async function getShortenUrlResponse(url) {
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 27bd897789f5c44f98373c08559798dd510b54c8',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "long_url": url })
    });

    return await response.json();
}