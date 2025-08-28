import requests
import json

# The API endpoint we discovered earlier.
VERIZON_API_URL = "https://www.verizon.com/service/v1/qualify/check5GAvailability"

def check_eligibility(address_data):
    """
    Checks the eligibility of an address using the Verizon API.
    """
    # This is the full payload we reverse-engineered from the website.
    payload = {
        "address1": address_data["address1"],
        "city": address_data["city"],
        "state": address_data["state"],
        "zipcode": address_data["zipcode"],
        "baseAddressIdSubloc": "false",
        "buildingId": "",
        "cBandOnly": "false",
        "captchachangeNeeded": "false",
        "cbandPro": "false",
        "cmp": "",
        "editAddress": "true",
        "flowtype": "LQ2.0",
        "includeCband": "true",
        "includeFtr": "false",
        "isLoadTest": "false",
        "isRevist": "false",
        "locationCode": "",
        "location_id": "",
        "locusId": "",
        "loopQual": "true",
        "outletId": "",
        "preOrder": "true",
        "preState": "",
        "referrer": "https://www.verizon.com/home/internet/",
        "scEmail": "",
        "scTtn": "",
        "superBowlPromo": "false",
        "vendorId": None,
        "wifiBackupRequired": "true",
    }

    try:
        # Send the POST request to the Verizon API.
        response = requests.post(
            VERIZON_API_URL,
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        # Raise an exception for bad status codes (4xx or 5xx)
        response.raise_for_status()

        # Parse the JSON response from the API.
        data = response.json()

        # We need to find the specific field that indicates eligibility.
        # This is a common pattern for eligibility checks.
        is_eligible = data.get('isEligible', False)

        if is_eligible:
            print(f"\u2705 The address is eligible for Verizon 5G FWA Business Internet!")
            # Optional: You can print more details from the response here if needed.
            # print("Response details:", json.dumps(data, indent=2))
        else:
            print(f"\u274c The address is NOT eligible for Verizon 5G FWA Business Internet.")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while making the request: {e}")
    except json.JSONDecodeError:
        print("Failed to decode JSON response from the API.")

if __name__ == "__main__":
    print("Welcome to the Verizon 5G FWA Eligibility Checker!")
    print("Please enter the address details to check eligibility.")

    # Get user input for the address details.
    address_input = {}
    address_input['address1'] = input("Street Address: ")
    address_input['city'] = input("City: ")
    address_input['state'] = input("State (e.g., AR): ")
    address_input['zipcode'] = input("Zip Code: ")

    # Run the eligibility check with the user's input.
    check_eligibility(address_input)
