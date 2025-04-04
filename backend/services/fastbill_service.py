import os
import requests
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

class FastbillService:
    def __init__(self):
        """Initialize FastBill API connection with authentication."""
        self.api_url = os.getenv("FASTBILL_API_URL", "https://my.fastbill.com/api/1.0/api.php")
        self.email = os.getenv("FASTBILL_EMAIL")
        self.api_key = os.getenv("FASTBILL_API_KEY")

        if not self.email or not self.api_key:
            raise ValueError("FastBill email or API key is missing!")

        # Correct base64 encoding of email:api_key
        auth_string = f"{self.email}:{self.api_key}"
        auth_header = base64.b64encode(auth_string.encode()).decode()

        self.headers = {
            "Authorization": f"Basic {auth_header}",
            "Content-Type": "application/json",
        }

    def get_customers(self):
        """Fetch only customer IDs and names from FastBill API."""
        limit = 100
        offset = 0
        customers = []
        payload = {
            "SERVICE": "customer.get",
            "FILTER": {},
            "LIMIT_FIELDS": ["CUSTOMER_ID", "FIRST_NAME", "LAST_NAME"],
            "LIMIT": limit,
            "OFFSET": offset
        }

        try:
            response = requests.post(self.api_url, json=payload, headers=self.headers)
            response.raise_for_status()
            data = response.json()

            customers = data.get("RESPONSE", {}).get("CUSTOMERS", [])

            return [{"id": c["CUSTOMER_ID"], "name": f"{c['FIRST_NAME']} {c['LAST_NAME']}"} for c in customers]

        except requests.exceptions.RequestException as e:
            print(f"Error connecting to FastBill API: {e}")
            return None
        
