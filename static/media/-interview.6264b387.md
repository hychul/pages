# Java와 관련된 질문

## equals() 와 hashcode() 비교
equals()
- 두 객체가 동일한지 검사하기 위해 사용
- 기본적으로 2개의 객체가 가리키는 곳이 동일한 메모리 주소일 경우에만 동일한 객체가 된다

hashcode()
- 기본적으로 Object 클래스에 의해 저장된 객체의 메모리 주소를 반환한다.

둘의 관계
- Java 프로그램을 실행하는 동안 equals에 사용된 정보가 수정되지 않았다면, hashCode는 항상 동일한 정수값을 반환해야 한다. (Java의 프로그램을 실행할 때 마다 달라지는 것은 상관이 없다.)
- 두 객체가 equals()에 의해 동일하다면, 두 객체의 hashCode() 값도 일치해야 한다.
- 두 객체가 equals()에 의해 동일하지 않다면, 두 객체의 hashCode() 값은 일치하지 않아도 된다.

## equals()를 재정의 해야할때
- 논리적 동치성을 확인해야 하는데 상위 클래스의 equals가 논리적 동치성을 비교하도록 재정의 되어있지 않을때
- 주로 값 클래스 : Integer, String처럼 값을 표현하는 클래스
- 두 값 객체를 equals로 비교한다는 것은 객체가 같은지가 아니라 값이 같은지 알고 싶은 것이다.
- equals가 논리적 동치성을 확인하도록 재정의 해두면, 그 인스턴스 값의 비교가 가능하고 Map의 key와 Set의 원소로 사용할 수 있다.

## Equals 메서드 규약 (null이 아닌 모든 참조값 x,y,z에 대해)
- 반사성(reflexivity) : `x.equals(x)`는 true
- 대칭성(symmetry) : `x.equals(y)`가 true이면 `y.equals(x)`도 true
- 추이성(transitivity) : `x.equals(y)`는 true이고 `y.equals(z)`는 true이면 `x.equals(z)`는 true
- 일관성(consistency) : `x.equals(y)`를 반복해서 호출해도 항상 true 또는 false를 반환
- null-아님 : `x.equals(null)`는 false

## hashcode()를 재정의 하지 않을 때 발생하는 문제점
- 같은 값을 가진 객체가 서로 다른 해시값을 갖게 될 수 있다.
- 특히 HashMap의 key 값으로 해당 객체를 사용할 경우 문제가 발생한다.

## StringBuilder를 사용해야하는 이유
- String 객체와 다른 String 객체를 더할 때 새로운 String 객체가 만들어지면서 메모리 할당하게 되어 쓰레기 값을 생성하게 된다.
- JDK 1.5 이상부턴 String의 `+` 오퍼레이터를 사용하면 StringBuilder를 사용한 코드로 바꿔주지만, 각 줄마다 StringBuilder를 생성하기 때문에 주의해야한다.
- 한줄에서 상수 String을 더하는 것은 모두 합쳐진 문자열로 바꿔준다. `String a = "1" + "2" + "3";` -> `String a = "123";`
- 한줄에서 String과 상수를 더하면 StringBuffer의 append, toString 메서드를 사용하는 코드로 바꿔준다. `String a = "a" + 4 + "c";` -> `String a = new StringBuffer().append("a").append(4).append("c").toString()`

## 객체지향의 특징
캡슐화
- 객체의 상세한 내용을 외부에 철저히 숨기고 메시지만으로 객체와의 상호작용을 하게 함 (=정보은닉)

상속성
- 클래스의 속성과 메소드를 하위 클래스에 물려주거나, 상위 클래스에서 물려받는 것을 지칭

추상화
- 객체에서 공통된 속성과 메소드를 추출하는 것

다형성
- 하나의 클래스 내부에 같은 이름의 메소드를 여러 개 정의하거나, 상위 클래스의 메소드를 하위 클래스에서 다시 정의하여 사용할 수 있음

## overloading과 overriding의 차이
Overloading
- 클래스 내부에 동일한 이름의 메소드를 정의하는 것

Overriding
- 상속받은 자료나 메소드를 그대로 사용하지 않고 자신이 새로 만들어 사용하는 것

## interface와 adstract class의 차이
Interface  
- 추상 메서드와 상수만을 갖는 일종의 추상 클래스  
- 자바에서 지원하지 않는 다중 상속을 할 때 사용됨  

Abstract Class  
- 추상 메서드를 하나 이상 갖는 클래스  
- 자신의 생성자로 객체 생성 불가능  

