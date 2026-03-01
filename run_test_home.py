from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})

    # Let's bypass Splash & StoreSelection
    page.add_init_script("""
        localStorage.setItem('selectedStore', '{"id": "1", "name": "Mercadona Prueba"}');
    """)

    page.goto("http://localhost:3000")

    # Give it some time to finish splash delay
    page.wait_for_timeout(4000)
    page.screenshot(path="/home/jules/verification/home_es_fixed.png", animations="disabled")

    lang_btn = page.locator("[data-testid='lang-btn']")
    if lang_btn.count() > 0:
        lang_btn.click()
        page.wait_for_timeout(2000)
        page.screenshot(path="/home/jules/verification/home_en_fixed.png", animations="disabled")
    else:
        print("Lang btn not found")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
