document.addEventListener("DOMContentLoaded", async function () {
    const clientId = sessionStorage.getItem("userId");

    if (!clientId) {
        console.error("Client ID not found in sessionStorage.");
        return;
    }

    // Fetch Unpaid Balance
    try {
        const unpaidResponse = await fetch(`${API_BASE_URL}/api/payment/unpaid-balance/${clientId}`);
        if (!unpaidResponse.ok) {
            throw new Error(`HTTP error! Status: ${unpaidResponse.status}`);
        }

        const unpaidBalance = await unpaidResponse.json();
        document.querySelector(".counter.unpaid-balance").innerText = unpaidBalance.toFixed(2);

    } catch (error) {
        console.error("Error fetching unpaid balance:", error);
        document.querySelector(".counter.unpaid-balance").innerText = "N/A";
    }

    // Fetch Paid Balance
    try {
        const paidResponse = await fetch(`${API_BASE_URL}/api/payment/paid-balance/${clientId}`);
        if (!paidResponse.ok) {
            throw new Error(`HTTP error! Status: ${paidResponse.status}`);
        }

        const paidBalance = await paidResponse.json();
        document.querySelector(".counter.paid-balance").innerText = paidBalance.toFixed(2);

    } catch (error) {
        console.error("Error fetching paid balance:", error);
        document.querySelector(".counter.paid-balance").innerText = "N/A";
    }
});
