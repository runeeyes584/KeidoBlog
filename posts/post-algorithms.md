---
title: Các giải thuật phải biết!
date: 2025-05-04
author: Kaleidoscope
category: Programming
readingTime: 30 phút đọc
excerpt: Nhập môn lập trình - Giải thuật phải biết
---
# Các Giải Thuật Bắt Buộc Phải Biết Với Lập Trình Viên

Giải thuật là nền tảng của mọi hệ thống phần mềm. Dù bạn đang xây dựng một ứng dụng web, hệ thống nhúng hay phần mềm phân tích dữ liệu, khả năng lựa chọn và triển khai đúng giải thuật sẽ quyết định trực tiếp đến hiệu năng, độ bền và khả năng mở rộng của sản phẩm. Bài viết này tổng hợp các nhóm giải thuật cốt lõi mà mọi lập trình viên cần nắm vững, kèm theo bài tập thực hành và lời giải chi tiết bằng Python.


## 1. Độ Phức Tạp Thuật Toán (Big O Notation)

Trước khi đi vào các giải thuật cụ thể, cần hiểu cách đánh giá hiệu suất. Big O Notation là công cụ để mô tả tốc độ tăng trưởng của thời gian chạy hoặc bộ nhớ sử dụng khi kích thước đầu vào `n` tăng lên.

### 1.1 Các Mức Độ Phức Tạp Thường Gặp

| Ký hiệu | Tên | Ví dụ |
|---|---|---|
| O(1) | Hằng số | Truy cập phần tử mảng theo chỉ số |
| O(log n) | Logarit | Binary Search |
| O(n) | Tuyến tính | Duyệt toàn bộ mảng |
| O(n log n) | Tuyến tính logarit | Merge Sort, Quick Sort |
| O(n²) | Bình phương | Bubble Sort, vòng lặp lồng nhau |
| O(2ⁿ) | Hàm mũ | Đệ quy Fibonacci ngây thơ |

### 1.2 Bài Tập 1: Xác Định Độ Phức Tạp

**Đề bài:** Xác định độ phức tạp thời gian của các đoạn code sau và giải thích.

```python
# Đoạn A
def tinh_tong(n):
    tong = 0
    for i in range(n):
        tong += i
    return tong

# Đoạn B
def tim_cap_trung_binh(arr):
    ket_qua = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            ket_qua.append((arr[i] + arr[j]) / 2)
    return ket_qua

# Đoạn C
def truy_cap_phan_tu(arr, idx):
    return arr[idx]
```

**Lời giải:**

```python
"""
Đoạn A - O(n): Có một vòng lặp duy nhất chạy n lần.
  - Khi n tăng gấp đôi, số phép tính tăng gấp đôi.

Đoạn B - O(n²): Hai vòng lặp lồng nhau.
  - Vòng ngoài chạy n lần, vòng trong chạy trung bình n/2 lần.
  - Tổng số phép tính ≈ n*(n-1)/2 → O(n²).

Đoạn C - O(1): Truy cập trực tiếp bằng chỉ số.
  - Thời gian thực thi không phụ thuộc vào kích thước mảng.
"""

# Kiểm chứng bằng thực nghiệm
import time

def do_thoi_gian(func, *args):
    start = time.perf_counter()
    func(*args)
    return time.perf_counter() - start

n_values = [1000, 2000, 4000]
print("Kiểm tra Đoạn A (kỳ vọng: tuyến tính):")
for n in n_values:
    t = do_thoi_gian(tinh_tong, n)
    print(f"  n={n}: {t:.6f}s")

print("\nKiểm tra Đoạn B (kỳ vọng: bậc hai):")
arr_sizes = [100, 200, 400]
for n in arr_sizes:
    arr = list(range(n))
    t = do_thoi_gian(tim_cap_trung_binh, arr)
    print(f"  n={n}: {t:.6f}s")
```


## 2. Giải Thuật Tìm Kiếm (Searching Algorithms)

### 2.1 Linear Search (Tìm Kiếm Tuyến Tính)

Duyệt từng phần tử từ đầu đến cuối cho đến khi tìm thấy giá trị cần tìm. Đơn giản nhưng kém hiệu quả với dữ liệu lớn.

- Độ phức tạp thời gian: O(n)
- Độ phức tạp không gian: O(1)
- Không yêu cầu dữ liệu đã được sắp xếp.

```python
def linear_search(arr, target):
    """
    Tìm kiếm tuyến tính.
    Trả về chỉ số đầu tiên tìm thấy, -1 nếu không có.
    """
    for i, phan_tu in enumerate(arr):
        if phan_tu == target:
            return i
    return -1
```

### 2.2 Binary Search (Tìm Kiếm Nhị Phân)

Yêu cầu mảng đã được sắp xếp. Mỗi lần so sánh, loại bỏ đi một nửa không gian tìm kiếm.

- Độ phức tạp thời gian: O(log n)
- Độ phức tạp không gian: O(1) (iterative), O(log n) (recursive)
- Yêu cầu dữ liệu đã được sắp xếp.

```python
def binary_search(arr, target):
    """
    Tìm kiếm nhị phân (phiên bản lặp).
    Mảng arr phải được sắp xếp tăng dần.
    """
    trai, phai = 0, len(arr) - 1

    while trai <= phai:
        giua = (trai + phai) // 2

        if arr[giua] == target:
            return giua
        elif arr[giua] < target:
            trai = giua + 1   # Tìm kiếm ở nửa phải
        else:
            phai = giua - 1   # Tìm kiếm ở nửa trái

    return -1


def binary_search_recursive(arr, target, trai=0, phai=None):
    """
    Tìm kiếm nhị phân (phiên bản đệ quy).
    """
    if phai is None:
        phai = len(arr) - 1

    if trai > phai:
        return -1

    giua = (trai + phai) // 2

    if arr[giua] == target:
        return giua
    elif arr[giua] < target:
        return binary_search_recursive(arr, target, giua + 1, phai)
    else:
        return binary_search_recursive(arr, target, trai, giua - 1)
```

