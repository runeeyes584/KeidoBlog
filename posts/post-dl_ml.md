---
title: Học Máy và Học Sâu - Kiến Thức Nền Tảng Dành Cho Sinh Viên Đại Học
date: 2024-12-05
author: Kaleidoscope
category: Programming
readingTime: 30 phút đọc
excerpt: Nhập môn Trí tuệ nhân tạo - Học máy và học sâu.
---

# Học Máy và Học Sâu: Kiến Thức Nền Tảng Dành Cho Sinh Viên Đại Học


## 1. Tổng Quan về Học Máy

Học máy (Machine Learning) là một nhánh của trí tuệ nhân tạo, cho phép máy tính học từ dữ liệu mà không cần được lập trình tường minh cho từng tác vụ. Thay vì viết các quy tắc cứng nhắc, chúng ta cung cấp dữ liệu và để thuật toán tự tìm ra các mẫu (pattern) ẩn trong đó.

Quá trình học máy về cơ bản là bài toán tối ưu hóa: tìm một hàm số `f` sao cho `f(x)` xấp xỉ tốt nhất giá trị mục tiêu `y` trên tập dữ liệu đã cho.

### 1.1 Phân Loại Các Phương Pháp Học Máy

Học máy được chia thành ba nhóm chính dựa trên cách dữ liệu huấn luyện được cung cấp.

**Học có giám sát (Supervised Learning):** Dữ liệu huấn luyện bao gồm các cặp đầu vào - đầu ra `(x, y)`. Mô hình học cách ánh xạ từ `x` sang `y`. Ví dụ: phân loại email spam, dự đoán giá nhà.

**Học không giám sát (Unsupervised Learning):** Chỉ có dữ liệu đầu vào `x`, không có nhãn. Mô hình tự khám phá cấu trúc ẩn trong dữ liệu. Ví dụ: phân cụm khách hàng, giảm chiều dữ liệu.

**Học tăng cường (Reinforcement Learning):** Một tác nhân (agent) học thông qua tương tác với môi trường, nhận phần thưởng hoặc hình phạt dựa trên hành động của mình.


## 2. Chuẩn Bị Dữ Liệu

Chất lượng dữ liệu quyết định trực tiếp đến hiệu suất của mô hình. Giai đoạn này thường chiếm 60-80% thời gian trong một dự án thực tế.

### 2.1 Tải và Khám Phá Dữ Liệu

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_iris, load_boston

# Tải bộ dữ liệu mẫu
iris = load_iris()
df = pd.DataFrame(iris.data, columns=iris.feature_names)
df['target'] = iris.target

# Khám phá cơ bản
print(df.shape)          # Kích thước: (150, 5)
print(df.dtypes)         # Kiểu dữ liệu từng cột
print(df.describe())     # Thống kê mô tả
print(df.isnull().sum()) # Đếm giá trị thiếu

# Phân phối của biến mục tiêu
print(df['target'].value_counts())
```

### 2.2 Xử Lý Giá Trị Thiếu

```python
from sklearn.impute import SimpleImputer, KNNImputer

# Tạo dữ liệu giả có giá trị thiếu
df_missing = df.copy()
df_missing.loc[np.random.choice(df.index, 20), 'sepal length (cm)'] = np.nan

# Phương pháp 1: Điền bằng giá trị trung bình / trung vị / mode
imputer_mean = SimpleImputer(strategy='mean')
df_missing[['sepal length (cm)']] = imputer_mean.fit_transform(
    df_missing[['sepal length (cm)']]
)

# Phương pháp 2: KNN Imputer - điền dựa trên k láng giềng gần nhất
knn_imputer = KNNImputer(n_neighbors=5)
df_imputed = pd.DataFrame(
    knn_imputer.fit_transform(df_missing.drop('target', axis=1)),
    columns=iris.feature_names
)
```

### 2.3 Chuẩn Hóa và Tỉ Lệ Hóa Dữ Liệu

Nhiều thuật toán học máy (KNN, SVM, Neural Networks) rất nhạy cảm với tầm vực của dữ liệu. Chuẩn hóa giúp các đặc trưng có đóng góp bình đẳng.

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

X = df.drop('target', axis=1).values
y = df['target'].values

# StandardScaler: z = (x - mu) / sigma -> phân phối chuẩn (mean=0, std=1)
scaler_std = StandardScaler()
X_standard = scaler_std.fit_transform(X)

# MinMaxScaler: x' = (x - x_min) / (x_max - x_min) -> khoảng [0, 1]
scaler_minmax = MinMaxScaler()
X_minmax = scaler_minmax.fit_transform(X)

# RobustScaler: sử dụng median và IQR, ít bị ảnh hưởng bởi outlier
scaler_robust = RobustScaler()
X_robust = scaler_robust.fit_transform(X)

print("Trước chuẩn hóa - Mean:", X.mean(axis=0).round(2))
print("Sau StandardScaler - Mean:", X_standard.mean(axis=0).round(2))
print("Sau StandardScaler - Std:", X_standard.std(axis=0).round(2))
```

### 2.4 Mã Hóa Biến Phân Loại

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import pandas as pd

# Dữ liệu ví dụ
data = pd.DataFrame({
    'color': ['red', 'blue', 'green', 'red', 'blue'],
    'size': ['S', 'M', 'L', 'XL', 'M'],
    'price': [10, 20, 30, 25, 15]
})

# Label Encoding: phù hợp cho biến có thứ tự (ordinal)
le = LabelEncoder()
data['size_encoded'] = le.fit_transform(data['size'])

# One-Hot Encoding: phù hợp cho biến danh nghĩa (nominal)
data_encoded = pd.get_dummies(data, columns=['color'], drop_first=True)
print(data_encoded)
```

### 2.5 Chia Tập Dữ Liệu

```python
from sklearn.model_selection import train_test_split

# Chia 70% train, 15% validation, 15% test
X_train_full, X_test, y_train_full, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42, stratify=y
)

X_train, X_val, y_train, y_val = train_test_split(
    X_train_full, y_train_full, test_size=0.176,  # 0.15 / 0.85 ≈ 0.176
    random_state=42, stratify=y_train_full
)

print(f"Train: {X_train.shape}, Val: {X_val.shape}, Test: {X_test.shape}")
```


## 3. Các Thuật Toán Học Máy Cổ Điển

### 3.1 Hồi Quy Tuyến Tính (Linear Regression)

Hồi quy tuyến tính mô hình hóa mối quan hệ giữa biến phụ thuộc `y` và một hoặc nhiều biến độc lập `X` thông qua phương trình tuyến tính:

```
y = w0 + w1*x1 + w2*x2 + ... + wn*xn
```

Hàm mất mát (loss function) là Mean Squared Error:

```
MSE = (1/n) * sum((y_pred - y_true)^2)
```

```python
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import make_regression

