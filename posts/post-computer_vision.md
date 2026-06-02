---
title: Thị giác máy tính trong chương trình đại học
date: 2024-12-02
author: Kaleidoscope
category: Programming
readingTime: 25 phút đọc
excerpt: Giới thiệu những gì căn bản về thị giác máy tính được dạy ở trương trình đại học.
---


# Thị Giác Máy Tính trong Chương Trình Đại Học

## Giới thiệu tổng quan

Thị giác máy tính (Computer Vision) là một nhánh của trí tuệ nhân tạo và xử lý tín hiệu số, tập trung vào việc giúp máy tính "nhìn" và hiểu nội dung từ hình ảnh hoặc video. Mục tiêu cốt lõi là xây dựng các hệ thống có khả năng thu nhận, phân tích và diễn giải thông tin trực quan theo cách tương tự như thị giác con người.

Trong chương trình đại học ngành Khoa học Máy tính, Kỹ thuật Phần mềm hoặc Trí tuệ Nhân tạo, môn Thị giác máy tính thường được giảng dạy ở năm thứ ba hoặc năm tư, sau khi sinh viên đã nắm vững các kiến thức nền tảng về đại số tuyến tính, xác suất thống kê và lập trình Python.


## Nền tảng toán học cần thiết

Trước khi đi vào các khái niệm kỹ thuật, sinh viên cần nắm chắc một số nền tảng toán học:

- **Đại số tuyến tính**: ma trận, phép biến đổi tuyến tính, trị riêng, phân tích SVD
- **Giải tích**: đạo hàm riêng, gradient, chuỗi Taylor
- **Xác suất và thống kê**: phân phối xác suất, ước lượng tham số, phân tích Bayes
- **Xử lý tín hiệu số**: biến đổi Fourier, lọc tín hiệu, tích chập

Không có nền tảng này vững chắc, sinh viên sẽ gặp khó khăn khi tiếp cận các thuật toán thực sự của lĩnh vực.


## Biểu diễn ảnh số

### Cấu trúc dữ liệu ảnh

Một ảnh số được biểu diễn dưới dạng ma trận (hay tensor) các giá trị cường độ điểm ảnh (pixel). Với ảnh grayscale, mỗi pixel là một số nguyên trong khoảng `[0, 255]`. Với ảnh màu RGB, mỗi pixel là một vector 3 chiều tương ứng với kênh Red, Green, Blue.

```python
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

# Doc anh tu file
img = Image.open("sample.jpg")
img_array = np.array(img)

print("Kich thuoc anh:", img_array.shape)   # (height, width, channels)
print("Kieu du lieu:", img_array.dtype)      # uint8
print("Gia tri min/max:", img_array.min(), img_array.max())

# Chuyen anh RGB sang Grayscale
img_gray = np.mean(img_array, axis=2).astype(np.uint8)
print("Kich thuoc anh grayscale:", img_gray.shape)  # (height, width)

# Hien thi
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].imshow(img_array)
axes[0].set_title("Anh mau RGB")
axes[1].imshow(img_gray, cmap='gray')
axes[1].set_title("Anh grayscale")
plt.show()
```

### Chuẩn hóa giá trị pixel

Trước khi đưa ảnh vào mô hình học sâu, việc chuẩn hóa là bước không thể bỏ qua:

```python
# Chuan hoa ve [0, 1]
img_normalized = img_array.astype(np.float32) / 255.0

# Chuan hoa Z-score (dung trong nhieu mo hinh deep learning)
mean = np.array([0.485, 0.456, 0.406])  # Gia tri trung binh cua ImageNet
std  = np.array([0.229, 0.224, 0.225])  # Do lech chuan cua ImageNet

img_zscore = (img_normalized - mean) / std
```


## Xử lý ảnh cơ bản

### Biến đổi không gian màu

```python
import cv2

img_bgr = cv2.imread("sample.jpg")  # OpenCV doc anh theo dinh dang BGR

# BGR -> RGB
img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

# BGR -> Grayscale
img_gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

# BGR -> HSV (Hue, Saturation, Value)
img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

# BGR -> LAB
img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
```

Không gian màu HSV thường được dùng để phân đoạn màu sắc vì kênh Hue tách biệt thông tin màu sắc khỏi độ sáng.

### Lọc ảnh và tích chập

