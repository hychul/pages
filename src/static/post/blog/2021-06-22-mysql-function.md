DBMS의 종류과 관계없이 대부분의 SQL 함수는 동일하게 제공되지만 함수의 이름이나 사용법은 달라질 수 있다.
MySQL의 함수는 기본적으로 제공되는 내장함수와 사용자가 직접 C/C++ API를 사용해 추가할 수 있는 사용자 정의 함수 (UDF)로 구분된다.

# NULL 값 대체 : IFNULL, ISNULL
- IFNULL : 해당 값이 NULL인 경우, 두번째 파라메터를 반환한다.  
- ISNULL : 해당 값이 NULL인 경우 TRUE(1), 아닌경우 FALSE(0)를 반환한다.

# 현재 시간 조회 : NOW, SYSDATE
두 함수 모두 현재 시간을 반환하지만 작동방식에 차이가 존재한다.

- NOW : 하나의 SQL문 안에서 항상 동일한 값을 반환한다.  
- SYSDATE : 같은 SQL문 안에서도 실제 호출되는 시점에 따라 다른 값을 반환한다.

쿼리가 오래 걸리는 경우 값이 달라지기 때문에 꼭 필요한 경우가 아니라면 SYSDATE 사용을 지양하는 편이 좋지만, 이미 사용하고 있다면 `sysdate-is-now` 같은 설정을 통해 NOW 처럼 동작하도록 설정할 것을 권장한다.

# 날짜와 시간 포맷 : DATE_FORMAT, STR_TO_DATE
| 지정문자 | 설명 |
| - | - |
| %Y | 4자리 년도 |
| %m | 2자리 숫자 월 |
| %d | 2자리 숫자 일 |
| %H | 2자리 숫자 시 |
| %i | 2자리 숫자 분 |
| %s | 2자리 숫자 초 |

포맷을 사용하여 TEXT - DATE 간의 변환을 지원한다.

# 날짜와 시간 연산 : DATE_ADD, DATE_SUB
특정 날짜나 시간의 연산에서 사용된다.  
DATE_ADD 만으로도 파라메터를 통해 빼기가 가능하기 때문에 DATE_SUB 가 크게 필요하지 않다.

두번째 파라메터로 숫자 이외에 단위를 `INTERVAL n [YEAR, MONTH...]` 형태로 입력해야한다.

| 단위 키워드 | 설명 |
| - | - |
| YAER | 년도 |
| MONTH | 월 |
| DAY | 일 |
| HOUR | 시 |
| MINUTE | 분 |
| SECOND | 초 |
| QUARTER | 분기 |
| WEEK | 주 |

# 날짜와 시간의 차 : DATEDIFF, TIMESTAMPDIFF
DATE_ADD와 DATE_SUB가 일정 기간만큼 계산하여 DATE를 반환한다면, DATEDIFF의 경우 두 DATE에 대한 차이를 지정한 단위에 대해서 차이값을 얻을 수 있다.

```sql
DATEDIFF(date1, date2);
TIMESTAMPDIFF(SECOND, ts1, ts2);
```

# 타임 스탬프 연산 : UNIX_TIMESTAMP, FROM_UNIXTIME
- UNIX_TIMESTAMP : '1970-01-01 00:00:00'을 기준으로 현재까지 경과된 초의 수를 반환한다.
- FROM_UNIXTIME : UNIX 타임 스탬프를 DATE로 변환한다.

> Unix 타임 스탬프는 4바이트로 저장되기 때문에 1970-01-01 00:00:00 ~ 2038-01-09 03:14:07 사이의 값만 저장이 가능하다.  

# 문자열 처리 : RPAD, LPAD / RTRIM, LTRIM, TRIM
- RPAD : 문자열 우측에 문자를 덧붙여서 지정된 길이의 문자열로 변환한다. 
- LPAD : 문자열 좌측에 문자를 덧붙여서 지정된 길이의 문자열로 변환한다.

