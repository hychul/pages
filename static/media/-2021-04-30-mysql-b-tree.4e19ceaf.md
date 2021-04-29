<!-- https://zorba91.tistory.com/293 -->

B-tree는 인덱스를 이루고 있는 자료구조의 일종이다. 
B-tree에서 'B'는 정확히 어떤 의미라고 밝혀진 바는 없다. 아마 'Balanced'를 의미하는 'B'가 아닐까라는 추측만 있다. 
MySQL의 DB engine인 InnoDB는 B+tree로 이뤄져있는데, B-tree의 확장된 개념이다.

먼저 B-tree를 살펴보자.

# 트리 구조의 우위성
트리 구조는 꼭 데이터베이스에 한정하지 않더라도 시스템 세계에서는 데이터를 유지하기 위해 자주 사용하는 구조이다. '탐색' 시, 단시간 내에 실행할 수 있기 때문이다.  

B-tree의 핵심은 데이터가 정렬된 상태로 유지되어 있다는 것이다.

![mysql-b-tree-0](https://user-images.githubusercontent.com/18159012/116574760-fea68f00-a948-11eb-94d8-39ca2880ece8.png)

그림에 표시된 사각형으로 표시된 한 개 한 개의 데이터를 '노드(Node)'라고 한다. 

가장 상단의 노드를 '루트 노드(Root Node)', 중간 노드들을 '브랜치 노드(Branch Node)', 가장 아래 노드들을 '리프 노드(Leaf Node)'라고 한다. 

![mysql-b-tree-1](https://user-images.githubusercontent.com/18159012/116574755-fea68f00-a948-11eb-9077-b0fddb54809a.jpeg) 
출처: http://www.btechsmartclass.com/data_structures/b-trees.html
 
B-tree는 Binary search tree와 유사하지만, 한 노드 당 자식 노드가 2개 이상 가능하다. 

key 값을 이용해 찾고자 하는 데이터를 트리 구조를 이용해 찾는 것이다.

# 왜 B-tree는 빠른가 
B-tree의 장점 한 가지는 '어떤 값에 대해서도 같은 시간에 결과를 얻을 수 있다'인데, 이를 '균일성'이라고 한다. 

위의 예시에서 리프노드에 있는 '15'나 '28'을 찾는 시간은 동일할 것이다.(트리 높이가 다른 경우, 약간의 차이는 있겠지만 O(logN)이라는 시간 복잡도를 구할 수 있다.)

만약 선형탐색일 경우 어떨까? 

리프노드에 있는 값들만 따져보면,
`[1, 3, 7, 15, 21 .... 85, 89, 97]`
'15', '28'을 찾기 위해서는 배열을 하나씩 체크하는 수 밖에 없고 시간은 더욱 소요된다. (시간복잡도 : O(n))

# B-tree는 균형트리
![mysql-b-tree-2](https://user-images.githubusercontent.com/18159012/116574753-fe0df880-a948-11eb-8559-d01d1539c806.png)

'균형 트리'란 루트로부터 리프까지의 거리가 일정한 트리 구조를 뜻하는 것으로, 트리 중에서 특히 성능이 안정화 되어있다. 

그러나, B-tree 처음 생성 당시는 균형 트리이지만 테이블 갱신(INSERT/UPDATE/DELETE)의 반복을 통해 서서히 균형이 깨지고, 성능도 악화된다. 

어느 정도 자동으로 균형을 회복하는 기능이 있지만, 갱신 빈도가 높은 테이블에 작성되는 인덱스 같은 경우 인덱스 재구성을 해서 트리의 균형을 되찾는 작업이 필요하다. 

# 데이터양에 비례해 효과 상승  
![mysql-b-tree-3](https://user-images.githubusercontent.com/18159012/116574748-fe0df880-a948-11eb-9751-6f8000ca2aea.png)

풀 스캔이 테이블의 크기에 비례하는 형태로 실행 시간이 늘어가는데에 비해 인덱스를 사용한 경우 실행 시간의 저하는 보통 원만한 곡선을 그리게 된다. 

# B+tree란?
![mysql-b-tree-4](https://user-images.githubusercontent.com/18159012/116575063-45948480-a949-11eb-9c1e-ff2790f5c0fd.png)
출처: 위키피디아

B+tree는 B-tree의 확장개념으로, B-tree의 경우, internal 또는 branch 노드에 key와 data를 담을 수 있다. 하지만, B+tree의 경우 브랜치 노드에 key만 담아두고, data는 담지 않는다. 오직 리프 노드에만 key와 data를 저장하고, 리프 노드끼리 Linked list로 연결되어 있다. 

# B+tree의 장점
1. 리프 노드를 제외하고 데이터를 담아두지 않기 때문에 메모리를 더 확보함으로써 더 많은 key들을 수용할 수 있다. 하나의 노드에 더 많은 key들을 담을 수 있기에 트리의 높이는 더 낮아진다.(cache hit를 높일 수 있음)

2. 풀 스캔 시, B+tree는 리프 노드에 데이터가 모두 있기 때문에 한 번의 선형탐색만 하면 되기 때문에 B-tree에 비해 빠르다. B-tree의 경우에는 모든 노드를 확인해야 한다. 

# InnoDB에서 사용된 B+tree
![mysql-b-tree-5](https://user-images.githubusercontent.com/18159012/116575105-4e855600-a949-11eb-98ad-1621a6daef9d.png)
출처: https://blog.jcole.us/2013/01/10/btree-index-structures-in-innodb/

InnoDB에서 B+tree는 단순하게 설명한 B+tree보다 더 복잡하게 구현된 것 같다. 

같은 레벨의 노드들끼리는 Linked List가 아닌 Double Linked List를 사용했고, 자식 노드로는 Single Linked List로 연결되어있다.

key의 범위마다 찾아가야할 페이지 넘버(포인터)가 있는데, 해당 페이지 넘버를 통해 곧바로 다음 노드로 넘어간다.

그리고 리프 노드에 다다랐을 때 디스크에 존재하는 데이터의 주소값을 구할 수 있고, Linked List를 통해 탐색도 가능하다. 

# B-tree Vs B+tree 
아래서 말하는 데이터는 자료구조 상 value를 가리킴. (실제 DB 데이터 X)

| 구분 | B-tree | B+tree |
| - | - | - |
| 데이터 저장 | 리프 노드, 브랜치 노드 모두 데이터 저장 가능 | 오직 리프 노드에만 데이터 저장 가능 |
| 트리의 높이 | 높음 | 낮음(한 노드 당 key를 많이 담을 수 있음) |
| 풀 스캔 시, 검색 속도 | 모든 노드 탐색 | 리프 노드에서 선형 탐색 |
| 키 중복 | 없음 | 있음(리프 노드에 모든 데이터가 있기 때문) |
| 검색 | 자주 access 되는 노드를 루트 노드 가까이 배치할 수 있고, 루트 노드에서 가까울 경우, 브랜치 노드에도 데이터가 존재하기 때문에 빠름 | 리프 노드까지 가야 데이터 존재 |
| 링크드 리스트 | 없음 | 리프 노드끼리 링크드 리스트로 연결 | 

> ### Reference
> 데이터베이스 첫 걸음 - 미크, 기무라 메이지 지음(한빛미디어)
> https://www.softwaretestinghelp.com/b-tree-data-structure-cpp/
> https://stackoverflow.com/questions/870218/differences-between-b-trees-and-b-trees
> https://blog.jcole.us/2013/01/10/btree-index-structures-in-innodb/