### 2.3 Bài Tập 2: Tìm Vị Trí Chèn

**Đề bài:** Cho một mảng đã sắp xếp và một giá trị `target`. Nếu `target` không có trong mảng, trả về vị trí mà nó nên được chèn vào để mảng vẫn giữ nguyên thứ tự tăng dần.

```
Ví dụ:
  arr = [1, 3, 5, 6], target = 5  -> kết quả: 2
  arr = [1, 3, 5, 6], target = 2  -> kết quả: 1
  arr = [1, 3, 5, 6], target = 7  -> kết quả: 4
```

**Lời giải:**

```python
def vi_tri_chen(arr, target):
    """
    Biến thể của Binary Search để tìm vị trí chèn.
    Luôn trả về vị trí hợp lệ dù target không tồn tại trong mảng.
    """
    trai, phai = 0, len(arr)

    while trai < phai:
        giua = (trai + phai) // 2
        if arr[giua] < target:
            trai = giua + 1
        else:
            phai = giua

    return trai


# Kiểm thử
test_cases = [
    ([1, 3, 5, 6], 5, 2),
    ([1, 3, 5, 6], 2, 1),
    ([1, 3, 5, 6], 7, 4),
    ([1, 3, 5, 6], 0, 0),
]

for arr, target, expected in test_cases:
    result = vi_tri_chen(arr, target)
    trang_thai = "PASS" if result == expected else "FAIL"
    print(f"[{trang_thai}] arr={arr}, target={target} -> {result} (kỳ vọng: {expected})")
```


## 3. Giải Thuật Sắp Xếp (Sorting Algorithms)

### 3.1 Bubble Sort

Thuật toán đơn giản nhất. Mỗi lần duyệt, đẩy phần tử lớn nhất "nổi bọt" về cuối mảng bằng cách hoán đổi liền kề.

- Độ phức tạp thời gian: O(n²) trung bình và xấu nhất, O(n) tốt nhất
- Độ phức tạp không gian: O(1)
- Ổn định (stable): Có

```python
def bubble_sort(arr):
    """
    Bubble Sort với tối ưu dừng sớm khi mảng đã sắp xếp.
    """
    n = len(arr)
    arr = arr.copy()  # Không thay đổi mảng gốc

    for i in range(n):
        da_sap_xep = True  # Cờ tối ưu

        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                da_sap_xep = False

        if da_sap_xep:
            break  # Mảng đã sắp xếp, thoát sớm

    return arr
```

### 3.2 Selection Sort

Mỗi lần duyệt, tìm phần tử nhỏ nhất trong phần chưa sắp xếp và đặt vào vị trí đúng.

- Độ phức tạp thời gian: O(n²) trong mọi trường hợp
- Độ phức tạp không gian: O(1)
- Ổn định (stable): Không (trong cài đặt thông thường)

```python
def selection_sort(arr):
    """
    Selection Sort: tìm phần tử nhỏ nhất, hoán đổi về đầu mảng chưa sắp xếp.
    """
    n = len(arr)
    arr = arr.copy()

    for i in range(n):
        idx_nho_nhat = i

        for j in range(i + 1, n):
            if arr[j] < arr[idx_nho_nhat]:
                idx_nho_nhat = j

        arr[i], arr[idx_nho_nhat] = arr[idx_nho_nhat], arr[i]

    return arr
```

### 3.3 Insertion Sort

Xây dựng mảng đã sắp xếp từng phần tử một. Hiệu quả với dữ liệu gần như đã sắp xếp hoặc dữ liệu nhỏ.

- Độ phức tạp thời gian: O(n²) xấu nhất, O(n) tốt nhất
- Độ phức tạp không gian: O(1)
- Ổn định (stable): Có

```python
def insertion_sort(arr):
    """
    Insertion Sort: chèn từng phần tử vào đúng vị trí trong phần đã sắp xếp.
    """
    arr = arr.copy()

    for i in range(1, len(arr)):
        khoa = arr[i]     # Phần tử cần chèn
        j = i - 1

        # Dịch chuyển các phần tử lớn hơn 'khoa' sang phải một vị trí
        while j >= 0 and arr[j] > khoa:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = khoa

    return arr
```

### 3.4 Merge Sort

Thuật toán chia để trị (Divide and Conquer). Chia mảng làm đôi, sắp xếp từng nửa đệ quy, rồi gộp lại.

- Độ phức tạp thời gian: O(n log n) trong mọi trường hợp
- Độ phức tạp không gian: O(n)
- Ổn định (stable): Có

```python
def merge_sort(arr):
    """
    Merge Sort: chia đôi đệ quy, sau đó gộp hai nửa đã sắp xếp.
    """
    if len(arr) <= 1:
        return arr

    giua = len(arr) // 2
    trai = merge_sort(arr[:giua])
    phai = merge_sort(arr[giua:])

    return _gop_hai_nua(trai, phai)


def _gop_hai_nua(trai, phai):
    """Gộp hai mảng đã sắp xếp thành một mảng sắp xếp."""
    ket_qua = []
    i = j = 0

    while i < len(trai) and j < len(phai):
        if trai[i] <= phai[j]:
            ket_qua.append(trai[i])
            i += 1
        else:
            ket_qua.append(phai[j])
            j += 1

    # Thêm phần còn dư
    ket_qua.extend(trai[i:])
    ket_qua.extend(phai[j:])
    return ket_qua
```

### 3.5 Quick Sort

Thuật toán phân hoạch (partitioning). Chọn một phần tử "pivot", đặt nó vào đúng vị trí, tất cả phần tử bên trái nhỏ hơn, bên phải lớn hơn.

- Độ phức tạp thời gian: O(n log n) trung bình, O(n²) xấu nhất
- Độ phức tạp không gian: O(log n) trung bình
- Ổn định (stable): Không