Tích chập (convolution) là phép toán nền tảng trong xử lý ảnh, cho phép trích xuất đặc trưng từ ảnh bằng cách áp dụng một bộ lọc (kernel) lên từng vùng cục bộ.

```python
import numpy as np
import scipy.ndimage as ndimage

def convolution_2d(image, kernel):
    """
    Thuc hien tich chap 2D giua anh va kernel.
    
    Parameters:
        image  : np.ndarray, anh grayscale (H x W)
        kernel : np.ndarray, bo loc (kH x kW)
    
    Returns:
        output : np.ndarray, anh sau khi tich chap
    """
    return ndimage.convolve(image.astype(np.float32), kernel)

# Kernel Gaussian - lam mo anh
gaussian_kernel = np.array([
    [1,  4,  7,  4, 1],
    [4, 16, 26, 16, 4],
    [7, 26, 41, 26, 7],
    [4, 16, 26, 16, 4],
    [1,  4,  7,  4, 1]
], dtype=np.float32) / 273.0

# Kernel Sobel - phat hien bien theo truc X
sobel_x = np.array([
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
], dtype=np.float32)

# Kernel Laplacian - do sac net
laplacian = np.array([
    [0,  1, 0],
    [1, -4, 1],
    [0,  1, 0]
], dtype=np.float32)

img_blurred  = convolution_2d(img_gray, gaussian_kernel)
img_edges_x  = convolution_2d(img_gray, sobel_x)
img_sharpness = convolution_2d(img_gray, laplacian)
```


## Phát hiện đặc trưng (Feature Detection)

### Phát hiện góc với Harris Corner Detector

Thuật toán Harris Corner Detector xác định các điểm góc bằng cách phân tích ma trận cấu trúc cục bộ (structure tensor).

```python
import cv2
import numpy as np

def harris_corner_detection(image, k=0.04, threshold=0.01):
    """
    Phat hien goc su dung thuat toan Harris.

    Parameters:
        image     : np.ndarray, anh grayscale
        k         : float, hang so Harris (thuong trong [0.04, 0.06])
        threshold : float, nguong phan loai goc

    Returns:
        corners   : np.ndarray, ban do cac diem goc
    """
    img = image.astype(np.float32)

    # Tinh gradient theo x va y
    Ix = cv2.Sobel(img, cv2.CV_32F, 1, 0, ksize=3)
    Iy = cv2.Sobel(img, cv2.CV_32F, 0, 1, ksize=3)

    # Cac phan tu cua ma tran cau truc
    Ixx = cv2.GaussianBlur(Ix * Ix, (5, 5), 1)
    Iyy = cv2.GaussianBlur(Iy * Iy, (5, 5), 1)
    Ixy = cv2.GaussianBlur(Ix * Iy, (5, 5), 1)

    # Ham phan hoi Harris: R = det(M) - k * trace(M)^2
    det_M   = Ixx * Iyy - Ixy ** 2
    trace_M = Ixx + Iyy
    R = det_M - k * (trace_M ** 2)

    # Nguong hoa
    corners = np.zeros_like(R)
    corners[R > threshold * R.max()] = 255

    return corners

img_gray = cv2.cvtColor(cv2.imread("sample.jpg"), cv2.COLOR_BGR2GRAY)
corners = harris_corner_detection(img_gray)
```

### Bộ mô tả đặc trưng SIFT

SIFT (Scale-Invariant Feature Transform) là một trong những bộ mô tả đặc trưng mạnh nhất, bất biến với tỉ lệ, góc quay và một phần với thay đổi ánh sáng.

```python
import cv2

def extract_sift_features(image):
    """
    Trich xuat diem dac trung va bo mo ta su dung SIFT.

    Parameters:
        image : np.ndarray, anh grayscale

    Returns:
        keypoints    : list, danh sach cac diem dac trung
        descriptors  : np.ndarray, ma tran mo ta (N x 128)
    """
    sift = cv2.SIFT_create()
    keypoints, descriptors = sift.detectAndCompute(image, None)

    print(f"So luong diem dac trung tim duoc: {len(keypoints)}")
    print(f"Kich thuoc ma tran mo ta: {descriptors.shape}")  # (N, 128)

    return keypoints, descriptors

# Hien thi diem dac trung len anh
img_with_kp = cv2.drawKeypoints(
    img_gray, keypoints, None,
    flags=cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS
)
```


