import spacy
import wikipedia
from wikipedia.exceptions import DisambiguationError, PageError
from bs4 import BeautifulSoup
import requests
from typing import OrderedDict
from transformers import T5ForConditionalGeneration, AutoTokenizer
from transformers import pipeline

nlp = spacy.load("en_core_web_sm")
wikipedia.set_lang("en")

question_generator = pipeline("text2text-generation", model="valhalla/t5-small-qg-hl")

def generate_question(phrase):
    question = question_generator(phrase, max_new_tokens=50, num_return_sequences=1)[0]['generated_text'].strip()
    return question

def extract_main_phrases(text, max_phrases=5):
    doc = nlp(text)
    main_phrases = [chunk.text for chunk in doc.noun_chunks]
    main_phrases.sort(key=len, reverse=True)
    return main_phrases[:max_phrases]

def summarize_concept(main_concept, context):
    try:
        search_results = wikipedia.search(main_concept)

        page = wikipedia.page(search_results[0])

        if context.lower() in page.content.lower():
            summary = page.content.split('.')[0] + '.'
            return summary
        else:
            return select_relevant_option(main_concept, context, search_results)

    except DisambiguationError as e:
        return select_relevant_option(main_concept, context, e.options)

    except PageError:
        return generate_question(main_concept)

def select_relevant_option(main_concept, context, options):
    context_words = set(context.lower().split())
    best_match = None
    best_score = 0

    for option in options[:5]:  
        try:
            page = wikipedia.page(option)
            page_content = page.content.lower()
            match_count = sum(1 for word in context_words if word in page_content)

            if match_count > best_score:
                best_match = page
                best_score = match_count

        except PageError:
            continue

    if best_match:
        summary = best_match.content.split('.')[0] + '.'
        return summary
    else:
        return f"No relevant Wikipedia page found for '{main_concept}' in the given context."

main_concept = "Jay Gatsby"
context = "The Great Gatsby is an American classic novel by F. Scott Fitzgerald, set in the 1920s Jazz Age of New York. It tells the story of the mysterious millionaire Jay Gatsby and his pursuit of his lost love, Daisy Buchanan. Narrated by Gatsby's neighbor Nick Carraway, the novel explores themes of wealth, class, love, and the American Dream. Gatsby's lavish parties and lifestyle are ultimately revealed to be an attempt to win back Daisy, who is married to the wealthy but morally corrupt Tom Buchanan. The novel culminates in a tragic confrontation that leads to Gatsby's death. Though initially overlooked, The Great Gatsby is now considered a masterpiece of American literature and a poignant commentary on the decadence of the 1920s."
phrases = extract_main_phrases(context)
print(phrases)
for phrase in phrases:
    print(summarize_concept(phrase, context))
