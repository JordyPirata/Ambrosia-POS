import requests
import json
import time

BASE_URL = "http://localhost:9154"

def test_feature_printing():
    print(f"--- Starting Printing Feature Test on {BASE_URL} ---")
    
    # 1. Create a Ticket Template
    print("\n[1] Creating Ticket Template 'FeatureTest'...")
    template_data = {
        "name": "FeatureTest",
        "elements": [
            {
                "type": "HEADER",
                "value": "Feature Test Ticket",
                "style": {"bold": True, "justification": "CENTER", "fontSize": "LARGE"}
            },
            {
                "type": "TEXT",
                "value": "Printer: {{config.businessName}}",
                "style": {"justification": "CENTER"}
            },
             {
                "type": "SEPARATOR",
                "value": "="
            },
            {
                "type": "TEXT",
                "value": "If you can read this, printing works!",
                "style": {"bold": True}
            },
            {
                "type": "FOOTER",
                "value": "End of Test",
                "style": {"justification": "CENTER"}
            }
        ]
    }
    
    try:
        # Check if template exists first to avoid conflict error on re-run
        # But we assume clean state or ignore conflict
        res = requests.post(f"{BASE_URL}/templates", json=template_data)
        if res.status_code == 201:
            print(f"✅ Template created. ID: {res.json()['id']}")
        elif res.status_code == 409:
            print("⚠️ Template 'FeatureTest' already exists. Using existing one.")
        else:
            print(f"❌ Failed to create template: {res.status_code} {res.text}")
            return
    except Exception as e:
         print(f"❌ Connection error creating template: {e}")
         return

    # 2. List Available Printers
    print("\n[2] Listing Available Printers...")
    try:
        res = requests.get(f"{BASE_URL}/printers")
        if res.status_code == 200:
            printers = res.json()
            print(f"Found printers: {printers}")
            
            if not printers:
                print("❌ No printers found available on the server system.")
                print("Cannot proceed with physical printing test.")
                return
                
            target_printer = printers[0] # Pick the first one
            print(f"👉 Selecting printer: '{target_printer}' for testing.")
        else:
            print(f"❌ Failed to list printers: {res.status_code} {res.text}")
            return
    except Exception as e:
        print(f"❌ Connection error listing printers: {e}")
        return

    # 3. Set Printer as KITCHEN
    print(f"\n[3] Setting '{target_printer}' as KITCHEN printer...")
    try:
        payload = {
            "printerType": "KITCHEN",
            "printerName": target_printer
        }
        res = requests.post(f"{BASE_URL}/printers/set", json=payload)
        if res.status_code == 200:
            print("✅ Printer configured successfully.")
        else:
            print(f"❌ Failed to set printer: {res.status_code} {res.text}")
            return
    except Exception as e:
         print(f"❌ Connection error setting printer: {e}")
         return

    # 4. Print Ticket
    print("\n[4] Sending Print Job...")
    try:
        ticket_data = {
            "templateName": "FeatureTest",
            "printerType": "KITCHEN",
            "ticketData": {
                "ticketId": "TEST-001",
                "tableName": "Debug Table",
                "roomName": "Debug Room",
                "date": "2023-12-30 12:00:00",
                "total": 123.45,
                "items": [
                    {
                        "quantity": 1, 
                        "name": "Test Item", 
                        "price": 100.00,
                        "comments": ["No onions"]
                    },
                     {
                        "quantity": 2, 
                        "name": "Side Dish", 
                        "price": 11.72
                    }
                ]
            }
        }
        
        res = requests.post(f"{BASE_URL}/printers/print", json=ticket_data)
        if res.status_code == 200:
            print("✅ Print job sent! Check your printer.")
        else:
            print(f"❌ Failed to print: {res.status_code} {res.text}")
    except Exception as e:
         print(f"❌ Connection error printing: {e}")

if __name__ == "__main__":
    test_feature_printing()
