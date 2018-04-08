---
title: A*(aStar) 알고리즘
date: 2018-??-??
categories:
- Game
tags:
- Development
- Game
- C#
---

 길찾기 알고리즘이라고 하면 보통 가장 먼저 떠오르는 알고리즘이 다익스트라 알고리즘<sup>(Dijkstra algorithm)</sup>일 것이다. 최단거리를 찾아주는 대표적인 알고리즘이지만 실제 프로그램에 적용하기에 문제가 되는 부분이 있다. 다익스트라 알고리즘은 경로를 찾을 때 한 노드를 기준으로 모든 노드에 대한 최단 경로를 찾기 때문에 시간 비용이 많이 든다.[^Dijkstra-Time]

[^Dijkstra-Time]: 다익스트라 알고이즘은 O(V^2^)의 시간 복잡도를 갖는다.

 이러한 문제를 해결하기 위해서 다음 노드로의 분기를 모든 노드가 아닌 가장 적은 추정 비용을 갖는 노드로 이동할 수 있게 휴리스틱 함수<sup>(Heuristic Function)</sup>[^Heuristic-Function]를 적용한다면 각 노드에서 분기를 줄일 수 있다. 이를 대표하는 탐색 알고리즘인 A*<sup>A Star</sup>에 대해 알아본다.

[^Heuristic-Function]: 휴리스틱 함수(Heuristic Function) : 가용한 정보를 기반으로 각 분기 단계에서 어느 한 분기를 선택하기 위해 사용하는 다양한 탐색 알고리즘의 대안 함수이다.

# A* 알고리즘

 A* 알고리즘을 이해하기 위해선 

## -휴리스틱 함수

## -Open List

## -Close List

## -탐색 우선 순위

## 탐색 과정

![astar-0](https://user-images.githubusercontent.com/18159012/38462570-6850a3a0-3b24-11e8-8bc8-9513b1ccfc74.png)

![astar-1](https://user-images.githubusercontent.com/18159012/38462574-748d2116-3b24-11e8-8bd9-e9060a714cc1.png)

![astar-2](https://user-images.githubusercontent.com/18159012/38462575-7cb1c932-3b24-11e8-802e-80140d2ade2b.png)

![astar-3](https://user-images.githubusercontent.com/18159012/38462577-83709a1e-3b24-11e8-9297-38346867375c.png)

![astar-4](https://user-images.githubusercontent.com/18159012/38462580-8b912b1e-3b24-11e8-8868-4ca62110d15c.png)

![astar-5](https://user-images.githubusercontent.com/18159012/38462584-98e1e862-3b24-11e8-9d16-ed8894fb41fa.png)

![astar-6](https://user-images.githubusercontent.com/18159012/38462586-a2141810-3b24-11e8-9bca-e89e998650a7.png)

![astar-7](https://user-images.githubusercontent.com/18159012/38462588-aa9010b6-3b24-11e8-9a3b-927278b456a9.png)

![astar-8](https://user-images.githubusercontent.com/18159012/38462655-c80c7390-3b25-11e8-8746-61b718b2865f.png)

![astar-9](https://user-images.githubusercontent.com/18159012/38462662-dc7fef32-3b25-11e8-85f0-0aad2390fc03.png)



-코드



다른 길찾기 알고리즘을 실행해 보고 싶다면 다음 사이트를 참고

http://qiao.github.io/PathFinding.js/visual/