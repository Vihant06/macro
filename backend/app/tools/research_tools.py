from langchain.tools import tool
from langchain_exa import ExaSearchRetriever
from langchain_tavily import TavilySearch
from app.core.config import settings

def _get_exa_retriever():
    return ExaSearchRetriever(
        api_key=settings.exa_api_key,
        k=3,
        highlights=True
    )

@tool
def research_fitness_science(query: str) -> str:
    """Research exercise science, muscle growth, recovery,
    progressive overload, training frequency and workout strategies."""
    retriever = _get_exa_retriever()
    docs = retriever.invoke(query)

    return "\n\n".join([
        f"Source: {doc.metadata.get('url', 'N/A')}\n"
        f"Research: {doc.metadata.get('highlights', doc.page_content)}"
        for doc in docs
    ])

def _get_tavily():
    return TavilySearch(
        api_key=settings.tavily_api_key,
        max_results=5,
        topic="general",
        search_depth="basic"
    )

@tool
def gym_web_search(query: str):
    """
    Search the web for current gym, fitness, workout,
    exercise, nutrition and supplement information.

    Use this tool when users ask for recent information,
    scientific research, fitness guidelines or facts
    that require external verification.
    """
    tavily = _get_tavily()
    results = tavily.invoke({"query": query})
    return results
