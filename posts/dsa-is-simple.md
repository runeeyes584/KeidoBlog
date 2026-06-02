---
title: Ai cũng có thể làm chủ được Cấu trúc Dữ liệu và Giải thuật
date: 2023-04-01
author: Kaleidoscope
category: Programming
readingTime: 20 phút đọc
excerpt: Tổng quan về Cấu trúc dữ liệu và Giải thuật cho dân không chuyên :D
---
# Cấu Trúc Dữ Liệu & Giải Thuật - Toàn Tập Cho Người Mới

> **Dành cho:** Sinh viên, người mới học lập trình, và những ai muốn ôn thi môn Cấu trúc dữ liệu & Giải thuật.

## 1. Phân Tích Độ Phức Tạp Thuật Toán (Big-O)

### 1.1. Big-O là gì?

&emsp;Câu trả lời chính là **độ phức tạp thuật toán**.

&emsp;**Big-O Notation** là cách ký hiệu toán học để mô tả **tốc độ tăng trưởng** của thời gian chạy (hoặc bộ nhớ) theo kích thước đầu vào `n`.

### 1.2. Các mức Big-O phổ biến (từ nhanh đến chậm)

| Ký hiệu | Tên gọi | Ví dụ điển hình |
|---|---|---|
| O(1) | Hằng số | Truy cập phần tử mảng `a[i]` |
| O(log n) | Logarithm | Tìm kiếm nhị phân |
| O(n) | Tuyến tính | Duyệt toàn bộ mảng |
| O(n log n) | Tuyến tính-log | Merge Sort, Quick Sort |
| O(n²) | Bình phương | Bubble Sort, vòng lặp lồng nhau |
| O(2ⁿ) | Hàm mũ | Đệ quy Fibonacci ngây thơ |
| O(n!) | Giai thừa | Liệt kê hoán vị |

### 1.3. Phân tích chi tiết từng mức

- **O(1) - Hằng số**
&emsp;Dù đầu vào có bao nhiêu phần tử, thời gian thực thi **không thay đổi**.

```cpp
int getFirst(int arr[], int n) {
    return arr[0]; // Luôn chỉ 1 thao tác, dù mảng có 10 hay 10 triệu phần tử
}
```

- **O(log n) - Logarithm**
Mỗi bước lặp, bài toán **giảm một nửa** kích thước.

```cpp
// Tìm kiếm nhị phân: mỗi bước loại bỏ 1/2 phần tử còn lại
int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
// n = 1.000.000 => chỉ cần khoảng 20 bước!
```

- **O(n) - Tuyến tính**
Duyệt qua **từng phần tử** một lần.

```cpp
int findMax(int arr[], int n) {
    int maxVal = arr[0];
    for (int i = 1; i < n; i++) { // Chạy đúng n lần
        if (arr[i] > maxVal) maxVal = arr[i];
    }
    return maxVal;
}
```
- **O(n log n) - Tuyến tính-log**
Thường xuất hiện trong các thuật toán sắp xếp hiệu quả.

```cpp
// Merge Sort đạt O(n log n) - sẽ trình bày chi tiết ở phần sau
// Ý tưởng: chia đôi liên tục (log n lần), mỗi lần gộp tốn O(n)
```

- **O(n²) - Bình phương**
Vòng lặp **lồng nhau**, mỗi vòng chạy n lần.

```cpp
// Kiểm tra tất cả các cặp (i, j)
void printAllPairs(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) { // n * n = n² thao tác
            cout << arr[i] << " " << arr[j] << "\n";
        }
    }
}
```
- **O(2ⁿ) - Hàm mũ**
**Cực kỳ chậm** - chỉ dùng được với n rất nhỏ (n ≤ 25).

```cpp
// Fibonacci đệ quy cơ bản - tính đi tính lại các giá trị
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2); // Mỗi gọi sinh ra 2 gọi con => O(2^n)
}
// fib(50) cần ~2^50 ≈ 1 nghìn tỷ thao tác!
```
### 1.4. Quy tắc tính Big-O

**Quy tắc 1: Bỏ hằng số**
```
O(2n) → O(n)
O(100) → O(1)
O(3n²) → O(n²)
```

**Quy tắc 2: Bỏ số hạng bậc thấp**
```
O(n² + n) → O(n²)
O(n + log n) → O(n)
```

**Quy tắc 3: Vòng lặp lồng nhau → nhân**
```cpp
for (int i = 0; i < n; i++)       // O(n)
    for (int j = 0; j < n; j++)   // O(n)
        ...                        // => O(n²)
```

**Quy tắc 4: Các đoạn liên tiếp → cộng (rồi lấy lớn hơn)**
```cpp
for (int i = 0; i < n; i++) ...   // O(n)
for (int j = 0; j < n*n; j++) ... // O(n²)
// Tổng: O(n) + O(n²) = O(n²)
```

### 1.5. Độ phức tạp không gian (Space Complexity)

Ngoài thời gian, ta còn quan tâm đến **bộ nhớ** sử dụng.