## generic 이란?
- 각 데이터 형에 대한 별도의 메소드나 멤버변수를 구현하지 않고, 미리 정의된 하나의 메소드 또는 매개변수에 서로 다른 자료형의 결과를 얻을 수 있도록 하는 기능
- 기능은 같지만 자료형만 서로 다른 경우에 쓰임 (콜렉션에서 많이 사용)

## Primitive Type과 Reference Type의 차이
Primitive Type
- 자바 기본형으로 변수에 값 자체를 저장
- byte, short, int, float, double, char, boolean

Reference Type
- 메모리상의 객체가 있는 위치를 저장

## Call by reference와 Call by value의 차이
Call by Reference
- 매개 변수의 원래 주소에 값을 저장하는 방식

Call by Value
- 주어진 값을 복사하여 처리하는 방식

## 접근 제한자
public
- 접근 제한 없음

protected
- 같은 또는 다른 패키지에서 상속받아 접근 가능

default
- 같은 패키지 내에서 상속받아 접근 가능

private
- 같은 클래스 내에서 접근 가능

## 키워드 final
- 클래스 : 상속되지 않음
- 메서드 : overriding 되지 않음
- 변수 : 값이 변경되지 않음

## 키워즈 static
- 클래스 : 객체를 생성하지 않고 메서드나 변수에 접근이 가능 → 객체 생성도 가능하지만 쓸모없음
- 메서드 : 객체에 의존적이지 않은 작업을 수행 → 멤버변수 사용 불가
- 변수 : 객체와 관계 없이 클래스당 하나만 존재

## 싱글톤과 statis class 차이
싱글톤
- 클래스가 사용될 때에 새로운 객체를 생성하는 것이 아니라, 동일 객체를 사용
- 초기화가 간단함 -> 생성자
- 편리하지만, 많이 사용될 경우 독립성을 확인하기 어려움

Static Class
- 클래스의 객체를 만들 필요 없이, static 한 클래스에 접근하여 사용
- 초기화가 어려움

## GC란?
- 힙 영역에서 가비지를 찾아내 힙의 메모리를 회수하는 것 
- GC 대상인 객체를 처리하여 메모리를 회수하는 작업은 즉각적인 연속 작업이 아니며, GC 대상 객체의 메모리를 한 번에 모두 회수하지도 않는다

### Reachability
- reachable : 어떤 객체에 유효한 참조가 있는 경우
- unreachable : 어떤 객체에 유효한 참조가 없는 경우 → 가비지로 간주해 GC를 수행함

### 객체참조방식
- strong reference
- soft reference
- weak reference
- phantom reference

### 힙 내의 참조 4가지
- 힙 내의 다른 객체에 의한 참조
- Java 스택, 즉 Java 메서드 실행 시에 사용하는 지역 변수와 파라미터들에 의한 참조
- 네이티브 스택, 즉 JNI(Java Native Interface)에 의해 생성된 객체에 대한 참조
- 메서드 영역의 정적 변수에 의한 참조

### Root set
- 객체들이 참조 사슬을 이루는 상황에서 유효한 참조 여부를 파악하기 위한 최초의 참조
- 힙 내의 다른 객체에 의한 참조를 제외한 나머지 3개가 root set이 되서 reachability를 판가름하는 기준이 됨

### Strong Reference
- Root set에서 시작한 참조 사슬에 속하는 레퍼런스
- strong reachable 객체

### Weak Reference
- Weak reference 객체 자체는 strong reachable 객체이다
- Weak reference로만 참조된 객체는 weakly reachable 객체라고 하며 GC가 동작할 때 unreachable과 함께 처리된다

### Soft Reference
- SoftReferencce 객체로만 참조된 객체는 힙에 남아 있는 메모리의 크기와 해당 객체의 사용 빈도에 따라 GC 여부가 결정
- softly reachable 객체는 weakly reachable 객체와는 달리 GC가 동작할 때마다 회수되지 않으며 자주 사용될수록 더 오래 살아남게 됨

### PhantomReference
- PhantomReference로만 참조되는 객체는 먼저 파이널라이즈된 이후에 phantomly reachable로 간주됨
- 객체에 대한 참조가 PhantomReference만 남게 되면 해당 객체는 바로 파이널라이즈됨

