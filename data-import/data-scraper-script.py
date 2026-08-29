import os
import requests
import csv

def fetch_store_products():
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
    
    all_products = []

    if response.status_code == 200:
        data = response.json()
        
        details = data.get('details', {})
        
        for category_id, category_data in details.items():
            
            # Fetch items, defaulting to an empty dictionary
            items = category_data.get('items', {})
            
            # Handle cases where the API returns a dictionary of items instead of a list
            if isinstance(items, dict):
                items_to_loop = items.values()
            elif isinstance(items, list):
                items_to_loop = items
            else:
                items_to_loop = []
            
            for item in items_to_loop:
                
                # Check if the item is a dictionary to prevent attribute errors
                if isinstance(item, dict):
                    all_products.append({
                        'title': item.get('item_name', ''),
                        'price': item.get('price', ''),
                        'image_url': item.get('image', '')
                    })
                
        return all_products
    else:
        print(f"Request failed. Status Code: {response.status_code}")
        return []

def save_to_csv(products):
    if not products:
        print("No data extracted.")
        return
        
    with open('candyshop_products.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=['title', 'price', 'image_url'])
        writer.writeheader()
        writer.writerows(products)
        
    print(f"Successfully saved {len(products)} products to candyshop_products.csv")

if __name__ == "__main__":
    scraped_products = fetch_store_products()
    save_to_csv(scraped_products)