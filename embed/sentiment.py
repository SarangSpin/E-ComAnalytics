from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from textblob import TextBlob

# Set up the Firefox WebDriver
driver = webdriver.Firefox()

def search_product_and_analyze_sentiment(product_name):
    try:
        # Open the website
        driver.get('http://localhost:5173')  # Replace with the actual URL if different

        # Find the search box and search for the product
        search_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="text"]'))
        )
        search_box.send_keys(product_name)
        search_box.send_keys(Keys.RETURN)

        time.sleep(6)
        # Wait for search results to load and display the product grid
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '.product-grid'))
        )

        time.sleep(2)

        # Get all product tiles
        product_tiles = driver.find_elements(By.CSS_SELECTOR, '.product-tile')

        if not product_tiles:
            print("No products found for the search.")
            return

        for product_tile in product_tiles:
            # Click on the product
            product_tile.click()
           
            # Wait for the product detail page to load
            # time.sleep(2)
            # WebDriverWait(driver, 10).until(
            #     EC.presence_of_element_located((By.CSS_SELECTOR, '.product-detail-page'))
            # )
            # print('In reviews part 2')
            time.sleep(2)
            # Scroll to the reviews section (if needed)
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, '.reviewText'))
            )
            time.sleep(2)
          
            # Find and extract all reviews
            reviews = driver.find_elements(By.CSS_SELECTOR, '.reviewText')
            review_texts = [review.text for review in reviews]
        
            if not review_texts:
                print("No reviews found for this product.")
                continue
            
            # Perform sentiment analysis using TextBlob
            sentiments = []
            for review in review_texts:
                analysis = TextBlob(review)
                sentiment = analysis.sentiment.polarity
                print(review + ":" + str(sentiment))
                sentiments.append(sentiment)

            # Calculate the overall sentiment
            overall_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0

            print(f'Overall Sentiment for "{product_name}": {overall_sentiment}')
            break  # Exit the loop once a product with reviews is found and analyzed

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the browser
        driver.quit()

# Example usage
search_product_and_analyze_sentiment('nikon')  # Replace with the product name you want to search for