```python
def quick_sort(arr):
    """
    Quick Sort với chiến lược chọn pivot ngẫu nhiên để tránh trường hợp xấu nhất.
    """
    import random

    def _quick_sort_helper(arr, thap, cao):
        if thap < cao:
            idx_phan_hoach = _phan_hoach(arr, thap, cao)
            _quick_sort_helper(arr, thap, idx_phan_hoach - 1)
            _quick_sort_helper(arr, idx_phan_hoach + 1, cao)

    def _phan_hoach(arr, thap, cao):
        # Chọn pivot ngẫu nhiên và hoán đổi về cuối
        idx_pivot = random.randint(thap, cao)
        arr[idx_pivot], arr[cao] = arr[cao], arr[idx_pivot]
        pivot = arr[cao]

        i = thap - 1
        for j in range(thap, cao):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]

        arr[i + 1], arr[cao] = arr[cao], arr[i + 1]
        return i + 1

    arr = arr.copy()
    _quick_sort_helper(arr, 0, len(arr) - 1)
    return arr
```

### 3.6 Bài Tập 3: Sắp Xếp Mảng Màu (Dutch National Flag)

**Đề bài:** Cho một mảng chứa các giá trị 0, 1, 2 đại diện cho ba màu (đỏ, trắng, xanh). Sắp xếp mảng sao cho tất cả 0 đứng trước, tiếp đến là 1, cuối cùng là 2. Chỉ được duyệt mảng đúng một lần và không dùng bộ nhớ phụ.

```
Ví dụ:
  Input:  [2, 0, 2, 1, 1, 0]
  Output: [0, 0, 1, 1, 2, 2]
```

**Lời giải:**

```python
def sap_xep_mau(arr):
    """
    Dutch National Flag Algorithm - Edsger Dijkstra.
    Ba con trỏ: thap (chứa 0), giua (phần tử hiện tại), cao (chứa 2).
    Chỉ O(n) và O(1) không gian.
    """
    arr = arr.copy()
    thap = 0
    giua = 0
    cao = len(arr) - 1

    while giua <= cao:
        if arr[giua] == 0:
            arr[thap], arr[giua] = arr[giua], arr[thap]
            thap += 1
            giua += 1
        elif arr[giua] == 1:
            giua += 1
        else:  # arr[giua] == 2
            arr[giua], arr[cao] = arr[cao], arr[giua]
            cao -= 1
            # Không tăng giua vì phần tử hoán đổi về chưa được kiểm tra

    return arr


# Kiểm thử
test_cases = [
    [2, 0, 2, 1, 1, 0],
    [0],
    [2, 1, 0],
    [1, 0, 2, 1, 0, 2, 1],
]

for tc in test_cases:
    result = sap_xep_mau(tc)
    print(f"Input:  {tc}")
    print(f"Output: {result}\n")
```


## 4. Cấu Trúc Dữ Liệu Cơ Bản

### 4.1 Stack (Ngăn Xếp)

Cấu trúc dữ liệu LIFO (Last In, First Out). Thao tác push/pop đều O(1).

```python
class Stack:
    """Triển khai Stack bằng danh sách Python."""

    def __init__(self):
        self._du_lieu = []

    def push(self, phan_tu):
        """Thêm phần tử vào đỉnh stack. O(1)"""
        self._du_lieu.append(phan_tu)

    def pop(self):
        """Lấy và xóa phần tử ở đỉnh stack. O(1)"""
        if self.rong():
            raise IndexError("Stack rỗng")
        return self._du_lieu.pop()

    def peek(self):
        """Xem phần tử ở đỉnh mà không xóa. O(1)"""
        if self.rong():
            raise IndexError("Stack rỗng")
        return self._du_lieu[-1]

    def rong(self):
        return len(self._du_lieu) == 0

    def __len__(self):
        return len(self._du_lieu)

    def __repr__(self):
        return f"Stack({self._du_lieu})"
```

### 4.2 Queue (Hàng Đợi)

Cấu trúc dữ liệu FIFO (First In, First Out). Dùng `collections.deque` để đảm bảo enqueue/dequeue đều O(1).

```python
from collections import deque

class Queue:
    """Triển khai Queue bằng collections.deque."""

    def __init__(self):
        self._du_lieu = deque()

    def enqueue(self, phan_tu):
        """Thêm phần tử vào cuối hàng. O(1)"""
        self._du_lieu.append(phan_tu)

    def dequeue(self):
        """Lấy và xóa phần tử ở đầu hàng. O(1)"""
        if self.rong():
            raise IndexError("Queue rỗng")
        return self._du_lieu.popleft()

    def peek(self):
        """Xem phần tử đầu hàng mà không xóa. O(1)"""
        if self.rong():
            raise IndexError("Queue rỗng")
        return self._du_lieu[0]

    def rong(self):
        return len(self._du_lieu) == 0

    def __len__(self):
        return len(self._du_lieu)
```

### 4.3 Bài Tập 4: Kiểm Tra Ngoặc Hợp Lệ

**Đề bài:** Cho một chuỗi chứa các ký tự `(`, `)`, `{`, `}`, `[`, `]`. Kiểm tra xem chuỗi có hợp lệ không (mọi ngoặc mở đều có ngoặc đóng tương ứng và theo đúng thứ tự).

```
Ví dụ:
  "()"       -> True
  "()[]{}"   -> True
  "(]"       -> False
  "([)]"     -> False
  "{[]}"     -> True
```

**Lời giải:**

```python
def kiem_tra_ngoac(s):
    """
    Dùng Stack để kiểm tra tính hợp lệ của chuỗi ngoặc.
    - Gặp ngoặc mở: đẩy vào stack.
    - Gặp ngoặc đóng: kiểm tra stack có chứa ngoặc mở tương ứng không.
    """
    stack = Stack()
    cap_ngoac = {')': '(', '}': '{', ']': '['}

    for ky_tu in s:
        if ky_tu in '({[':
            stack.push(ky_tu)
        elif ky_tu in ')}]':
            if stack.rong() or stack.pop() != cap_ngoac[ky_tu]:
                return False

    return stack.rong()  # Stack phải rỗng khi duyệt hết chuỗi


# Kiểm thử
test_cases = [
    ("()", True),
    ("()[]{}", True),
    ("(]", False),
    ("([)]", False),
    ("{[]}", True),
    ("", True),
    ("((((", False),
]

for chuoi, expected in test_cases:
    result = kiem_tra_ngoac(chuoi)
    trang_thai = "PASS" if result == expected else "FAIL"
    print(f"[{trang_thai}] '{chuoi}' -> {result}")
```


