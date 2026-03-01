from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})

    # Pre-set store to bypass splash directly? Can't bypass Splash entirely because it's hardcoded to start with 'splash'.
    page.goto("http://localhost:3000")
    page.evaluate("localStorage.setItem('selectedStore', '{\"id\": \"1\", \"name\": \"Mercadona Prueba\"}')")

    # We must wait for Splash screen to be done. App.tsx has setTimeout(2000).
    page.wait_for_timeout(3000)

    page.screenshot(path="/home/jules/verification/screen_es.png")
    print("Screenshotted ES")

    lang_btn = page.locator("button", has_text="es")
    if lang_btn.count() > 0:
        lang_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/screen_en.png")
        print("Done EN")
    else:
        print("ES button not found")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
