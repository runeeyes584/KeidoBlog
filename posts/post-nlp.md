---
title: Xử lí ngôn ngữ tự nhiên
date: 2025-02-09
author: Kaleidoscope
category: Programming
readingTime: 30 phút đọc
excerpt: Nhập môn Trí tuệ nhân tạo - Xử lí ngôn ngữ tự nhiên.
---

# Xử lý Ngôn ngữ Tự nhiên: Kiến thức Nền tảng Bậc Đại học

Xử lý ngôn ngữ tự nhiên (Natural Language Processing - NLP) là một nhánh của trí tuệ nhân tạo, tập trung vào việc xây dựng các hệ thống có khả năng hiểu, phân tích và tạo ra ngôn ngữ con người. Bài viết này trình bày các kiến thức cốt lõi thường được giảng dạy trong chương trình đại học, từ tiền xử lý văn bản đến các mô hình ngôn ngữ hiện đại.


## 1. Tiền xử lý văn bản (Text Preprocessing)

Trước khi đưa văn bản vào bất kỳ mô hình nào, ta cần chuẩn hóa và làm sạch dữ liệu thô. Đây là bước nền tảng ảnh hưởng trực tiếp đến chất lượng của toàn bộ pipeline.

### 1.1 Tokenization

Tokenization là quá trình tách văn bản thành các đơn vị nhỏ hơn gọi là token. Token có thể là từ, ký tự, hoặc subword tùy theo chiến lược.

```python
import re
from nltk.tokenize import word_tokenize, sent_tokenize
import nltk

nltk.download('punkt', quiet=True)

text = "Xử lý ngôn ngữ tự nhiên rất thú vị. Chúng ta hãy cùng tìm hiểu nhé!"

# Tokenize theo câu
sentences = sent_tokenize(text)
print("Câu:", sentences)

# Tokenize theo từ
words = word_tokenize(text)
print("Từ:", words)

# Tokenize thủ công bằng regex
tokens_regex = re.findall(r'\b\w+\b', text.lower())
print("Regex tokens:", tokens_regex)
```

Với tiếng Anh, word_tokenize của NLTK hoạt động tốt. Với tiếng Việt, cần dùng thư viện chuyên biệt như `underthesea` hoặc `pyvi`.

```python
# Ví dụ tokenize tiếng Việt
# pip install underthesea

from underthesea import word_tokenize as vn_tokenize

text_vn = "Tôi đang học xử lý ngôn ngữ tự nhiên tại trường đại học."
tokens_vn = vn_tokenize(text_vn)
print("Tiếng Việt:", tokens_vn)
# Output: ['Tôi', 'đang', 'học', 'xử lý ngôn ngữ tự nhiên', 'tại', 'trường đại học', '.']
```

### 1.2 Lowercasing và chuẩn hóa Unicode

```python
import unicodedata

def normalize_text(text: str) -> str:
    # Chuyển về chữ thường
    text = text.lower()
    # Chuẩn hóa Unicode về dạng NFC
    text = unicodedata.normalize('NFC', text)
    # Xóa khoảng trắng thừa
    text = re.sub(r'\s+', ' ', text).strip()
    return text

sample = "  Xử  Lý   NGÔN NGỮ   Tự Nhiên  "
print(normalize_text(sample))
# Output: "xử lý ngôn ngữ tự nhiên"
```

### 1.3 Loại bỏ stopwords

Stopwords là các từ xuất hiện nhiều nhưng ít mang nghĩa như "là", "và", "của", "the", "is", "a".

```python
from nltk.corpus import stopwords
import nltk

nltk.download('stopwords', quiet=True)

stop_words_en = set(stopwords.words('english'))

def remove_stopwords(tokens: list, lang_stopwords: set) -> list:
    return [token for token in tokens if token not in lang_stopwords]

tokens = ["natural", "language", "processing", "is", "a", "fascinating", "field"]
filtered = remove_stopwords(tokens, stop_words_en)
print("Sau khi lọc stopwords:", filtered)
# Output: ['natural', 'language', 'processing', 'fascinating', 'field']

# Tự định nghĩa stopwords tiếng Việt
stop_words_vn = {"là", "và", "của", "trong", "có", "các", "những", "được", "này", "đó"}

tokens_vn = ["xử", "lý", "ngôn", "ngữ", "tự", "nhiên", "là", "lĩnh", "vực", "thú", "vị"]
filtered_vn = remove_stopwords(tokens_vn, stop_words_vn)
print("Tiếng Việt sau lọc:", filtered_vn)
```

### 1.4 Stemming và Lemmatization

Hai kỹ thuật này đưa từ về dạng gốc, giúp giảm kích thước từ vựng.

**Stemming** cắt bỏ hậu tố theo quy tắc cứng nhắc, không quan tâm ngữ nghĩa:

```python
from nltk.stem import PorterStemmer, SnowballStemmer

ps = PorterStemmer()
ss = SnowballStemmer("english")

words = ["running", "runs", "runner", "easily", "fairly", "studies", "studying"]

print("Porter Stemmer:")
for w in words:
    print(f"  {w} -> {ps.stem(w)}")

print("\nSnowball Stemmer:")
for w in words:
    print(f"  {w} -> {ss.stem(w)}")
```

**Lemmatization** tra từ điển, trả về lemma đúng nghĩa ngữ pháp:

```python
from nltk.stem import WordNetLemmatizer
import nltk

nltk.download('wordnet', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)

lemmatizer = WordNetLemmatizer()

# Cần chỉ định Part-of-Speech để lemmatize chính xác
# n = noun, v = verb, a = adjective, r = adverb
examples = [
    ("running", "v"),
    ("better",  "a"),
    ("geese",   "n"),
    ("studies", "v"),
]

for word, pos in examples:
    lemma = lemmatizer.lemmatize(word, pos=pos)
    print(f"  {word} ({pos}) -> {lemma}")

# Output:
#   running (v) -> run
#   better  (a) -> good
#   geese   (n) -> goose
#   studies (v) -> study
```


## 2. Biểu diễn văn bản (Text Representation)

Mô hình máy học yêu cầu đầu vào dạng số. Biểu diễn văn bản là quá trình ánh xạ từ hoặc câu thành vector số học.

### 2.1 Bag of Words (BoW)

BoW biểu diễn văn bản bằng tần suất xuất hiện của từng từ, bỏ qua thứ tự.

```python
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np

corpus = [
    "I love natural language processing",
    "NLP is a fascinating field of AI",
    "I love machine learning and NLP",
    "Deep learning powers modern NLP systems",
]

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(corpus)

print("Từ vựng:", vectorizer.get_feature_names_out())
print("\nMa trận BoW:")
print(X.toarray())
print("\nKích thước:", X.shape)
# Mỗi hàng là một văn bản, mỗi cột là một từ trong từ vựng
```

Nhược điểm lớn của BoW: không nắm bắt được ngữ nghĩa và bỏ qua hoàn toàn thứ tự từ.

