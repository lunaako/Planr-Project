from openai import OpenAI
import os

from app.gpt.ai_board_schema import Board

api_key = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def call_gpt(content):
  completion = client.chat.completions.create(
      model="gpt-4o-mini",
      messages=[
          {"role": "system", "content": "You are an expert task planner and productivity consultant. Your job is to help users optimize their workflows and organize tasks efficiently. You are an assistant to help me generate answer for the clients who is using my website, so you will be ready to respond with natural language answers based on my need"},
          {
              "role": "user",
              "content": content
          }
      ],

  )
  return completion.choices[0].message.content


def call_gpt_with_schema(description, suggestion, prompt, schema):
  completion = client.beta.chat.completions.parse(
      model="gpt-4o-mini",
      messages=[
          {"role": "system", "content": "You are an expert task planner and productivity consultant. Your job is to help users optimize their workflows and organize tasks efficiently. You are an assistant to help me generate answer for the clients who is using my website, so you will be ready to respond with natural language answers or fixed json schema based on my need"},
          {
              "role": "user",
              "content": description
          },
          {
              "role": "system",
              "content": suggestion
          },
          {
              "role": "user",
              "content": "Based on your suggestion, help me to generate board based on json schema."
          }
      ],
      response_format=schema,
  )
  output = completion.choices[0].message

  if (output.refusal):
    print(output.refusal)
  else:
    print(output.parsed)  
  return output.parsed
