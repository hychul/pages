---
title: 큰 피보나치
date: 2018-08-21
categories:
- Algorithm
tags:
- Development
- Algorithm
- Java
---

 피보나치는 재귀문을 배울 때 가장 많이 쓰이는 개발자들에게 친숙한 수열일 것이다. 일반적으로 재귀 함수가 한번 불릴 때마다 수를 더해가면서 구현을 하는데, 이는 큰 수의 피보나치를 계산할 때 함수 호출 스택으로 인한 스택 오버플로우를 발생시킬 수 있고 시간 복잡도가 O(n)이기 성능상으로 적합하지 않다. 이를 해결하기 위해 좀 더 효율적인 방법이 필요하다.

# 행렬과 피보나치

 피보나치가 재귀문을 배울 때 가장 많이 쓰이는 이유는 점화식이 간단하기 때문이다.

![big-fibonacci-0](https://user-images.githubusercontent.com/18159012/44535577-4ce54800-a735-11e8-976e-f4d236bb00e7.jpg)

![big-fibonacci-1](https://user-images.githubusercontent.com/18159012/44535608-5a9acd80-a735-11e8-83af-a7bcb497978a.jpg)

