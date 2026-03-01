from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})

    page.goto("http://localhost:3000")
    page.wait_for_timeout(3000)

    html = page.content()
    with open("dom.html", "w") as f:
        f.write(html)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