```cpp
// O(1) space - chỉ dùng vài biến
int sum(int arr[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) total += arr[i];
    return total;
}

// O(n) space - tạo thêm mảng kích thước n
int* copyArray(int arr[], int n) {
    int* copy = new int[n]; // Tốn thêm n ô nhớ
    for (int i = 0; i < n; i++) copy[i] = arr[i];
    return copy;
}
```

## 2. Cấu Trúc Dữ Liệu Cơ Bản

### 2.1. Mảng (Array)

- **Khái niệm**
Mảng là tập hợp các phần tử **cùng kiểu**, được lưu **liên tiếp** trong bộ nhớ, truy cập qua **chỉ số (index)**.

```
Index:  [0]  [1]  [2]  [3]  [4]
Mảng:  | 5 | 12 |  3 | 47 |  8 |
       └────────────────────────┘
       Địa chỉ bộ nhớ liên tiếp
```

- **Ví dụ C++**

```cpp
#include <iostream>
using namespace std;

int main() {
    // Khai báo mảng tĩnh
    int arr[5] = {5, 12, 3, 47, 8};

    // Truy cập: O(1)
    cout << arr[2]; // In ra 3

    // Tìm kiếm tuyến tính: O(n)
    int target = 47;
    for (int i = 0; i < 5; i++) {
        if (arr[i] == target) {
            cout << "Tìm thấy tại index " << i;
            break;
        }
    }

    // Mảng động với vector
    vector<int> v = {1, 2, 3};
    v.push_back(4);    // Thêm cuối: O(1) amortized
    v.insert(v.begin() + 1, 99); // Chèn giữa: O(n)
    v.erase(v.begin()); // Xóa đầu: O(n)

    return 0;
}
```

- **Độ phức tạp**

| Thao tác | Mảng tĩnh | Vector |
|---|---|---|
| Truy cập `a[i]` | O(1) | O(1) |
| Tìm kiếm | O(n) | O(n) |
| Thêm vào cuối | - | O(1)* |
| Thêm vào đầu/giữa | O(n) | O(n) |
| Xóa | O(n) | O(n) |

*:Amortized (trung bình)

- Ưu & Nhược điểm
*Ưu điểm*
-- Truy cập ngẫu nhiên nhanh O(1)
-- Hiệu quả bộ nhớ (lưu liên tiếp)
*Nhược điểm*
-- Kích thước cố định (mảng tĩnh)
-- Chèn/xóa ở giữa chậm O(n)

---

### 2.2. Danh Sách Liên Kết (Linked List)

- **Khái niệm**
Mỗi phần tử là một **node** chứa **dữ liệu** và **con trỏ** trỏ đến node tiếp theo. Các node **không cần liên tiếp** trong bộ nhớ.

```
[5|→] → [12|→] → [3|→] → [47|→] → [8|null]
 head                               tail
```

- **Các loại Linked List**

>> **Singly Linked List:** Mỗi node chỉ trỏ tới node kế tiếp.
>> **Doubly Linked List:** Mỗi node trỏ cả hai phía (trước và sau).
>> **Circular Linked List:** Node cuối trỏ lại node đầu.

- **Ví dụ C++ - Singly Linked List**

```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
public:
    Node* head;
    LinkedList() : head(nullptr) {}

    // Thêm vào đầu: O(1)
    void pushFront(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }

    // Thêm vào cuối: O(n)
    void pushBack(int val) {
        Node* newNode = new Node(val);
        if (!head) { head = newNode; return; }
        Node* cur = head;
        while (cur->next) cur = cur->next;
        cur->next = newNode;
    }

    // Xóa node có giá trị val: O(n)
    void remove(int val) {
        if (!head) return;
        if (head->data == val) {
            Node* tmp = head;
            head = head->next;
            delete tmp;
            return;
        }
        Node* cur = head;
        while (cur->next && cur->next->data != val)
            cur = cur->next;
        if (cur->next) {
            Node* tmp = cur->next;
            cur->next = tmp->next;
            delete tmp;
        }
    }

    // In danh sách
    void print() {
        Node* cur = head;
        while (cur) {
            cout << cur->data << " -> ";
            cur = cur->next;
        }
        cout << "null\n";
    }
};

int main() {
    LinkedList list;
    list.pushBack(5);
    list.pushBack(12);
    list.pushBack(3);
    list.pushFront(99);
    list.print(); // 99 -> 5 -> 12 -> 3 -> null
    list.remove(12);
    list.print(); // 99 -> 5 -> 3 -> null
    return 0;
}
```

- **Độ phức tạp**

| Thao tác | Singly LL | Doubly LL |
|---|---|---|
| Truy cập `i` | O(n) | O(n) |
| Tìm kiếm | O(n) | O(n) |
| Thêm đầu | O(1) | O(1) |
| Thêm cuối | O(n) / O(1)* | O(1)* |
| Xóa đầu | O(1) | O(1) |
| Xóa giữa | O(n) | O(n) |

*:Nếu có con trỏ `tail`

### 2.3. Stack (Ngăn Xếp)

- **Khái niệm**
Stack hoạt động theo nguyên tắc **LIFO - Last In, First Out** (vào sau, ra trước), như một chồng đĩa: đĩa đặt vào sau cùng sẽ được lấy ra đầu tiên.

