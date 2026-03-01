from playwright.sync_api import sync_playwright

def test_errors(page):
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Error: {err}"))
    page.goto("http://localhost:3000")
    page.wait_for_timeout(3000)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        test_errors(page)
    finally:
        browser.close()
