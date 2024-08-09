from huggingface_hub import login
from langchain_community.llms import HuggingFaceEndpoint

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

def generate_questions(text, num_tf=5, num_free_response=3, num_mc=2):
    prompt = (
        f"Generate {num_tf} true/false questions, {num_free_response} free response questions, "
        f"and {num_mc} multiple choice questions from the following notes. "
        "Use the following format for each question type:\n"
        "True/False Question:\n"
        "Question: [Your question here]\n"
        "Answer: [True/False]\n\n"
        "Free Response Question:\n"
        "Question: [Your question here]\n"
        "Answer: [Your answer here]\n\n"
        "Multiple Choice Question:\n"
        "Question: [Your question here]\n"
        "Options: [Option A], [Option B], [Option C], [Option D]\n"
        "Answer: [Correct option]\n\n"
        f"Notes:\n{text}\n\n"
    )
    
    
    # Generate the output using the endpoint
    response = llm(prompt)
    
    # Debugging: Print the raw response
    print("Raw response:", response)
    
    # Process the response directly
    questions = []
    lines = response.strip().split('\n')
    
    # Iterate over lines to split into questions and answers
    i = 0
    while i < len(lines):
        if lines[i].startswith("Question:") and i + 1 < len(lines) and lines[i + 1].startswith("Answer:"):
            question = lines[i].replace("Question: ", "").strip()
            answer = lines[i + 1].replace("Answer: ", "").strip()
            questions.append({
                "question": question,
                "answer": answer
            })
            i += 2  # Move to the next pair
        else:
            i += 1  # Skip any line that doesn't match the expected format

    return questions

def main():
    user_notes = """
    Machine learning is a method of data analysis that automates analytical model building. 
    It is a branch of artificial intelligence based on the idea that systems can learn from data, 
    identify patterns, and make decisions with minimal human intervention.
    """
    # user_notes = "Addition is a fundamental mathematical operation where two or more numbers are combined to find their total sum."
    # Generate questions
    questions = generate_questions(user_notes, num_tf=5, num_free_response=3, num_mc=2)

    # Print the question suggestions
    for i, question in enumerate(questions, 1):
        print(f"Question {i}:")
        print(f"Question: {question['question']}")
        print(f"Answer: {question['answer']}")
        print()

# Run the script
if __name__ == '__main__':
    main()