```
       ┌───┐
  TOP → | 3 |  ← push/pop tại đây
       ├───┤
       | 7 |
       ├───┤
       | 1 |
       └───┘
```

- **Ví dụ C++**

```cpp
#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> st;

    // Push: O(1)
    st.push(1);
    st.push(7);
    st.push(3);

    // Top: O(1)
    cout << "Đỉnh stack: " << st.top() << "\n"; // 3

    // Pop: O(1)
    st.pop();
    cout << "Sau pop, đỉnh: " << st.top() << "\n"; // 7

    cout << "Kích thước: " << st.size() << "\n"; // 2

    return 0;
}
```

- **Ứng dụng thực tế của Stack**

**Ứng dụng 1: Kiểm tra dấu ngoặc hợp lệ**

```cpp
bool isValidParentheses(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c); // Gặp mở ngoặc thì push
        } else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            // Kiểm tra cặp khớp
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return st.empty(); // Stack rỗng nghĩa là tất cả đã khớp
}

int main() {
    cout << isValidParentheses("({[]})") << "\n"; // 1 (true)
    cout << isValidParentheses("({[})") << "\n";  // 0 (false)
}
```

**Ứng dụng 2: Tính biểu thức hậu tố (Postfix)**

```cpp
// Ví dụ: "3 4 + 2 *" = (3 + 4) * 2 = 14
int evalPostfix(string tokens[], int n) {
    stack<int> st;
    for (int i = 0; i < n; i++) {
        if (tokens[i] == "+" || tokens[i] == "*") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (tokens[i] == "+") st.push(a + b);
            else st.push(a * b);
        } else {
            st.push(stoi(tokens[i]));
        }
    }
    return st.top();
}
```

---

### 2.4. Queue (Hàng Đợi)

- **Khái niệm**
Queue hoạt động theo nguyên tắc **FIFO - First In, First Out** (vào trước, ra trước), như hàng chờ mua vé: người đến trước được phục vụ trước.

```
FRONT                          BACK
  ↓                              ↓
| 1 | ← | 7 | ← | 3 | ← | 9 |
Dequeue từ FRONT          Enqueue vào BACK
```

- **Ví dụ C++**

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<int> q;

    // Enqueue (push): O(1)
    q.push(1);
    q.push(7);
    q.push(3);

    // Front: O(1)
    cout << "Đầu hàng: " << q.front() << "\n"; // 1

    // Dequeue (pop): O(1)
    q.pop();
    cout << "Sau dequeue, đầu hàng: " << q.front() << "\n"; // 7

    cout << "Kích thước: " << q.size() << "\n"; // 2

    return 0;
}
```

- **Biến thể: Deque (Double-ended Queue)**

```cpp
#include <deque>
deque<int> dq;
dq.push_front(1); // Thêm đầu
dq.push_back(2);  // Thêm cuối
dq.pop_front();   // Xóa đầu
dq.pop_back();    // Xóa cuối
```

- **Ứng dụng: BFS (Breadth-First Search) dùng Queue**

Queue là nền tảng của thuật toán BFS - sẽ trình bày chi tiết ở phần sau.

---

### 2.5. Hash Table (Bảng Băm)

- **Khái niệm**
Hash Table lưu trữ dữ liệu dưới dạng **cặp key-value**, sử dụng **hàm băm (hash function)** để ánh xạ key thành một vị trí trong mảng, giúp tìm kiếm cực nhanh.

```
key: "apple"  →  hash("apple") = 3  →  slot[3] = {key:"apple", val:50}
key: "banana" →  hash("banana") = 7 →  slot[7] = {key:"banana", val:30}
```

- **Ví dụ C++ với `unordered_map`**

```cpp
#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    unordered_map<string, int> price;

    // Insert: O(1) trung bình
    price["apple"] = 50;
    price["banana"] = 30;
    price["cherry"] = 120;

    // Lookup: O(1) trung bình
    cout << "Giá táo: " << price["apple"] << "\n"; // 50

    // Kiểm tra tồn tại
    if (price.count("grape")) {
        cout << "Có nho\n";
    } else {
        cout << "Không có nho\n";
    }

    // Duyệt tất cả
    for (auto& [fruit, val] : price) {
        cout << fruit << ": " << val << "\n";
    }

    // Xóa: O(1)
    price.erase("banana");

    return 0;
}
```

- **Ứng dụng: Đếm tần suất**

```cpp
// Bài toán: Đếm số lần xuất hiện của từng số trong mảng
void countFrequency(int arr[], int n) {
    unordered_map<int, int> freq;
    for (int i = 0; i < n; i++) {
        freq[arr[i]]++; // Tự khởi tạo 0 nếu chưa có
    }
    for (auto& [num, cnt] : freq) {
        cout << num << " xuất hiện " << cnt << " lần\n";
    }
}
// arr = {1, 2, 2, 3, 1, 2} => 1:2, 2:3, 3:1
```

-  **Độ phức tạp**

| Thao tác | Trung bình | Xấu nhất |
|---|---|---|
| Tìm kiếm | O(1) | O(n) |
| Chèn | O(1) | O(n) |
| Xóa | O(1) | O(n) |

> <small> Trường hợp xấu nhất xảy ra khi có quá nhiều **collision** (va chạm). Trong thực tế với hàm băm tốt, gần như luôn là O(1). </small>


## 3. Cấu Trúc Dữ Liệu Nâng Cao

### 3.1. Cây (Tree)

- **Khái niệm cơ bản**

Cây là cấu trúc dữ liệu **phân cấp** gồm các node có quan hệ cha-con.

```
         1          ← Root (gốc)
        / \
       2   3        ← Internal nodes
      / \   \
     4   5   6      ← Leaf nodes (lá)
