from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})

    # We will log any console errors that might prevent rendering
    errors = []
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda err: errors.append(str(err)))

    page.goto("http://localhost:3000")

    # Try waiting for root div to contain something
    try:
        page.wait_for_selector("#root > div", timeout=5000)
        print("Root rendered!")
    except Exception as e:
        print("Timeout waiting for root > div:", e)

    page.screenshot(path="/home/jules/verification/screen_blank.png")

    if errors:
        print("Errors found:", errors)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