### 2.2 TF-IDF (Term Frequency - Inverse Document Frequency)

TF-IDF cải tiến BoW bằng cách giảm trọng số của các từ phổ biến và tăng trọng số của từ đặc trưng cho tài liệu.

Công thức:

```
TF(t, d)  = (số lần từ t xuất hiện trong d) / (tổng số từ trong d)
IDF(t, D) = log(|D| / (1 + |{d ∈ D : t ∈ d}|))
TF-IDF(t, d, D) = TF(t, d) × IDF(t, D)
```

```python
from sklearn.feature_extraction.text import TfidfVectorizer

tfidf = TfidfVectorizer(
    max_features=20,      # Giới hạn 20 từ phổ biến nhất
    ngram_range=(1, 2),   # Dùng cả unigram và bigram
    sublinear_tf=True,    # Dùng log(TF) thay vì TF thô
)

X_tfidf = tfidf.fit_transform(corpus)

print("Đặc trưng:", tfidf.get_feature_names_out())
print("\nMa trận TF-IDF (làm tròn 3 chữ số):")
print(np.round(X_tfidf.toarray(), 3))

# Tính TF-IDF thủ công để hiểu rõ hơn
import math

def compute_tf(doc_tokens: list) -> dict:
    tf = {}
    for token in doc_tokens:
        tf[token] = tf.get(token, 0) + 1
    total = len(doc_tokens)
    return {k: v / total for k, v in tf.items()}

def compute_idf(all_docs: list) -> dict:
    N = len(all_docs)
    idf = {}
    all_tokens = set(t for doc in all_docs for t in doc)
    for token in all_tokens:
        df = sum(1 for doc in all_docs if token in doc)
        idf[token] = math.log(N / (1 + df))
    return idf

docs_tokenized = [doc.lower().split() for doc in corpus]
idf_scores = compute_idf(docs_tokenized)

for word, score in sorted(idf_scores.items(), key=lambda x: -x[1])[:5]:
    print(f"  IDF({word}) = {score:.3f}")
```

### 2.3 N-gram Language Model

N-gram là chuỗi n token liên tiếp. Mô hình n-gram ước lượng xác suất của một từ dựa trên n-1 từ trước đó.

```python
from nltk import ngrams
from collections import defaultdict, Counter

def build_ngram_model(corpus: list, n: int) -> dict:
    """Xây dựng mô hình n-gram đơn giản."""
    model = defaultdict(Counter)
    
    for sentence in corpus:
        tokens = sentence.lower().split()
        # Thêm ký hiệu bắt đầu và kết thúc
        tokens = ['<s>'] * (n - 1) + tokens + ['</s>']
        
        for gram in ngrams(tokens, n):
            context = gram[:-1]  # n-1 từ đầu
            target  = gram[-1]   # từ cuối
            model[context][target] += 1
    
    return model

def get_probability(model: dict, context: tuple, word: str, vocab_size: int) -> float:
    """Xác suất P(word | context) với Laplace smoothing."""
    count_context = sum(model[context].values())
    count_word    = model[context][word]
    # Add-1 (Laplace) smoothing
    return (count_word + 1) / (count_context + vocab_size)

training_corpus = [
    "the cat sat on the mat",
    "the cat ate the rat",
    "the dog sat on the log",
    "the dog chased the cat",
]

bigram_model = build_ngram_model(training_corpus, n=2)

# Sinh văn bản ngẫu nhiên từ mô hình bigram
import random

def generate_text(model: dict, n: int, max_len: int = 10) -> str:
    context = tuple(['<s>'] * (n - 1))
    result  = []
    
    for _ in range(max_len):
        if context not in model:
            break
        next_word = model[context].most_common(1)[0][0]
        if next_word == '</s>':
            break
        result.append(next_word)
        context = context[1:] + (next_word,)
    
    return ' '.join(result)

print("Văn bản sinh ra:", generate_text(bigram_model, n=2))
```

### 2.4 Word Embeddings - Word2Vec

Word2Vec học biểu diễn vector dày đặc (dense vector) cho từng từ, nắm bắt được quan hệ ngữ nghĩa.

Hai kiến trúc chính:
- **CBOW** (Continuous Bag of Words): dự đoán từ trung tâm từ ngữ cảnh xung quanh.
- **Skip-gram**: dự đoán các từ ngữ cảnh từ từ trung tâm.

```python
from gensim.models import Word2Vec
import numpy as np

sentences = [
    ["king", "rules", "the", "kingdom"],
    ["queen", "rules", "the", "kingdom"],
    ["man", "is", "a", "human"],
    ["woman", "is", "a", "human"],
    ["king", "is", "a", "man"],
    ["queen", "is", "a", "woman"],
    ["prince", "will", "be", "king"],
    ["princess", "will", "be", "queen"],
]

# Huấn luyện mô hình Skip-gram
model = Word2Vec(
    sentences,
    vector_size=50,   # Chiều của vector
    window=3,         # Kích thước cửa sổ ngữ cảnh
    min_count=1,      # Bỏ từ xuất hiện ít hơn ngưỡng
    sg=1,             # sg=1: Skip-gram, sg=0: CBOW
    epochs=200,
    seed=42,
)

# Kiểm tra độ tương đồng
print("Độ tương đồng king-queen:", model.wv.similarity('king', 'queen'))
print("Độ tương đồng king-man:",   model.wv.similarity('king', 'man'))

# Phép toán vector nổi tiếng: king - man + woman = ?
result = model.wv.most_similar(
    positive=['king', 'woman'],
    negative=['man'],
    topn=3
)
print("\nking - man + woman:")
for word, score in result:
    print(f"  {word}: {score:.4f}")

# Lấy vector của một từ
king_vector = model.wv['king']
print(f"\nVector 'king' (5 chiều đầu): {king_vector[:5]}")
```


## 3. Gán nhãn từ loại và Phân tích cú pháp (POS Tagging & Parsing)

### 3.1 Part-of-Speech Tagging

POS Tagging gán nhãn từ loại (noun, verb, adjective...) cho từng token trong câu.

```python
import nltk
from nltk import pos_tag, word_tokenize

nltk.download('averaged_perceptron_tagger', quiet=True)

sentence = "The quick brown fox jumps over the lazy dog"
tokens   = word_tokenize(sentence)
tagged   = pos_tag(tokens)

print("POS Tags:")
for token, tag in tagged:
    print(f"  {token:<12} -> {tag}")

# Giải thích một số tag phổ biến:
tag_descriptions = {
    'NN':  'Danh từ số ít',
    'NNS': 'Danh từ số nhiều',
    'VB':  'Động từ nguyên thể',
    'VBZ': 'Động từ ngôi 3 số ít hiện tại',
    'JJ':  'Tính từ',
    'RB':  'Trạng từ',
    'DT':  'Mạo từ',
    'IN':  'Giới từ',
}

print("\nGiải thích tag:")
for token, tag in tagged:
    desc = tag_descriptions.get(tag, tag)
    print(f"  {token:<12} | {tag:<5} | {desc}")
```

