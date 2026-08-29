import os
import requests
import csv
import re

def clean_weight_for_shopify(weight_str):
    # Return 0 if the weight string is empty
    if not weight_str:
        return 0
        
    weight_str = weight_str.lower()
    
    # Extract all numeric values, including decimals
    numbers = re.findall(r'[\d.]+', weight_str)
    
    if not numbers:
        return 0
        
    # Take the final number to handle multi-pack strings like "8x20.7g 165.6g"
    final_number = float(numbers[-1])
    
    # Convert kilograms to grams for Shopify compatibility
    if 'kg' in weight_str:
        final_number *= 1000
        
    return int(final_number)

def create_shopify_handle(title):
    handle = title.lower()
    
    # Strip out any characters that are not lowercase letters, numbers, spaces, or hyphens
    handle = re.sub(r'[^a-z0-9\s-]', '', handle)
    
    # Collapse multiple spaces or hyphens into a single hyphen
    handle = re.sub(r'[\s-]+', '-', handle)
    
    return handle.strip('-')

def fetch_store_products():
    # Fresh authorization headers provided from the network tab
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
            
            # Map category name to Shopify Type and Tags
            category_info = category_data.get('category_info', {})
            category_name = category_info.get('category_name', 'General')
            
            items = category_data.get('items', {})
            
            # Ensure items structure is iterable
            if isinstance(items, dict):
                items_to_loop = items.values()
            elif isinstance(items, list):
                items_to_loop = items
            else:
                items_to_loop = []
            
            for item in items_to_loop:
                if isinstance(item, dict):
                    
                    title = item.get('item_name', '').strip()
                    if not title:
                        continue
                        
                    image = item.get('photo') or item.get('item_photo') or ''
                    
                    price = ''
                    weight = ''
                    
                    # Extract price and initial weight guess from the nested prices list
                    prices_list = item.get('prices', [])
                    if isinstance(prices_list, list) and len(prices_list) > 0:
                        first_price_obj = prices_list[0]
                        price = first_price_obj.get('price', '')
                        weight = first_price_obj.get('weight') or first_price_obj.get('size') or ''
                    
                    # Fallback to root weight key
                    if not weight:
                        raw_weight = item.get('weight', '')
                        if isinstance(raw_weight, list) and len(raw_weight) > 0:
                            weight = raw_weight[0]
                        elif isinstance(raw_weight, dict) and len(raw_weight) > 0:
                            weight = next(iter(raw_weight.values()), '')
                        elif isinstance(raw_weight, str):
                            weight = raw_weight
                            
                    # Final fallback to item description key
                    if not weight or weight == 'None':
                        weight = item.get('item_description', '')
                    
                    if not isinstance(weight, str) or weight == 'None':
                        weight = ''
                        
                    # Format data for Shopify CSV mapping
                    handle = create_shopify_handle(title)
                    grams = clean_weight_for_shopify(weight)
                    
                    # Map the extracted data to exact Shopify headers
                    all_products.append({
                        'Handle': handle,
                        'Title': title,
                        'Body (HTML)': weight if weight else '',
                        'Vendor': 'Candyshop',
                        'Type': category_name,
                        'Tags': f"{category_name}, Imported",
                        'Published': 'TRUE',
                        'Option1 Name': 'Title',
                        'Option1 Value': 'Default Title',
                        'Variant Grams': grams,
                        'Variant Inventory Tracker': 'shopify',
                        'Variant Inventory Qty': 100,
                        'Variant Inventory Policy': 'deny',
                        'Variant Fulfillment Service': 'manual',
                        'Variant Price': price,
                        'Variant Requires Shipping': 'TRUE',
                        'Variant Taxable': 'TRUE',
                        'Image Src': image
                    })
                
        return all_products
    else:
        print(f"Request failed. Status Code: {response.status_code}")
        return []

def save_to_shopify_csv(products):
    if not products:
        print("No data extracted.")
        return
        
    # Required Shopify CSV headers
    shopify_columns = [
        'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
        'Option1 Name', 'Option1 Value', 'Variant Grams', 'Variant Inventory Tracker',
        'Variant Inventory Qty', 'Variant Inventory Policy', 'Variant Fulfillment Service',
        'Variant Price', 'Variant Requires Shipping', 'Variant Taxable', 'Image Src'
    ]
        
    with open('shopify_import.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=shopify_columns)
        writer.writeheader()
        writer.writerows(products)
        
    print(f"Successfully saved {len(products)} products to shopify_import.csv ready for upload.")

if __name__ == "__main__":
    scraped_products = fetch_store_products()
    save_to_shopify_csv(scraped_products)