```

**Thuật ngữ:**
- **Root:** Node gốc, không có cha
- **Leaf:** Node lá, không có con
- **Height (chiều cao):** Số cạnh trên đường dài nhất từ root đến lá
- **Depth (độ sâu):** Số cạnh từ root đến node đó

- **Binary Tree (Cây nhị phân)**
Mỗi node có **tối đa 2 con**: trái và phải.

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};
```

- **3 cách duyệt cây nhị phân**

```cpp
// 1. Inorder: Trái → Gốc → Phải (cho BST: ra kết quả tăng dần)
void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}

// 2. Preorder: Gốc → Trái → Phải (dùng để copy cây)
void preorder(TreeNode* root) {
    if (!root) return;
    cout << root->val << " ";
    preorder(root->left);
    preorder(root->right);
}

// 3. Postorder: Trái → Phải → Gốc (dùng để xóa cây)
void postorder(TreeNode* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->val << " ";
}

// 4. Level-order (BFS): Duyệt theo từng tầng
#include <queue>
void levelOrder(TreeNode* root) {
    if (!root) return;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* cur = q.front(); q.pop();
        cout << cur->val << " ";
        if (cur->left)  q.push(cur->left);
        if (cur->right) q.push(cur->right);
    }
}
```

**Ví dụ với cây trên:**
```
Inorder:    4 2 5 1 3 6
Preorder:   1 2 4 5 3 6
Postorder:  4 5 2 6 3 1
LevelOrder: 1 2 3 4 5 6
```

### 3.2. Binary Search Tree (BST - Cây Tìm Kiếm Nhị Phân)

- **Tính chất quan trọng**
>> Tất cả node ở **cây con trái < node gốc**
>> Tất cả node ở **cây con phải > node gốc**
>> Áp dụng đệ quy cho mọi cây con

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13
```

- **Ví dụ C++ - Tìm kiếm và Chèn**

```cpp
// Tìm kiếm trong BST: O(log n) trung bình, O(n) xấu nhất
TreeNode* search(TreeNode* root, int target) {
    if (!root || root->val == target) return root;
    if (target < root->val)
        return search(root->left, target);
    else
        return search(root->right, target);
}

// Chèn vào BST: O(log n) trung bình
TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val)
        root->left = insert(root->left, val);
    else if (val > root->val)
        root->right = insert(root->right, val);
    return root; // val == root->val: bỏ qua (không chèn trùng)
}

int main() {
    TreeNode* root = nullptr;
    root = insert(root, 8);
    root = insert(root, 3);
    root = insert(root, 10);
    root = insert(root, 1);
    root = insert(root, 6);

    inorder(root); // In ra: 1 3 6 8 10 (tăng dần!)
}
```

### 3.3. Heap (Đống)

- **Khái niệm **
Heap là cây nhị phân **hoàn chỉnh** (tất cả tầng đầy, tầng cuối lấp từ trái) thỏa mãn **tính chất heap**:

>> **Max-Heap:** Node cha **≥** tất cả node con → phần tử lớn nhất ở gốc
>> **Min-Heap:** Node cha **≤** tất cả node con → phần tử nhỏ nhất ở gốc

```
Max-Heap:        Min-Heap:
      9                1
     / \              / \
    7   8            3   2
   / \ / \          / \ / \
  4  5 6  3        7  5 6  4
```

- **Ví dụ C++ với `priority_queue`**

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    // Max-Heap (mặc định)
    priority_queue<int> maxHeap;
    maxHeap.push(3); maxHeap.push(9); maxHeap.push(1);
    maxHeap.push(7); maxHeap.push(5);

    cout << "Max: " << maxHeap.top() << "\n"; // 9
    maxHeap.pop();
    cout << "Sau pop, max: " << maxHeap.top() << "\n"; // 7

    // Min-Heap
    priority_queue<int, vector<int>, greater<int>> minHeap;
    minHeap.push(3); minHeap.push(9); minHeap.push(1);

    cout << "Min: " << minHeap.top() << "\n"; // 1

    return 0;
}
```

- **Ứng dụng: Heap Sort và Top-K**

```cpp
// Tìm K phần tử lớn nhất trong mảng: O(n log k)
vector<int> topK(vector<int>& nums, int k) {
    // Dùng min-heap kích thước k
    priority_queue<int, vector<int>, greater<int>> minH;
    for (int x : nums) {
        minH.push(x);
        if ((int)minH.size() > k) minH.pop(); // Loại phần tử nhỏ nhất
    }
    vector<int> result;
    while (!minH.empty()) {
        result.push_back(minH.top()); minH.pop();
    }
    return result;
}
// nums = {3,1,9,7,5,2,8,4,6}, k=3 => {7, 8, 9}
```

