import os
import requests
import csv

def fetch_store_products():
    # Set up the exact headers generated from your browser session
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

    # Include the necessary query parameters for the API call
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
        
        # Iterate over each category group in the details dictionary
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
                    image = item.get('photo') or item.get('item_photo') or ''
                    
                    price = ''
                    weight = ''
                    
                    # The price data is stored inside a list of dictionaries
                    # We access the first dictionary in the list to extract the actual price
                    prices_list = item.get('prices', [])
                    if isinstance(prices_list, list) and len(prices_list) > 0:
                        first_price_obj = prices_list[0]
                        price = first_price_obj.get('price', '')
                        
                        # 1. First attempt to get the weight from the price object
                        weight = first_price_obj.get('weight') or first_price_obj.get('size') or ''
                    
                    # 2. If weight is still empty, check the root weight property
                    if not weight:
                        raw_weight = item.get('weight', '')
                        
                        # Handle cases where the backend returns weight as an array
                        if isinstance(raw_weight, list) and len(raw_weight) > 0:
                            weight = raw_weight[0]
                        # Handle cases where the backend returns weight as a dictionary mapping
                        elif isinstance(raw_weight, dict) and len(raw_weight) > 0:
                            weight = next(iter(raw_weight.values()), '')
                        # Handle cases where it is a normal string
                        elif isinstance(raw_weight, str):
                            weight = raw_weight
                            
                    # 3. If weight is STILL empty, fallback to the item_description property
                    if not weight or weight == 'None':
                        weight = item.get('item_description', '')
                    
                    # Ensure weight is a string and clear it if it is just a None value
                    if not isinstance(weight, str) or weight == 'None':
                        weight = ''
                    
                    all_products.append({
                        'title': title,
                        'price': price,
                        'weight': weight.strip(),
                        'image_url': image
                    })
                
        return all_products
    else:
        print(f"Request failed. Status Code: {response.status_code}")
        return []

def save_to_csv(products):
    if not products:
        print("No data extracted.")
        return
        
    # Open the CSV file and write the headers and data rows
    with open('candyshop_products.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=['title', 'price', 'weight', 'image_url'])
        writer.writeheader()
        writer.writerows(products)
        
    print(f"Successfully saved {len(products)} products to candyshop_products.csv")

if __name__ == "__main__":
    scraped_products = fetch_store_products()
    save_to_csv(scraped_products)