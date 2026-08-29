import os
import requests
import json

def debug_specific_item():
    headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.6',
        'authorization': f"Bearer {os.environ['INDOLJ_TOKEN']}",
        'origin': 'https://candyshop.com.pk',
        'priority': 'u=1, i',
        'referer': 'https://candyshop.com.pk/',
        'sec-ch-ua': '"Chromium";v="152", "Not?A_Brand";v="24", "Brave";v="152"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
    }

    params = {
        'domain': 'candyshop.com.pk',
        'json': '1',
        'api_version': '0.3.66',
    }

    url = 'https://console.indolj.io/mobileapp/WebApiV2/StructuredMenu'
    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()
        details = data.get('details', {})
        
        for category_id, category_data in details.items():
            items = category_data.get('items', {})
            
            # Standardize the items data into a list for looping
            if isinstance(items, dict):
                items_to_loop = items.values()
            elif isinstance(items, list):
                items_to_loop = items
            else:
                items_to_loop = []
            
            for item in items_to_loop:
                if isinstance(item, dict):
                    title = item.get('item_name', '')
                    
                    # Isolate the exact product missing its weight
                    if title == "Cadbury Dairy Milk Pouch ":
                        print(f"--- RAW JSON FOR {title} ---")
                        # Print the complete dictionary structure to the terminal
                        print(json.dumps(item, indent=4))
                        print("-----------------------------------")
                        # Exit the function immediately after finding the target
                        return
                        
    else:
        print(f"Request failed. Status Code: {response.status_code}")

if __name__ == "__main__":
    debug_specific_item()