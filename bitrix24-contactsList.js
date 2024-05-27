
// function returns list of contacts from bitrix24 crm system, wihhin the given time period
async function fetchContactsNew() {
    const webhookUrl = 'here-goes-the-user-crm-webhook-url';

    // Get the current date
    const today = new Date();

    // Calculate the start and end dates of the current week (Monday to Sunday)
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday

    // Format the dates as 'YYYY-MM-DD'
    const startDateString = firstDayOfWeek.toISOString().split('T')[0];
    const endDateString = lastDayOfWeek.toISOString().split('T')[0];

    let allContacts = [];
    let start = 0;
    const batchSize = 50; // Number of items to fetch per request

    try {
    while (true) {
        const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            select: ['ID', 'NAME', 'DATE_CREATE', 'ASSIGNED_BY_ID', 'TYPE_ID', 'SOURCE_ID', 'STATUS_ID'],
            start: start,
            order: { "ID": "ASC" } // Ensure consistent ordering for pagination
        })
        });

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
        console.error('Error fetching contacts:', data.error);
        break;
        } else {
        allContacts = allContacts.concat(data.result);
        if (data.result.length < batchSize) {
            // If the number of results is less than the batch size, we've fetched all contacts
            break;
        }
        start += batchSize;
        }
    }

    console.log('Contacts created this week:', allContacts);
    } catch (error) {
    console.error('Error fetching contacts:', error);
    }
}
