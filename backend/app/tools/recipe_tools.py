from langchain.tools import tool
from langchain_firecrawl import FirecrawlSearch, FirecrawlScrape
from app.core.config import settings

def _get_firecrawl_search():
    if settings.firecrawl_api_key:
        return FirecrawlSearch(api_key=settings.firecrawl_api_key)
    return FirecrawlSearch()

def _get_firecrawl_scrape():
    if settings.firecrawl_api_key:
        return FirecrawlScrape(api_key=settings.firecrawl_api_key)
    return FirecrawlScrape()

@tool
def firecrawl_search_recipes(query: str) -> str:
    """Search the web for relevant recipes and return titles,
    URLs, and descriptions."""
    searcher = _get_firecrawl_search()
    results = searcher.invoke({
        "query": query,
        "limit": 2
    })
    return str(results)

@tool
def firecrawl_scrape(url: str) -> str:
    """Scrape a recipe webpage and extract ingredients,
    quantities, serving sizes, and cooking instructions."""
    scraper = _get_firecrawl_scrape()
    result = scraper.invoke({"url": url})
    return result.get("markdown", str(result))