### 3.4. Đồ Thị (Graph)

- **Khái niệm**
Đồ thị gồm tập hợp **đỉnh (vertices)** và **cạnh (edges)** nối các đỉnh.

```
Đồ thị vô hướng:     Đồ thị có hướng:
  1 - 2 - 3            1 → 2 → 3
  |   |                ↑   |
  4 - 5                4 ← 5
```

**Phân loại:**
>> **Vô hướng / Có hướng:** Cạnh có chiều hay không
>> **Có trọng số / Không trọng số:** Cạnh mang giá trị (khoảng cách, chi phí)

- **Biểu diễn đồ thị**

**Cách 1: Ma trận kề (Adjacency Matrix)**
```cpp
// adj[i][j] = 1 nếu có cạnh từ i đến j
int adj[5][5] = {0};
adj[0][1] = 1; // Có cạnh 0-1
adj[1][2] = 1; // Có cạnh 1-2
// Ưu: Check cạnh O(1). Nhược: Tốn O(V²) bộ nhớ
```

**Cách 2: Danh sách kề (Adjacency List) - Phổ biến hơn**
```cpp
#include <vector>
vector<vector<int>> adj(5); // 5 đỉnh
adj[0].push_back(1); // Cạnh 0→1
adj[1].push_back(2); // Cạnh 1→2
adj[1].push_back(4); // Cạnh 1→4
// Ưu: Tiết kiệm bộ nhớ O(V+E). Nhược: Check cạnh O(degree)
```

- **BFS - Breadth-First Search (Tìm kiếm theo chiều rộng)**

BFS duyệt đồ thị **theo từng tầng**, dùng **Queue**.

```cpp
#include <queue>
#include <vector>

void BFS(vector<vector<int>>& adj, int start, int n) {
    vector<bool> visited(n, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int v = q.front(); q.pop();
        cout << v << " ";

        for (int u : adj[v]) {
            if (!visited[u]) {
                visited[u] = true;
                q.push(u);
            }
        }
    }
}
// Ứng dụng: Tìm đường ngắn nhất trên đồ thị không trọng số
// Độ phức tạp: O(V + E)
```

- **DFS - Depth-First Search (Tìm kiếm theo chiều sâu)**

DFS đi **càng sâu càng tốt** trước khi quay lui, dùng **Stack** (hoặc đệ quy).

```cpp
void DFS(vector<vector<int>>& adj, int v, vector<bool>& visited) {
    visited[v] = true;
    cout << v << " ";

    for (int u : adj[v]) {
        if (!visited[u]) {
            DFS(adj, u, visited);
        }
    }
}

void DFSAll(vector<vector<int>>& adj, int n) {
    vector<bool> visited(n, false);
    for (int i = 0; i < n; i++) {
        if (!visited[i]) DFS(adj, i, visited);
    }
}
// Ứng dụng: Phát hiện chu trình, topo sort, tìm thành phần liên thông
// Độ phức tạp: O(V + E)
```

- **Ví dụ minh họa BFS và DFS** 

```
Đồ thị:
0 - 1 - 3
|   |
2 - 4

BFS từ 0: 0 → 1 → 2 → 3 → 4  (theo tầng)
DFS từ 0: 0 → 1 → 3 → 4 → 2  (đi sâu trước)
```

### 3.5. Segment Tree (Cây Phân Đoạn)

- **Khái niệm**
Segment Tree là cấu trúc cho phép:
>> **Truy vấn** (query) trên đoạn `[l, r]`: tổng, min, max... trong O(log n)
>> **Cập nhật** (update) một phần tử trong O(log n)

Mỗi node lưu kết quả của một đoạn con.

```
Mảng:  [1, 3, 5, 7, 9]
           [25]          ← [0,4]: tổng toàn bộ
          /    \
       [9]     [16]      ← [0,2], [3,4]
       / \     / \
     [4] [5] [7] [9]    ← [0,1],[2,2],[3,3],[4,4]
     / \
   [1] [3]               ← [0,0],[1,1]
```

- **Ví dụ C++ - Range Sum Query**

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> tree;
int n;

void build(vector<int>& arr, int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
    } else {
        int mid = (start + end) / 2;
        build(arr, 2*node, start, mid);
        build(arr, 2*node+1, mid+1, end);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}

// Query tổng đoạn [l, r]
int query(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0; // Ngoài đoạn
    if (l <= start && end <= r) return tree[node]; // Trong đoạn
    int mid = (start + end) / 2;
    return query(2*node, start, mid, l, r)
         + query(2*node+1, mid+1, end, l, r);
}

