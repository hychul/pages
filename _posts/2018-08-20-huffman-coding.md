---
title: 허프만 코딩
date: 2018-08-20
categories:
- Algorithm
tags:
- Development
- Algorithm
---

허프만 코딩을 통한 압축은 자주 사용되는 문자에 작은 bit를, 적게 사용되는 문자에 큰 bit를 할당한 후 문자를 할당한 bit로 치환하여 파일의 크기를 압축한다. 각 문자에 적절한 bit를 할당하기 위해 허프만 알고리즘은 입력 문자를 리프 노드로 하는 이진 트리를 만들어서 bit로 표현된 접두 부호를 만든다.

# 허프만 알고리즘

1. 모든 기호를 출현 빈도수에 따라 정렬한다.
2. 단 한 가지 기호가 남을 때까지 아래 단계를 반복한다.
   1. 목록으로부터 가장 빈도가 낮은 것을 2개 고른다.
   2. 고른 두가지 기호를 자식으로 가지는 트리를 만든다. 부모 노드의 빈도에 자식 노드에 합을 할당하고, 빈도수를 비교해 정렬시킨다.
   3. 목록에서 부모노드에 포함된 기호를 제거한다.
3. 이진 트리가 완성되면 빈도수가 큰 노드에 0, 작은 노드에 1bit를 할당한다.
4. 파일의 문자를 이진트리의 루트부터 문자까지 탐색하며 찾은 bit의 배열을 통해 치환한다.

## 예

주어진 문자열이 "CDDCACBCBCCCBBCDA"이라고 할 때, 위의 알고리즘에 따라 빈도수에 따라 정렬하면 다음과 같다.

![huffman-coding-01](https://user-images.githubusercontent.com/18159012/44322494-804f7a80-a488-11e8-9944-4ad98929ec34.png)

목록에서 가장 작은 두 노드를 합쳐 트리를 만든 후 정렬한다.

![huffman-coding-02](https://user-images.githubusercontent.com/18159012/44322506-89d8e280-a488-11e8-894b-12bf5d9acdf1.png)

목록에서 가장 작은 두 노드를 합쳐 트리를 만든 후 정렬한다.

![huffman-coding-03](https://user-images.githubusercontent.com/18159012/44322531-ac6afb80-a488-11e8-896f-c0c4f4fd0a96.png)

목록에서 가장 작은 두 노드를 합쳐 트리를 만든 후 정렬한다.

![huffman-coding-04](https://user-images.githubusercontent.com/18159012/44322564-de7c5d80-a488-11e8-9747-f36cdb28b9c0.png)

트리가 완성되면 빈도수가 큰 트리에 0을 작은 트리에 1을 부여한다.

![huffman-coding-05](https://user-images.githubusercontent.com/18159012/44322591-04a1fd80-a489-11e8-87c3-a355eebf5e8a.png)

치환하려는 문자를 루트부터 탐색하여 bit 부호를 얻는다.

![huffman-coding-06](https://user-images.githubusercontent.com/18159012/44322615-1aafbe00-a489-11e8-91d0-dba25aaaed83.png)

파일의 문자열을 트리로 부터 얻은 bit부호로 치환한다.

CDDCACBCBCCCBBCDA -> 10000001001100110011110010011000001

## 특징

이 부호화 기술은 입력 데이터의 값 분포에 따라 할당 방법이 동적으로 변화하기 때문에, 별도로 분포에 대한 정보를 가지고 있거나 보내 주어야 한다는 부담이 있다. 하지만 반복되어 사용되는 문자가 많을 수록, 파일의 크기가 커질 수록 압축률이 높아지는 장점을 갖는다.