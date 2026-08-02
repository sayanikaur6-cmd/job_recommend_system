export const openMap = (
    company,
    city,
    state,
    country,
    lat,
    lng
) => {

    // Priority-1
    if (company && city && state) {

        const query = `${company}, ${city}, ${state}, ${country}`;

        const url =
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

        window.open(url, "_blank");
        return;
    }

    // Priority-2
    if (lat && lng) {

        const url =
            `https://www.google.com/maps?q=${lat},${lng}`;

        window.open(url, "_blank");
    }

};