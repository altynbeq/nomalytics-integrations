
// function returns list of lead within the given time period from bitrix24crm 
export async function fetchLeads() {
  const webhookUrl = 'client-webhook-url-goes-here';

  // Get the current date
  const today = new Date();

  // Calculate the start and end dates of the current week (Monday to Sunday)
  const startDate = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
  const endDate = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday

  // Format the dates as 'YYYY-MM-DD'
  const startDateString = firstDayOfWeek.toISOString().split('T')[0];
  const endDateString = lastDayOfWeek.toISOString().split('T')[0];

  let allLeads = [];
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
                  filter: {
                      '>=DATE_CREATE': startDateString,
                      '<=DATE_CREATE': endDateString
                  },
                  select: ['ASSIGNED_BY_ID', 'CURRENCY_ID', 'DATE_CLOSED', 'DATE_CREATE', 'ID', 'IS_RETURN_CUSTOMER', 'NAME', 'OPENED', 'SOURCE_ID', 'STATUS_ID', 'STATUS_SEMANTIC_ID'],
                  start: start,
                  order: { "ID": "ASC" } // Ensure consistent ordering for pagination
              })
          });

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          if (data.error) {
              console.error('Error fetching leads:', data.error);
              break;
          } else {
              allLeads = allLeads.concat(data.result);
              if (data.result.length < batchSize) {
                  // If the number of results is less than the batch size, we've fetched all leads
                  break;
              }
              start += batchSize;
          }
      }

      console.log('Leads created or received this week:', allLeads);
  } catch (error) {
      console.error('Error fetching leads:', error);
  }
}