## Phân đoạn ảnh (Image Segmentation)

### Phân đoạn theo ngưỡng (Thresholding)

```python
import cv2
import numpy as np

def otsu_thresholding(image):
    """
    Phan doan anh su dung phuong phap Otsu tu dong chon nguong.

    Parameters:
        image : np.ndarray, anh grayscale

    Returns:
        binary : np.ndarray, anh nhi phan sau phan doan
        thresh : float, nguong duoc chon tu dong
    """
    thresh, binary = cv2.threshold(
        image, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )
    print(f"Nguong Otsu: {thresh}")
    return binary, thresh
```

### Phân đoạn theo vùng với K-means

```python
import cv2
import numpy as np

def kmeans_segmentation(image, k=3):
    """
    Phan doan anh bang giai thuat K-means clustering.

    Parameters:
        image : np.ndarray, anh mau RGB (H x W x 3)
        k     : int, so luong cum (segment)

    Returns:
        segmented : np.ndarray, anh da duoc phan doan
        labels    : np.ndarray, nhan cum cho tung pixel
    """
    # Reshape anh thanh danh sach pixel
    pixel_data = image.reshape((-1, 3)).astype(np.float32)

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    _, labels, centers = cv2.kmeans(
        pixel_data, k, None, criteria,
        attempts=10, flags=cv2.KMEANS_RANDOM_CENTERS
    )

    centers = np.uint8(centers)
    segmented = centers[labels.flatten()].reshape(image.shape)

    return segmented, labels.reshape(image.shape[:2])
```


## Mạng nơ-ron tích chập (Convolutional Neural Networks)

### Kiến trúc CNN cơ bản

Mạng nơ-ron tích chập là nền tảng của thị giác máy tính hiện đại. Mỗi lớp tích chập học các bộ lọc đặc trưng từ dữ liệu, thay vì được thiết kế thủ công.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleCNN(nn.Module):
    """
    Mang CNN don gian cho bai toan phan loai anh.
    
    Kien truc: Conv -> BN -> ReLU -> Pool (x2) -> FC -> Softmax
    """

    def __init__(self, num_classes=10):
        super(SimpleCNN, self).__init__()

        # Khoi dau: 3 kenh mau (RGB), output 32 feature maps
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=32,
                                kernel_size=3, padding=1)
        self.bn1   = nn.BatchNorm2d(32)

        # Lop thu hai: 32 -> 64 feature maps
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64,
                                kernel_size=3, padding=1)
        self.bn2   = nn.BatchNorm2d(64)

        # Lop thu ba: 64 -> 128 feature maps
        self.conv3 = nn.Conv2d(in_channels=64, out_channels=128,
                                kernel_size=3, padding=1)
        self.bn3   = nn.BatchNorm2d(128)

        self.pool    = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout = nn.Dropout(p=0.5)

        # Voi anh dau vao 32x32: sau 3 lan pool -> 4x4
        self.fc1 = nn.Linear(128 * 4 * 4, 512)
        self.fc2 = nn.Linear(512, num_classes)

    def forward(self, x):
        # x: (batch, 3, 32, 32)
        x = self.pool(F.relu(self.bn1(self.conv1(x))))  # -> (batch, 32, 16, 16)
        x = self.pool(F.relu(self.bn2(self.conv2(x))))  # -> (batch, 64, 8, 8)
        x = self.pool(F.relu(self.bn3(self.conv3(x))))  # -> (batch, 128, 4, 4)

        x = x.view(x.size(0), -1)   # Flatten -> (batch, 2048)
        x = self.dropout(F.relu(self.fc1(x)))
        x = self.fc2(x)              # Logits -> (batch, num_classes)

        return x
```

### Huấn luyện mô hình CNN

```python
import torch
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

def train_epoch(model, loader, criterion, optimizer, device):
    """
    Huan luyen mot epoch.

    Returns:
        avg_loss     : float
        accuracy     : float
    """
    model.train()
    total_loss, correct, total = 0.0, 0, 0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        correct += predicted.eq(labels).sum().item()
        total   += labels.size(0)

    return total_loss / total, correct / total


def evaluate(model, loader, criterion, device):
    """
    Danh gia mo hinh tren tap du lieu.
    """
    model.eval()
    total_loss, correct, total = 0.0, 0, 0

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            total_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            correct += predicted.eq(labels).sum().item()
            total   += labels.size(0)

    return total_loss / total, correct / total


