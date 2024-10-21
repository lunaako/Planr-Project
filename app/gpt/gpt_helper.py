from openai import OpenAI
import os

def call_gpt(content):
  api_key = os.environ.get("OPENAI_API_KEY")

  client = OpenAI(api_key=api_key)

  completion = client.chat.completions.create(
      model="gpt-4o-mini",
      messages=[
          {"role": "system", "content": "You are an expert task planner and productivity consultant. Your job is to help users optimize their workflows and organize tasks efficiently."},

          {
              "role": "user",
              "content": content
          }
      ],

  )
  return completion.choices[0].message.content