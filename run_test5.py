from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})

    # Preload the state BEFORE going to the page
    page.add_init_script("""
        localStorage.setItem('selectedStore', '{"id": "1", "name": "Mercadona Prueba"}');
    """)

    page.goto("http://localhost:3000", wait_until="networkidle")

    page.wait_for_timeout(3000)
    page.screenshot(path="/home/jules/verification/home_networkidle.png", full_page=True)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
