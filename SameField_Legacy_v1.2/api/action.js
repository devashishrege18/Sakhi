export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const { actionType, itemName, actorName } = req.body;
            console.log(`[ACTION API] ${actionType} recorded for: ${itemName} by ${actorName || 'Guest'}`);

            let message = "Action recorded successfully!";

            switch (actionType) {
                case 'store_visit':
                    message = `Opening ${itemName}... Get ready for premium gear!`;
                    break;
                case 'purchase':
                    message = `Order confirmed for ${itemName}! Check your email for details.`;
                    break;
                case 'ticket_buy':
                    message = `Ticket secured for ${itemName}! See you at the event.`;
                    break;
                case 'meet_maker':
                    message = `Connecting you with the artisans behind ${itemName}...`;
                    break;
                case 'follow':
                    message = `You are now following ${itemName}! Stay tuned for updates.`;
                    break;
                default:
                    message = `Action '${actionType}' for ${itemName} processed successfully.`;
            }

            return res.status(200).json({
                success: true,
                message,
                action: actionType
            });
        } catch (error) {
            console.error("Action API Error:", error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