// Cập nhật phần tử vị trí idx
void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
    } else {
        int mid = (start + end) / 2;
        if (idx <= mid) update(2*node, start, mid, idx, val);
        else update(2*node+1, mid+1, end, idx, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9};
    n = arr.size();
    tree.assign(4 * n, 0);

    build(arr, 1, 0, n-1);

    cout << query(1, 0, n-1, 1, 3) << "\n"; // Tổng [1..3] = 3+5+7 = 15
    update(1, 0, n-1, 2, 10);               // arr[2] = 10 (thay 5 bằng 10)
    cout << query(1, 0, n-1, 1, 3) << "\n"; // Tổng [1..3] = 3+10+7 = 20

    return 0;
}
```

## 4. Chiến Lược Giải Thuật

### 4.1. Sắp Xếp (Sorting)

-  **Bubble Sort - O(n²)**
So sánh và hoán đổi từng cặp phần tử kề nhau.

```cpp
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]); // Phần tử lớn "nổi bọt" lên cuối
            }
        }
    }
}
// arr = [5, 3, 8, 1, 2] => [1, 2, 3, 5, 8]
```

- **Merge Sort - O(n log n)**
**Chia để trị:** Chia đôi mảng → sắp xếp từng nửa → gộp lại.

```cpp
void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    vector<int> L(arr+l, arr+m+1), R(arr+m+1, arr+r+1);
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(arr, l, m);     // Sắp xếp nửa trái
    mergeSort(arr, m+1, r);   // Sắp xếp nửa phải
    merge(arr, l, m, r);      // Gộp 2 nửa đã sắp xếp
}
```

- **Quick Sort - O(n log n) trung bình**

```cpp
int partition(int arr[], int l, int r) {
    int pivot = arr[r]; // Chọn phần tử cuối làm pivot
    int i = l - 1;
    for (int j = l; j < r; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]); // Đưa phần tử nhỏ về bên trái pivot
        }
    }
    swap(arr[i+1], arr[r]); // Đặt pivot vào đúng vị trí
    return i + 1;
}

void quickSort(int arr[], int l, int r) {
    if (l < r) {
        int pi = partition(arr, l, r);
        quickSort(arr, l, pi - 1);
        quickSort(arr, pi + 1, r);
    }
}
```

- **So sánh các thuật toán sắp xếp**
| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

### 4.2. Đệ Quy (Recursion)

- **Khái niệm**
Đệ quy là kỹ thuật một hàm **tự gọi chính nó** để giải bài toán lớn bằng cách chia thành các bài toán con tương tự.

**Mọi hàm đệ quy cần có:**
1. **Base case (điều kiện dừng):** Trường hợp đơn giản nhất, không gọi đệ quy
2. **Recursive case:** Gọi đệ quy với bài toán nhỏ hơn

```cpp
// Ví dụ 1: Tính n! (giai thừa)
// n! = n * (n-1) * (n-2) * ... * 1
int factorial(int n) {
    if (n == 0 || n == 1) return 1; // Base case
    return n * factorial(n - 1);    // Recursive case
}
// factorial(4) = 4 * factorial(3)
//              = 4 * 3 * factorial(2)
//              = 4 * 3 * 2 * factorial(1)
//              = 4 * 3 * 2 * 1 = 24

// Ví dụ 2: Tính tổng các số từ 1 đến n
int sum(int n) {
    if (n == 0) return 0;           // Base case
    return n + sum(n - 1);          // Recursive case
}

// Ví dụ 3: In ngược chuỗi
void reverse(string s, int i) {
    if (i < 0) return;              // Base case
    cout << s[i];
    reverse(s, i - 1);              // Recursive case
}
```

### 4.3. Chia Để Trị (Divide and Conquer)

- **Khái niệm**
Ba bước:
1. **Divide:** Chia bài toán thành các bài toán con nhỏ hơn
2. **Conquer:** Giải từng bài toán con (thường bằng đệ quy)
3. **Combine:** Gộp kết quả lại thành đáp án

```
Ví dụ: Merge Sort với mảng [8, 3, 5, 1, 9, 2]

           [8,3,5,1,9,2]         ← Divide
           /            \
       [8,3,5]         [1,9,2]   ← Divide tiếp
       /     \          /    \
    [8,3]   [5]      [1,9]  [2]
    /  \              /  \
  [8]  [3]          [1]  [9]
   ↓ Conquer ↓
  [8]  [3]          [1]  [9]
    \  /              \  /
   [3,8]   [5]      [1,9]  [2]  ← Combine
     \     /           \   /
    [3,5,8]           [1,2,9]   ← Combine
          \            /
        [1,2,3,5,8,9]            ← Kết quả
```

- **Ví dụ khác: Tìm phần tử lớn nhất**

```cpp
int findMax(int arr[], int l, int r) {
    if (l == r) return arr[l]; // Base case: 1 phần tử
    int mid = (l + r) / 2;
    int leftMax  = findMax(arr, l, mid);    // Conquer nửa trái
    int rightMax = findMax(arr, mid+1, r);  // Conquer nửa phải
    return max(leftMax, rightMax);           // Combine
}
```

### 4.4. Quy Hoạch Động (Dynamic Programming - DP)

- **Khái niệm**
DP dùng để giải các bài toán có **hai đặc tính**:
1. **Optimal Substructure:** Đáp án bài toán lớn xây dựng từ đáp án các bài toán con
2. **Overlapping Subproblems:** Các bài toán con được giải đi giải lại nhiều lần

**Ý tưởng:** Lưu (memorize) kết quả bài toán con để **không tính lại**.

- **Hai cách tiếp cận**

**Top-down (Memoization):** Đệ quy + lưu cache
```cpp
int memo[100];
bool computed[100];