```sql
mysql > SELECT RPAD('Cloee', 10, '_');
+------------------------------+
| Clee______                   |
+------------------------------+
mysql > SELECT LPAD('123', 10, '0');
+------------------------------+
| 0000000123                   |
+------------------------------+
```

- RTRIM : 문자열 우측에 연속된 공백 문자를 제거한다.
- LTRIM : 문자열 좌측에 연속된 공백 문자를 제거한다.
- TRIM : 문자열 우측과 좌측의 연속된 공백 문자를 제거한다.

# 문자열 결합 : CONCAT, CONCAT_WS
- CONCAT : 여러개의 문자열을 하나의 문자열로 빤환하는 함수이다.
- CONCAT_WS : CONCAT과 동일하게 문자열을 합쳐주지만, 구분자를 추가해준다는 차이점이 있다.

# GROUP BY 문자열 결합 : GROUP_CONCAT
COUNT(), MAX(), MIN(), AVG() 와 같은 그룹 함수 중 하나이다.  
주로 GROUP BY와 함께 사용하며, GROUP BY가 없는 경우 단일 값을 반환한다.
구분자나 정렬 순서등을 설정하여 사용할 수 있다.

```sql
mysql> SELECT GROUP_CONCAT(dept_no) FROM department;
+----------------------------------------------+
| d001,d002,d003,d004,d005,d006,d007,d008,d009 |
+----------------------------------------------+

mysql> SELECT GROUP_CONCAT(dept_no SEPARATOR '|') FROM department;
+----------------------------------------------+
| d001|d002|d003|d004|d005|d006|d007|d008|d009 |
+----------------------------------------------+

mysql> SELECT GROUP_CONCAT(dept_no ORDER BY dept_name DESC) FROM department;
+----------------------------------------------+
| d007,d008,d006,d004,d001,d003,d002,d005,d009 |
+----------------------------------------------+
```

# 조건문 : IF
IF는 조건, 참일때의 값, 거짓일떄의 값, 세개의 파라메터를 받아 처리한다. 조건에 따라 값을 다른 값으로 대체할때 사용한다.

```sql
IF (cnt > 0, 'exist', 'empty')
```

# 값의 비교와 대체 : CASE WHEN ... THEN ... END

CASE WHEN는 함수가 아니라 SQL 구문이다.  
프로그래밍 언어의 switch 문과 동일하게 사용되며 CASE로 시작하고 반드시 END로 끝나야 한다.  
WHEN ... THEN ... 구문은 뭔하는 만큼 반복하여 사용할 수 있고, ELSE를 통해 WHEN 절 이외의 값을 처리 할 수 있다.

# 타입의 변환 : CAST, CONVERT
Prepare Statement를 제외하면 SQL은 텍스트를 기반으로 작동한다.
- CAST : 명시적으로 타입을 변환한다 : DATE, TIME, DATETIME, BINARY, CHAR, DECIMAL, SIGNED INTEGER, UNSIGNED INTEGER
- CONVERT : CAST와 같이 타입을 변환하고 USING 절을 사용하는 경우 문자열의 Character Set을 변환할 수 있다.

> Prepare Statement  
> 
> `PREPARE [stmt_name] FROM '[query]';`  
> PREPARE, EXECUTE, DEALLOCATE PREPRE 순서로 동작한다.  
> PREPARE에서 ? 문자를 통해 파라메터를 설정하고, EXECUTE에서 바인딩을 통해 ?에 값을 할당하여 구문이 수행된다.  
> ```sql
> mysql> PREPARE stmt1 FROM 'SELECT SQRT(POW(?,2) + POW(?,2)) AS hypotenuse'; 
> mysql> SET @a = 3; 
> mysql> SET @b = 4; 
> mysql> EXECUTE stmt1 USING @a, @b;
> +------------+ 
> | hypotenuse | 
> +------------+ 
> |          5 | 
> +------------+ 
> mysql> DEALLOCATE PREPARE stmt1;
> ```

