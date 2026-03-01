from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})
    page.goto("http://localhost:3000")

    # We are in StoreSelection because localStorage is empty
    page.wait_for_timeout(3000)
    page.screenshot(path="/home/jules/verification/store.png")

    # Let's bypass Splash & StoreSelection
    page.evaluate("localStorage.setItem('selectedStore', '{\"id\": \"1\", \"name\": \"Mercadona Prueba\"}')")
    page.reload()

    page.wait_for_timeout(3000)

    page.screenshot(path="/home/jules/verification/home_es.png")

    lang_btn = page.locator("[data-testid='lang-btn']")
    if lang_btn.count() > 0:
        lang_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/home_en.png")
        print("Done EN")
    else:
        print("ES button not found")
        print(page.content())

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
