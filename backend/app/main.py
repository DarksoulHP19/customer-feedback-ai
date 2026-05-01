from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import FeedbackRequest, FeedbackResponse
from app.agents.sentiment import analyze_sentiment
from app.agents.clustering import cluster_topics
from app.agents.urgency import classify_urgency
from app.agents.insights import generate_insights

app = FastAPI(
    title="Customer Feedback AI",
    description="Multi-agent pipeline for analyzing customer feedback",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Customer Feedback AI is running 🚀"}

@app.post("/analyze", response_model=FeedbackResponse)
async def analyze_feedback(request: FeedbackRequest):
    """
    Full pipeline: Sentiment → Clustering → Urgency → Insights
    """
    sentiment = await analyze_sentiment(request.feedback)
    topics = await cluster_topics(request.feedback)
    urgency = await classify_urgency(request.feedback, sentiment)
    insights = await generate_insights(request.feedback, sentiment, topics, urgency)

    return FeedbackResponse(
        feedback=request.feedback,
        sentiment=sentiment,
        topics=topics,
        urgency=urgency,
        insights=insights
    )