int fib(int n) {
    if (n <= 1) return n;
    if (computed[n]) return memo[n]; // Đã tính rồi, trả về ngay
    computed[n] = true;
    memo[n] = fib(n-1) + fib(n-2);
    return memo[n];
}
// fib(10) chỉ tính mỗi giá trị đúng 1 lần => O(n) thay vì O(2^n)
```

**Bottom-up (Tabulation):** Điền bảng từ bài toán nhỏ nhất
```cpp
int fibDP(int n) {
    vector<int> dp(n+1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2]; // Xây dựng từ dưới lên
    }
    return dp[n];
}
```

- **Bài toán kinh điển: Knapsack 0/1 (Ba lô)**

**Đề bài:** Có `n` vật, vật thứ `i` có trọng lượng `w[i]` và giá trị `v[i]`. Ba lô chứa tối đa `W` kg. Chọn các vật để **tổng giá trị lớn nhất** (mỗi vật chỉ dùng 1 lần).

**Trạng thái:** `dp[i][j]` = giá trị lớn nhất dùng `i` vật đầu tiên, trọng lượng ≤ `j`

**Công thức:**
- Không chọn vật `i`: `dp[i][j] = dp[i-1][j]`
- Chọn vật `i` (nếu `w[i] <= j`): `dp[i][j] = dp[i-1][j-w[i]] + v[i]`
- Lấy giá trị lớn hơn!

```cpp
int knapsack(int W, vector<int>& w, vector<int>& v, int n) {
    // dp[i][j] = max value với i vật đầu, túi chứa j kg
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= W; j++) {
            dp[i][j] = dp[i-1][j]; // Không chọn vật i
            if (w[i-1] <= j) {     // Có thể chọn vật i
                dp[i][j] = max(dp[i][j],
                               dp[i-1][j-w[i-1]] + v[i-1]);
            }
        }
    }
    return dp[n][W];
}

int main() {
    int W = 5; // Túi chứa 5 kg
    vector<int> weights = {1, 2, 3, 5};
    vector<int> values  = {1, 6, 10, 16};
    int n = weights.size();
    cout << knapsack(W, weights, values, n); // In ra 17 (chọn vật 2+3: 6+10=16? Không, chọn vật 2+4: không được. Chọn 2+3: w=2+3=5, v=6+10=16. Đúng nhất là 17 với vật {2kg,6} + {3kg,10} = sai. Thực ra: vật 2 (2kg,6) + vật 3 (3kg,10) = 5kg, 16. Vật 4 (5kg,16). Bằng nhau! Kết quả 16.)
    return 0;
}
```

- **Bài toán: Dãy con tăng dài nhất (LIS)**

```cpp
// LIS: Longest Increasing Subsequence
// Ví dụ: [3, 1, 4, 1, 5, 9, 2, 6] => LIS = [1, 4, 5, 9] hoặc [1, 4, 5, 6], length = 4

int LIS(vector<int>& arr) {
    int n = arr.size();
    vector<int> dp(n, 1); // Mỗi phần tử tự là dãy con dài 1
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[j] < arr[i]) { // arr[i] có thể nối sau arr[j]
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
    }
    return *max_element(dp.begin(), dp.end());
}
// Độ phức tạp: O(n²)
```

### 4.5. Tham Lam (Greedy)

- **Khái niệm**
Ở mỗi bước, chọn lựa chọn **tốt nhất ngay lúc đó** (locally optimal) mà không xem xét tương lai. Không phải lúc nào cũng đúng, nhưng với nhiều bài toán, greedy cho kết quả tối ưu toàn cục.

>  <small> **Cách nhớ:** Greedy như người mua hàng - luôn lấy đồ rẻ nhất trước, không nghĩ đến combo. </small>

- **Ví dụ 1: Bài toán đổi tiền (Coin Change - Greedy)**

```cpp
// Đổi tiền xu 11000đ với các mệnh giá {10000, 5000, 2000, 1000}
void coinChangeGreedy(int amount, vector<int> coins) {
    sort(coins.rbegin(), coins.rend()); // Sắp xếp giảm dần
    int count = 0;
    for (int coin : coins) {
        while (amount >= coin) {
            amount -= coin;
            count++;
            cout << coin << " ";
        }
    }
    cout << "\nSố xu: " << count << "\n";
}
// amount=11000: dùng 10000 + 1000 = 2 xu ✅
// ⚠️ Greedy không luôn đúng: coins={1,3,4}, amount=6
//    Greedy: 4+1+1=3 xu. Tối ưu: 3+3=2 xu. => Cần dùng DP!
```

- **Ví dụ 2: Bài toán chọn công việc (Activity Selection)**

**Đề bài:** Có `n` công việc, công việc `i` bắt đầu lúc `s[i]` và kết thúc lúc `e[i]`. Chọn tối đa số công việc không chồng chéo nhau.

**Greedy:** Luôn chọn công việc kết thúc sớm nhất.

```cpp
int activitySelection(vector<pair<int,int>>& jobs) {
    // Sắp xếp theo thời gian kết thúc
    sort(jobs.begin(), jobs.end(), [](auto& a, auto& b){
        return a.second < b.second;
    });

    int count = 1;
    int lastEnd = jobs[0].second;

    for (int i = 1; i < (int)jobs.size(); i++) {
        if (jobs[i].first >= lastEnd) { // Không chồng chéo
            count++;
            lastEnd = jobs[i].second;
        }
    }
    return count;
}