Dùng spaCy để có kết quả chính xác hơn:

```python
# pip install spacy
# python -m spacy download en_core_web_sm

import spacy

nlp = spacy.load("en_core_web_sm")

doc = nlp("Apple is looking at buying U.K. startup for $1 billion")

print(f"{'Token':<15} {'POS':<10} {'Tag':<10} {'Dep':<12} {'Head'}")
print("-" * 60)
for token in doc:
    print(f"{token.text:<15} {token.pos_:<10} {token.tag_:<10} {token.dep_:<12} {token.head.text}")
```

### 3.2 Named Entity Recognition (NER)

NER nhận dạng và phân loại các thực thể có tên như người, địa điểm, tổ chức, thời gian.

```python
import spacy
from spacy import displacy

nlp = spacy.load("en_core_web_sm")

text = """
Elon Musk founded SpaceX in 2002 and Tesla in 2003.
The company is headquartered in Austin, Texas.
In 2023, SpaceX launched the Starship rocket from Boca Chica.
"""

doc = nlp(text)

print("Named Entities:")
print(f"{'Entity':<25} {'Label':<12} {'Description'}")
print("-" * 60)

entity_descriptions = {
    'PERSON':  'Người',
    'ORG':     'Tổ chức',
    'GPE':     'Địa điểm địa lý',
    'DATE':    'Ngày/Thời gian',
    'MONEY':   'Tiền tệ',
    'LOC':     'Địa điểm',
    'PRODUCT': 'Sản phẩm',
}

for ent in doc.ents:
    desc = entity_descriptions.get(ent.label_, ent.label_)
    print(f"{ent.text:<25} {ent.label_:<12} {desc}")
```

### 3.3 Chunking và Constituency Parsing

Chunking nhóm các token thành các cụm từ (noun phrase, verb phrase...).

```python
import nltk
from nltk import RegexpParser

nltk.download('averaged_perceptron_tagger', quiet=True)

# Định nghĩa grammar cho noun phrase chunking
grammar = r"""
    NP: {<DT>?<JJ>*<NN.*>+}      # Noun Phrase
    VP: {<VB.*><NP|PP>*}          # Verb Phrase
    PP: {<IN><NP>}                 # Prepositional Phrase
"""

chunk_parser = RegexpParser(grammar)

sentence = "The quick brown fox jumps over the lazy dog"
tokens   = nltk.word_tokenize(sentence)
tagged   = nltk.pos_tag(tokens)
tree     = chunk_parser.parse(tagged)

print("Cây cú pháp:")
print(tree)

# Trích xuất noun phrases
print("\nNoun Phrases:")
for subtree in tree.subtrees():
    if subtree.label() == 'NP':
        np = ' '.join(word for word, tag in subtree.leaves())
        print(f"  {np}")
```


## 4. Phân loại văn bản (Text Classification)

### 4.1 Naive Bayes Classifier

Naive Bayes là mô hình phân loại xác suất, giả định các đặc trưng độc lập có điều kiện với nhãn.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

# Dữ liệu ví dụ - phân loại cảm xúc đơn giản
texts = [
    "I love this movie, it was amazing",
    "Fantastic film, great performances",
    "Wonderful story and beautiful cinematography",
    "This is the best movie I have ever seen",
    "Absolutely brilliant and entertaining",
    "Terrible movie, waste of time",
    "Horrible acting and boring plot",
    "I hated every minute of this film",
    "Worst movie I have ever watched",
    "Dreadful and disappointing experience",
]
labels = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]  # 1=tích cực, 0=tiêu cực

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.3, random_state=42
)

# Vectorize
vectorizer = TfidfVectorizer(ngram_range=(1, 2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec  = vectorizer.transform(X_test)

# Huấn luyện
nb_model = MultinomialNB(alpha=1.0)  # alpha: Laplace smoothing
nb_model.fit(X_train_vec, y_train)

# Đánh giá
y_pred = nb_model.predict(X_test_vec)
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=['Negative', 'Positive']))

# Dự đoán câu mới
new_texts = ["This film was absolutely incredible", "I deeply regret watching this"]
new_vec   = vectorizer.transform(new_texts)
preds     = nb_model.predict(new_vec)
probs     = nb_model.predict_proba(new_vec)

for text, pred, prob in zip(new_texts, preds, probs):
    label = "Positive" if pred == 1 else "Negative"
    print(f"\n  '{text}'")
    print(f"  -> {label} (confidence: {max(prob):.2%})")
```

### 4.2 Logistic Regression và SVM cho Text

```python
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.datasets import fetch_20newsgroups

# Tải dataset 20 Newsgroups (4 nhóm)
categories = ['alt.atheism', 'sci.space', 'rec.sport.baseball', 'comp.graphics']

train_data = fetch_20newsgroups(subset='train', categories=categories, remove=('headers', 'footers', 'quotes'))
test_data  = fetch_20newsgroups(subset='test',  categories=categories, remove=('headers', 'footers', 'quotes'))

# Pipeline: TF-IDF + Logistic Regression
lr_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=10000, sublinear_tf=True, stop_words='english')),
    ('clf',   LogisticRegression(max_iter=1000, C=1.0, solver='lbfgs', multi_class='multinomial')),
])

lr_pipeline.fit(train_data.data, train_data.target)
lr_score = lr_pipeline.score(test_data.data, test_data.target)
print(f"Logistic Regression Accuracy: {lr_score:.4f}")

# Pipeline: TF-IDF + LinearSVC
svm_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=10000, sublinear_tf=True, stop_words='english')),
    ('clf',   LinearSVC(C=1.0, max_iter=2000)),
])

svm_pipeline.fit(train_data.data, train_data.target)
svm_score = svm_pipeline.score(test_data.data, test_data.target)
print(f"LinearSVC Accuracy:           {svm_score:.4f}")

# Xem các từ quan trọng nhất cho mỗi lớp (chỉ cho Logistic Regression)
tfidf     = lr_pipeline.named_steps['tfidf']
clf       = lr_pipeline.named_steps['clf']
feature_names = tfidf.get_feature_names_out()

print("\nTop 5 từ đặc trưng cho mỗi lớp:")
for i, category in enumerate(categories):
    top_idx  = np.argsort(clf.coef_[i])[-5:][::-1]
    top_words = [feature_names[j] for j in top_idx]
    print(f"  {category:<25}: {', '.join(top_words)}")
```


## 5. Phân tích cảm xúc (Sentiment Analysis)

### 5.1 Rule-based Sentiment với VADER

VADER (Valence Aware Dictionary and sEntiment Reasoner) là công cụ dựa trên từ điển, đặc biệt hiệu quả với văn bản mạng xã hội.

```python
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

nltk.download('vader_lexicon', quiet=True)

sia = SentimentIntensityAnalyzer()

