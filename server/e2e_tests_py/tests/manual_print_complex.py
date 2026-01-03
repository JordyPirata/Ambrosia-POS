import requests
import json
import time

BASE_URL = "http://localhost:9154"

def test_complex_ticket():
    print(f"--- Starting Complex Ticket Test on {BASE_URL} ---")
    
    # 1. Create Complex Template
    template_name = "ComplexTest"
    print(f"\n[1] Creating Ticket Template '{template_name}'...")
    
    template_data = {
        "name": template_name,
        "elements": [
            # --- HEADER SECTION ---
            {
                "type": "HEADER",
                "value": "{{config.businessName}}",
                "style": {"bold": True, "justification": "CENTER", "fontSize": "EXTRA_LARGE"}
            },
            {
                "type": "TEXT",
                "value": "Authentic Cuisine",
                "style": {"justification": "CENTER", "fontSize": "NORMAL"}
            },
            {
                "type": "TEXT",
                "value": "{{config.businessAddress}}",
                "style": {"justification": "CENTER"}
            },
            {
                "type": "SEPARATOR",
                "value": "="
            },
            
            # --- TICKET INFO SECTION ---
            {
                "type": "TEXT",
                "value": "Ticket #: {{ticket.ticketId}}",
                "style": {"bold": True}
            },
            {
                "type": "TEXT",
                "value": "Date: {{ticket.date}}",
                "style": {"justification": "RIGHT"}
            },
            {
                "type": "TEXT",
                "value": "Table: {{ticket.tableName}} | Room: {{ticket.roomName}}",
                "style": {"fontSize": "NORMAL"}
            },
             {
                "type": "LINE_BREAK",
                "value": ""
            },
            
            # --- ITEMS SECTION ---
            {
                "type": "TABLE_HEADER",
                "value": "Qty Item             Price",
                "style": {"bold": True} 
            },
            {
                "type": "SEPARATOR",
                "value": "-"
            },
            {
                "type": "TABLE_ROW",
                "value": "" # Value ignored for rows, data comes from ticketData
            },
            {
                "type": "SEPARATOR",
                "value": "-"
            },
            
            # --- TOTAL SECTION ---
            {
                "type": "TEXT",
                "value": "TOTAL: ${{ticket.total}}",
                "style": {"bold": True, "justification": "RIGHT", "fontSize": "LARGE"}
            },
            {
                "type": "LINE_BREAK",
                "value": ""
            },
            
            # --- FOOTER SECTION ---
            {
                "type": "TEXT",
                "value": "Wifi: Free_Ambrosia",
                "style": {"justification": "CENTER"}
            },
            {
                "type": "FOOTER",
                "value": "Thank you for your visit!",
                "style": {"justification": "CENTER", "bold": True}
            }
        ]
    }
    
    try:
        # Try to delete it first to ensure we update if it exists (or just create new version if name unique logic permits, but usually name is unique)
        # For this test, we handle 409 by assuming it's ok or just using it.
        # Ideally we'd fetch ID by name and update, but let's try creating.
        res = requests.post(f"{BASE_URL}/templates", json=template_data)
        if res.status_code == 201:
            print(f"✅ Template created. ID: {res.json()['id']}")
        elif res.status_code == 409:
            print("⚠️ Template already exists. Proceeding with print...")
        else:
            print(f"❌ Failed to create template: {res.status_code} {res.text}")
            return
    except Exception as e:
         print(f"❌ Connection error creating template: {e}")
         return

    # 2. Get Printer
    print("\n[2] Getting available printers...")
    try:
        res = requests.get(f"{BASE_URL}/printers")
        printers = res.json()
        if not printers:
            print("❌ No printers found.")
            return
        target_printer = printers[0]
        print(f"👉 Using printer: {target_printer}")
        
        # Ensure it's set
        requests.post(f"{BASE_URL}/printers/set", json={"printerType": "CUSTOMER", "printerName": target_printer})
    except Exception as e:
        print(f"❌ Error getting printers: {e}")
        return

    # 3. Print Complex Ticket
    print("\n[3] Sending Complex Print Job...")
    try:
        ticket_payload = {
            "templateName": template_name,
            "printerType": "CUSTOMER", # Using CUSTOMER type this time
            "ticketData": {
                "ticketId": "ORD-9988",
                "tableName": "Table 5",
                "roomName": "Terrace",
                "date": "2024-01-02 21:30",
                "total": 45.50,
                "items": [
                    {
                        "quantity": 2, 
                        "name": "Mojito Classico", 
                        "price": 12.00,
                        "comments": ["Less sugar"]
                    },
                    {
                        "quantity": 1, 
                        "name": "Nachos Supreme", 
                        "price": 15.50,
                        "comments": []
                    },
                    {
                        "quantity": 1, 
                        "name": "Spicy Wings (6)", 
                        "price": 6.00,
                        "comments": ["Extra hot sauce"]
                    }
                ]
            }
        }
        
        res = requests.post(f"{BASE_URL}/printers/print", json=ticket_payload)
        if res.status_code == 200:
            print("✅ Complex Print job sent successfully!")
        else:
            print(f"❌ Failed to print: {res.status_code} {res.text}")
    except Exception as e:
         print(f"❌ Connection error printing: {e}")

if __name__ == "__main__":
    test_complex_ticket()
