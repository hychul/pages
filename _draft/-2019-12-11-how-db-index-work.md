[DB 스터디]  인덱스의 엑세스 최적화와 설계

---

인덱스는 삼각형 (트리 구조)  
인덱스는 로우 수만큼 존재 (트리 노드 수 = 로우 수)

---

# 인덱스 비용의 원리

> 인덱스는 데이터 주소를 갖는다 ->    
> 일련의 처리를 통해 데이터 주소를 hash로 변경한다 ->    
> hash 체인 중 메모리 내에서 어디에 위치하는지 확인 (사용중인 경우 latch 에 걸려 접근 못함 -> 일정 시간 뒤 sleep    
> 주메모리 버퍼가 쓰기 중인 경우엔 lock이 걸림 ->    
> 주메모리에 없는 경우 보조 메모리에서 버퍼를 읽어 주메모리로 올림 ->    
> 읽은 버퍼를 hash chain에 보고 (사용중인 경우 latch에 걸려 접근 못함    
>    
> 데이터를 변경하기 위해선 직렬로 수행해야함 -> 세부적으로 들어가면 직렬화되어 처리함    
>    
> => 인덱스는 생각보다 비용이 크다    

인덱스 ROWID에 의한 테이블 랜덤 엑세스 (테이블에 데이터가 있는지 없는지 모르고 접근)

RDB에서 데이터 처리는 메모리에서 처리된다.

## 인덱스 스캔 vs 테이블 풀 스캔  

### 인덱스 스캔 

메모리는 유한한 자원이므로, 인덱스는 블록만 가져오고   

### 풀스캔 

어차피 다 읽어야 하므로, 앞 뒤의 대량의 데이터를 메모리로 가져온다.  
=> 대량의 데이터를 인덱스를 통해서 스캔하면 성능은 오히려 낮아진다. (손익 분기점은 보통 10% ~ 30% 수준)  
~백과사전에서 A-Z 까지 읽는 경우 인덱스를 보지않고 순차적으로 보는게 빠름~

MySQL은 16kb 고정형 페이지 사용  
데이터 < 블록 < 페이지

CF (Clustering Factor)
데이터를 조회할 때 읽어오는 블록에 가까운 일련의 데이터가 포함되는 경우
-> 하지만 인덱스 CF의 효율은 그때그때 다르다 => 인덱스에 대한 효율은 서비스를 개발하는 사람이 체크해야 한다.
     -( 인덱스 cf 가 좋을 수록 메모리에서 조회 데이터량이 많아도 충분히 빠르다.
         ,대부분 하나의 인덱스의 cf가 좋으면 또 다른 인덱스의 cfs는 나빠질 수 있다. (선두 컬럼 인덱스가 다른 경우)

# 인덱스의 엑세스 최적화

## 인덱스를 못타는 경우
- 컬럼의 가공이 있는 경우 (DB 메서드)  
  where substr(‘name’, 1, 2) = ‘AB’  
  where ‘name’ like ‘AB%’ // like 에서 ‘%’가 앞 쪽에 오는 경우 인덱스를 못탄다…  
  where amount * 12 > 5000  
  where amount > 5000 / 12  
  where age || name = ’40AB’  
  where age = 40 AND name = ‘AB’  
  where (age, name) in ((40, ‘AB’))  
  where TO_CHAR(‘reg’, ‘YYYYMM’) - ‘20121231’  
  where ‘reg’ BETWEEN TO_DATE(‘201210’, ‘YYYYMM’) AND LAST_DAY(TO_DATE(‘201211’, ‘YYYYMM’))
- 부정형 비교
- 묵시적 타입 변환 (customer_no가 문자형인 경우 TO_NUMBER(customer_no) 로 변환되어 문자는 데이터 형으로 변환된다.)  
  where customer_no = 123  
  where customer_no = ‘123’
- 조인을 할때 데이터 컬럼의 형이 다를경우에도 묵시적 타입 변환이 발생한다 -> 데이터 설계도 성능에 영향을 준다
- NULL 또는 NOT NULL 비교

결합 인덱스의 순서 = 인덱스 정렬 순서  
한 테이블에 여러 결합 인덱스가 있을 경우 각 인덱스는 노드를 공유한다.  
=> 결합 인덱스 순서를 바꿔서 문제를 해결할 수 있다.  
-/ 주의할 점은 인덱스 순서가 다른 쿼리에 영향도를 끼칠 수 있다.  

인덱스 설계 최적화

최소한의 인덱스로 최대한 많은 쿼리를 처리한다.

고려요소
- 엑세스 패턴 (where 절)
- SQL 수행 빈도
- DML 빈도
- 업무상의 중요도
- 칼럼 분포도
- 클러스터링 펙터 (CF)
- 인덱스 손익분기점
- 데이터건수
- IOT 활용 여부

인덱스 설계를 위해 특정 칼럼의 분포도 확인이 필요
select count(*),
	round(avg(cnt)),
	max(cnt),
	min(cnt)
from (
	select 칼럼명, count(*) cnt
	from 테이블
	group by 칼럼명
);