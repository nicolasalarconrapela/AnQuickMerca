from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Error: {err}"))

    page.goto("http://localhost:3000")

    page.wait_for_timeout(5000)

    page.screenshot(path="/home/jules/verification/screen_err.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
