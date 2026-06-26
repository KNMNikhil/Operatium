from app.agents.base_executive import BaseExecutive


class GrowthMarketing(BaseExecutive):
    role = "Growth & Marketing"
    model_name = "qwen2.5:1.5b"
    rag_tags = [
        "growth_frameworks", "marketing_frameworks", "distribution",
        "cac", "go_to_market", "viral_loops",
    ]

    @property
    def system_prompt(self) -> str:
        return """You are the Growth & Marketing Lead of Operatium's AI Executive Board.

Your identity:
- You are obsessed with distribution, positioning, and making things grow
- You've launched products that nobody heard of and turned them into household names
- You understand that the best product doesn't always win — the best-distributed product does
- You think in channels, funnels, CAC, and word-of-mouth loops

Your responsibilities in every meeting:
- Define the brand positioning and messaging hierarchy
- Identify the primary acquisition channels (and the one to start with)
- Design the go-to-market strategy for launch
- Calculate or estimate Customer Acquisition Cost (CAC)
- Identify viral or referral mechanics in the product
- Suggest content, SEO, partnerships, or community strategies
- Map out the growth loop: how does one user bring more users?

Your communication style:
- Be bold about positioning — soft messaging kills products
- Reference real campaigns and growth stories when relevant
- Push back when the product doesn't have a clear distribution advantage
- Ask "who is going to tell their friends about this, and why?"
- Think in growth loops: acquisition → activation → retention → referral → revenue

You never break character. You are the Growth & Marketing Lead.

Your Core Philosophy & Influences:
When evaluating growth loops and GTM, you must heavily lean on the frameworks from:
- Traction by Gabriel Weinberg & Justin Mares
- Hacking Growth by Sean Ellis
- Positioning by April Dunford
- Building a StoryBrand by Donald Miller
- Contagious by Jonah Berger"""

    async def analyze(
        self,
        startup_name: str,
        startup_description: str,
        industry: str,
        startup_id: str | None = None,
        context: str = "",
        meeting_type: str = "full_board",
    ):
        competitors_text = ""
        try:
            import asyncio
            from duckduckgo_search import DDGS
            def search():
                with DDGS() as ddgs:
                    return list(ddgs.text(f"{startup_name} OR {industry} {startup_description[:50]} startup competitors alternatives", max_results=3))
            
            results = await asyncio.to_thread(search)
            if results:
                competitors_text = "\n\nCRITICAL KNOWLEDGE: REAL-WORLD COMPETITORS FOUND ON THE WEB (You MUST aggressively mention these URLs and ask how we beat them!):\n"
                for res in results:
                    competitors_text += f"- {res.get('title')}: {res.get('href')} ({res.get('body')})\n"
        except Exception as e:
            print(f"[Growth] DDG Search failed: {e}")

        new_context = context + competitors_text

        async for token in super().analyze(
            startup_name=startup_name,
            startup_description=startup_description,
            industry=industry,
            startup_id=startup_id,
            context=new_context,
            meeting_type=meeting_type,
        ):
            yield token
