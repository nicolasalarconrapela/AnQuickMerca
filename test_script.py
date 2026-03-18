from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Navigate to local dev server
        page.goto("http://localhost:3000")

        # set local storage so we skip the welcome screen
        page.evaluate("localStorage.setItem('userProfile', JSON.stringify({ name: 'DesktopUser' })); localStorage.setItem('selectedStore', JSON.stringify({ id: 'store1', name: 'Mercadona Center' }));")
        page.reload()
        page.wait_for_timeout(3000) # wait for the list view to load

        # Take a screenshot to verify edge-to-edge layout on the home view
        page.screenshot(path="/home/jules/verification/test_home.png", full_page=True)

        context.close()
        browser.close()

if __name__ == "__main__":
    run()