test_sentences = [
    "I absolutely LOVE this product! It's amazing!!!",
    "This is okay, nothing special.",
    "I hate this, it's terrible and broken.",
    "Not bad, could be better though.",
    "Surprisingly good for the price :)",
    "The worst experience of my life >:(",
]

print(f"{'Câu':<50} {'Neg':>6} {'Neu':>6} {'Pos':>6} {'Compound':>10}")
print("-" * 82)

for sentence in test_sentences:
    scores = sia.polarity_scores(sentence)
    label  = "POS" if scores['compound'] >= 0.05 else ("NEG" if scores['compound'] <= -0.05 else "NEU")
    print(f"{sentence[:48]:<50} {scores['neg']:>6.3f} {scores['neu']:>6.3f} {scores['pos']:>6.3f} {scores['compound']:>8.3f}  [{label}]")
```

### 5.2 Aspect-Based Sentiment Analysis (ABSA)

ABSA không chỉ phân loại cảm xúc chung, mà còn xác định cảm xúc theo từng khía cạnh cụ thể.

```python
import spacy

nlp = spacy.load("en_core_web_sm")

# Từ điển đơn giản cho ABSA
aspect_keywords = {
    'battery':   ['battery', 'charge', 'power', 'charging'],
    'camera':    ['camera', 'photo', 'picture', 'image', 'lens'],
    'display':   ['screen', 'display', 'resolution', 'brightness'],
    'performance':['fast', 'slow', 'speed', 'performance', 'lag'],
}

positive_words = {'great', 'excellent', 'amazing', 'good', 'love', 'best', 'clear', 'bright', 'fast', 'smooth'}
negative_words = {'bad', 'terrible', 'awful', 'poor', 'hate', 'worst', 'blurry', 'slow', 'laggy', 'weak'}

def analyze_aspects(review: str) -> dict:
    doc    = nlp(review.lower())
    tokens = [token.text for token in doc]
    results = {}
    
    for aspect, keywords in aspect_keywords.items():
        # Kiểm tra xem review có đề cập đến aspect này không
        mentioned = any(kw in tokens for kw in keywords)
        if not mentioned:
            continue
        
        # Tìm từ tình cảm gần nhất với keyword của aspect
        for token in doc:
            if token.text in keywords:
                # Lấy các token xung quanh (window ±3)
                window_start = max(0, token.i - 3)
                window_end   = min(len(doc), token.i + 4)
                window_tokens = {doc[i].text for i in range(window_start, window_end)}
                
                if window_tokens & positive_words:
                    results[aspect] = 'positive'
                elif window_tokens & negative_words:
                    results[aspect] = 'negative'
                else:
                    results[aspect] = 'neutral'
    
    return results

reviews = [
    "The camera takes amazing photos but the battery life is terrible.",
    "Fast performance and bright display make this phone excellent.",
    "Poor screen resolution and slow charging are deal breakers.",
]

for review in reviews:
    aspects = analyze_aspects(review)
    print(f"\nReview: {review}")
    for aspect, sentiment in aspects.items():
        print(f"  {aspect:<15}: {sentiment}")
```


## 6. Mô hình Sequence (Sequence Models)

### 6.1 Hidden Markov Model (HMM) cho POS Tagging

HMM mô hình hóa chuỗi quan sát (từ) được sinh ra từ chuỗi trạng thái ẩn (POS tags).

```python
import numpy as np
from collections import defaultdict

class HMM_POS_Tagger:
    """HMM đơn giản cho POS Tagging dùng thuật toán Viterbi."""
    
    def __init__(self):
        self.transition_prob = defaultdict(lambda: defaultdict(float))  # P(tag_j | tag_i)
        self.emission_prob   = defaultdict(lambda: defaultdict(float))  # P(word | tag)
        self.initial_prob    = defaultdict(float)                        # P(tag đầu tiên)
        self.tags            = set()
    
    def train(self, tagged_sentences: list):
        """Ước lượng xác suất từ corpus đã gán nhãn."""
        tag_bigram_count = defaultdict(lambda: defaultdict(int))
        tag_unigram_count = defaultdict(int)
        emission_count   = defaultdict(lambda: defaultdict(int))
        start_count      = defaultdict(int)
        
        for sentence in tagged_sentences:
            for i, (word, tag) in enumerate(sentence):
                self.tags.add(tag)
                tag_unigram_count[tag]        += 1
                emission_count[tag][word.lower()] += 1
                
                if i == 0:
                    start_count[tag] += 1
                else:
                    prev_tag = sentence[i - 1][1]
                    tag_bigram_count[prev_tag][tag] += 1
        
        # Chuẩn hóa thành xác suất (với Laplace smoothing)
        vocab_size = len(set(w for s in tagged_sentences for w, _ in s))
        
        for tag in self.tags:
            total = sum(tag_bigram_count[tag].values()) + len(self.tags)
            for next_tag in self.tags:
                self.transition_prob[tag][next_tag] = (
                    tag_bigram_count[tag][next_tag] + 1
                ) / total
        
        for tag in self.tags:
            total = tag_unigram_count[tag] + vocab_size
            for word, count in emission_count[tag].items():
                self.emission_prob[tag][word] = (count + 1) / total
        
        total_starts = sum(start_count.values()) + len(self.tags)
        for tag in self.tags:
            self.initial_prob[tag] = (start_count[tag] + 1) / total_starts
    
    def viterbi(self, words: list) -> list:
        """Thuật toán Viterbi tìm chuỗi tag tối ưu."""
        tags   = list(self.tags)
        n      = len(words)
        dp     = np.zeros((len(tags), n))
        backptr = np.zeros((len(tags), n), dtype=int)
        
        # Khởi tạo bước đầu
        for i, tag in enumerate(tags):
            emit = self.emission_prob[tag].get(words[0].lower(), 1e-10)
            dp[i, 0] = np.log(self.initial_prob[tag] + 1e-10) + np.log(emit)
        
        # Lan truyền
        for t in range(1, n):
            for j, tag in enumerate(tags):
                emit = self.emission_prob[tag].get(words[t].lower(), 1e-10)
                scores = [
                    dp[i, t - 1] + np.log(self.transition_prob[tags[i]][tag] + 1e-10)
                    for i in range(len(tags))
                ]
                best_prev    = np.argmax(scores)
                dp[j, t]     = scores[best_prev] + np.log(emit)
                backptr[j, t] = best_prev
        
        # Truy vết lại
        best_last = np.argmax(dp[:, n - 1])
        path      = [best_last]
        for t in range(n - 1, 0, -1):
            path.append(backptr[path[-1], t])
        path.reverse()
        
        return [tags[i] for i in path]

# Dữ liệu huấn luyện nhỏ
training_data = [
    [("The", "DT"), ("cat", "NN"), ("sits", "VBZ"), ("here", "RB")],
    [("A", "DT"),   ("dog", "NN"), ("runs", "VBZ"),  ("fast", "RB")],
    [("The", "DT"), ("dog", "NN"), ("sits", "VBZ"),  ("there", "RB")],
    [("A", "DT"),   ("cat", "NN"), ("runs", "VBZ"),  ("quickly", "RB")],
]