#
# Chay thu nghiem
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5]*3, std=[0.5]*3)
])

train_dataset = datasets.CIFAR10(root="./data", train=True,
                                  download=True, transform=transform)
test_dataset  = datasets.CIFAR10(root="./data", train=False,
                                  download=True, transform=transform)

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader  = DataLoader(test_dataset,  batch_size=64, shuffle=False)

model     = SimpleCNN(num_classes=10).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)

for epoch in range(1, 31):
    train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
    val_loss,   val_acc   = evaluate(model, test_loader, criterion, device)
    scheduler.step()

    print(f"Epoch {epoch:02d} | "
          f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f} | "
          f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
```


## Transfer Learning

### Sử dụng mô hình tiền huấn luyện

Transfer Learning là kỹ thuật cực kỳ quan trọng trong thực tế: sử dụng lại trọng số của một mô hình đã được huấn luyện trên tập dữ liệu lớn (thường là ImageNet) để giải quyết bài toán mới với ít dữ liệu hơn.

```python
import torch
import torch.nn as nn
from torchvision import models

def build_transfer_model(num_classes, freeze_backbone=True):
    """
    Xay dung mo hinh phan loai dua tren ResNet-50 tien huan luyen.

    Parameters:
        num_classes      : int, so luong lop can phan loai
        freeze_backbone  : bool, dong bang cac lop backbone hay khong

    Returns:
        model : nn.Module
    """
    # Tai mo hinh ResNet-50 voi trong so tien huan luyen tren ImageNet
    model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)

    if freeze_backbone:
        # Dong bang toan bo backbone, chi huan luyen lop cuoi
        for param in model.parameters():
            param.requires_grad = False

    # Thay the lop phan loai cuoi
    in_features = model.fc.in_features   # 2048 voi ResNet-50
    model.fc = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(in_features, 512),
        nn.ReLU(),
        nn.Dropout(p=0.3),
        nn.Linear(512, num_classes)
    )

    return model


def fine_tune_model(model, unfreeze_layers=("layer4", "fc")):
    """
    Mo khoa mot so lop de fine-tune sau khi huan luyen lop cuoi.

    Parameters:
        model          : nn.Module, mo hinh ResNet da duoc build
        unfreeze_layers: tuple, ten cac module can mo khoa
    """
    for name, param in model.named_parameters():
        for layer_name in unfreeze_layers:
            if layer_name in name:
                param.requires_grad = True
                break

    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total     = sum(p.numel() for p in model.parameters())
    print(f"Tham so co the huan luyen: {trainable:,} / {total:,}")

    return model
```


## Phát hiện vật thể (Object Detection)

### Sliding Window (Cua so truot)

```python
import numpy as np

def sliding_window(image, window_size, stride):
    """
    Trich xuat cac vung anh bang ky thuat cua so truot.

    Parameters:
        image       : np.ndarray, anh dau vao (H x W x C)
        window_size : tuple, (height, width) cua cua so
        stride      : int, buoc truot

    Yields:
        (y, x, window) : vi tri va vung anh tuong ung
    """
    h, w = image.shape[:2]
    win_h, win_w = window_size

    for y in range(0, h - win_h + 1, stride):
        for x in range(0, w - win_w + 1, stride):
            window = image[y:y + win_h, x:x + win_w]
            yield (y, x, window)
```

### Non-Maximum Suppression

Sau khi mô hình đề xuất nhiều bounding box, NMS loại bỏ các hộp trùng lặp:

```python
import numpy as np

def non_maximum_suppression(boxes, scores, iou_threshold=0.5):
    """
    Loc cac bounding box bang Non-Maximum Suppression.

    Parameters:
        boxes         : np.ndarray, (N x 4) - [x1, y1, x2, y2]
        scores        : np.ndarray, (N,) - diem tin cay
        iou_threshold : float, nguong IoU de loai bo box trung lap

    Returns:
        keep : list, chi so cac box duoc giu lai
    """
    x1, y1, x2, y2 = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
    areas = (x2 - x1) * (y2 - y1)

    order = scores.argsort()[::-1]   # Sap xep giam dan theo diem tin cay
    keep  = []

    while order.size > 0:
        i = order[0]
        keep.append(i)

        # Tinh IoU giua box hien tai va tat ca box con lai
        inter_x1 = np.maximum(x1[i], x1[order[1:]])
        inter_y1 = np.maximum(y1[i], y1[order[1:]])
        inter_x2 = np.minimum(x2[i], x2[order[1:]])
        inter_y2 = np.minimum(y2[i], y2[order[1:]])

        inter_area = (np.maximum(0, inter_x2 - inter_x1) *
                      np.maximum(0, inter_y2 - inter_y1))

        union_area = areas[i] + areas[order[1:]] - inter_area
        iou = inter_area / (union_area + 1e-6)

        # Giu lai cac box co IoU duoi nguong
        keep_mask = iou < iou_threshold
        order = order[1:][keep_mask]

    return keep