# Tạo dữ liệu hồi quy
X_reg, y_reg = make_regression(n_samples=200, n_features=5, noise=10, random_state=42)
X_tr, X_te, y_tr, y_te = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)

# Hồi quy tuyến tính cơ bản
lr = LinearRegression()
lr.fit(X_tr, y_tr)
y_pred = lr.predict(X_te)

mse = mean_squared_error(y_te, y_pred)
r2 = r2_score(y_te, y_pred)
print(f"MSE: {mse:.2f}, R2: {r2:.4f}")
print(f"Hệ số: {lr.coef_}")
print(f"Hệ số chặn: {lr.intercept_:.2f}")

# Ridge Regression (L2 regularization): hạn phạt tổng bình phương hệ số
# Giúp giảm overfitting, không đưa hệ số về 0
ridge = Ridge(alpha=1.0)
ridge.fit(X_tr, y_tr)
print(f"Ridge R2: {r2_score(y_te, ridge.predict(X_te)):.4f}")

# Lasso Regression (L1 regularization): có thể đưa hệ số về đúng 0
# Tự động chọn đặc trưng (feature selection)
lasso = Lasso(alpha=0.1)
lasso.fit(X_tr, y_tr)
print(f"Lasso R2: {r2_score(y_te, lasso.predict(X_te)):.4f}")
print(f"Lasso - Số hệ số = 0: {(lasso.coef_ == 0).sum()}")
```

### 3.2 Hồi Quy Logistic (Logistic Regression)

Mặc dù tên là "hồi quy", đây thực chất là thuật toán phân loại. Nó sử dụng hàm sigmoid để ánh xạ đầu ra tuyến tính sang xác suất trong khoảng (0, 1).

```
sigma(z) = 1 / (1 + e^(-z))
```

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (classification_report, confusion_matrix,
                              roc_auc_score, roc_curve)

# Phân loại nhị phân: iris chỉ lấy 2 lớp
mask = y < 2
X_bin, y_bin = X[mask], y[mask]
X_tr, X_te, y_tr, y_te = train_test_split(X_bin, y_bin, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_tr_s = scaler.fit_transform(X_tr)
X_te_s = scaler.transform(X_te)

clf = LogisticRegression(max_iter=1000, C=1.0)  # C = 1/lambda (nghịch đảo regularization)
clf.fit(X_tr_s, y_tr)

y_pred = clf.predict(X_te_s)
y_prob = clf.predict_proba(X_te_s)[:, 1]

print(classification_report(y_te, y_pred))
print(f"AUC-ROC: {roc_auc_score(y_te, y_prob):.4f}")

# Ma trận nhầm lẫn
cm = confusion_matrix(y_te, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()
```

### 3.3 K-Nearest Neighbors (KNN)

KNN là thuật toán học lười biếng (lazy learning): không xây dựng mô hình trong quá trình huấn luyện mà lưu toàn bộ dữ liệu. Khi dự đoán, nó tìm `k` điểm gần nhất và bỏ phiếu (phân loại) hoặc lấy trung bình (hồi quy).

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score

# Chuẩn hóa dữ liệu - RẤT QUAN TRỌNG với KNN
scaler = StandardScaler()
X_s = scaler.fit_transform(X)
X_tr_s, X_te_s, y_tr, y_te = train_test_split(X_s, y, test_size=0.2, random_state=42)

# Tìm k tối ưu
k_values = range(1, 31)
cv_scores = []

for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X_tr_s, y_tr, cv=5, scoring='accuracy')
    cv_scores.append(scores.mean())

best_k = k_values[np.argmax(cv_scores)]
print(f"K tối ưu: {best_k}, CV Accuracy: {max(cv_scores):.4f}")

# Huấn luyện với k tối ưu
knn_best = KNeighborsClassifier(n_neighbors=best_k, metric='euclidean')
knn_best.fit(X_tr_s, y_tr)
print(f"Test Accuracy: {knn_best.score(X_te_s, y_te):.4f}")
```

### 3.4 Support Vector Machine (SVM)

SVM tìm siêu phẳng phân cách (hyperplane) tối ưu - tức là siêu phẳng có lề (margin) lớn nhất giữa các lớp. Với dữ liệu không phân tách tuyến tính, kernel trick ánh xạ dữ liệu lên không gian chiều cao hơn.

```python
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline

# Pipeline kết hợp chuẩn hóa và SVM
svm_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC(kernel='rbf', C=10, gamma='scale', probability=True))
])

svm_pipeline.fit(X_tr, y_tr)
y_pred_svm = svm_pipeline.predict(X_te)
print(f"SVM Accuracy: {svm_pipeline.score(X_te, y_te):.4f}")

# So sánh các kernel
kernels = ['linear', 'poly', 'rbf', 'sigmoid']
for kernel in kernels:
    svm = Pipeline([
        ('scaler', StandardScaler()),
        ('svm', SVC(kernel=kernel, C=1.0))
    ])
    score = cross_val_score(svm, X, y, cv=5).mean()
    print(f"Kernel {kernel:8s}: CV Accuracy = {score:.4f}")
```

### 3.5 Cây Quyết Định (Decision Tree)

Cây quyết định xây dựng mô hình bằng cách liên tục phân chia dữ liệu theo đặc trưng giúp giảm tạp chất (impurity) nhiều nhất. Hai tiêu chí phổ biến là Gini Impurity và Information Gain (Entropy).

```python
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree

# Xây dựng cây quyết định
dt = DecisionTreeClassifier(
    criterion='gini',      # hoặc 'entropy'
    max_depth=3,           # giới hạn độ sâu để tránh overfitting
    min_samples_split=5,   # số mẫu tối thiểu để tách một nút
    min_samples_leaf=2,    # số mẫu tối thiểu ở nút lá
    random_state=42
)
dt.fit(X_tr, y_tr)

print(f"Train Accuracy: {dt.score(X_tr, y_tr):.4f}")
print(f"Test Accuracy:  {dt.score(X_te, y_te):.4f}")

# Xem cấu trúc cây dưới dạng text
tree_rules = export_text(dt, feature_names=list(iris.feature_names))
print(tree_rules)

# Trực quan hóa cây
plt.figure(figsize=(14, 6))
plot_tree(dt, feature_names=iris.feature_names,
          class_names=iris.target_names, filled=True, rounded=True)
plt.title("Decision Tree Visualization")
plt.show()

# Tầm quan trọng của đặc trưng
for name, importance in zip(iris.feature_names, dt.feature_importances_):
    print(f"{name}: {importance:.4f}")