## 5. Đệ Quy và Ghi Nhớ (Recursion & Memoization)

### 5.1 Nguyên Tắc Đệ Quy

Mọi hàm đệ quy cần có:
1. **Base case**: Điều kiện dừng, tránh đệ quy vô hạn.
2. **Recursive case**: Gọi lại chính mình với đầu vào nhỏ hơn, tiến dần về base case.

### 5.2 Fibonacci và Vấn Đề Tính Toán Lại

```python
# Phiên bản ngây thơ - O(2^n)
def fibonacci_naive(n):
    if n <= 1:
        return n
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)


# Phiên bản memoization (Top-Down) - O(n)
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]


# Sử dụng functools.lru_cache (cách Python hiện đại)
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_cache(n):
    if n <= 1:
        return n
    return fibonacci_cache(n - 1) + fibonacci_cache(n - 2)


# Phiên bản vòng lặp (Bottom-Up, tốt nhất) - O(n) thời gian, O(1) không gian
def fibonacci_dp(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

### 5.3 Bài Tập 5: Leo Thang

**Đề bài:** Bạn đang leo một cái thang có `n` bậc. Mỗi lần bạn có thể leo 1 bậc hoặc 2 bậc. Đếm số cách khác nhau để leo đến bậc thứ `n`.

```
Ví dụ:
  n=2 -> 2 cách: [1+1], [2]
  n=3 -> 3 cách: [1+1+1], [1+2], [2+1]
  n=4 -> 5 cách: [1+1+1+1], [1+1+2], [1+2+1], [2+1+1], [2+2]
```

**Lời giải:**

```python
def leo_thang(n):
    """
    Nhận xét: để lên bậc n, ta có thể từ bậc (n-1) leo 1 bậc,
    hoặc từ bậc (n-2) leo 2 bậc.
    → f(n) = f(n-1) + f(n-2): chính là dãy Fibonacci!
    """
    if n <= 2:
        return n

    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        hien_tai = prev1 + prev2
        prev2, prev1 = prev1, hien_tai

    return prev1


def leo_thang_voi_buoc(n, so_buoc_toi_da=2):
    """
    Tổng quát: leo tối đa k bậc mỗi lần.
    f(n) = f(n-1) + f(n-2) + ... + f(n-k)
    """
    if n == 0:
        return 1

    dp = [0] * (n + 1)
    dp[0] = 1

    for i in range(1, n + 1):
        for buoc in range(1, so_buoc_toi_da + 1):
            if i - buoc >= 0:
                dp[i] += dp[i - buoc]

    return dp[n]


# Kiểm thử
for n in range(1, 8):
    print(f"n={n}: {leo_thang(n)} cách")

print("\nTổng quát với 3 bậc:")
for n in range(1, 8):
    print(f"n={n}: {leo_thang_voi_buoc(n, 3)} cách")
```


## 6. Quy Hoạch Động (Dynamic Programming)

### 6.1 Tư Duy Quy Hoạch Động

Quy hoạch động (DP) phù hợp khi bài toán có hai tính chất:
1. **Cấu trúc con tối ưu**: Lời giải tối ưu của bài toán lớn được xây dựng từ lời giải tối ưu của bài toán con.
2. **Bài toán con trùng lặp**: Cùng một bài toán con được tính đi tính lại nhiều lần.

### 6.2 Bài Toán Knapsack (Balo)

**Đề bài:** Có một chiếc balo sức chứa `W` kg. Có `n` món đồ, mỗi món có trọng lượng `w[i]` và giá trị `v[i]`. Chọn các món để tổng giá trị lớn nhất mà không vượt quá sức chứa.

```python
def knapsack_01(W, trong_luong, gia_tri, n):
    """
    0/1 Knapsack: mỗi món chỉ chọn hoặc không chọn.
    dp[i][w] = giá trị tối đa với i món đầu tiên và sức chứa w.
    """
    # Khởi tạo bảng DP
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(W + 1):
            # Không chọn món i
            dp[i][w] = dp[i - 1][w]

            # Chọn món i (nếu đủ sức chứa)
            if trong_luong[i - 1] <= w:
                gia_tri_neu_chon = dp[i - 1][w - trong_luong[i - 1]] + gia_tri[i - 1]
                dp[i][w] = max(dp[i][w], gia_tri_neu_chon)

    # Truy vết để tìm danh sách các món được chọn
    chon = []
    w = W
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            chon.append(i - 1)  # Chọn món thứ i (index 0-based)
            w -= trong_luong[i - 1]

    return dp[n][W], list(reversed(chon))


# Ví dụ
W = 10
trong_luong = [2, 3, 4, 5]
gia_tri     = [3, 4, 5, 6]
n = len(trong_luong)

max_gia_tri, cac_mon = knapsack_01(W, trong_luong, gia_tri, n)
print(f"Giá trị tối đa: {max_gia_tri}")
print(f"Các món được chọn (index): {cac_mon}")
for idx in cac_mon:
    print(f"  Món {idx}: trọng lượng={trong_luong[idx]}, giá trị={gia_tri[idx]}")
```

### 6.3 Bài Tập 6: Dãy Con Tăng Dài Nhất (LIS)

**Đề bài:** Tìm độ dài của dãy con tăng dần dài nhất trong một mảng số nguyên.

```
Ví dụ:
  arr = [10, 9, 2, 5, 3, 7, 101, 18]
  LIS = [2, 3, 7, 18] hoặc [2, 5, 7, 101] -> độ dài 4
```

**Lời giải:**

```python
def lis_dp(arr):
    """
    LIS bằng quy hoạch động - O(n²).
    dp[i] = độ dài LIS kết thúc tại arr[i].
    """
    if not arr:
        return 0

    n = len(arr)
    dp = [1] * n  # Mỗi phần tử tự nó là dãy con dài 1

    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)


