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
    # True/False Questions
    tf_prompt = (
        f"Generate {num_tf} true/false questions from the following notes: {text}.\n"
        "Use the following format for each question:\n"
        "True/False Question:\n"
        "Question: [Your question here]\n"
        "Answer: [True/False]\n\n"
        "Example:\n"
        "True/False Question:\n"
        "Question: The sky is blue.\n"
        "Answer: True\n\n"
    )
    
    # Generate the output using the endpoint
    tf_response = llm(tf_prompt)
    print("True/False Questions:", tf_response)

    tf_questions = []
    tf_pairs = tf_response.split("True/False Question:\nQuestion: ")[1:]
    for pair in tf_pairs:
        question, answer = pair.split("\nAnswer: ")
        # Strip extra text and remove possible newlines
        question = question.strip().split("\n")[0]
        answer = answer.strip().split("\n")[0]
        tf_questions.append([question, answer])

    # Free Response Questions
    fr_prompt = (
        f"Generate {num_free_response} free response questions from the following notes: {text}.\n"
        "Use the following format for each question:\n"
        "Free Response Question:\n"
        "Question: [Your question here]\n"
        "Answer: [Your answer here]\n\n"
        "Example:\n"
        "Free Response Question:\n"
        "Question: What is the capital of France?\n"
        "Answer: Paris\n\n"
    )
    
    # Generate the output using the endpoint
    fr_response = llm(fr_prompt)
    print("Free Response Questions:", fr_response)

    fr_questions = []
    fr_pairs = fr_response.split("Question: ")[1:]
    for pair in fr_pairs:
        question, answer = pair.split("\nAnswer: ")
        question = question.strip().split("\n")[0]
        answer = answer.strip().split("\n")[0]
        fr_questions.append([question, answer])


    # Multiple Choice Questions
    mc_prompt = (
        f"Generate {num_mc} multiple choice questions from the following notes: {text}.\n"
        "Use the following format for each question:\n"
        "Multiple Choice Question:\n"
        "Question: [Your question here]\n"
        "Options: [Option A], [Option B], [Option C], [Option D]\n"
        "Answer: [Correct option]\n\n"
        "Example:\n"
        "Multiple Choice Question:\n"
        "Question: What is the largest planet in our solar system?\n"
        "Options: [Mercury, Venus, Earth, Jupiter]\n"
        "Answer: Jupiter\n\n"
    )
    
    # Generate the output using the endpoint
    mc_response = llm(mc_prompt)
    print("Multiple Choice Questions:", mc_response)

    mc_questions = []
    mc_pairs = mc_response.split("Question")[1:]  # Split by "Question " instead of "Multiple Choice Question:"
    for pair in mc_pairs:
        if "Options: " in pair and "Answer: " in pair:
            question_part, rest = pair.split("Options: ")
            options, answer = rest.split("\nAnswer: ")
            question = question_part.split(":\n", 1)[-1].strip()  # Get the actual question text after "Question X:\n"
            mc_questions.append([question, options.strip(), answer.strip()])

    return tf_questions, fr_questions, mc_questions


def main():
    user_notes = """
    Machine learning is a method of data analysis that automates analytical model building. 
    It is a branch of artificial intelligence based on the idea that systems can learn from data, 
    identify patterns, and make decisions with minimal human intervention.
    """
    # user_notes = "Addition is a fundamental mathematical operation where two or more numbers are combined to find their total sum."
    # Generate questions
    tf_questions, fr_questions, mc_questions = generate_questions(user_notes, num_tf=5, num_free_response=3, num_mc=2)
    print("True/False Questions:", tf_questions)
    print("Free Response Questions:", fr_questions)
    print("Multiple Choice Questions:", mc_questions)
# Run the script
if __name__ == '__main__':
    main()