```

### 3.6 Random Forest và Gradient Boosting

Phương pháp ensemble kết hợp nhiều mô hình yếu (weak learners) để tạo thành mô hình mạnh hơn.

```python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb

# Random Forest: Bagging + Feature Randomness
rf = RandomForestClassifier(
    n_estimators=100,       # số cây
    max_depth=None,         # không giới hạn độ sâu
    max_features='sqrt',    # sqrt(n_features) đặc trưng mỗi nút
    bootstrap=True,         # lấy mẫu có hoàn lại
    n_jobs=-1,              # dùng tất cả CPU
    random_state=42
)
rf.fit(X_tr, y_tr)
print(f"Random Forest Accuracy: {rf.score(X_te, y_te):.4f}")

# Gradient Boosting: học tuần tự, mỗi cây sửa lỗi của cây trước
gb = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.1,  # thu nhỏ đóng góp mỗi cây
    max_depth=3,
    subsample=0.8,      # fraction dữ liệu cho mỗi cây
    random_state=42
)
gb.fit(X_tr, y_tr)
print(f"Gradient Boosting Accuracy: {gb.score(X_te, y_te):.4f}")

# XGBoost: Extreme Gradient Boosting - phổ biến trong Kaggle
xgb_clf = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=3,
    learning_rate=0.1,
    use_label_encoder=False,
    eval_metric='mlogloss',
    random_state=42
)
xgb_clf.fit(X_tr, y_tr, eval_set=[(X_te, y_te)], verbose=False)
print(f"XGBoost Accuracy: {xgb_clf.score(X_te, y_te):.4f}")
```

### 3.7 K-Means Clustering (Học Không Giám Sát)

K-Means phân chia dữ liệu thành `k` cụm, mỗi cụm xoay quanh một tâm (centroid). Thuật toán lặp đến hội tụ.

```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Tìm số cụm tối ưu bằng Elbow Method
inertias = []
silhouette_scores = []
K_range = range(2, 11)

for k in K_range:
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42)
    km.fit(X_s)
    inertias.append(km.inertia_)
    silhouette_scores.append(silhouette_score(X_s, km.labels_))

# Vẽ Elbow Curve
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_xlabel('Số cụm k')
axes[0].set_ylabel('Inertia (WCSS)')
axes[0].set_title('Elbow Method')

axes[1].plot(K_range, silhouette_scores, 'rs-')
axes[1].set_xlabel('Số cụm k')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Analysis')
plt.tight_layout()
plt.show()

# Huấn luyện với k=3
km_final = KMeans(n_clusters=3, init='k-means++', n_init=10, random_state=42)
labels = km_final.fit_predict(X_s)
print(f"Silhouette Score (k=3): {silhouette_score(X_s, labels):.4f}")
```


## 4. Đánh Giá Mô Hình và Điều Chỉnh Siêu Tham Số

### 4.1 Cross-Validation

Cross-validation đánh giá mô hình một cách đáng tin cậy hơn bằng cách sử dụng nhiều cách chia dữ liệu khác nhau.

```python
from sklearn.model_selection import (KFold, StratifiedKFold,
                                      cross_val_score, cross_validate)

# K-Fold Cross-Validation chuẩn
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(rf, X, y, cv=kf, scoring='accuracy')
print(f"CV Scores: {scores}")
print(f"Mean: {scores.mean():.4f} (+/- {scores.std()*2:.4f})")

# Stratified K-Fold: giữ tỉ lệ lớp trong mỗi fold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_results = cross_validate(
    rf, X, y, cv=skf,
    scoring=['accuracy', 'f1_macro', 'precision_macro', 'recall_macro'],
    return_train_score=True
)

for metric in ['accuracy', 'f1_macro']:
    train_score = cv_results[f'train_{metric}'].mean()
    test_score = cv_results[f'test_{metric}'].mean()
    print(f"{metric}: Train={train_score:.4f}, Test={test_score:.4f}")
```

### 4.2 Grid Search và Random Search

```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from scipy.stats import randint, uniform

# Grid Search: tìm kiếm toàn diện trên lưới siêu tham số
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 5, 10],
    'min_samples_split': [2, 5, 10],
    'max_features': ['sqrt', 'log2']
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid=param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    verbose=1
)
grid_search.fit(X_tr, y_tr)

print(f"Best params: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.4f}")
print(f"Test score: {grid_search.best_estimator_.score(X_te, y_te):.4f}")

# Random Search: hiệu quả hơn khi không gian tham số lớn
param_dist = {
    'n_estimators': randint(50, 500),
    'max_depth': [None, 3, 5, 10, 15],
    'min_samples_split': randint(2, 20),
    'max_features': uniform(0.1, 0.9)
}

random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=50,   # số lần thử ngẫu nhiên
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42
)
random_search.fit(X_tr, y_tr)
print(f"Random Search Best: {random_search.best_score_:.4f}")
```

### 4.3 Bias-Variance Tradeoff và Learning Curves

```python
from sklearn.model_selection import learning_curve, validation_curve

# Learning Curve: chẩn đoán underfitting / overfitting
train_sizes, train_scores, val_scores = learning_curve(
    estimator=RandomForestClassifier(n_estimators=100, random_state=42),
    X=X, y=y,
    train_sizes=np.linspace(0.1, 1.0, 10),
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)

train_mean = train_scores.mean(axis=1)
train_std  = train_scores.std(axis=1)
val_mean   = val_scores.mean(axis=1)
val_std    = val_scores.std(axis=1)

plt.figure(figsize=(8, 5))
plt.plot(train_sizes, train_mean, 'o-', color='royalblue', label='Training Score')
plt.fill_between(train_sizes, train_mean-train_std, train_mean+train_std, alpha=0.15, color='royalblue')
plt.plot(train_sizes, val_mean, 's-', color='tomato', label='Validation Score')
plt.fill_between(train_sizes, val_mean-val_std, val_mean+val_std, alpha=0.15, color='tomato')
plt.xlabel('Training Set Size')
plt.ylabel('Accuracy')
plt.title('Learning Curve')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```


## 5. Học Sâu - Mạng Nơ-ron Nhân Tạo

### 5.1 Perceptron và Mạng Nơ-ron Cơ Bản

Mạng nơ-ron nhân tạo lấy cảm hứng từ hệ thần kinh sinh học. Mỗi nơ-ron nhận đầu vào, tính tổng có trọng số, rồi áp dụng hàm kích hoạt.

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# Kiểm tra GPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Sử dụng thiết bị: {device}")

# Chuyển dữ liệu sang Tensor
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_tr_s, X_te_s, y_tr, y_te = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

X_train_t = torch.FloatTensor(X_tr_s).to(device)
y_train_t = torch.LongTensor(y_tr).to(device)
X_test_t  = torch.FloatTensor(X_te_s).to(device)
y_test_t  = torch.LongTensor(y_te).to(device)

# Dataset và DataLoader
train_dataset = TensorDataset(X_train_t, y_train_t)
train_loader  = DataLoader(train_dataset, batch_size=32, shuffle=True)
```

