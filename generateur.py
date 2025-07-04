from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

# Charger le modèle et le tokenizer GPT-2
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

# Mettre le modèle en mode évaluation
model.eval()

# Ton texte de départ
prompt = "Il était une fois un jeune développeur à Madagascar"

# Transformer le prompt en tokens
input_ids = tokenizer.encode(prompt, return_tensors='pt')

# Génération du texte
output = model.generate(
    input_ids,
    max_length=100,         # nombre total de mots/tokens générés
    temperature=0.9,        # plus haut = plus créatif
    num_return_sequences=1, # combien de textes à générer
    no_repeat_ngram_size=2, # évite les répétitions
)

# Conversion en texte
generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

# Affichage du texte généré
print("\n--- Texte généré ---\n")
print(generated_text)