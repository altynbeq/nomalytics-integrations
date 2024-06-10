export async function formatDateRange (type, dates) {
    const { startDate, endDate } = dates;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const optionsDay = { day: 'numeric', month: 'long', year: 'numeric' };
    const optionsMonth = { month: 'long', year: 'numeric' };

    switch (type) {
        case 'day':
            return start.toLocaleDateString('en-US', optionsDay);
        case 'week':
            const startDay = start.getDate();
            const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
            const startYear = start.getFullYear();
            const endDay = end.getDate();
            const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
            const endYear = end.getFullYear();

            if (startMonth === endMonth && startYear === endYear) {
                return `${startDay}-${endDay} ${startMonth} ${startYear}`;
            } else {
                return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
            }
        case 'month':
            return start.toLocaleDateString('en-US', optionsMonth);
        default:
            throw new Error('Invalid type. Type should be "day", "week", or "month".');
    }
};
