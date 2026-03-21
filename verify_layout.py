import time
from playwright.sync_api import sync_playwright

def verify_feature():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport
        context = browser.new_context(viewport={'width': 375, 'height': 812})
        page = context.new_page()

        # Set up a demo list
        page.goto("http://localhost:3000")
        page.evaluate('''() => {
            const demoList = {
                id: 'list-123',
                name: 'Demo List',
                items: [],
                storeId: 'store-1',
                storeName: 'Demo Store',
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            localStorage.setItem('quickmerca_lists', JSON.stringify([demoList]));
            localStorage.setItem('quickmerca_active_list', '"list-123"');
            localStorage.setItem('quickmerca_profile', JSON.stringify({ onboardingCompleted: true, language: 'en' }));
        }''')
        page.wait_for_timeout(500)

        # Reload to apply state
        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)

        # Ensure we're viewing the list (search bar is visible)
        try:
             page.click("text=Demo List", timeout=2000)
             page.wait_for_timeout(1000)
        except Exception as e:
             pass

        # Try to find the search input or demo data label to ensure it's loaded
        try:
             page.wait_for_selector('text=Usar datos de demo', timeout=3000)
        except:
             pass

        # Take a screenshot specifically of the header area containing the search component
        page.screenshot(path="/app/imgs/after_mobile_layout_fix.png", full_page=True)

        context.close()
        browser.close()

if __name__ == "__main__":
    verify_feature()
