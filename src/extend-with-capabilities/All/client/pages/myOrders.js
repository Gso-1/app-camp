import { 
    getLoggedInEmployee
} from '../identity/identityClient.js';
import { ensureTeamsSdkInitialized, inM365 } from '../modules/teamsHelpers.js';
import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
async function displayUI() {

    const displayElement = document.getElementById('content');
    const ordersElement = document.getElementById('orders');
    const messageDiv = document.getElementById('message');

    try {

        // Handle incoming deep links by redirecting to the selected order
        if (await inM365()) {
            await ensureTeamsSdkInitialized();
            const context = await microsoftTeams.app.getContext();
            if (context.page.subPageId) {
                window.location.href = `/pages/orderDetail.html?orderId=${context.page.subPageId}`;
            }
        }

        // Display order data
        const employee = await getLoggedInEmployee();
        if (employee) {
            
            displayElement.innerHTML = `
                <h3>Orders for ${employee.displayName}<h3>
            `;

            employee.orders.forEach(order => {
                const orderRow = document.createElement('tr');
                orderRow.innerHTML = `<tr>
                <td><a href="/pages/orderDetail.html?orderId=${order.orderId}">${order.orderId}</a></td>
                <td class='nowrapItem'>${(new Date(order.orderDate).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}))}</td>
                <td>${order.customerName}</td>
                <td>${order.customerContact}</td>            
                <td class='nowrapItem'>${order.customerPhone}</td>
                <td>${order.shipName}</td>
                <td>${order.shipAddress}</td>
            </tr>`;
                ordersElement.append(orderRow);

            });
        }
    }
    catch (error) {            // If here, we had some other error
        messageDiv.innerText = `Error: ${JSON.stringify(error)}`;
    }
}

displayUI();