int main() {
    vector<pair<int,int>> jobs = {{1,3},{2,5},{3,9},{6,8}};
    // Sắp xếp theo end: (1,3),(2,5),(6,8),(3,9)
    // Chọn: (1,3), bỏ (2,5) vì 2<3, chọn (6,8), bỏ (3,9) vì 3<8
    cout << activitySelection(jobs) << "\n"; // 2
}
```

### 4.6. Quay Lui (Backtracking)

- **Khái niệm**
Backtracking thử **tất cả các khả năng** có thể, và **quay lui** khi gặp trường hợp sai (không thỏa mãn ràng buộc).

```
Ý tưởng như ma trận mê cung:
→ → ↓
    → → ↓
        ✗  (tắc đường → quay lui)
    ← ← ↑
    ↓
    → → ✓ (tìm ra đường đi)
```

- **Ví dụ 1: Bài toán N-Queens (N quân hậu)**

**Đề bài:** Đặt N quân hậu lên bàn cờ N×N sao cho không quân nào tấn công nhau.

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool isSafe(vector<string>& board, int row, int col, int n) {
    // Kiểm tra cột
    for (int i = 0; i < row; i++)
        if (board[i][col] == 'Q') return false;
    // Kiểm tra đường chéo trái
    for (int i=row-1, j=col-1; i>=0 && j>=0; i--, j--)
        if (board[i][j] == 'Q') return false;
    // Kiểm tra đường chéo phải
    for (int i=row-1, j=col+1; i>=0 && j<n; i--, j++)
        if (board[i][j] == 'Q') return false;
    return true;
}

void solve(vector<string>& board, int row, int n, int& count) {
    if (row == n) { count++; return; } // Đặt xong n quân hậu!
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 'Q'; // Đặt quân hậu
            solve(board, row+1, n, count); // Thử hàng tiếp theo
            board[row][col] = '.'; // Quay lui: bỏ quân hậu
        }
    }
}

int main() {
    int n = 4;
    vector<string> board(n, string(n, '.'));
    int count = 0;
    solve(board, 0, n, count);
    cout << "Số cách đặt " << n << " quân hậu: " << count << "\n"; // 2
}
```

- **Ví dụ 2: Liệt kê tất cả tập con**
```cpp
void subsets(vector<int>& nums, int idx, vector<int>& current) {
    // In tập con hiện tại
    cout << "{ ";
    for (int x : current) cout << x << " ";
    cout << "}\n";

    for (int i = idx; i < (int)nums.size(); i++) {
        current.push_back(nums[i]); // Chọn nums[i]
        subsets(nums, i+1, current);  // Đệ quy
        current.pop_back();           // Quay lui: bỏ nums[i]
    }
}

int main() {
    vector<int> nums = {1, 2, 3};
    vector<int> current;
    subsets(nums, 0, current);
    // Output: {}, {1}, {1,2}, {1,2,3}, {1,3}, {2}, {2,3}, {3}
}
```

## Tổng Kết & Bảng So Sánh

### Khi nào dùng chiến lược nào?

| Tình huống | Chiến lược phù hợp |
|---|---|
| Bài toán chia nhỏ, không chồng lặp | Chia để trị |
| Bài toán có bài toán con chồng lặp | Quy hoạch động |
| Cần chọn lựa tối ưu từng bước | Tham lam |
| Thử mọi khả năng, có ràng buộc | Quay lui |
| Tìm đường ngắn nhất (không trọng số) | BFS |
| Duyệt sâu, phát hiện chu trình | DFS |

### Bảng Big-O nhanh

| CTDL | Tìm kiếm | Chèn | Xóa |
|---|---|---|---|
| Array | O(n) | O(n) | O(n) |
| Sorted Array | O(log n) | O(n) | O(n) |
| Linked List | O(n) | O(1)* | O(1)* |
| Hash Table | O(1) avg | O(1) avg | O(1) avg |
| BST | O(log n) avg | O(log n) avg | O(log n) avg |
| Heap | O(n) | O(log n) | O(log n) |

*:Nếu đã biết vị trí

## Lời Khuyên Ôn Thi Cho Các Sĩ Tử

1. **Nắm chắc Big-O:** Phân tích được độ phức tạp của bất kỳ đoạn code nào.
2. **Hiểu cách cài đặt CTDL cơ bản:** Stack, Queue, Linked List bằng tay (không dùng STL).
3. **Luyện các bài DP kinh điển:** Fibonacci, Knapsack, LIS, LCS.
4. **BFS/DFS là nền tảng:** Mọi bài đồ thị đều bắt đầu từ đây.
5. **Backtracking + Pruning:** Luôn cắt tỉa sớm để tối ưu.
6. **Dùng STL C++ thành thạo:** `vector`, `map`, `set`, `priority_queue`, `stack`, `queue`.

> <small> **Chúc bạn học tốt và thi đạt điểm cao!** </small>
