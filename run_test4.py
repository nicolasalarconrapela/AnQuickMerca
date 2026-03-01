from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 400, "height": 800})

    # Preload the state BEFORE going to the page
    # In playwright we can set init script
    page.add_init_script("""
        localStorage.setItem('selectedStore', '{"id": "1", "name": "Mercadona Prueba"}');
    """)

    page.goto("http://localhost:3000")

    # Wait for the splash screen to finish (it delays for 2s)
    page.wait_for_timeout(4000)
    page.screenshot(path="/home/jules/verification/home_es.png")

    html = page.content()
    print("Length of HTML:", len(html))

    # check for some keyword
    if "AnQuick" in html:
        print("Still seeing splash or generic text")

    if "Mercadona" in html:
        print("Found Mercadona in text")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
