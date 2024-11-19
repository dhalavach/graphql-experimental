from transformers import pipeline

ner_pipeline = pipeline("token-classification", model="your-fine-tuned-model")
text = "The compressor at Well-12 has been replaced with a higher capacity pump."
ner_results = ner_pipeline(text)
print(ner_results)