```


## Bài toán nhận dạng khuôn mặt

### Phát hiện khuôn mặt với Haar Cascade

```python
import cv2

def detect_faces_haar(image_path):
    """
    Phat hien khuon mat su dung Haar Cascade Classifier.

    Parameters:
        image_path : str, duong dan anh dau vao

    Returns:
        faces      : list of tuples, toa do (x, y, w, h) cua cac khuon mat
        img_drawn  : np.ndarray, anh voi cac khung bao khuon mat
    """
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    img     = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    gray    = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )

    img_drawn = img_rgb.copy()
    for (x, y, w, h) in faces:
        cv2.rectangle(img_drawn, (x, y), (x + w, y + h), (0, 255, 0), 2)

    print(f"Tim thay {len(faces)} khuon mat.")
    return faces, img_drawn
```


## Tăng cường dữ liệu (Data Augmentation)

Tăng cường dữ liệu là kỹ thuật quan trọng giúp cải thiện khả năng tổng quát hóa của mô hình khi dữ liệu huấn luyện có hạn.

```python
from torchvision import transforms
from PIL import Image

def get_augmentation_pipeline(mode="train", img_size=224):
    """
    Tao pipeline tang cuong du lieu cho tap huan luyen va kiem thu.

    Parameters:
        mode     : str, "train" hoac "val"
        img_size : int, kich thuoc anh dau ra

    Returns:
        transform : torchvision.transforms.Compose
    """
    if mode == "train":
        return transforms.Compose([
            transforms.RandomResizedCrop(img_size, scale=(0.7, 1.0)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomVerticalFlip(p=0.1),
            transforms.ColorJitter(
                brightness=0.3,
                contrast=0.3,
                saturation=0.2,
                hue=0.05
            ),
            transforms.RandomRotation(degrees=15),
            transforms.RandomGrayscale(p=0.05),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    else:
        return transforms.Compose([
            transforms.Resize(int(img_size * 1.15)),
            transforms.CenterCrop(img_size),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
```


## Đánh giá mô hình

### Các chỉ số đánh giá quan trọng

```python
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score,
    recall_score, f1_score,
    confusion_matrix, classification_report
)
import matplotlib.pyplot as plt
import seaborn as sns

def evaluate_classification(y_true, y_pred, class_names=None):
    """
    Tinh toan va hien thi cac chi so danh gia phan loai.

    Parameters:
        y_true       : array-like, nhan thuc te
        y_pred       : array-like, nhan du doan
        class_names  : list, ten cac lop

    Returns:
        metrics : dict, cac chi so danh gia
    """
    acc  = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, average='macro', zero_division=0)
    rec  = recall_score(y_true, y_pred, average='macro', zero_division=0)
    f1   = f1_score(y_true, y_pred, average='macro', zero_division=0)

    print("=" * 50)
    print(f"Accuracy  : {acc:.4f}")
    print(f"Precision : {prec:.4f}")
    print(f"Recall    : {rec:.4f}")
    print(f"F1-Score  : {f1:.4f}")
    print("=" * 50)
    print(classification_report(y_true, y_pred, target_names=class_names))

    # Ve confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=class_names, yticklabels=class_names)
    plt.xlabel("Du doan")
    plt.ylabel("Thuc te")
    plt.title("Confusion Matrix")
    plt.tight_layout()
    plt.show()

    return {"accuracy": acc, "precision": prec, "recall": rec, "f1": f1}
```


## Xu hướng hiện đại và nghiên cứu

### Vision Transformer (ViT)

Kể từ bài báo "An Image is Worth 16x16 Words" (Dosovitskiy et al., 2020), kiến trúc Transformer đã xâm nhập vào thị giác máy tính và thách thức sự thống trị của CNN.

```python
import torch
import torch.nn as nn
import math

class PatchEmbedding(nn.Module):
    """
    Chia anh thanh cac patch va chuyen thanh embedding.
    """

    def __init__(self, img_size=224, patch_size=16, in_channels=3, embed_dim=768):
        super().__init__()
        self.num_patches = (img_size // patch_size) ** 2
        self.projection  = nn.Conv2d(
            in_channels, embed_dim,
            kernel_size=patch_size, stride=patch_size
        )

    def forward(self, x):
        # x: (B, C, H, W) -> (B, embed_dim, H/P, W/P) -> (B, N, embed_dim)
        x = self.projection(x)           # (B, D, H/P, W/P)
        x = x.flatten(2).transpose(1, 2) # (B, N, D)
        return x


class VisionTransformerSmall(nn.Module):
    """
    Phien ban don gian cua Vision Transformer.
    """

    def __init__(self, img_size=224, patch_size=16, num_classes=1000,
                 embed_dim=768, depth=12, num_heads=12):
        super().__init__()

        self.patch_embed = PatchEmbedding(img_size, patch_size, 3, embed_dim)
        num_patches = self.patch_embed.num_patches

        # Token phan loai va positional encoding
        self.cls_token = nn.Parameter(torch.zeros(1, 1, embed_dim))
        self.pos_embed = nn.Parameter(torch.zeros(1, num_patches + 1, embed_dim))

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embed_dim, nhead=num_heads,
            dim_feedforward=embed_dim * 4, batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=depth)
        self.norm = nn.LayerNorm(embed_dim)
        self.head = nn.Linear(embed_dim, num_classes)

        nn.init.trunc_normal_(self.pos_embed, std=0.02)
        nn.init.trunc_normal_(self.cls_token, std=0.02)

    def forward(self, x):
        B = x.size(0)
        x = self.patch_embed(x)

        cls_token = self.cls_token.expand(B, -1, -1)
        x = torch.cat([cls_token, x], dim=1)
        x = x + self.pos_embed

        x = self.transformer(x)
        x = self.norm(x[:, 0])   # Lay output cua CLS token
        return self.head(x)
```


## Lời khuyên cho sinh viên

Học Thị giác máy tính ở đại học đòi hỏi sự kiên nhẫn và thực hành liên tục. Dưới đây là một số định hướng thực tế:

**Về kỹ năng lập trình**: Nắm chắc Python, NumPy, OpenCV là điều bắt buộc. PyTorch được khuyến nghị hơn TensorFlow ở môi trường học thuật vì API trực quan và dễ debug hơn.

**Về nền tảng lý thuyết**: Đừng bỏ qua toán học. Hiểu tại sao một thuật toán hoạt động quan trọng hơn biết cách gọi một hàm thư viện.

**Về dữ liệu**: Hầu hết thời gian trong dự án thực tế được dành cho thu thập, làm sạch và gán nhãn dữ liệu. Kỹ năng này thường bị xem nhẹ trong giảng dạy đại học nhưng lại cực kỳ quan trọng.

**Về tài nguyên học tập**: Các khóa học CS231n của Stanford, bài giảng của Andrej Karpathy, và tài liệu chính thức của PyTorch là những nguồn tham khảo có giá trị nhất.

**Về đồ án**: Cố gắng áp dụng kiến thức vào bài toán có dữ liệu thực (ảnh y tế, vệ tinh, giao thông đô thị) thay vì chỉ làm trên các benchmark tiêu chuẩn như MNIST hay CIFAR-10.


## Kết luận

Thị giác máy tính là một lĩnh vực vừa có chiều sâu lý thuyết đáng kể vừa có giá trị ứng dụng rất cao. Từ xử lý ảnh cổ điển đến CNN, từ Transfer Learning đến Vision Transformer, mỗi giai đoạn phát triển đều để lại những công cụ và tư duy quan trọng mà người học cần nắm vững.

Chương trình đại học cung cấp nền tảng cần thiết, nhưng sự phát triển thực sự đến từ việc tự xây dựng và thử nghiệm. Mỗi dòng code tự viết, mỗi mô hình tự debug và mỗi kết quả tự phân tích đều là bước tiến quan trọng trên con đường trở thành người thực hành thị giác máy tính thực sự.