tagger = HMM_POS_Tagger()
tagger.train(training_data)

test_sentence = ["The", "cat", "runs", "fast"]
predicted_tags = tagger.viterbi(test_sentence)

print("Câu:", test_sentence)
print("Tags:", predicted_tags)
```

### 6.2 RNN và LSTM cho Sequence Labeling

Mạng RNN và LSTM xử lý chuỗi tuần tự, rất phù hợp với bài toán NLP.

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

class LSTMTagger(nn.Module):
    """LSTM cho bài toán POS Tagging."""
    
    def __init__(self, vocab_size: int, embed_dim: int, hidden_dim: int, num_tags: int, num_layers: int = 2, dropout: float = 0.3):
        super(LSTMTagger, self).__init__()
        
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm      = nn.LSTM(
            input_size    = embed_dim,
            hidden_size   = hidden_dim,
            num_layers    = num_layers,
            batch_first   = True,
            bidirectional = True,    # Bi-LSTM nhìn cả hai chiều
            dropout       = dropout if num_layers > 1 else 0,
        )
        self.dropout = nn.Dropout(dropout)
        # Bi-LSTM nên output_dim = 2 * hidden_dim
        self.fc      = nn.Linear(hidden_dim * 2, num_tags)
    
    def forward(self, x):
        # x: (batch_size, seq_len)
        embedded   = self.dropout(self.embedding(x))   # (batch, seq, embed)
        lstm_out, _ = self.lstm(embedded)               # (batch, seq, 2*hidden)
        output     = self.fc(self.dropout(lstm_out))    # (batch, seq, num_tags)
        return output

# Xây dựng vocabulary và dataset đơn giản
class SequenceDataset(Dataset):
    def __init__(self, sentences: list, word2idx: dict, tag2idx: dict, max_len: int = 50):
        self.data    = []
        self.max_len = max_len
        
        for words, tags in sentences:
            word_ids = [word2idx.get(w.lower(), word2idx.get('<UNK>', 1)) for w in words]
            tag_ids  = [tag2idx[t] for t in tags]
            
            # Padding
            while len(word_ids) < max_len:
                word_ids.append(0)
                tag_ids.append(0)
            
            self.data.append((torch.tensor(word_ids[:max_len]), torch.tensor(tag_ids[:max_len])))
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        return self.data[idx]

# Ví dụ huấn luyện
def train_lstm_tagger(sentences: list, num_epochs: int = 10):
    # Xây dựng vocabulary
    words   = ['<PAD>', '<UNK>'] + list({w.lower() for s, _ in sentences for w in s})
    tags    = ['<PAD>'] + list({t for _, ts in sentences for t in ts})
    word2idx = {w: i for i, w in enumerate(words)}
    tag2idx  = {t: i for i, t in enumerate(tags)}
    
    # Dataset và DataLoader
    dataset    = SequenceDataset(sentences, word2idx, tag2idx)
    dataloader = DataLoader(dataset, batch_size=2, shuffle=True)
    
    # Khởi tạo model
    model     = LSTMTagger(len(words), embed_dim=32, hidden_dim=64, num_tags=len(tags))
    optimizer = optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss(ignore_index=0)
    
    # Vòng lặp huấn luyện
    for epoch in range(num_epochs):
        total_loss = 0
        model.train()
        
        for word_ids, tag_ids in dataloader:
            optimizer.zero_grad()
            output = model(word_ids)          # (batch, seq, num_tags)
            
            # Reshape cho CrossEntropyLoss
            output  = output.view(-1, len(tags))
            targets = tag_ids.view(-1)
            
            loss = criterion(output, targets)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            total_loss += loss.item()
        
        if (epoch + 1) % 2 == 0:
            print(f"  Epoch {epoch + 1}/{num_epochs}, Loss: {total_loss / len(dataloader):.4f}")
    
    return model, word2idx, tag2idx

# Dữ liệu mẫu
sample_sentences = [
    (["The", "cat", "runs"], ["DT", "NN", "VBZ"]),
    (["A", "dog", "sits"],   ["DT", "NN", "VBZ"]),
    (["The", "dog", "runs"], ["DT", "NN", "VBZ"]),
]

print("Huấn luyện Bi-LSTM Tagger:")
model, w2i, t2i = train_lstm_tagger(sample_sentences, num_epochs=10)
```


## 7. Mô hình Transformer và BERT

### 7.1 Kiến trúc Transformer và Self-Attention