def lis_binary_search(arr):
    """
    LIS tối ưu bằng Binary Search - O(n log n).
    Dùng mảng 'tails' để theo dõi phần tử nhỏ nhất có thể kết thúc dãy dài i.
    """
    import bisect

    tails = []
    for x in arr:
        # Tìm vị trí để chèn x vào tails
        pos = bisect.bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)   # Mở rộng dãy dài nhất
        else:
            tails[pos] = x    # Thay thế để dãy tiềm năng nhỏ hơn
    return len(tails)


def lis_voi_danh_sach(arr):
    """LIS và trả về danh sách phần tử của một dãy tối ưu."""
    if not arr:
        return []

    n = len(arr)
    dp = [1] * n
    prev = [-1] * n

    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                prev[i] = j

    # Truy vết
    idx = dp.index(max(dp))
    day_con = []
    while idx != -1:
        day_con.append(arr[idx])
        idx = prev[idx]

    return list(reversed(day_con))


# Kiểm thử
arr = [10, 9, 2, 5, 3, 7, 101, 18]
print(f"Mảng: {arr}")
print(f"Độ dài LIS (DP O(n²)):      {lis_dp(arr)}")
print(f"Độ dài LIS (Binary O(nlogn)): {lis_binary_search(arr)}")
print(f"Một dãy LIS tối ưu:           {lis_voi_danh_sach(arr)}")
```


## 7. Đồ Thị (Graph Algorithms)

### 7.1 Biểu Diễn Đồ Thị

```python
# Biểu diễn đồ thị bằng danh sách kề (Adjacency List)
# Phù hợp với đồ thị thưa (sparse graph)

do_thi = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E'],
}

# Biểu diễn đồ thị có trọng số
do_thi_co_trong_so = {
    'A': [('B', 4), ('C', 2)],
    'B': [('D', 5), ('E', 1)],
    'C': [('B', 1), ('E', 8)],
    'D': [('E', 2), ('F', 6)],
    'E': [('F', 3)],
    'F': [],
}
```

### 7.2 BFS (Breadth-First Search)

Duyệt đồ thị theo chiều rộng. Sử dụng Queue. Tìm đường đi ngắn nhất trong đồ thị không trọng số.

- Độ phức tạp: O(V + E) với V là số đỉnh, E là số cạnh.

```python
from collections import deque

def bfs(do_thi, dinh_bat_dau):
    """
    Duyệt BFS từ đỉnh xuất phát.
    Trả về thứ tự duyệt và khoảng cách đến các đỉnh.
    """
    thu_tu_duyet = []
    khoang_cach = {dinh_bat_dau: 0}
    hang_doi = deque([dinh_bat_dau])
    da_tham = {dinh_bat_dau}

    while hang_doi:
        dinh = hang_doi.popleft()
        thu_tu_duyet.append(dinh)

        for hang_xom in do_thi.get(dinh, []):
            if hang_xom not in da_tham:
                da_tham.add(hang_xom)
                khoang_cach[hang_xom] = khoang_cach[dinh] + 1
                hang_doi.append(hang_xom)

    return thu_tu_duyet, khoang_cach


def tim_duong_di_bfs(do_thi, nguon, dich):
    """
    Tìm đường đi ngắn nhất bằng BFS (đồ thị không trọng số).
    """
    if nguon == dich:
        return [nguon]

    da_tham = {nguon}
    hang_doi = deque([(nguon, [nguon])])

    while hang_doi:
        dinh, duong_di = hang_doi.popleft()

        for hang_xom in do_thi.get(dinh, []):
            if hang_xom not in da_tham:
                duong_di_moi = duong_di + [hang_xom]
                if hang_xom == dich:
                    return duong_di_moi
                da_tham.add(hang_xom)
                hang_doi.append((hang_xom, duong_di_moi))

    return None  # Không có đường đi


# Kiểm thử
thu_tu, khoang_cach = bfs(do_thi, 'A')
print(f"Thứ tự BFS từ A: {thu_tu}")
print(f"Khoảng cách từ A: {khoang_cach}")

duong = tim_duong_di_bfs(do_thi, 'A', 'F')
print(f"Đường đi ngắn nhất A -> F: {duong}")
```

### 7.3 DFS (Depth-First Search)

Duyệt đồ thị theo chiều sâu. Sử dụng Stack (hoặc đệ quy).

- Độ phức tạp: O(V + E)
- Ứng dụng: phát hiện chu trình, sắp xếp tô pô, tìm thành phần liên thông.

```python
def dfs_recursive(do_thi, dinh, da_tham=None, thu_tu=None):
    """DFS đệ quy."""
    if da_tham is None:
        da_tham = set()
        thu_tu = []

    da_tham.add(dinh)
    thu_tu.append(dinh)

    for hang_xom in do_thi.get(dinh, []):
        if hang_xom not in da_tham:
            dfs_recursive(do_thi, hang_xom, da_tham, thu_tu)

    return thu_tu


def dfs_iterative(do_thi, dinh_bat_dau):
    """DFS lặp dùng Stack."""
    da_tham = set()
    ngan_xep = [dinh_bat_dau]
    thu_tu = []

    while ngan_xep:
        dinh = ngan_xep.pop()
        if dinh not in da_tham:
            da_tham.add(dinh)
            thu_tu.append(dinh)
            # Thêm hàng xóm theo thứ tự ngược để giữ đúng thứ tự duyệt
            for hang_xom in reversed(do_thi.get(dinh, [])):
                if hang_xom not in da_tham:
                    ngan_xep.append(hang_xom)

    return thu_tu


