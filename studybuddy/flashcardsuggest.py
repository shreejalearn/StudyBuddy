from huggingface_hub import login
from langchain_community.llms import HuggingFaceEndpoint
from bs4 import BeautifulSoup

# Log in to Hugging Face with your API token
login(token="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")

# List of models and default index
list_llm = [
    "mistralai/Mistral-7B-Instruct-v0.2",
    "mistralai/Mixtral-8x7B-Instruct-v0.1",
    "mistralai/Mistral-7B-Instruct-v0.1",
    "google/gemma-7b-it",
    "google/gemma-2b-it",
    "HuggingFaceH4/zephyr-7b-beta",
    "HuggingFaceH4/zephyr-7b-gemma-v0.1",
    "meta-llama/Llama-2-7b-chat-hf",
    "microsoft/phi-2",
    "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    "mosaicml/mpt-7b-instruct",
    "tiiuae/falcon-7b-instruct",
    "google/flan-t5-xxl"
]
default_llm_index = 0

# Initialize the endpoint
llm_model = list_llm[default_llm_index]
llm = HuggingFaceEndpoint(
    repo_id=llm_model,
    temperature=0.5,  # Lower temperature for more deterministic output
    max_new_tokens=500,  # Increase to allow for more output
    top_k=20
)

def generate_flashcards(text, num_flashcards=10):
    prompt = (
        f"Generate {num_flashcards} flashcards from the following notes. "
        "Each flashcard should have a clear question and answer. "
        "Format each flashcard as follows:\n"
        "Question: [Your question here]\n"
        "Answer: [Your answer here]\n\n"
        "Make sure to include both the question and answer in your response for each flashcard. \n"
        f"Notes:\n{text}\n\n"
    )
    
    # Generate the output using the endpoint
    response = llm(prompt)
    
    # Debugging: Print the raw response
    print("Raw response:", response)
    
    
    # Process the response directly
    flashcards = []
    lines = response.strip().split('\n')
    
    # Iterate over lines to split into questions and answers
    i = 0
    while i < len(lines):
        if lines[i].startswith("Question:") and i + 1 < len(lines) and lines[i + 1].startswith("Answer:"):
            question = lines[i].replace("Question: ", "").strip()
            answer = lines[i + 1].replace("Answer: ", "").strip()
            flashcards.append({
                "question": question,
                "answer": answer
            })
            i += 2  # Move to the next pair
        else:
            i += 1  # Skip any line that doesn't match the expected format

    return flashcards


def main():
    # user_notes = """
    # To find the area of a triangle, use the formula Area = 1/2 * base * height,  where the base is the length of one side of the triangle and the height is the perpendicular distance from that side to the opposite vertex.
    # """
    user_notes = """
    Machine learning is a method of data analysis that automates analytical model building. 
    It is a branch of artificial intelligence based on the idea that systems can learn from data, 
    identify patterns, and make decisions with minimal human intervention.
    """
    # Generate flashcards
    flashcards = generate_flashcards(user_notes)

    # Print the flashcard suggestions
    for i, flashcard in enumerate(flashcards, 1):
        print(f"Flashcard {i}:")
        print(f"Question: {flashcard['question']}")
        print(f"Answer: {flashcard['answer']}")
        print()

# Run the script
if __name__ == '__main__':
    main()