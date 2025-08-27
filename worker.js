// This is the API endpoint we discovered using the browser's developer tools.
const VERIZON_API_URL = "https://www.verizon.com/service/v1/qualify/check5GAvailability";

// This is the main function that handles all incoming requests to our worker.
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// The handleRequest function processes the incoming request and returns a response.
async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Please send a POST request with address data.', { status: 405 });
  }

  try {
    const requestBody = await request.json();

    if (!requestBody.address1 || !requestBody.city || !requestBody.state || !requestBody.zipcode) {
      return new Response('Missing one or more required address fields: address1, city, state, zipcode.', { status: 400 });
    }

    const verizonPayload = {
      ...requestBody,
      baseAddressIdSubloc: "false",
      buildingId: "",
      cBandOnly: "false",
      captchachangeNeeded: "false",
      cbandPro: "false",
      cmp: "",
      editAddress: "true",
      flowtype: "LQ2.0",
      includeCband: "true",
      includeFtr: "false",
      isLoadTest: "false",
      isRevist: "false",
      locationCode: "",
      location_id: "",
      locusId: "",
      loopQual: "true",
      outletId: "",
      preOrder: "true",
      preState: "",
      referrer: "https://www.verizon.com/home/internet/",
      scEmail: "",
      scTtn: "",
      superBowlPromo: "false",
      vendorId: null,
      wifiBackupRequired: "true",
    };

    const response = await fetch(VERIZON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verizonPayload),
    });

    if (!response.ok) {
      return new Response(`Verizon API responded with status: ${response.status}`, { status: response.status });
    }

    const data = await response.json();

    // --- NEW CODE SECTION ---
    // This is where we parse the response to determine eligibility.
    // We will check for common property names. You will need to update this
    // based on the actual response you receive.

    let isEligible = false;
    let eligibilityMessage = "Not Eligible";

    // Example 1: Check for a direct boolean value.
    if (data.isEligible === true) {
      isEligible = true;
    }
    // Example 2: Check a nested object's property.
    else if (data.availability && data.availability.isAvailable === true) {
      isEligible = true;
    }
    // Example 3: Check a specific service type.
    else if (data.products && data.products.some(p => p.type === '5G_FWA' && p.isAvailable)) {
      isEligible = true;
    }

    if (isEligible) {
      eligibilityMessage = "Eligible for Verizon 5G FWA Business Internet!";
    }

    // Return a simple, clear response to the user.
    return new Response(eligibilityMessage, { status: 200 });

  } catch (error) {
    return new Response(`An error occurred: ${error.message}`, { status: 500 });
  }
}
