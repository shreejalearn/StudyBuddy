# from transformers import pipeline

# # Initialize the question-answering pipeline
# question_generator = pipeline('question-answering', model='distilbert-base-cased-distilled-squad')

# # Define the context
# context = "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar."

# # Generate a question
# result = question_generator({
#     'question': 'What is the process by which plants create oxygen and energy?',
#     'context': context
# })

# question = result
# print(question)
from lmqg.question_generator import QuestionGenerator

# Initialize the QuestionGenerator
question_generator = QuestionGenerator()

# Define the context
context = "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar."

# Generate a question
question = question_generator.generate_question(context)

print(question)