print(f"Thứ tự DFS từ A (đệ quy): {dfs_recursive(do_thi, 'A')}")
print(f"Thứ tự DFS từ A (lặp):    {dfs_iterative(do_thi, 'A')}")
```

### 7.4 Bài Tập 7: Số Thành Phần Liên Thông

**Đề bài:** Cho đồ thị vô hướng `n` đỉnh (đánh số từ 0 đến n-1) và danh sách các cạnh. Đếm số thành phần liên thông của đồ thị.

```
Ví dụ:
  n=5, edges=[[0,1],[1,2],[3,4]]
  -> 2 thành phần: {0,1,2} và {3,4}
```

**Lời giải:**

```python
def dem_thanh_phan_lien_thong(n, canh):
    """
    Dùng Union-Find (Disjoint Set Union) để đếm thành phần liên thông.
    Hiệu quả hơn BFS/DFS khi thêm cạnh liên tục.
    """
    cha = list(range(n))   # Mỗi đỉnh tự làm gốc của nó
    hang = [0] * n

    def tim_goc(x):
        """Path compression: tất cả đỉnh đều trỏ thẳng về gốc."""
        if cha[x] != x:
            cha[x] = tim_goc(cha[x])
        return cha[x]

    def hop_nhat(x, y):
        """Union by rank: nối cây nhỏ vào cây lớn."""
        goc_x, goc_y = tim_goc(x), tim_goc(y)
        if goc_x == goc_y:
            return
        if hang[goc_x] < hang[goc_y]:
            goc_x, goc_y = goc_y, goc_x
        cha[goc_y] = goc_x
        if hang[goc_x] == hang[goc_y]:
            hang[goc_x] += 1

    for u, v in canh:
        hop_nhat(u, v)

    # Đếm số gốc duy nhất = số thành phần
    so_thanh_phan = len({tim_goc(i) for i in range(n)})
    return so_thanh_phan


def dem_thanh_phan_bfs(n, canh):
    """Giải pháp thay thế bằng BFS."""
    do_thi = {i: [] for i in range(n)}
    for u, v in canh:
        do_thi[u].append(v)
        do_thi[v].append(u)

    da_tham = set()
    so_thanh_phan = 0

    for dinh in range(n):
        if dinh not in da_tham:
            so_thanh_phan += 1
            # BFS từ đỉnh này
            hang_doi = deque([dinh])
            da_tham.add(dinh)
            while hang_doi:
                d = hang_doi.popleft()
                for hang_xom in do_thi[d]:
                    if hang_xom not in da_tham:
                        da_tham.add(hang_xom)
                        hang_doi.append(hang_xom)

    return so_thanh_phan


# Kiểm thử
n = 5
canh = [[0, 1], [1, 2], [3, 4]]
print(f"n={n}, cạnh={canh}")
print(f"Số thành phần (Union-Find): {dem_thanh_phan_lien_thong(n, canh)}")
print(f"Số thành phần (BFS):        {dem_thanh_phan_bfs(n, canh)}")

n2 = 4
canh2 = []
print(f"\nn={n2}, cạnh={canh2} (không có cạnh)")
print(f"Số thành phần: {dem_thanh_phan_lien_thong(n2, canh2)}")
```


## 8. Thuật Toán Tham Lam (Greedy Algorithms)

### 8.1 Nguyên Tắc Tham Lam

Tại mỗi bước, chọn lựa chọn tốt nhất ngay lúc đó (locally optimal) với hy vọng đạt được giải pháp tổng thể tốt nhất. Không phải lúc nào cũng đúng, nhưng với một số bài toán có cấu trúc đặc biệt, tham lam cho kết quả tối ưu toàn cục.

### 8.2 Bài Toán Lên Lịch Hoạt Động (Activity Selection)

```python
def len_lich_hoat_dong(bat_dau, ket_thuc):
    """
    Chọn số hoạt động tối đa không chồng chéo nhau.
    Chiến lược tham lam: luôn chọn hoạt động kết thúc sớm nhất.
    """
    n = len(bat_dau)
    # Sắp xếp theo thời điểm kết thúc
    hoat_dong = sorted(range(n), key=lambda i: ket_thuc[i])

    duoc_chon = [hoat_dong[0]]
    thoi_gian_ket_thuc_cuoi = ket_thuc[hoat_dong[0]]

    for i in hoat_dong[1:]:
        if bat_dau[i] >= thoi_gian_ket_thuc_cuoi:
            duoc_chon.append(i)
            thoi_gian_ket_thuc_cuoi = ket_thuc[i]

    return duoc_chon


# Ví dụ
bat_dau   = [1, 3, 0, 5, 8, 5]
ket_thuc  = [2, 4, 6, 7, 9, 9]

ket_qua = len_lich_hoat_dong(bat_dau, ket_thuc)
print(f"Các hoạt động được chọn (index): {ket_qua}")
for i in ket_qua:
    print(f"  Hoạt động {i}: [{bat_dau[i]}, {ket_thuc[i]}]")
```

### 8.3 Bài Tập 8: Bài Toán Đổi Tiền

**Đề bài:** Cho các mệnh giá tiền xu và một số tiền `n`. Trả lại số xu ít nhất có thể (giả sử mệnh giá tiêu chuẩn như [1, 5, 10, 25]).

**Lưu ý:** Tham lam chỉ đúng với hệ mệnh giá chuẩn. Với hệ mệnh giá tùy ý, cần dùng quy hoạch động.

```python
def doi_tien_tham_lam(menh_gia, so_tien):
    """
    Đổi tiền bằng tham lam (chỉ đúng với mệnh giá chuẩn).
    """
    menh_gia = sorted(menh_gia, reverse=True)
    ket_qua = {}

    for mg in menh_gia:
        so_xu = so_tien // mg
        if so_xu > 0:
            ket_qua[mg] = so_xu
            so_tien -= so_xu * mg

    if so_tien != 0:
        return None  # Không thể đổi chính xác
    return ket_qua


