from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})

    # We load without animations? No, the DOM shows it rendered amcharts but screenshot is white.
    # It might be amcharts loading something over the network or rendering async. Let's use `page.screenshot` with `animations="disabled"`.
    page.goto("http://localhost:3000")

    page.wait_for_timeout(5000)
    page.screenshot(path="/home/jules/verification/screen_fixed.png", animations="disabled")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
