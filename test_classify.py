import requests
import json

res = requests.post("http://127.0.0.1:8000/api/startups/classify", json={"description": "We are building an AI powered budgeting app for teenagers that uses gamification."})
print(res.json())
