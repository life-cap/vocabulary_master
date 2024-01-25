export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { text, start, end } = req.body
        const response = await fetch(
            `https://openapi.naver.com/v1/papago/n2mt`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Naver-Client-Id': process.env.CLIENT_ID,
                    'X-Naver-Client-Secret': process.env.CLIENT_SECRET,
                },
                body: `source=${start}&target=${end}&text=${encodeURIComponent(text)}`,
            }
        );
        const data = await response.json();
        res.status(200).json(data)
    } else {
        res.status(200).json()
    }
}