### 5.2 Xây Dựng Mạng Nơ-ron với PyTorch

```python
class MLP(nn.Module):
    """Multi-Layer Perceptron cho bài toán phân loại."""

    def __init__(self, input_dim, hidden_dims, output_dim, dropout_rate=0.3):
        super(MLP, self).__init__()
        layers = []
        prev_dim = input_dim

        for hidden_dim in hidden_dims:
            layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.BatchNorm1d(hidden_dim),  # chuẩn hóa batch
                nn.ReLU(),
                nn.Dropout(dropout_rate)
            ])
            prev_dim = hidden_dim

        layers.append(nn.Linear(prev_dim, output_dim))
        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)


# Khởi tạo mô hình
model = MLP(
    input_dim=4,
    hidden_dims=[64, 128, 64],
    output_dim=3,
    dropout_rate=0.3
).to(device)

print(model)
total_params = sum(p.numel() for p in model.parameters())
print(f"Tổng số tham số: {total_params:,}")

# Hàm mất mát và bộ tối ưu
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-4)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=30, gamma=0.5)
```

### 5.3 Vòng Lặp Huấn Luyện

```python
def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss, correct, total = 0, 0, 0

    for X_batch, y_batch in loader:
        X_batch, y_batch = X_batch.to(device), y_batch.to(device)

        optimizer.zero_grad()        # xóa gradient cũ
        output = model(X_batch)      # forward pass
        loss = criterion(output, y_batch)
        loss.backward()              # backward pass - tính gradient
        optimizer.step()             # cập nhật trọng số

        total_loss += loss.item() * X_batch.size(0)
        _, predicted = output.max(1)
        correct += predicted.eq(y_batch).sum().item()
        total += X_batch.size(0)

    return total_loss / total, correct / total


def evaluate(model, X_tensor, y_tensor, criterion, device):
    model.eval()
    with torch.no_grad():
        output = model(X_tensor)
        loss = criterion(output, y_tensor)
        _, predicted = output.max(1)
        accuracy = predicted.eq(y_tensor).float().mean().item()
    return loss.item(), accuracy


# Huấn luyện
n_epochs = 100
history = {'train_loss': [], 'val_loss': [], 'train_acc': [], 'val_acc': []}

for epoch in range(n_epochs):
    train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
    val_loss, val_acc     = evaluate(model, X_test_t, y_test_t, criterion, device)
    scheduler.step()

    history['train_loss'].append(train_loss)
    history['val_loss'].append(val_loss)
    history['train_acc'].append(train_acc)
    history['val_acc'].append(val_acc)

    if (epoch + 1) % 20 == 0:
        print(f"Epoch [{epoch+1:3d}/{n_epochs}] "
              f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f} | "
              f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")

# Vẽ đường cong huấn luyện
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(history['train_loss'], label='Train', color='royalblue')
axes[0].plot(history['val_loss'], label='Validation', color='tomato')
axes[0].set_title('Loss Curve')
axes[0].legend()

axes[1].plot(history['train_acc'], label='Train', color='royalblue')
axes[1].plot(history['val_acc'], label='Validation', color='tomato')
axes[1].set_title('Accuracy Curve')
axes[1].legend()
plt.show()
```


## 6. Hàm Kích Hoạt (Activation Functions)

Hàm kích hoạt đưa vào tính phi tuyến, cho phép mạng học các ánh xạ phức tạp.

```python
import torch
import torch.nn.functional as F

x = torch.linspace(-5, 5, 200)

activations = {
    'Sigmoid':  torch.sigmoid(x),
    'Tanh':     torch.tanh(x),
    'ReLU':     F.relu(x),
    'LeakyReLU': F.leaky_relu(x, negative_slope=0.1),
    'ELU':      F.elu(x),
    'GELU':     F.gelu(x),
    'Swish':    x * torch.sigmoid(x)
}

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
axes = axes.flatten()

for i, (name, values) in enumerate(activations.items()):
    axes[i].plot(x.numpy(), values.numpy(), linewidth=2, color='royalblue')
    axes[i].axhline(y=0, color='gray', linestyle='--', alpha=0.5)
    axes[i].axvline(x=0, color='gray', linestyle='--', alpha=0.5)
    axes[i].set_title(name, fontsize=12, fontweight='bold')
    axes[i].set_ylim(-2, 4)
    axes[i].grid(True, alpha=0.3)

axes[-1].axis('off')
plt.suptitle('Các Hàm Kích Hoạt Phổ Biến', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

**Tóm tắt các hàm kích hoạt:**

- **Sigmoid:** Đầu ra trong (0,1), phù hợp lớp cuối phân loại nhị phân. Vấn đề: vanishing gradient với input lớn/nhỏ.
- **Tanh:** Đầu ra trong (-1,1), trung tâm tại 0. Vẫn có vanishing gradient nhưng tốt hơn sigmoid.
- **ReLU:** `max(0, x)`. Đơn giản, tính toán nhanh, giải quyết tốt vanishing gradient. Vấn đề: "dying ReLU" khi nơ-ron bị kẹt ở 0.
- **LeakyReLU:** Giải quyết dying ReLU bằng cách cho phép gradient nhỏ với x < 0.
- **GELU / Swish:** Phổ biến trong các kiến trúc hiện đại (Transformer, BERT).


## 7. Thuật Toán Tối Ưu Hóa (Optimizers)

### 7.1 Gradient Descent và Các Biến Thể

```python
# Minh họa các optimizer trên PyTorch
from torch.optim import SGD, Adam, AdamW, RMSprop

model_configs = [
    ('SGD', SGD(model.parameters(), lr=0.01, momentum=0.9)),
    ('Adam', Adam(model.parameters(), lr=0.001, betas=(0.9, 0.999))),
    ('AdamW', AdamW(model.parameters(), lr=0.001, weight_decay=0.01)),
    ('RMSprop', RMSprop(model.parameters(), lr=0.001, alpha=0.99))
]

# Nguyên lý cập nhật gradient descent:
# w = w - lr * grad(L, w)

# Momentum: tích lũy vận tốc theo hướng giảm gradient
# v = beta*v - lr*grad
# w = w + v