Transformer (Vaswani et al., 2017) là nền tảng của hầu hết mọi mô hình NLP hiện đại. Cơ chế cốt lõi là **Self-Attention**.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadSelfAttention(nn.Module):
    """Triển khai Multi-Head Self-Attention từ đầu."""
    
    def __init__(self, embed_dim: int, num_heads: int, dropout: float = 0.1):
        super().__init__()
        assert embed_dim % num_heads == 0, "embed_dim phải chia hết cho num_heads"
        
        self.embed_dim  = embed_dim
        self.num_heads  = num_heads
        self.head_dim   = embed_dim // num_heads
        self.scale      = math.sqrt(self.head_dim)
        
        # Ma trận chiếu cho Q, K, V và đầu ra
        self.W_q = nn.Linear(embed_dim, embed_dim, bias=False)
        self.W_k = nn.Linear(embed_dim, embed_dim, bias=False)
        self.W_v = nn.Linear(embed_dim, embed_dim, bias=False)
        self.W_o = nn.Linear(embed_dim, embed_dim)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x: torch.Tensor, mask: torch.Tensor = None):
        batch, seq_len, _ = x.shape
        
        # Chiếu và tách thành nhiều head
        Q = self.W_q(x).view(batch, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        K = self.W_k(x).view(batch, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        V = self.W_v(x).view(batch, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        # Q, K, V shape: (batch, num_heads, seq_len, head_dim)
        
        # Tính Scaled Dot-Product Attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / self.scale
        # scores shape: (batch, num_heads, seq_len, seq_len)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        
        # Áp dụng attention lên V
        context = torch.matmul(attn_weights, V)
        # context shape: (batch, num_heads, seq_len, head_dim)
        
        # Nối các head lại
        context = context.transpose(1, 2).contiguous().view(batch, seq_len, self.embed_dim)
        output  = self.W_o(context)
        
        return output, attn_weights

class TransformerBlock(nn.Module):
    """Một block Transformer: Self-Attention + FFN + LayerNorm + Residual."""
    
    def __init__(self, embed_dim: int, num_heads: int, ff_dim: int, dropout: float = 0.1):
        super().__init__()
        self.attention  = MultiHeadSelfAttention(embed_dim, num_heads, dropout)
        self.norm1      = nn.LayerNorm(embed_dim)
        self.norm2      = nn.LayerNorm(embed_dim)
        self.ff         = nn.Sequential(
            nn.Linear(embed_dim, ff_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(ff_dim, embed_dim),
            nn.Dropout(dropout),
        )
    
    def forward(self, x: torch.Tensor, mask: torch.Tensor = None):
        # Pre-norm (hiện đại hơn Post-norm)
        attn_out, attn_weights = self.attention(self.norm1(x), mask)
        x = x + attn_out                   # Residual connection
        x = x + self.ff(self.norm2(x))     # FFN + Residual
        return x, attn_weights

# Test kiến trúc
batch_size = 2
seq_len    = 10
embed_dim  = 64

x     = torch.randn(batch_size, seq_len, embed_dim)
block = TransformerBlock(embed_dim=64, num_heads=4, ff_dim=256)

out, weights = block(x)
print(f"Input  shape: {x.shape}")
print(f"Output shape: {out.shape}")
print(f"Attention weights shape: {weights.shape}")
```

### 7.2 Positional Encoding

Transformer không có khái niệm thứ tự nên cần thêm Positional Encoding.

```python
class PositionalEncoding(nn.Module):
    """Sine/Cosine Positional Encoding theo bài báo gốc."""
    
    def __init__(self, embed_dim: int, max_len: int = 5000, dropout: float = 0.1):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        
        pe       = torch.zeros(max_len, embed_dim)
        position = torch.arange(0, max_len).unsqueeze(1).float()
        div_term = torch.exp(
            torch.arange(0, embed_dim, 2).float() * -(math.log(10000.0) / embed_dim)
        )
        
        # Các chiều chẵn dùng sin, chiều lẻ dùng cos
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        
        pe = pe.unsqueeze(0)  # (1, max_len, embed_dim)
        self.register_buffer('pe', pe)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (batch, seq_len, embed_dim)
        x = x + self.pe[:, :x.size(1)]
        return self.dropout(x)

# Visualize positional encoding
import matplotlib.pyplot as plt
import numpy as np

pe_layer = PositionalEncoding(embed_dim=64, max_len=50)
pe_values = pe_layer.pe.squeeze(0).detach().numpy()  # (50, 64)

print(f"Positional Encoding shape: {pe_values.shape}")
print(f"Giá trị pe[0, :5] (vị trí 0): {pe_values[0, :5].round(3)}")
print(f"Giá trị pe[1, :5] (vị trí 1): {pe_values[1, :5].round(3)}")
```

### 7.3 Fine-tuning BERT với Hugging Face

BERT (Bidirectional Encoder Representations from Transformers) là mô hình encoder tiền huấn luyện trên văn bản quy mô lớn.

```python
from transformers import BertTokenizer, BertForSequenceClassification
from transformers import Trainer, TrainingArguments
import torch
from torch.utils.data import Dataset

class SentimentDataset(Dataset):
    def __init__(self, texts: list, labels: list, tokenizer, max_len: int = 128):
        self.encodings = tokenizer(
            texts,
            truncation     = True,
            padding        = True,
            max_length     = max_len,
            return_tensors = 'pt',
        )
        self.labels = torch.tensor(labels)
    
    def __len__(self):
        return len(self.labels)
    
    def __getitem__(self, idx):
        return {
            'input_ids':      self.encodings['input_ids'][idx],
            'attention_mask': self.encodings['attention_mask'][idx],
            'labels':         self.labels[idx],
        }

# Load tokenizer và model
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model     = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased',
    num_labels = 2,  # Positive / Negative
)

# Dữ liệu
train_texts  = ["I love this!", "This is terrible.", "Amazing product.", "Worst purchase ever."]
train_labels = [1, 0, 1, 0]

train_dataset = SentimentDataset(train_texts, train_labels, tokenizer)

# Cấu hình training
training_args = TrainingArguments(
    output_dir          = "./bert_sentiment",
    num_train_epochs    = 3,
    per_device_train_batch_size = 4,
    learning_rate       = 2e-5,
    weight_decay        = 0.01,
    warmup_steps        = 100,
    logging_steps       = 10,
    save_strategy       = "epoch",
    load_best_model_at_end = True,
)

trainer = Trainer(
    model     = model,
    args      = training_args,
    train_dataset = train_dataset,
)

# trainer.train()  # Bỏ comment để thực sự huấn luyện

# Inference trực tiếp không qua Trainer
def predict_sentiment(texts: list, tokenizer, model) -> list:
    model.eval()
    inputs  = tokenizer(texts, return_tensors='pt', padding=True, truncation=True, max_length=128)
    
    with torch.no_grad():
        logits  = model(**inputs).logits
        preds   = torch.argmax(logits, dim=-1)
        probs   = torch.softmax(logits, dim=-1)
    
    results = []
    for i, text in enumerate(texts):
        label = "Positive" if preds[i] == 1 else "Negative"
        confidence = probs[i][preds[i]].item()
        results.append({'text': text, 'label': label, 'confidence': confidence})
    
    return results

sample_texts = ["This movie was absolutely brilliant!", "Boring and uninspiring."]
predictions  = predict_sentiment(sample_texts, tokenizer, model)

for pred in predictions:
    print(f"'{pred['text']}'")
    print(f"  -> {pred['label']} ({pred['confidence']:.2%})\n")
```


## 8. Machine Translation và Sequence-to-Sequence

### 8.1 Kiến trúc Encoder-Decoder

Mô hình Seq2Seq gồm một encoder mã hóa chuỗi đầu vào thành vector ngữ cảnh và một decoder giải mã vector đó thành chuỗi đầu ra.

```python
import torch
import torch.nn as nn
import random

class Encoder(nn.Module):
    def __init__(self, vocab_size: int, embed_dim: int, hidden_dim: int, num_layers: int, dropout: float):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.rnn       = nn.LSTM(embed_dim, hidden_dim, num_layers, batch_first=True,
                                  dropout=dropout if num_layers > 1 else 0, bidirectional=True)
        self.fc_h      = nn.Linear(hidden_dim * 2, hidden_dim)
        self.fc_c      = nn.Linear(hidden_dim * 2, hidden_dim)
        self.dropout   = nn.Dropout(dropout)
    
    def forward(self, src):
        embedded = self.dropout(self.embedding(src))
        outputs, (hidden, cell) = self.rnn(embedded)
        
        # Kết hợp 2 hướng của Bi-LSTM
        hidden = self.fc_h(torch.cat([hidden[-2], hidden[-1]], dim=-1)).unsqueeze(0)
        cell   = self.fc_c(torch.cat([cell[-2],   cell[-1]],   dim=-1)).unsqueeze(0)
        
        return outputs, hidden, cell

class BahdanauAttention(nn.Module):
    """Cơ chế Attention của Bahdanau (2015)."""
    
    def __init__(self, enc_dim: int, dec_dim: int, attn_dim: int):
        super().__init__()
        self.W_enc  = nn.Linear(enc_dim, attn_dim, bias=False)
        self.W_dec  = nn.Linear(dec_dim, attn_dim, bias=False)
        self.v      = nn.Linear(attn_dim, 1, bias=False)
    
    def forward(self, encoder_outputs, decoder_hidden):
        # encoder_outputs: (batch, src_len, enc_dim)
        # decoder_hidden:  (batch, dec_dim)
        src_len = encoder_outputs.size(1)
        
        energy  = torch.tanh(
            self.W_enc(encoder_outputs) +
            self.W_dec(decoder_hidden).unsqueeze(1).repeat(1, src_len, 1)
        )
        scores  = self.v(energy).squeeze(-1)             # (batch, src_len)
        weights = torch.softmax(scores, dim=-1)           # (batch, src_len)
        context = torch.bmm(weights.unsqueeze(1), encoder_outputs).squeeze(1)
        
        return context, weights

class AttentionDecoder(nn.Module):
    def __init__(self, vocab_size: int, embed_dim: int, enc_dim: int, hidden_dim: int, num_layers: int, dropout: float):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.attention = BahdanauAttention(enc_dim, hidden_dim, hidden_dim)
        self.rnn       = nn.LSTM(embed_dim + enc_dim, hidden_dim, num_layers,
                                  batch_first=True, dropout=dropout if num_layers > 1 else 0)
        self.fc_out    = nn.Linear(hidden_dim + enc_dim + embed_dim, vocab_size)
        self.dropout   = nn.Dropout(dropout)
    
    def forward(self, tgt_token, encoder_outputs, hidden, cell):
        tgt_token = tgt_token.unsqueeze(1)                     # (batch, 1)
        embedded  = self.dropout(self.embedding(tgt_token))    # (batch, 1, embed)
        
        context, attn_weights = self.attention(encoder_outputs, hidden.squeeze(0))
        context = context.unsqueeze(1)                         # (batch, 1, enc_dim)
        
        rnn_input  = torch.cat([embedded, context], dim=-1)   # (batch, 1, embed+enc)
        output, (hidden, cell) = self.rnn(rnn_input, (hidden, cell))
        
        combined  = torch.cat([output.squeeze(1), context.squeeze(1), embedded.squeeze(1)], dim=-1)
        prediction = self.fc_out(combined)                     # (batch, tgt_vocab)
        
        return prediction, hidden, cell, attn_weights.squeeze(0)

# Khởi tạo mô hình Seq2Seq hoàn chỉnh
def build_seq2seq(src_vocab_size: int, tgt_vocab_size: int):
    encoder = Encoder(src_vocab_size, embed_dim=128, hidden_dim=256, num_layers=2, dropout=0.3)
    decoder = AttentionDecoder(tgt_vocab_size, embed_dim=128, enc_dim=256*2, hidden_dim=256, num_layers=2, dropout=0.3)
    return encoder, decoder

enc, dec = build_seq2seq(src_vocab_size=5000, tgt_vocab_size=6000)
total_params = sum(p.numel() for p in list(enc.parameters()) + list(dec.parameters()) if p.requires_grad)
print(f"Tổng số tham số: {total_params:,}")
```


## 9. Đánh giá mô hình NLP (Evaluation Metrics)

### 9.1 BLEU Score (Machine Translation)

BLEU đo mức độ trùng khớp n-gram giữa văn bản sinh ra và văn bản tham chiếu.

```python
from nltk.translate.bleu_score import sentence_bleu, corpus_bleu, SmoothingFunction
import nltk

def compute_bleu(references: list, hypothesis: str, weights=(0.25, 0.25, 0.25, 0.25)) -> float:
    """Tính BLEU score với smoothing."""
    ref_tokens   = [ref.lower().split() for ref in references]
    hyp_tokens   = hypothesis.lower().split()
    smoother     = SmoothingFunction().method4
    return sentence_bleu(ref_tokens, hyp_tokens, weights=weights, smoothing_function=smoother)

# Ví dụ
references = [
    "The cat is on the mat",
    "There is a cat on the mat",
    "A cat sat on the mat",
]

hypotheses = [
    "The cat is on the mat",          # Hoàn hảo
    "The cat sat on the mat",          # Gần đúng
    "A dog is sitting on the floor",   # Khác nhiều
    "Cat mat",                          # Quá ngắn
]

print("BLEU Scores:")
for hyp in hypotheses:
    bleu1 = compute_bleu(references, hyp, (1, 0, 0, 0))
    bleu4 = compute_bleu(references, hyp, (0.25, 0.25, 0.25, 0.25))
    print(f"  Hyp: '{hyp}'")
    print(f"  BLEU-1: {bleu1:.4f}  |  BLEU-4: {bleu4:.4f}\n")
```

### 9.2 ROUGE Score (Text Summarization)

ROUGE đo lường chất lượng tóm tắt văn bản bằng cách so sánh n-gram và chuỗi con dài nhất.

```python
# pip install rouge-score
from rouge_score import rouge_scorer

scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)

reference = """
The transformer architecture revolutionized natural language processing.
It uses self-attention mechanisms to process sequential data in parallel,
enabling training on much larger datasets than previously possible.
"""

summaries = {
    "Tốt": "Transformers use self-attention to process language in parallel, revolutionizing NLP.",
    "Trung bình": "Transformers are a type of neural network used in NLP.",
    "Kém": "Deep learning models have many parameters.",
}

print(f"{'Summary':<12} {'ROUGE-1':>10} {'ROUGE-2':>10} {'ROUGE-L':>10}")
print("-" * 46)

for label, summary in summaries.items():
    scores = scorer.score(reference, summary)
    print(f"{label:<12} "
          f"{scores['rouge1'].fmeasure:>10.4f} "
          f"{scores['rouge2'].fmeasure:>10.4f} "
          f"{scores['rougeL'].fmeasure:>10.4f}")
```

### 9.3 Perplexity (Language Model Evaluation)

Perplexity đo mức độ "bất ngờ" của mô hình ngôn ngữ trước một chuỗi văn bản. Perplexity thấp hơn nghĩa là mô hình dự đoán tốt hơn.

```python
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import numpy as np

def compute_perplexity(text: str, model, tokenizer, device: str = 'cpu') -> float:
    """Tính perplexity của một đoạn văn bản với mô hình ngôn ngữ."""
    encodings  = tokenizer(text, return_tensors='pt').to(device)
    input_ids  = encodings.input_ids
    
    with torch.no_grad():
        outputs  = model(input_ids, labels=input_ids)
        neg_log_likelihood = outputs.loss.item()  # NLL trung bình mỗi token
    
    perplexity = np.exp(neg_log_likelihood)
    return perplexity

# Load GPT-2
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
gpt2_model = GPT2LMHeadModel.from_pretrained('gpt2')
gpt2_model.eval()

test_texts = [
    "The weather today is sunny and warm.",          # Ngữ pháp tốt, tự nhiên
    "I am going to the store to buy groceries.",     # Ngữ pháp tốt
    "Weather sunny is today the warm and.",          # Sai ngữ pháp
    "Xlkj mno pqr stu vwx yz abc def ghi jkl.",     # Vô nghĩa
]

print(f"{'Văn bản':<50} {'Perplexity':>12}")
print("-" * 65)

for text in test_texts:
    ppl = compute_perplexity(text, gpt2_model, tokenizer)
    print(f"{text[:48]:<50} {ppl:>12.2f}")
```


## 10. Ứng dụng thực tế: Xây dựng Pipeline NLP hoàn chỉnh

Kết hợp tất cả các kỹ thuật trên để xây dựng một hệ thống phân tích văn bản end-to-end.

```python
import re
import numpy as np
from typing import List, Dict, Any
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import LabelEncoder
import spacy

class NLPPipeline:
    """Pipeline NLP hoàn chỉnh: tiền xử lý, trích xuất đặc trưng, phân loại."""
    
    def __init__(self, use_spacy: bool = True):
        self.nlp       = spacy.load("en_core_web_sm") if use_spacy else None
        self.stopwords = {
            "the", "a", "an", "is", "are", "was", "were", "be", "been",
            "being", "have", "has", "had", "do", "does", "did", "will",
            "would", "could", "should", "may", "might", "shall", "can",
            "to", "of", "in", "on", "at", "for", "with", "by", "from",
        }
        self.classifier = None
        self.label_encoder = LabelEncoder()
    
    def preprocess(self, text: str) -> str:
        """Tiền xử lý văn bản: lowercase, xóa ký tự đặc biệt, xóa stopwords."""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        
        tokens   = text.split()
        filtered = [t for t in tokens if t not in self.stopwords and len(t) > 1]
        
        return ' '.join(filtered)
    
    def extract_features(self, texts: List[str]) -> Dict[str, Any]:
        """Trích xuất các đặc trưng NLP từ văn bản."""
        features = []
        
        for text in texts:
            if self.nlp:
                doc = self.nlp(text)
                feature = {
                    'num_tokens':    len(doc),
                    'num_sentences': len(list(doc.sents)),
                    'num_entities':  len(doc.ents),
                    'avg_token_len': np.mean([len(t.text) for t in doc if not t.is_space]),
                    'noun_ratio':    sum(1 for t in doc if t.pos_ == 'NOUN') / max(len(doc), 1),
                    'verb_ratio':    sum(1 for t in doc if t.pos_ == 'VERB') / max(len(doc), 1),
                }
            else:
                tokens = text.split()
                feature = {
                    'num_tokens':    len(tokens),
                    'avg_token_len': np.mean([len(t) for t in tokens]) if tokens else 0,
                }
            features.append(feature)
        
        return features
    
    def build_classifier(self):
        """Xây dựng pipeline phân loại dùng TF-IDF + Logistic Regression."""
        self.classifier = Pipeline([
            ('tfidf', TfidfVectorizer(
                preprocessor  = self.preprocess,
                ngram_range   = (1, 2),
                max_features  = 20000,
                sublinear_tf  = True,
                min_df        = 2,
            )),
            ('clf', LogisticRegression(
                max_iter      = 1000,
                C             = 1.0,
                class_weight  = 'balanced',
                solver        = 'lbfgs',
                multi_class   = 'multinomial',
            )),
        ])
    
    def fit(self, texts: List[str], labels: List[str]):
        """Huấn luyện pipeline."""
        encoded_labels = self.label_encoder.fit_transform(labels)
        self.build_classifier()
        self.classifier.fit(texts, encoded_labels)
        print(f"Huấn luyện xong. Classes: {list(self.label_encoder.classes_)}")
    
    def predict(self, texts: List[str]) -> List[Dict[str, Any]]:
        """Dự đoán nhãn và xác suất."""
        encoded_preds = self.classifier.predict(texts)
        probs         = self.classifier.predict_proba(texts)
        labels        = self.label_encoder.inverse_transform(encoded_preds)
        
        results = []
        for text, label, prob in zip(texts, labels, probs):
            class_probs = {cls: p for cls, p in zip(self.label_encoder.classes_, prob)}
            results.append({
                'text':        text[:60] + '...' if len(text) > 60 else text,
                'prediction':  label,
                'confidence':  max(prob),
                'probabilities': class_probs,
            })
        return results
    
    def evaluate(self, texts: List[str], labels: List[str], cv: int = 5) -> float:
        """Đánh giá cross-validation."""
        encoded_labels = self.label_encoder.fit_transform(labels)
        self.build_classifier()
        scores = cross_val_score(self.classifier, texts, encoded_labels, cv=cv, scoring='f1_macro')
        print(f"Cross-Validation F1: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")
        return scores.mean()


# Demo pipeline
train_texts = [
    # Tech
    "Python is a popular programming language for machine learning",
    "Deep learning models require significant computational resources",
    "Cloud computing enables scalable data processing pipelines",
    "Software engineers build APIs and microservices architectures",
    # Sports
    "The football team scored three goals in the second half",
    "Tennis players compete for grand slam titles throughout the season",
    "Basketball requires both physical fitness and strategic thinking",
    "Olympic athletes train for years to achieve peak performance",
    # Politics
    "The government announced new economic stimulus policies",
    "Parliamentary elections will be held in the coming months",
    "International diplomacy requires careful negotiation and compromise",
    "Voters expressed their preferences in the local referendum",
]
train_labels = ['tech'] * 4 + ['sports'] * 4 + ['politics'] * 4

pipeline = NLPPipeline(use_spacy=False)
pipeline.fit(train_texts, train_labels)

test_texts = [
    "Scientists developed a new algorithm for natural language understanding",
    "The championship game will be played on Saturday evening",
    "The senator proposed amendments to the healthcare legislation",
]

predictions = pipeline.predict(test_texts)

print("\nKết quả dự đoán:")
for pred in predictions:
    print(f"\n  '{pred['text']}'")
    print(f"  -> {pred['prediction']} (confidence: {pred['confidence']:.2%})")
    print(f"     {', '.join(f'{k}: {v:.2%}' for k, v in pred['probabilities'].items())}")
```


## Tổng kết

Bài viết đã trình bày đầy đủ các kiến thức NLP cốt lõi từ nền tảng đến nâng cao. Dưới đây là lộ trình học tập được đề xuất:

Bắt đầu từ tiền xử lý văn bản (tokenization, stemming, lemmatization) để có hiểu biết vững chắc về cách văn bản được chuẩn hóa. Tiếp theo, nắm vững các phương pháp biểu diễn như BoW, TF-IDF và Word2Vec để hiểu cách ánh xạ văn bản thành số. Sau đó, học về các mô hình chuỗi (HMM, LSTM) trước khi chuyển sang Transformer và BERT. Cuối cùng, thực hành xây dựng pipeline end-to-end và đánh giá mô hình bằng BLEU, ROUGE, Perplexity.

Thư viện chính cần nắm vững: `nltk`, `spacy`, `scikit-learn`, `gensim`, `transformers` (Hugging Face), `torch`.