### Strengths of Reachable
- strongly reachable: root set으로부터 시작해서 어떤 reference object도 중간에 끼지 않은 상태로 참조 가능한 객체, 다시 말해, 객체까지 도달하는 여러 참조 사슬 중 reference object가 없는 사슬이 하나라도 있는 객체
- softly reachable: strongly reachable 객체가 아닌 객체 중에서 weak reference, phantom reference 없이 soft reference만 통과하는 참조 사슬이 하나라도 있는 객체
- weakly reachable: strongly reachable 객체도 softly reachable 객체도 아닌 객체 중에서, phantom reference 없이 weak reference만 통과하는 참조 사슬이 하나라도 있는 객체
- phantomly reachable: strongly reachable 객체, softly reachable 객체, weakly reachable 객체 모두 해당되지 않는 객체. 이 객체는 파이널라이즈(finalize)되었지만 아직 메모리가 회수되지 않은 상태이다.
unreachable: root set으로부터 시작되는 참조 사슬로 참조되지 않는 객체

### GC의 객체 처리순서
1. soft references
2. weak references
3. 파이널라이즈
4. phantom references
5. 메모리 회수

## Multiplex Server의 동작

# Spring과 관련된 질문

## AOP

## MVC 요청이 처리되는 과정

## Webflux 요청이 처리되는 과정

# DB와 관련된 질문

### DB 인덱싱의 특징
- 인덱스 목적이 질의 결과를 빠르게 찾는 데 목적이 있다.
- 데이터베이스에 레코드가 삽입, 삭제될 때마다 인덱스가 변경되어야 한다.
- 데이터베이스에서 인덱스는 별도의 자료 구조인 B-Tree와 같은 형태로 관리하게 된다. 인덱스 자료 구조도 디스크에 저장하여, 질의가 있을 경우 읽어와 사용하게 된다.

<!-- MySQL B+tree https://zorba91.tistory.com/293 -->

## Transaction

### ACID
원자성<sup>Atomicity</sup>
- 트랜잭션과 관련된 작업들이 부분적으로 실행되다가 중단되지 않는 것을 보장하는 것을 의미

일관성<sup>Consistency</sup>
- 트랜잭션이 실행을 성공적으로 완료하면 언제나 일관성 있는 데이터베이스 상태로 유지하는 것을 의미

독립성<sup>Isolation</sup>
- 트랜잭션을 수행 시 다른 트랜잭션의 연산 작업이 끼어들지 못하도록 보장하는 것을 의미

영속성<sup>Durability</sup>
- 성공적으로 수행된 트랜잭션은 영원히 반영되어야 함을 의미

### 로컬 트랜젝션과 글로벌 트랜젝션
로컬 트랜젝션
- 트랜젝션은 Connection 오브젝트 안에서 만들어지기 때문에 일련의 작업이 하나의 트랜잭션으로 묶이려면 작업이 진행되는 동안 DB 커넥션도 하나만 사용돼야 한다.
- 스프링에선 이를 위해 Connection을 특별한 저장소에 보관하고 DAO의 메소드에서 이를 가져다 사용하게 하여 트랜젝션을 동기화한다.

글로벌 트랜젝션
- 로컬 트랜잭션과 달리 여러 DB 커넥션에 대해 트랜잭션을 관리하는 방식이다.

### 스프링의 트랜잭션

## JTA

## JPA

## DBCP<sup>DB 커넥션 풀<sup>

```java
Connection conn = null;
PreparedStatement  pstmt = null;
ResultSet rs = null;

try {
    sql = "SELECT * FROM A"

    // 1. 드라이버 연결 DB 커넥션 객체를 얻음
    connection = DriverManager.getConnection(DBURL, DBUSER, DBPASSWORD);

    // 2. 쿼리 수행을 위한 PreparedStatement 객체 생성
    pstmt = conn.createStatement();

    // 3. executeQuery: 쿼리 실행 후
    // ResultSet: DB 레코드 ResultSet에 객체에 담김
    rs = pstmt.executeQuery(sql);
    } catch (Exception e) {
    } finally {
        conn.close();
        pstmt.close();
        rs.close();
    }
}
```

- 다음의 코드에서 매번 커넥션 객체를 생성하고 사용후에 종료하는 방식은 비효율 적이기 때문에 커넥션 풀을 만들어 사용한 다음 풀링하여 사용하도록 한다.

# 알고리즘

## 정렬

# 프로젝트와 관련된 질문

## 노티가 동작하는 과정

## 과금이 이뤄지는 과정

## 정산이 이뤄지는 과정

## 결제가 이뤄지는 과정