# Adam: Adaptive Moment Estimation
# m = beta1*m + (1-beta1)*grad         <- moment bậc 1
# v = beta2*v + (1-beta2)*grad^2       <- moment bậc 2
# m_hat = m / (1 - beta1^t)            <- hiệu chỉnh bias
# v_hat = v / (1 - beta2^t)
# w = w - lr * m_hat / (sqrt(v_hat) + epsilon)

print("Optimizer SGD:    cập nhật đơn giản, cần điều chỉnh lr cẩn thận")
print("Optimizer Adam:   thích nghi lr theo từng tham số, hội tụ nhanh")
print("Optimizer AdamW:  Adam + weight decay đúng cách, thường tốt hơn Adam")
```

### 7.2 Learning Rate Scheduling

```python
from torch.optim.lr_scheduler import (StepLR, CosineAnnealingLR,
                                       OneCycleLR, ReduceLROnPlateau)

optimizer = Adam(model.parameters(), lr=0.01)

# StepLR: giảm lr theo bước cố định
step_scheduler = StepLR(optimizer, step_size=30, gamma=0.1)

# CosineAnnealingLR: lr thay đổi theo hàm cosine
cosine_scheduler = CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)

# ReduceLROnPlateau: giảm lr khi metric không cải thiện
plateau_scheduler = ReduceLROnPlateau(
    optimizer, mode='min', factor=0.5, patience=10, verbose=True
)

# OneCycleLR: tăng rồi giảm lr - thường hội tụ rất nhanh
one_cycle = OneCycleLR(
    optimizer, max_lr=0.01,
    steps_per_epoch=len(train_loader),
    epochs=50
)

# Trong vòng lặp huấn luyện:
# for epoch in range(n_epochs):
#     ...
#     plateau_scheduler.step(val_loss)  # sau mỗi epoch
#     cosine_scheduler.step()
```


## 8. Mạng Nơ-ron Tích Chập (Convolutional Neural Networks - CNN)

CNN là kiến trúc phù hợp nhất cho dữ liệu ảnh. Lớp tích chập (Conv2D) học các bộ lọc đặc trưng cục bộ, lớp pooling giảm chiều không gian, còn lớp fully-connected đưa ra quyết định cuối cùng.

### 8.1 Kiến Trúc CNN Cơ Bản

```python
import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms

# Tải CIFAR-10
transform_train = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomCrop(32, padding=4),
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465),
                         (0.2023, 0.1994, 0.2010))
])

transform_test = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465),
                         (0.2023, 0.1994, 0.2010))
])

trainset = torchvision.datasets.CIFAR10(root='./data', train=True,
                                         download=True, transform=transform_train)
testset  = torchvision.datasets.CIFAR10(root='./data', train=False,
                                         download=True, transform=transform_test)

train_loader = DataLoader(trainset, batch_size=64, shuffle=True, num_workers=2)
test_loader  = DataLoader(testset, batch_size=64, shuffle=False, num_workers=2)


class CNN(nn.Module):
    """Mạng CNN cơ bản cho CIFAR-10."""

    def __init__(self, num_classes=10):
        super(CNN, self).__init__()

        # Khối đặc trưng (Feature Extractor)
        self.features = nn.Sequential(
            # Block 1: 3 -> 32 channels
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),          # 32x32 -> 16x16
            nn.Dropout2d(0.25),

            # Block 2: 32 -> 64 channels
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),          # 16x16 -> 8x8
            nn.Dropout2d(0.25),

            # Block 3: 64 -> 128 channels
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2)           # 8x8 -> 4x4
        )

        # Khối phân loại (Classifier)
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x


cnn = CNN(num_classes=10).to(device)

# Tính số tham số
total = sum(p.numel() for p in cnn.parameters())
trainable = sum(p.numel() for p in cnn.parameters() if p.requires_grad)
print(f"Tổng tham số: {total:,}")
print(f"Tham số có thể huấn luyện: {trainable:,}")
```

### 8.2 Transfer Learning

Transfer learning tận dụng mô hình đã được huấn luyện trên tập dữ liệu lớn (ImageNet) và điều chỉnh lại cho bài toán mới.

```python
import torchvision.models as models

# Tải ResNet-18 với trọng số đã huấn luyện trên ImageNet
resnet18 = models.resnet18(weights='IMAGENET1K_V1')

# Chiến lược 1: Feature Extraction - đóng băng toàn bộ backbone
for param in resnet18.parameters():
    param.requires_grad = False

# Thay lớp cuối để phù hợp với số lớp mới
num_features = resnet18.fc.in_features
resnet18.fc = nn.Sequential(
    nn.Linear(num_features, 256),
    nn.ReLU(),
    nn.Dropout(0.4),
    nn.Linear(256, 10)
)

# Chiến lược 2: Fine-tuning - chỉ đóng băng các lớp đầu
resnet50 = models.resnet50(weights='IMAGENET1K_V2')

# Đóng băng layer1 và layer2
for name, param in resnet50.named_parameters():
    if 'layer1' in name or 'layer2' in name or 'conv1' in name or 'bn1' in name:
        param.requires_grad = False

resnet50.fc = nn.Linear(resnet50.fc.in_features, 10)

# Dùng learning rate khác nhau cho backbone và head
optimizer = Adam([
    {'params': resnet50.layer3.parameters(), 'lr': 1e-4},
    {'params': resnet50.layer4.parameters(), 'lr': 1e-4},
    {'params': resnet50.fc.parameters(),     'lr': 1e-3}
])
```


## 9. Mạng Nơ-ron Hồi Tiếp (Recurrent Neural Networks - RNN)

RNN xử lý dữ liệu chuỗi bằng cách duy trì trạng thái ẩn (hidden state) qua các bước thời gian.

### 9.1 LSTM và GRU

```python
class LSTMClassifier(nn.Module):
    """LSTM cho phân loại chuỗi văn bản."""

    def __init__(self, vocab_size, embed_dim, hidden_dim,
                 n_layers, n_classes, dropout=0.3):
        super(LSTMClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            input_size=embed_dim,
            hidden_size=hidden_dim,
            num_layers=n_layers,
            batch_first=True,           # input shape: (batch, seq, feature)
            dropout=dropout if n_layers > 1 else 0,
            bidirectional=True          # LSTM hai chiều
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim * 2, n_classes)  # *2 vì bidirectional

    def forward(self, x):
        # x shape: (batch_size, seq_len)
        embedded = self.dropout(self.embedding(x))  # (batch, seq, embed_dim)

        # output: (batch, seq, hidden*2)
        # hidden: (n_layers*2, batch, hidden)
        output, (hidden, cell) = self.lstm(embedded)

        # Lấy hidden state cuối của cả hai chiều
        hidden_fwd = hidden[-2]  # chiều thuận, lớp cuối
        hidden_bwd = hidden[-1]  # chiều ngược, lớp cuối
        hidden_cat = torch.cat([hidden_fwd, hidden_bwd], dim=1)

        return self.fc(self.dropout(hidden_cat))