def doi_tien_dp(menh_gia, so_tien):
    """
    Đổi tiền bằng quy hoạch động - đúng với mọi hệ mệnh giá.
    dp[i] = số xu ít nhất để đổi số tiền i.
    """
    dp = [float('inf')] * (so_tien + 1)
    dp[0] = 0
    lua_chon = [0] * (so_tien + 1)

    for i in range(1, so_tien + 1):
        for mg in menh_gia:
            if mg <= i and dp[i - mg] + 1 < dp[i]:
                dp[i] = dp[i - mg] + 1
                lua_chon[i] = mg

    if dp[so_tien] == float('inf'):
        return None, []

    # Truy vết
    xu_da_dung = []
    hien_tai = so_tien
    while hien_tai > 0:
        xu_da_dung.append(lua_chon[hien_tai])
        hien_tai -= lua_chon[hien_tai]

    return dp[so_tien], xu_da_dung


# So sánh hai phương pháp
menh_gia_chuan = [1, 5, 10, 25]
so_tien = 41

print(f"Đổi {so_tien} xu với mệnh giá {menh_gia_chuan}:")
print(f"Tham lam: {doi_tien_tham_lam(menh_gia_chuan, so_tien)}")
so_xu, xu_dung = doi_tien_dp(menh_gia_chuan, so_tien)
print(f"DP: {so_xu} xu - chi tiết: {xu_dung}")

# Trường hợp tham lam cho kết quả sai
menh_gia_tuy_y = [1, 3, 4]
so_tien2 = 6
print(f"\nĐổi {so_tien2} xu với mệnh giá {menh_gia_tuy_y}:")
print(f"Tham lam: {doi_tien_tham_lam(menh_gia_tuy_y, so_tien2)} (sai: 4+1+1=3 xu)")
so_xu2, xu_dung2 = doi_tien_dp(menh_gia_tuy_y, so_tien2)
print(f"DP: {so_xu2} xu - chi tiết: {xu_dung2} (đúng: 3+3=2 xu)")
```


## 9. Chia Để Trị (Divide and Conquer)

### 9.1 Mô Hình Tổng Quát

Chia để trị hoạt động theo ba bước:
1. **Divide**: Chia bài toán lớn thành các bài toán con nhỏ hơn.
2. **Conquer**: Giải quyết đệ quy từng bài toán con.
3. **Combine**: Gộp kết quả của các bài toán con thành lời giải của bài toán lớn.

### 9.2 Tìm Phần Tử Lớn Thứ K (Quick Select)

```python
import random

def quick_select(arr, k):
    """
    Tìm phần tử lớn thứ k trong mảng (1-indexed).
    Ứng dụng ý tưởng phân hoạch của Quick Sort.
    Độ phức tạp: O(n) trung bình, O(n²) xấu nhất.
    """
    arr = arr.copy()

    def _phan_hoach(arr, thap, cao):
        idx_pivot = random.randint(thap, cao)
        arr[idx_pivot], arr[cao] = arr[cao], arr[idx_pivot]
        pivot = arr[cao]
        i = thap - 1
        for j in range(thap, cao):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[cao] = arr[cao], arr[i + 1]
        return i + 1

    def _quick_select(arr, thap, cao, k):
        if thap == cao:
            return arr[thap]

        idx = _phan_hoach(arr, thap, cao)
        # Số phần tử từ vị trí hiện tại đến cuối (tính theo thứ tự giảm dần)
        vi_tri_tu_cuoi = cao - idx + 1

        if vi_tri_tu_cuoi == k:
            return arr[idx]
        elif vi_tri_tu_cuoi > k:
            return _quick_select(arr, idx + 1, cao, k)
        else:
            return _quick_select(arr, thap, idx - 1, k - vi_tri_tu_cuoi)

    return _quick_select(arr, 0, len(arr) - 1, k)


# Kiểm thử
arr = [3, 2, 1, 5, 6, 4]
for k in range(1, len(arr) + 1):
    print(f"Phần tử lớn thứ {k}: {quick_select(arr, k)}")
```

### 9.3 Bài Tập 9: Đếm Số Nghịch Thế (Count Inversions)

**Đề bài:** Cho mảng A, đếm số cặp `(i, j)` sao cho `i < j` nhưng `A[i] > A[j]`. Số này đo mức độ "đảo ngược" của mảng so với thứ tự sắp xếp.

**Lời giải:** Biến thể của Merge Sort.

```python
def dem_nghich_the(arr):
    """
    Đếm số nghịch thế bằng cách biến đổi Merge Sort.
    Trong quá trình gộp, nếu arr_trai[i] > arr_phai[j],
    thì tất cả phần tử từ i đến cuối arr_trai đều > arr_phai[j].
    O(n log n).
    """
    def _gop_dem(arr):
        if len(arr) <= 1:
            return arr, 0

        giua = len(arr) // 2
        trai, dem_trai = _gop_dem(arr[:giua])
        phai, dem_phai = _gop_dem(arr[giua:])

        gop = []
        dem = dem_trai + dem_phai
        i = j = 0

        while i < len(trai) and j < len(phai):
            if trai[i] <= phai[j]:
                gop.append(trai[i])
                i += 1
            else:
                # trai[i] > phai[j]: tất cả trai[i..] đều > phai[j]
                dem += len(trai) - i
                gop.append(phai[j])
                j += 1

        gop.extend(trai[i:])
        gop.extend(phai[j:])
        return gop, dem

    _, so_nghich_the = _gop_dem(arr)
    return so_nghich_the


# Kiểm thử
test_cases = [
    ([2, 4, 1, 3, 5], 3),     # (2,1), (4,1), (4,3)
    ([1, 2, 3, 4, 5], 0),     # Đã sắp xếp
    ([5, 4, 3, 2, 1], 10),    # Sắp xếp ngược
]

for arr, expected in test_cases:
    result = dem_nghich_the(arr)
    trang_thai = "PASS" if result == expected else "FAIL"
    print(f"[{trang_thai}] {arr} -> {result} nghịch thế (kỳ vọng: {expected})")
