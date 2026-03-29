from dotenv import load_dotenv
import os
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import httpx
from tavily import TavilyClient
import time

load_dotenv()

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key = os.getenv("GEMINI_API_KEY")
)

PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are an expert in researching products for me on amazon. 
You search deeply about the products i just told you.

Some rules when you researching something:
1. Search according to my query
2. Use the detail and research briefly
3. Find right product for me
4. Always give direct Amazon links
5. Show price, rating, and why it suits ME

Here's some detail about me so you recommend perfectly:
Age        = 17
Skin tone  = Neutral
Height     = 170cm
Upper body = 2.5 feet
Lower body = 3.2 feet
Colors     = old money and classic colors
Face shape = oval"""),

    ("human", """Search Query  : {query}

Amazon Results:
{results}

Now analyze these results and recommend the BEST product for me personally!""")
#  ↑ human message is REQUIRED for Gemini!
])

parser = StrOutputParser()
chain  = PROMPT | llm | parser

def search_product(query : str) -> str :
    
    print(f"\n🔍 Searching Amazon for: {query}...")

    response = tavily.search(
        query=f"{query} site:amazon.com",
        search_depth="advanced",
        max_results=5,
        include_answer=True
    )


    results = response.get("results", [])

    if not results :
        return "❌ No product found, try different query"
    

    
    formatted = ""
    for i, result in enumerate(results, 1):
        title   = result.get("title", "N/A")
        url     = result.get("url", "N/A")
        content = result.get("content", "N/A")

        formatted += f"""
Product {i}:
Title   : {title}
Link    : {url}
Details : {content}
{'─' * 50}"""

    final = chain.invoke({
        "query":query,
        "results" : formatted
    })

    return final