class GRUClassifier(nn.Module):
    """GRU - đơn giản hơn LSTM, ít tham số hơn."""

    def __init__(self, vocab_size, embed_dim, hidden_dim, n_classes):
        super(GRUClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.gru = nn.GRU(embed_dim, hidden_dim, batch_first=True,
                          bidirectional=True)
        self.fc = nn.Linear(hidden_dim * 2, n_classes)

    def forward(self, x):
        embedded = self.embedding(x)
        _, hidden = self.gru(embedded)
        hidden = torch.cat([hidden[-2], hidden[-1]], dim=1)
        return self.fc(hidden)
```


## 10. Kiến Trúc Transformer

Transformer là kiến trúc cách mạng hóa NLP, thay thế RNN bằng cơ chế Self-Attention. Nó xử lý toàn bộ chuỗi song song và nắm bắt được phụ thuộc xa.

### 10.1 Self-Attention

```python
class MultiHeadAttention(nn.Module):
    """Cơ chế Multi-Head Attention."""

    def __init__(self, d_model, n_heads, dropout=0.1):
        super(MultiHeadAttention, self).__init__()
        assert d_model % n_heads == 0

        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)

    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        # Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_k ** 0.5)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        attn_weights = torch.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        return torch.matmul(attn_weights, V), attn_weights

    def forward(self, Q, K, V, mask=None):
        batch_size = Q.size(0)

        # Linear projections và reshape thành (batch, heads, seq, d_k)
        Q = self.W_q(Q).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(K).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(V).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)

        x, attn = self.scaled_dot_product_attention(Q, K, V, mask)

        # Ghép các head lại
        x = x.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        return self.W_o(x)


class TransformerEncoderLayer(nn.Module):
    """Một lớp Transformer Encoder."""

    def __init__(self, d_model, n_heads, d_ff, dropout=0.1):
        super(TransformerEncoderLayer, self).__init__()
        self.self_attn = MultiHeadAttention(d_model, n_heads, dropout)
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        # Pre-LayerNorm (hiện đại hơn Post-LayerNorm)
        attn_out = self.self_attn(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_out))   # residual connection
        ff_out = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_out))      # residual connection
        return x
```

### 10.2 Sử Dụng Hugging Face Transformers

```python
from transformers import (AutoTokenizer, AutoModelForSequenceClassification,
                           Trainer, TrainingArguments)
from datasets import Dataset
import torch

# Tải BERT pre-trained
model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=2
)

# Tokenize dữ liệu
texts = ["I love this movie!", "This film was terrible.", "Great acting overall."]
labels = [1, 0, 1]

encodings = tokenizer(
    texts,
    truncation=True,
    padding=True,
    max_length=128,
    return_tensors='pt'
)

# Fine-tuning với Trainer API
train_data = Dataset.from_dict({
    'input_ids': encodings['input_ids'].tolist(),
    'attention_mask': encodings['attention_mask'].tolist(),
    'labels': labels
})

training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=16,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    evaluation_strategy='epoch',
    learning_rate=2e-5,
    fp16=torch.cuda.is_available()  # mixed precision nếu có GPU
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_data
)
```


## 11. Kỹ Thuật Tránh Overfitting

### 11.1 Regularization

```python
# L1 và L2 Regularization trong PyTorch thông qua weight_decay
optimizer_l2 = Adam(model.parameters(), lr=0.001, weight_decay=1e-4)  # L2
optimizer_l1 = Adam(model.parameters(), lr=0.001)  # L1 thêm thủ công

# Thêm L1 regularization thủ công trong training loop
def l1_regularization(model, lambda_l1):
    l1_loss = 0
    for param in model.parameters():
        l1_loss += torch.abs(param).sum()
    return lambda_l1 * l1_loss

# Trong training loop:
# loss = criterion(output, target) + l1_regularization(model, 1e-5)

# Dropout
class RegularizedNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(100, 256)
        self.dropout1 = nn.Dropout(0.5)  # 50% nơ-ron bị tắt ngẫu nhiên
        self.fc2 = nn.Linear(256, 128)
        self.dropout2 = nn.Dropout(0.3)
        self.fc3 = nn.Linear(128, 10)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.dropout1(x)  # chỉ active khi model.train()
        x = F.relu(self.fc2(x))
        x = self.dropout2(x)
        return self.fc3(x)
```

### 11.2 Early Stopping

```python
class EarlyStopping:
    """Dừng huấn luyện khi validation loss không cải thiện."""

    def __init__(self, patience=10, min_delta=1e-4, save_path='best_model.pth'):
        self.patience = patience
        self.min_delta = min_delta
        self.save_path = save_path
        self.counter = 0
        self.best_loss = float('inf')

    def __call__(self, val_loss, model):
        if val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0
            torch.save(model.state_dict(), self.save_path)
            print(f"  -> Model saved (loss={val_loss:.6f})")
        else:
            self.counter += 1
            if self.counter >= self.patience:
                print(f"Early stopping triggered after {self.counter} epochs.")
                return True  # dừng huấn luyện
        return False

# Sử dụng trong vòng lặp
early_stop = EarlyStopping(patience=15, save_path='best_model.pth')

for epoch in range(200):
    train_loss, _ = train_epoch(model, train_loader, criterion, optimizer, device)
    val_loss, val_acc = evaluate(model, X_test_t, y_test_t, criterion, device)

    if early_stop(val_loss, model):
        break

# Tải lại mô hình tốt nhất
model.load_state_dict(torch.load('best_model.pth'))
```

### 11.3 Data Augmentation

```python
from torchvision import transforms

# Augmentation cho ảnh
augment_transform = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomVerticalFlip(p=0.2),
    transforms.RandomRotation(degrees=15),
    transforms.ColorJitter(brightness=0.3, contrast=0.3,
                            saturation=0.3, hue=0.1),
    transforms.RandomGrayscale(p=0.1),
    transforms.RandomPerspective(distortion_scale=0.2, p=0.3),
    transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 2.0)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                          std=[0.229, 0.224, 0.225])
])

# Mixup Augmentation
def mixup_data(x, y, alpha=0.2):
    """Trộn hai mẫu với tỉ lệ ngẫu nhiên."""
    if alpha > 0:
        lam = np.random.beta(alpha, alpha)
    else:
        lam = 1.0

    batch_size = x.size(0)
    index = torch.randperm(batch_size).to(x.device)

    mixed_x = lam * x + (1 - lam) * x[index]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam


def mixup_criterion(criterion, pred, y_a, y_b, lam):
    return lam * criterion(pred, y_a) + (1 - lam) * criterion(pred, y_b)
```


## 12. Giảm Chiều Dữ Liệu

### 12.1 PCA (Principal Component Analysis)

```python
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import umap  # pip install umap-learn

# PCA: giảm chiều tuyến tính
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

print(f"Phương sai giải thích: {pca.explained_variance_ratio_}")
print(f"Tổng phương sai giải thích: {pca.explained_variance_ratio_.sum():.4f}")

# Scree plot - chọn số thành phần
pca_full = PCA().fit(X_scaled)
cumvar = np.cumsum(pca_full.explained_variance_ratio_)

plt.figure(figsize=(8, 4))
plt.plot(range(1, len(cumvar)+1), cumvar, 'bo-')
plt.axhline(y=0.95, color='red', linestyle='--', label='95% variance')
plt.xlabel('Số thành phần chính')
plt.ylabel('Phương sai tích lũy')
plt.title('Scree Plot - PCA')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# t-SNE: giảm chiều phi tuyến, tốt cho trực quan hóa
tsne = TSNE(n_components=2, perplexity=30, max_iter=1000, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)

# UMAP: nhanh hơn t-SNE, bảo toàn cấu trúc cục bộ và toàn cục
reducer = umap.UMAP(n_components=2, n_neighbors=15, min_dist=0.1, random_state=42)
X_umap = reducer.fit_transform(X_scaled)

# Vẽ kết quả
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
methods = [('PCA', X_pca), ('t-SNE', X_tsne), ('UMAP', X_umap)]

for ax, (name, X_reduced) in zip(axes, methods):
    scatter = ax.scatter(X_reduced[:, 0], X_reduced[:, 1], c=y,
                          cmap='Set1', alpha=0.7, s=50)
    ax.set_title(name, fontsize=12, fontweight='bold')
    ax.set_xlabel('Component 1')
    ax.set_ylabel('Component 2')
    plt.colorbar(scatter, ax=ax)

plt.suptitle('So Sánh Các Phương Pháp Giảm Chiều', fontsize=14)
plt.tight_layout()
plt.show()
```


## 13. Mạng Sinh Đối Kháng (Generative Adversarial Networks - GAN)

GAN bao gồm hai mạng cạnh tranh: Generator tạo dữ liệu giả, Discriminator phân biệt thật/giả. Hai mạng huấn luyện song song trong trò chơi minimax.

```python
class Generator(nn.Module):
    """Tạo ảnh giả từ vector nhiễu ngẫu nhiên."""

    def __init__(self, latent_dim=100, img_dim=784):
        super(Generator, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(latent_dim, 256),
            nn.LeakyReLU(0.2),
            nn.BatchNorm1d(256, momentum=0.8),
            nn.Linear(256, 512),
            nn.LeakyReLU(0.2),
            nn.BatchNorm1d(512, momentum=0.8),
            nn.Linear(512, 1024),
            nn.LeakyReLU(0.2),
            nn.BatchNorm1d(1024, momentum=0.8),
            nn.Linear(1024, img_dim),
            nn.Tanh()  # output trong [-1, 1]
        )

    def forward(self, z):
        return self.model(z)


class Discriminator(nn.Module):
    """Phân biệt ảnh thật và ảnh giả."""

    def __init__(self, img_dim=784):
        super(Discriminator, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(img_dim, 512),
            nn.LeakyReLU(0.2),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2),
            nn.Dropout(0.3),
            nn.Linear(256, 1),
            nn.Sigmoid()  # xác suất là ảnh thật
        )

    def forward(self, x):
        return self.model(x)


# Khởi tạo
latent_dim = 100
G = Generator(latent_dim).to(device)
D = Discriminator().to(device)

optimizer_G = Adam(G.parameters(), lr=0.0002, betas=(0.5, 0.999))
optimizer_D = Adam(D.parameters(), lr=0.0002, betas=(0.5, 0.999))
criterion_gan = nn.BCELoss()


def train_gan_step(real_imgs, batch_size):
    real_labels = torch.ones(batch_size, 1).to(device)
    fake_labels = torch.zeros(batch_size, 1).to(device)

    # Huấn luyện Discriminator
    optimizer_D.zero_grad()
    z = torch.randn(batch_size, latent_dim).to(device)
    fake_imgs = G(z).detach()  # .detach() ngăn gradient lan sang G

    loss_real = criterion_gan(D(real_imgs), real_labels)
    loss_fake = criterion_gan(D(fake_imgs), fake_labels)
    loss_D = (loss_real + loss_fake) / 2
    loss_D.backward()
    optimizer_D.step()

    # Huấn luyện Generator
    optimizer_G.zero_grad()
    z = torch.randn(batch_size, latent_dim).to(device)
    gen_imgs = G(z)
    # Generator muốn D(fake) = 1 (đánh lừa Discriminator)
    loss_G = criterion_gan(D(gen_imgs), real_labels)
    loss_G.backward()
    optimizer_G.step()

    return loss_D.item(), loss_G.item()
```


## 14. AutoML và MLOps Cơ Bản

### 14.1 Pipeline Hoàn Chỉnh với Scikit-learn

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import GridSearchCV
import joblib

# Phân loại cột theo kiểu dữ liệu
numerical_features = ['age', 'income', 'score']
categorical_features = ['gender', 'city', 'occupation']

# Transformer cho từng loại cột
numerical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

# Kết hợp transformer
preprocessor = ColumnTransformer(transformers=[
    ('num', numerical_transformer, numerical_features),
    ('cat', categorical_transformer, categorical_features)
])

# Pipeline đầy đủ: tiền xử lý + mô hình
full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', GradientBoostingClassifier(random_state=42))
])

# GridSearch trên toàn pipeline
param_grid = {
    'classifier__n_estimators': [100, 200],
    'classifier__learning_rate': [0.05, 0.1],
    'classifier__max_depth': [3, 5],
    'preprocessor__num__imputer__strategy': ['mean', 'median']
}

grid_cv = GridSearchCV(full_pipeline, param_grid, cv=5, n_jobs=-1, verbose=1)
# grid_cv.fit(X_train, y_train)  # chạy khi có dữ liệu thực tế

# Lưu và tải mô hình
# joblib.dump(grid_cv.best_estimator_, 'best_pipeline.pkl')
# loaded_model = joblib.load('best_pipeline.pkl')
# predictions = loaded_model.predict(X_new)
```

### 14.2 Experiment Tracking với MLflow