# 이진값과 16진수 문자열 변환 : HEX, UNHEX
- HEX : 사람이 읽을 수 있는 16진수 문자열로 변환
- UNHEX : 16진수 문자열을 읽어 이진값 (BINARY)로 변환

# 암호화 및 해시 함수 : MD5, SHA
비대칭형 암호화 알고리즘으로, 인자로 전달한 문자열을 각각지정된 비트 수의 해시값을 만들어낸다.
- MD5 : 메세지 다이제스트<sup>Message Digest</sup> 알고리즘을 사용해 128비트 해시값을 반환한다.
- SHA : SHA-1 암호화 알고리즘을 사용하여 160비트 해시 값을 반환한다.

```sql
mysql> SELECT MD5('abc')
+----------------------------------+
| 900150983cd24fb0d6963f7d28e17f72 |
+----------------------------------+
mysql> SELECT SHA('abc')
+------------------------------------------+
| a9993e364706816aba3e25717850c26c9cd0d89d |
+------------------------------------------+
```

두 함수 모두 비대칭 암호화 알고리즘을 사용하고, 결과 값이 중복 가능성이 매우 낮기 때문에 길이가 긴 데이터의 크기를 줄여 인데싱하는 용도로 사용된다.

# 처리 대기 : SLEEP
- SLEEP : 함수가 호출될 때 마다 (레코드의 로우수 만큼) 일정시간 대기한다.

# 벤치마크 : BENCHMARK
- BENCHMARK : 반복해서 수행할 횟수, 스칼라 값을 반환하는 표현식을 파라메터로 받아 해당 표현식이 수행되는데 걸리는 시간을 보여준다.

# IP 주소 변환 : INET_ATOM, INET_NTOA
- INET_ATOM : IP 문자열을 정수형으로 변환한다.
- INET_NTOA : 정수형 IP를 문자열로 변환한다.

# MySQL 전용 암호화 : PASSWORD, OLD_PASSWORD
일반 사용자가 사용해서는 안된다.  
이 함수의 알고리즘이 4.1 부터 변경이 되었고 앞으로도 변경될 가능성이 존재한다.  
때문에 MySQL 유저의 비밀번호를 관리하기 위한 함수이지, 일반 서비스의 고객 정보를 위해 사용할 때는 적합하지 않다.

고객 정보에 사용할 때는 MD5() 혹은 SHA 알고리즘을 사용하는 것이 좋다.

# VALUES()
INSERT INTO ... ON DUPLICATE KEY UPDATE ... 문장에서만 사용할 수 있다.  
REPLACE와 비슷한 기능의 쿼리 문장인데, UPSERT로 동작하는 문장이다.  
VALUES()를 사용하면 컬럼에 INSERT 하려고 했던 값을 참조하는 것이 가능하다.

```sql
INSERT INTO tab_statistics (member_id, visit_count)
  SELECT student_id, COUNT(*) AS cnt
  FROM tab_statistics
  GROUP BY member_id
ON DUPLICATE KEY
  UPDATE visit_count = visit_count + VALUE(visit_count);
```

# COUNT()
결과 레코드의 로우 수를 반환하는 함수이다.

COUNT(*) 와 같은 표현을 사용할 때 LEFT JOIN이나 ORDER BY 와 함께 사용하면 소용이 없다.

COUNT() 함수를 컬럼명이나 표현식과 함께 사용할 때, 결과값이 NULL이 아닌 레코드의 갯수만 반환한다. 때문에 NULL 값을 갖는 컬럼에서 사용할 때 유의해야한다.

# RANK(), DENSE_RANK()
MySQL 함수에서 설명하지 않아 따로 추가했다.  
인자로 컬럼명이나 DISTINCT, ORDER BY 등의 구문과 함께 사용하여 해당 컬럼의 순서를 1부터 반환한다.
RANK()의 경우 동일한 랭크가 존재한다면 그 다음 랭크는 해당 랭크의 갯수만큼 증가한 값을 갖지만, DENSE_RANK()의 경우 중복 값과 상관없이 +1 만큼 증가하는 랭크를 갖는다.