```


## 10. Xử Lý Chuỗi (String Algorithms)

### 10.1 KMP (Knuth-Morris-Pratt)

Tìm kiếm mẫu trong chuỗi hiệu quả hơn tìm kiếm ngây thơ O(n*m).

- Độ phức tạp: O(n + m) với n là độ dài văn bản, m là độ dài mẫu.

```python
def xay_dung_bang_lps(pattern):
    """
    Xây dựng bảng LPS (Longest Proper Prefix which is also Suffix).
    lps[i] = độ dài tiền tố-hậu tố dài nhất của pattern[0..i].
    """
    m = len(pattern)
    lps = [0] * m
    do_dai = 0   # Độ dài tiền tố-hậu tố đang xét
    i = 1

    while i < m:
        if pattern[i] == pattern[do_dai]:
            do_dai += 1
            lps[i] = do_dai
            i += 1
        else:
            if do_dai != 0:
                do_dai = lps[do_dai - 1]
            else:
                lps[i] = 0
                i += 1

    return lps


def kmp_search(text, pattern):
    """
    KMP: tìm tất cả vị trí xuất hiện của pattern trong text.
    """
    n, m = len(text), len(pattern)
    if m == 0:
        return []

    lps = xay_dung_bang_lps(pattern)
    vi_tri = []
    i = j = 0

    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1

        if j == m:
            vi_tri.append(i - j)
            j = lps[j - 1]
        elif i < n and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1

    return vi_tri


# Kiểm thử
text = "ABABDABACDABABCABAB"
pattern = "ABABCABAB"
vi_tri_tim_thay = kmp_search(text, pattern)
print(f"Text:    {text}")
print(f"Pattern: {pattern}")
print(f"Tìm thấy tại vị trí: {vi_tri_tim_thay}")
```

### 10.2 Bài Tập 10: Palindrome Dài Nhất

**Đề bài:** Cho chuỗi `s`, tìm chuỗi con palindrome dài nhất.

**Lời giải:** Kỹ thuật "mở rộng từ trung tâm" (Expand Around Center).

```python
def palindrome_dai_nhat(s):
    """
    Mở rộng từ trung tâm - O(n²).
    Với mỗi vị trí (và khoảng giữa hai vị trí), thử mở rộng ra hai phía.
    """
    if not s:
        return ""

    bat_dau = ket_thuc = 0

    def mo_rong(trai, phai):
        while trai >= 0 and phai < len(s) and s[trai] == s[phai]:
            trai -= 1
            phai += 1
        return trai + 1, phai - 1  # Trả về biên của palindrome hợp lệ cuối

    for i in range(len(s)):
        # Palindrome độ dài lẻ (trung tâm là 1 ký tự)
        l, r = mo_rong(i, i)
        if r - l > ket_thuc - bat_dau:
            bat_dau, ket_thuc = l, r

        # Palindrome độ dài chẵn (trung tâm giữa i và i+1)
        l, r = mo_rong(i, i + 1)
        if r - l > ket_thuc - bat_dau:
            bat_dau, ket_thuc = l, r

    return s[bat_dau:ket_thuc + 1]


def tat_ca_palindrome(s):
    """Đếm tổng số chuỗi con palindrome."""
    tong = 0

    def mo_rong(trai, phai):
        nonlocal tong
        while trai >= 0 and phai < len(s) and s[trai] == s[phai]:
            tong += 1
            trai -= 1
            phai += 1

    for i in range(len(s)):
        mo_rong(i, i)       # Độ dài lẻ
        mo_rong(i, i + 1)   # Độ dài chẵn

    return tong


# Kiểm thử
test_strings = ["babad", "cbbd", "racecar", "abcba", "a"]
for s in test_strings:
    print(f"'{s}' -> Palindrome dài nhất: '{palindrome_dai_nhat(s)}', Tổng palindrome: {tat_ca_palindrome(s)}")
```


## 11. Tổng Kết và Lộ Trình Học

Dưới đây là bảng tóm tắt các nhóm giải thuật và mức độ ưu tiên:

| Nhóm | Giải thuật | Độ ưu tiên |
|---|---|---|
| Tìm kiếm | Linear Search, Binary Search | Bắt buộc |
| Sắp xếp | Merge Sort, Quick Sort | Bắt buộc |
| Sắp xếp | Bubble, Selection, Insertion | Cơ bản |
| Cấu trúc dữ liệu | Stack, Queue | Bắt buộc |
| Đệ quy | Fibonacci, Backtracking | Bắt buộc |
| Quy hoạch động | Knapsack, LIS, LCS | Nâng cao |
| Đồ thị | BFS, DFS, Union-Find | Bắt buộc |
| Tham lam | Activity Selection, Coin Change | Nâng cao |
| Chia để trị | Merge Sort, Quick Select | Bắt buộc |
| Chuỗi | KMP, Palindrome | Nâng cao |

### 11.1 Lộ Trình Học Đề Xuất

Giai đoạn 1 (tuần 1-2): Nắm vững Big O Notation, thực hành Linear Search và Binary Search, hiểu Stack và Queue.

Giai đoạn 2 (tuần 3-4): Thực hành các thuật toán sắp xếp từ đơn giản đến phức tạp. Tập trung vào Merge Sort và Quick Sort.

Giai đoạn 3 (tuần 5-6): Học đệ quy kết hợp memoization. Giải quyết các bài toán quy hoạch động cơ bản.

Giai đoạn 4 (tuần 7-8): Thành thạo BFS và DFS trên đồ thị. Học Union-Find cho bài toán thành phần liên thông.

Giai đoạn 5 (tuần 9-10): Tổng hợp kiến thức, giải bài LeetCode theo từng chủ đề, tập trung nhận biết mẫu bài toán để chọn đúng giải thuật.

### 11.2 Nguyên Tắc Quan Trọng

Khi giải bài, không nên nhảy vào code ngay. Hãy phân tích độ phức tạp mong đợi từ kích thước đầu vào trước: nếu n ≤ 10⁶ thì cần O(n log n) hoặc tốt hơn; nếu n ≤ 10³ thì O(n²) có thể chấp nhận. Từ đó mới chọn giải thuật phù hợp.

Học giải thuật không chỉ là ghi nhớ code, mà là hiểu tại sao nó hoạt động, khi nào dùng nó và cách biến thể nó cho từng bài cụ thể.