```python
import mlflow
import mlflow.sklearn
import mlflow.pytorch

# Bắt đầu một experiment
mlflow.set_experiment("iris_classification")

with mlflow.start_run(run_name="random_forest_baseline"):
    # Log tham số
    params = {'n_estimators': 100, 'max_depth': 5, 'random_state': 42}
    mlflow.log_params(params)

    # Huấn luyện
    rf = RandomForestClassifier(**params)
    rf.fit(X_tr, y_tr)

    # Log metrics
    train_acc = rf.score(X_tr, y_tr)
    test_acc  = rf.score(X_te, y_te)
    mlflow.log_metric("train_accuracy", train_acc)
    mlflow.log_metric("test_accuracy", test_acc)

    # Log mô hình
    mlflow.sklearn.log_model(rf, "random_forest_model")

    print(f"Run ID: {mlflow.active_run().info.run_id}")
    print(f"Train Acc: {train_acc:.4f}, Test Acc: {test_acc:.4f}")
```


## 15. Các Chủ Đề Nâng Cao

### 15.1 Explainable AI với SHAP

```python
import shap

# SHAP Values cho Random Forest
explainer = shap.TreeExplainer(rf)
shap_values = explainer.shap_values(X_te)

# Summary plot: tầm quan trọng tổng thể
shap.summary_plot(shap_values, X_te,
                  feature_names=iris.feature_names,
                  class_names=iris.target_names)

# Force plot: giải thích một dự đoán cụ thể
shap.force_plot(
    explainer.expected_value[0],
    shap_values[0][0],
    X_te[0],
    feature_names=iris.feature_names
)
```

### 15.2 Class Imbalance

```python
from imblearn.over_sampling import SMOTE, ADASYN
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline

# SMOTE: tạo mẫu tổng hợp cho lớp thiểu số
smote = SMOTE(sampling_strategy='minority', random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_tr, y_tr)
print(f"Trước SMOTE: {dict(zip(*np.unique(y_tr, return_counts=True)))}")
print(f"Sau  SMOTE: {dict(zip(*np.unique(y_resampled, return_counts=True)))}")

# Class weights trong model
from sklearn.utils.class_weight import compute_class_weight

class_weights = compute_class_weight('balanced', classes=np.unique(y_tr), y=y_tr)
weight_dict = dict(enumerate(class_weights))

rf_weighted = RandomForestClassifier(
    n_estimators=100, class_weight=weight_dict, random_state=42
)
rf_weighted.fit(X_tr, y_tr)

# Trong PyTorch
weights_tensor = torch.FloatTensor(class_weights).to(device)
criterion_weighted = nn.CrossEntropyLoss(weight=weights_tensor)
```

### 15.3 Federated Learning - Học Liên Kết (Khái Niệm)

```python
# Federated Learning: huấn luyện mô hình trên dữ liệu phân tán
# mà không cần gửi dữ liệu thô lên server

def federated_averaging(global_model, client_models):
    """FedAvg: trung bình trọng số từ các client."""
    global_dict = global_model.state_dict()

    for key in global_dict:
        # Lấy trung bình trọng số từ tất cả client
        global_dict[key] = torch.stack([
            client.state_dict()[key].float()
            for client in client_models
        ]).mean(0)

    global_model.load_state_dict(global_dict)
    return global_model


def client_update(model, data_loader, criterion, optimizer, epochs=5):
    """Mỗi client huấn luyện cục bộ trên dữ liệu riêng."""
    local_model = type(model)(*model._init_args).to(device)
    local_model.load_state_dict(model.state_dict())  # sao chép global model

    for _ in range(epochs):
        for X_batch, y_batch in data_loader:
            optimizer.zero_grad()
            loss = criterion(local_model(X_batch), y_batch)
            loss.backward()
            optimizer.step()

    return local_model  # chỉ gửi trọng số, không gửi dữ liệu
```


## 16. Tóm Tắt và Lộ Trình Học Tập

Học máy và học sâu là lĩnh vực rộng lớn và phát triển nhanh. Để nắm vững, sinh viên cần kết hợp lý thuyết toán học (đại số tuyến tính, giải tích, xác suất thống kê) với thực hành lập trình liên tục.

### 16.1 Thư Viện Quan Trọng Cần Thành Thạo

```python
# Nền tảng
import numpy as np          # Tính toán số học
import pandas as pd         # Xử lý dữ liệu bảng
import matplotlib.pyplot as plt  # Trực quan hóa cơ bản
import seaborn as sns       # Trực quan hóa thống kê

# Machine Learning
from sklearn import *       # Hầu hết thuật toán ML cổ điển

# Deep Learning
import torch                # PyTorch - phổ biến trong nghiên cứu
import tensorflow as tf     # TensorFlow/Keras - phổ biến trong production

# NLP
from transformers import *  # Hugging Face - state-of-the-art NLP

# Computer Vision
import torchvision          # Bộ dữ liệu và model CV cho PyTorch
import cv2                  # OpenCV - xử lý ảnh truyền thống

# Explainability
import shap                 # Model explanation
import lime                 # Local interpretable explanations

# MLOps
import mlflow               # Experiment tracking
import wandb                # Weights & Biases - alternative to MLflow
```

### 16.2 Checklist Khi Xây Dựng Mô Hình

```
Bước 1: Hiểu bài toán
   - Xác định loại bài toán: phân loại, hồi quy, clustering, generation?
   - Định nghĩa metric đánh giá phù hợp

Bước 2: Khám phá dữ liệu (EDA)
   - Kiểm tra kích thước, kiểu dữ liệu
   - Phân tích phân phối, tương quan
   - Phát hiện outlier và giá trị thiếu

Bước 3: Tiền xử lý
   - Xử lý giá trị thiếu
   - Encode biến phân loại
   - Chuẩn hóa / tỉ lệ hóa
   - Chia train/val/test

Bước 4: Lựa chọn và huấn luyện mô hình
   - Bắt đầu với baseline đơn giản
   - Tăng độ phức tạp dần
   - Theo dõi train vs validation performance

Bước 5: Điều chỉnh siêu tham số
   - GridSearch hoặc RandomSearch
   - Bayesian Optimization cho bài toán lớn

Bước 6: Đánh giá cuối cùng
   - Chỉ dùng test set MỘT LẦN
   - Báo cáo đầy đủ các metric
   - Phân tích lỗi

Bước 7: Triển khai
   - Đóng gói pipeline
   - Monitoring và retraining
```


*Tài liệu này tổng hợp kiến thức học máy và học sâu cốt lõi theo chương trình đại học, bao gồm lý thuyết nền tảng kết hợp với code Python thực tế. Để đi sâu hơn, tham khảo các nguồn: Deep Learning (Goodfellow et al.), Hands-On Machine Learning (Aurélien Géron), tài liệu chính thức của PyTorch và Hugging Face.*
